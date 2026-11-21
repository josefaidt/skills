#!/usr/bin/env bun
/*
  Fails when a change would alter approved behavior without the maintainer approving it.

  For each RFC this branch changes, compared with where it branched from the base ref:
  - When the RFC was `accepted` or `implemented` and its Behavior section changed, the branch must
    end with the RFC in `review`, waiting on the maintainer, or back in `accepted` through a commit
    that moves the status from `review` after the last commit that changed the Behavior section.
    That commit is the maintainer's approval, so nothing may change the behavior after it.
  - When the branch ends with the RFC `accepted` or `implemented`, its Open questions section holds
    no question, since the maintainer cannot accept behavior that is still undecided.
  - An `accepted` or `implemented` RFC is never deleted. Its status moves to `withdrawn` or
    `superseded` instead, so its IDs stay taken.

  An RFC is a markdown file whose frontmatter has `kind: rfc`, or whose H1 ends in "RFC". A renamed
  RFC is compared with its old path.

  Usage: bun behavior-guard.ts [--base <ref>]
*/
import { readFileSync } from "node:fs"
import { parseArgs } from "node:util"

const APPROVED = ["accepted", "implemented"]

const git = (args: string[]): { ok: boolean; out: string } => {
  const result = Bun.spawnSync(["git", ...args])
  return { ok: result.exitCode === 0, out: result.stdout.toString() }
}

const frontmatterField = (source: string, field: string): string | undefined => {
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? ""
  return new RegExp(`^${field}:\\s*["']?([^"'\\n]+?)["']?\\s*$`, "m").exec(frontmatter)?.[1]
}

const isRfc = (source: string): boolean =>
  (frontmatterField(source, "kind") ?? /^#\s+.*\b(RFC)\s*$/m.exec(source)?.[1])?.toLowerCase() ===
  "rfc"

const status = (source: string): string => frontmatterField(source, "status") ?? ""

const approved = (source: string): boolean => APPROVED.includes(status(source))

// The text of an H2 section, from its heading up to the next H2, with trailing whitespace trimmed.
const section = (source: string, title: string): string => {
  const lines = source.split("\n")
  const start = lines.findIndex((line) => new RegExp(`^##\\s+${title}\\s*$`).test(line))
  if (start === -1) return ""
  const end = lines.findIndex((line, index) => index > start && /^##\s/.test(line))
  return lines
    .slice(start + 1, end === -1 ? undefined : end)
    .join("\n")
    .trimEnd()
}

const behavior = (source: string): string => section(source, "Behavior")

// A file's text at a commit, trying each path it has had, or undefined when it did not exist.
const showAt = (commit: string, paths: string[]): string | undefined => {
  for (const path of paths) {
    const result = git(["show", `${commit}:${path}`])
    if (result.ok) return result.out
  }
  return undefined
}

type Change = { path: string; basePath: string; deleted: boolean }

// Each markdown file the diff touches, keyed by its path now, with the path it had at the base.
const changes = (args: string[], into: Map<string, Change>): boolean => {
  const result = git(["diff", "--name-status", "-M", ...args, "--", "*.md"])
  for (const line of result.out.split("\n").filter(Boolean)) {
    const [code = "", first = "", second] = line.split("\t")
    const path = second ?? first
    const earlier = into.get(first)
    const basePath = earlier?.basePath ?? first
    if (second) into.delete(first)
    into.set(path, { path, basePath, deleted: code.startsWith("D") })
  }
  return result.ok
}

const check = (change: Change, mergeBase: string): string[] => {
  const { path, basePath } = change
  const before = showAt(mergeBase, [basePath])
  const problems: string[] = []

  if (change.deleted) {
    if (before && isRfc(before) && approved(before)) {
      problems.push(
        `${path}: an ${status(before)} RFC was deleted. Set its status to withdrawn or superseded instead, so its IDs stay taken.`,
      )
    }
    return problems
  }

  const head = readFileSync(path, "utf8")
  if (!isRfc(head)) return problems

  if (before && approved(before) && behavior(before) !== behavior(head)) {
    if (approved(head)) {
      const commits = git(["rev-list", "--reverse", `${mergeBase}..HEAD`])
        .out.split("\n")
        .filter(Boolean)
      const versions = [mergeBase, ...commits].map(
        (commit) => showAt(commit, [path, basePath]) ?? "",
      )
      // the working tree counts as a last version, so an uncommitted change follows any approval
      versions.push(head)
      let lastChange = 0
      for (let index = 1; index < versions.length; index++) {
        if (behavior(versions[index] ?? "") !== behavior(versions[index - 1] ?? "")) {
          lastChange = index
        }
      }
      const approval = versions.some(
        (version, index) =>
          index > lastChange && status(versions[index - 1] ?? "") === "review" && approved(version),
      )
      if (!approval) {
        problems.push(
          `${path}: the Behavior section changed on an ${status(before)} RFC without an approval. Set its status to review, and the maintainer approves by setting it back to accepted in a later commit.`,
        )
      }
    } else if (status(head) !== "review") {
      problems.push(
        `${path}: the Behavior section changed on an ${status(before)} RFC. Set its status to review so the maintainer approves the change.`,
      )
    }
  }

  if (approved(head) && /^\s*-\s+\S/m.test(section(head, "Open questions"))) {
    problems.push(
      `${path}: status is ${status(head)}, but Open questions still lists questions. Settle each one in the Behavior section first.`,
    )
  }
  return problems
}

const { values } = parseArgs({ options: { base: { type: "string", default: "origin/main" } } })
const mergeBase = git(["merge-base", values.base, "HEAD"]).out.trim()
if (!mergeBase) {
  throw new Error(
    `git merge-base with ${values.base} failed. Fetch the base ref first, such as with fetch-depth: 0 in CI.`,
  )
}
const changed = new Map<string, Change>()
changes([mergeBase, "HEAD"], changed)
// files with uncommitted changes count too, so the guard works before a commit as well as in CI
changes(["HEAD"], changed)
const problems = [...changed.values()].flatMap((change) => check(change, mergeBase))

console.log(
  problems.length > 0 ? problems.join("\n") : `Checked ${changed.size} changed markdown files.`,
)
process.exitCode = problems.length > 0 ? 1 : 0
