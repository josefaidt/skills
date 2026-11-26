#!/usr/bin/env bun
/*
  Prints one tab-separated line per open issue in a milestone, sorted by bucket: bucket, issue,
  priority, size, areas, open blockers, open issues it blocks, and title. The buckets are tracker,
  parent, in-flight, blocked, needs-you, and ready.

  It reads the repository from `gh repo view` in the current checkout. With no milestone it takes the
  lowest-numbered open milestone that still has open issues. An issue is in flight when an open pull
  request closes it, or when `--assignee` names an account assigned to it.

  Usage: bun <coordinating-sessions skill folder>/scripts/tasklist.ts [milestone] [--assignee <login>]

  It depends on nothing but Bun and an authenticated `gh`.
*/
import { parseArgs } from "node:util"
import { $ } from "bun"

type Linked = { nodes: { number: number; state: string }[] }

type Issue = {
  number: number
  title: string
  labels: { nodes: { name: string }[] }
  assignees: { nodes: { login: string }[] }
  closedByPullRequestsReferences: { nodes: { number: number }[] }
  blockedBy: Linked
  blocking: Linked
  subIssues: { totalCount: number }
}

type Page = {
  pageInfo: { hasNextPage: boolean; endCursor: string | null }
  nodes: Issue[]
}

const QUERY = `
query($owner: String!, $name: String!, $m: Int!, $endCursor: String) {
  repository(owner: $owner, name: $name) { milestone(number: $m) {
    issues(first: 100, states: OPEN, after: $endCursor) { pageInfo { hasNextPage endCursor } nodes {
      number title
      labels(first: 20) { nodes { name } }
      assignees(first: 5) { nodes { login } }
      closedByPullRequestsReferences(first: 5, includeClosedPrs: false) { nodes { number } }
      blockedBy(first: 20) { nodes { number state } }
      blocking(first: 20) { nodes { number state } }
      subIssues { totalCount }
} } } } }`

async function gh(args: readonly string[]): Promise<string> {
  const result = await $`gh ${args}`.nothrow().quiet()
  if (result.exitCode !== 0) {
    throw new Error(`gh ${args[0] ?? ""} failed: ${result.stderr.toString().trim()}`)
  }
  return result.text()
}

async function findRepository(): Promise<{ owner: string; name: string }> {
  const nameWithOwner = (
    await gh(["repo", "view", "--json", "nameWithOwner", "--jq", ".nameWithOwner"])
  ).trim()
  const [owner, name] = nameWithOwner.split("/")
  if (owner === undefined || name === undefined) {
    throw new Error(`gh repo view printed ${nameWithOwner}`)
  }
  return { owner, name }
}

async function findDefaultMilestone(repo: string): Promise<number> {
  const milestones = JSON.parse(await gh(["api", `repos/${repo}/milestones?state=open`])) as {
    number: number
    open_issues: number
  }[]
  const first = milestones
    .filter((milestone) => milestone.open_issues > 0)
    .toSorted((a, b) => a.number - b.number)[0]
  if (first === undefined) throw new Error("no open milestone has open issues")
  return first.number
}

async function fetchIssues(owner: string, name: string, milestone: number): Promise<Issue[]> {
  const issues: Issue[] = []
  let cursor: string | null = null
  for (;;) {
    const cursorArgs = cursor === null ? [] : ["-f", `endCursor=${cursor}`]
    const output = await gh([
      "api",
      "graphql",
      "-F",
      `owner=${owner}`,
      "-F",
      `name=${name}`,
      "-F",
      `m=${milestone}`,
      ...cursorArgs,
      "-f",
      `query=${QUERY}`,
    ])
    const page = (JSON.parse(output) as { data: { repository: { milestone: { issues: Page } } } })
      .data.repository.milestone.issues
    issues.push(...page.nodes)
    if (!page.pageInfo.hasNextPage) return issues
    cursor = page.pageInfo.endCursor
  }
}

function openNumbers(linked: Linked): number[] {
  return linked.nodes.filter((issue) => issue.state === "OPEN").map((issue) => issue.number)
}

function escapeField(field: string): string {
  return field
    .replaceAll("\\", String.raw`\\`)
    .replaceAll("\t", String.raw`\t`)
    .replaceAll("\n", String.raw`\n`)
}

function pickBucket(issue: Issue, labels: string[], blockers: number[], assignee?: string): string {
  if (labels.includes("kind:tracker")) return "tracker"
  if (issue.subIssues.totalCount > 0) return "parent"
  const isAssigned =
    assignee !== undefined && issue.assignees.nodes.some((node) => node.login === assignee)
  if (issue.closedByPullRequestsReferences.nodes.length > 0 || isAssigned) return "in-flight"
  if (blockers.length > 0) return "blocked"
  if (labels.includes("status:needs-human")) return "needs-you"
  return "ready"
}

export function formatIssue(issue: Issue, assignee?: string): string {
  const labels = issue.labels.nodes.map((label) => label.name)
  const blockers = openNumbers(issue.blockedBy)
  const fields = [
    pickBucket(issue, labels, blockers, assignee),
    `#${issue.number}`,
    labels.find((label) => /^priority:[0-3]$/.test(label)) ?? "priority:?",
    labels.find((label) => /^size:(?:sm|md|lg)$/.test(label)) ?? "--",
    `areas=${labels
      .filter((label) => label.startsWith("area:"))
      .map((label) => label.slice("area:".length))
      .join(",")}`,
    `blockedBy=${blockers.join(",")}`,
    `unblocks=${openNumbers(issue.blocking).join(",")}`,
    issue.title,
  ]
  return fields.map(escapeField).join("\t")
}

if (import.meta.main) {
  const { values, positionals } = parseArgs({
    args: process.argv.slice(2),
    options: { assignee: { type: "string" } },
    allowPositionals: true,
  })
  const arg = positionals[0]
  if (arg !== undefined && !/^\d+$/.test(arg)) {
    process.stderr.write(`tasklist: ${arg} is not a milestone number\n`)
    process.exit(2)
  }
  try {
    const { owner, name } = await findRepository()
    const milestone =
      arg === undefined ? await findDefaultMilestone(`${owner}/${name}`) : Number(arg)
    const lines = (await fetchIssues(owner, name, milestone))
      .map((issue) => formatIssue(issue, values.assignee))
      .toSorted()
    if (lines.length > 0) process.stdout.write(`${lines.join("\n")}\n`)
  } catch (error) {
    process.stderr.write(`tasklist: ${error instanceof Error ? error.message : String(error)}\n`)
    process.exit(1)
  }
}
