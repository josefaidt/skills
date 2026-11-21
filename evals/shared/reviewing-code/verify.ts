#!/usr/bin/env bun
/*
  Scores a review the agent wrote against the findings a task expects, and writes the scores to
  /logs/verifier/reward.json.

  The review is markdown in the shape the reviewing-code skill posts: a `**Verdict:**` line, then
  `### Blocking` and `### Advisory` tables whose first column is a rule ID or "Defect" and whose
  second names `path:line`, then `### Behavior` and `### Exceptions` lists. Scores:

  - recall: the share of expected findings, untested behaviors, and exceptions the review reports
  - precision: the share of the review's table rows that match an expected finding, so a review
    that pads itself with comments no rule backs scores lower
  - severity: the share of matched findings filed under the expected section
  - verdict: 1 when the verdict matches
  - untouched: 1 when the repository still has exactly the commits it started with and no changes
  - reward: untouched × (0.4 recall + 0.3 precision + 0.2 verdict + 0.1 severity)

  Paths default to the task's and can be overridden with REVIEW, EXPECTED, APP, and REWARD.
*/
import { existsSync, readFileSync, writeFileSync } from "node:fs"

type Section = "Blocking" | "Advisory"

type ExpectedFinding = {
  // A rule ID such as `secrets/no-tokens-in-logs`, or "defect".
  kind: string
  section: Section
  file: string
  // Lines a matching finding may point at. Any one within LINE_SLACK counts.
  lines: number[]
}

type Expected = {
  verdict: "Request changes" | "Comment" | "Approve"
  findings: ExpectedFinding[]
  // Behavior IDs the review must report as having no test.
  untested: string[]
  // Exceptions the review must list, and whether it must accept each.
  exceptions: { rule: string; accepted: boolean }[]
}

type Row = { section: Section; kind: string; locations: { file: string; line?: number }[] }

const LINE_SLACK = 3

const BEHAVIOR_ID = /[A-Z][A-Z0-9]*-\d+\.\d+/

const escape = (text: string): string => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const REVIEW = process.env.REVIEW ?? "/pr/review.md"
const EXPECTED = process.env.EXPECTED ?? "/tests/expected.json"
const APP = process.env.APP ?? "/app"
const REWARD = process.env.REWARD ?? "/logs/verifier/reward.json"

const sections = (review: string): Map<string, string[]> => {
  const result = new Map<string, string[]>()
  let current = ""
  for (const line of review.split("\n")) {
    const heading = /^#{2,4}\s+(.+?)\s*$/.exec(line)?.[1]
    if (heading) {
      current = heading.toLowerCase()
      result.set(current, [])
    } else {
      result.get(current)?.push(line)
    }
  }
  return result
}

const rows = (lines: string[], section: Section): Row[] =>
  lines
    .filter((line) => line.trim().startsWith("|") && !/^\|\s*:?-/.test(line.trim()))
    .map((line) => line.split("|").map((cell) => cell.trim()))
    .map((cells) => ({ first: cells[1] ?? "", rest: cells.slice(2).join(" | ") }))
    .filter(({ first }) => first !== "" && first.toLowerCase() !== "rule")
    .map(({ first, rest }) => ({
      section,
      kind: /^defect$/i.test(first.replaceAll("`", "")) ? "defect" : first.replaceAll("`", ""),
      locations: [...rest.matchAll(/([\w./-]+\.\w+)(?::(\d+))?/g)].map((match) => ({
        file: match[1] ?? "",
        line: match[2] ? Number(match[2]) : undefined,
      })),
    }))

const matches = (row: Row, expected: ExpectedFinding): boolean =>
  row.kind === expected.kind &&
  row.locations.some(
    ({ file, line }) =>
      file.endsWith(expected.file) &&
      (line === undefined || expected.lines.some((want) => Math.abs(want - line) <= LINE_SLACK)),
  )

const untouched = (): boolean => {
  const git = (args: string[]): string =>
    Bun.spawnSync(["git", "-C", APP, ...args])
      .stdout.toString()
      .trim()
  return git(["status", "--porcelain"]) === "" && git(["rev-list", "--count", "HEAD"]) === "2"
}

const score = (review: string, expected: Expected) => {
  const parts = sections(review)
  const found = [
    ...rows(parts.get("blocking") ?? [], "Blocking"),
    ...rows(parts.get("advisory") ?? [], "Advisory"),
  ]
  const behavior = parts.get("behavior") ?? []
  const exceptions = parts.get("exceptions") ?? []

  const hit = expected.findings.map((want) => found.filter((row) => matches(row, want)))
  // Each check reads one line. No other behavior ID may sit between an ID and "no test", and an
  // exception's ruling is the first "accepted" or "rejected" after its rule, so "rejected, since the
  // reason is not accepted" counts as rejected.
  const reportedUntested = expected.untested.filter((id) =>
    behavior.some((line) =>
      new RegExp(`${escape(id)}\\b(?:(?!${BEHAVIOR_ID.source}).)*\\bno test`, "i").test(line),
    ),
  )
  const reportedExceptions = expected.exceptions.filter(({ rule, accepted }) =>
    exceptions.some(
      (line) =>
        new RegExp(`${escape(rule)}.*?\\b(accepted|rejected)\\b`, "i")
          .exec(line)?.[1]
          ?.toLowerCase() === (accepted ? "accepted" : "rejected"),
    ),
  )

  const wanted = expected.findings.length + expected.untested.length + expected.exceptions.length
  const got =
    hit.filter((rows) => rows.length > 0).length +
    reportedUntested.length +
    reportedExceptions.length
  const matchedRows = found.filter((row) => expected.findings.some((want) => matches(row, want)))
  const rightSection = expected.findings.filter((want, index) =>
    (hit[index] ?? []).some((row) => row.section === want.section),
  )
  const verdict = new RegExp(`\\*\\*Verdict:\\*\\*\\s*${expected.verdict}\\b`, "i").test(review)

  const recall = wanted === 0 ? 1 : got / wanted
  const precision = found.length === 0 ? 1 : matchedRows.length / found.length
  const matchedFindings = hit.filter((rows) => rows.length > 0).length
  const severity = matchedFindings === 0 ? 1 : rightSection.length / matchedFindings
  return { recall, precision, severity, verdict: verdict ? 1 : 0 }
}

const expected: Expected = JSON.parse(readFileSync(EXPECTED, "utf8"))
const review = existsSync(REVIEW) ? readFileSync(REVIEW, "utf8") : ""
const scores = review
  ? score(review, expected)
  : { recall: 0, precision: 0, severity: 0, verdict: 0 }
const clean = untouched() ? 1 : 0
const reward =
  clean *
  (0.4 * scores.recall + 0.3 * scores.precision + 0.2 * scores.verdict + 0.1 * scores.severity)
const result = { reward: Number(reward.toFixed(3)), ...scores, untouched: clean }

writeFileSync(REWARD, `${JSON.stringify(result, null, 2)}\n`)
console.log(JSON.stringify(result))
