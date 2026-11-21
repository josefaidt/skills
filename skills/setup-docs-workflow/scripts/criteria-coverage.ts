#!/usr/bin/env bun
/*
  Lists the behaviors in a repository's RFCs and PRDs that no test names, and the IDs tests name that
  no document defines or that a document has struck. Exits 1 only when a required behavior in an
  `implemented` document has no test, so an approved document waiting on its code never fails CI.

  A document is a markdown file with a `key` in its frontmatter and a `kind` of `rfc` or `prd`, or,
  without `kind`, an H1 that ends in "RFC" or "PRD". Each behavior is a bullet that opens with its
  bold ID, such as `- **RESET-3.2** A used link MUST be rejected.`, and one struck through with `~~`
  is removed and skipped.

  - In an RFC, behaviors sit under `## Behavior`, and the keyword sets the tier: `MUST` is required,
    `SHOULD` expected, and `MAY` optional. Only an `accepted` or `implemented` RFC counts toward
    coverage, though a test may name the IDs of a draft.
  - In a PRD, behaviors are the criteria under `### Story N: Title - P0` headings, and the story's
    priority sets the tier: P0 is required, P1 expected, and P2 optional. A PRD counts unless its
    status is `draft`, and one with no status counts as approved.

  A test names a behavior by its ID anywhere in a test file, usually the test's title.

  Usage: bun criteria-coverage.ts [--root <dir>] [--json]
*/
import { readFileSync } from "node:fs"
import { join } from "node:path"
import { parseArgs } from "node:util"

const TIERS = ["required", "expected", "optional"] as const
type Tier = (typeof TIERS)[number]

type Behavior = {
  // `<key>-<group>.<number>`, such as `RESET-3.2`.
  id: string
  tier: Tier
  // The keyword or priority the document gave it, such as `MUST` or `P0`.
  label: string
  // Repository-relative path of the document that defines it.
  doc: string
  // The behavior's text, without its ID.
  text: string
  // Whether its document is `implemented`, so a missing test fails the check.
  shipped: boolean
}

type Parsed = {
  // Behaviors that count toward coverage.
  counted: Behavior[]
  // Every ID the document defines and has not struck, counted or not.
  defined: string[]
}

type Coverage = {
  untested: Behavior[]
  // IDs a test names that no document defines or that a document has struck, mapped to the test
  // files that name them.
  unknown: Record<string, string[]>
  tested: number
}

const BULLET = /^\s*-\s+\*\*([A-Z][A-Z0-9]*-\d+\.\d+)\*\*\s*(.*)$/
const STORY = /^###\s+Story\s+\d+:.*-\s*(P[012])\s*$/
const KEYWORD = /\b(MUST|SHOULD|MAY)\b/
const ID = /\b[A-Z][A-Z0-9]*-\d+\.\d+\b/g
const TEST_FILE = /\.(test|spec)\.(ts|tsx|mts|cts|js|jsx|mjs|cjs)$/
const COUNTED_RFC_STATUSES = ["accepted", "implemented"]

const TIER_OF: Record<string, Tier> = {
  MUST: "required",
  SHOULD: "expected",
  MAY: "optional",
  P0: "required",
  P1: "expected",
  P2: "optional",
}

const listFiles = (root: string): string[] => {
  const result = Bun.spawnSync(["git", "ls-files", "--cached", "--others", "--exclude-standard"], {
    cwd: root,
  })
  if (result.exitCode !== 0) {
    throw new Error(`git ls-files failed in ${root}. Run this from inside a git repository.`)
  }
  return result.stdout.toString().split("\n").filter(Boolean)
}

const frontmatterField = (source: string, field: string): string | undefined => {
  const frontmatter = /^---\n([\s\S]*?)\n---/.exec(source)?.[1] ?? ""
  return new RegExp(`^${field}:\\s*["']?([^"'\\n]+?)["']?\\s*$`, "m").exec(frontmatter)?.[1]
}

const parseDocument = (path: string, source: string): Parsed => {
  const key = frontmatterField(source, "key")
  const kind = (
    frontmatterField(source, "kind") ?? /^#\s+.*\b(RFC|PRD)\s*$/m.exec(source)?.[1]
  )?.toUpperCase()
  if (!key || (kind !== "RFC" && kind !== "PRD")) return { counted: [], defined: [] }
  const status = frontmatterField(source, "status")
  const counts = kind === "PRD" ? status !== "draft" : COUNTED_RFC_STATUSES.includes(status ?? "")
  const shipped = status === "implemented"

  const counted: Behavior[] = []
  const defined: string[] = []
  // In an RFC, whether the line sits under `## Behavior`. In a PRD, the current story's priority.
  let inBehavior = false
  let storyPriority: string | undefined
  for (const line of source.split("\n")) {
    if (kind === "RFC" && /^##\s/.test(line)) inBehavior = /^##\s+Behavior\s*$/.test(line)
    if (kind === "PRD" && /^#{1,3}\s/.test(line)) storyPriority = STORY.exec(line)?.[1]

    const [, id, text = ""] = BULLET.exec(line) ?? []
    if (!id?.startsWith(`${key}-`) || text.startsWith("~~")) continue
    const label =
      kind === "RFC" ? (inBehavior ? KEYWORD.exec(text)?.[1] : undefined) : storyPriority
    if (!label) continue

    defined.push(id)
    const tier = TIER_OF[label]
    if (counts && tier) counted.push({ id, tier, label, doc: path, text, shipped })
  }
  return { counted, defined }
}

const coverage = (root: string): Coverage => {
  const files = listFiles(root)
  const parsed = files
    .filter((path) => path.endsWith(".md"))
    .map((path) => parseDocument(path, readFileSync(join(root, path), "utf8")))
  const behaviors = parsed.flatMap((doc) => doc.counted)
  const defined = new Set(parsed.flatMap((doc) => doc.defined))

  const named = new Map<string, string[]>()
  for (const path of files.filter((file) => TEST_FILE.test(file))) {
    for (const id of new Set(readFileSync(join(root, path), "utf8").match(ID) ?? [])) {
      named.set(id, [...(named.get(id) ?? []), path])
    }
  }

  const untested = behaviors.filter((behavior) => !named.has(behavior.id))
  const unknown = Object.fromEntries([...named].filter(([id]) => !defined.has(id)))
  return { untested, unknown, tested: behaviors.length - untested.length }
}

const fails = (behavior: Behavior): boolean => behavior.shipped && behavior.tier === "required"

const HEADINGS: Record<Tier, string> = {
  required: "Required behaviors (MUST, P0) with no test yet, in documents not yet implemented:",
  expected: "Expected behaviors (SHOULD, P1) with no test:",
  optional: "Optional behaviors (MAY, P2) with no test:",
}

const report = ({ untested, unknown, tested }: Coverage): string => {
  const lines = [`${tested} of ${tested + untested.length} behaviors have a test.`]
  const failing = untested.filter(fails)
  if (failing.length > 0) {
    lines.push(
      "",
      "Required behaviors (MUST, P0) with no test in an implemented document, which fail:",
    )
    for (const { id, text, doc } of failing) lines.push(`- ${id} (${doc}): ${text}`)
  }
  for (const tier of TIERS) {
    const missing = untested.filter((behavior) => behavior.tier === tier && !fails(behavior))
    if (missing.length === 0) continue
    lines.push("", HEADINGS[tier])
    for (const { id, text, doc } of missing) lines.push(`- ${id} (${doc}): ${text}`)
  }
  const stale = Object.entries(unknown)
  if (stale.length > 0) {
    lines.push("", "IDs named in tests that no document defines, or that a document has struck:")
    for (const [id, paths] of stale) lines.push(`- ${id}: ${paths.join(", ")}`)
  }
  return lines.join("\n")
}

const { values } = parseArgs({
  options: { root: { type: "string", default: "." }, json: { type: "boolean", default: false } },
})
const result = coverage(values.root)
console.log(values.json ? JSON.stringify(result, null, 2) : report(result))
process.exitCode = result.untested.some(fails) ? 1 : 0
