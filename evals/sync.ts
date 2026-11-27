#!/usr/bin/env bun
/*
  Copies the files every task in a dataset shares from `evals/shared/<dataset>/` into each task, so
  each task directory runs on its own in Harbor. Edit the shared copy, then run this. With `--check`,
  it changes nothing and exits 1 when a task's copy differs from the shared one.

  Usage: bun evals/sync.ts [--check]
*/
import { chmodSync, cpSync, existsSync, readdirSync, readFileSync, rmSync, statSync } from "node:fs"
import { join } from "node:path"
import { parseArgs } from "node:util"

// Where each shared file or directory goes inside a task.
const LAYOUT: Record<string, string> = {
  base: "environment/base",
  Dockerfile: "environment/Dockerfile",
  "build-repo.sh": "environment/build-repo.sh",
  "instruction.md": "instruction.md",
  "test.sh": "tests/test.sh",
  "verify.ts": "tests/verify.ts",
  "solve.sh": "solution/solve.sh",
}
const EXECUTABLE = ["environment/build-repo.sh", "tests/test.sh", "solution/solve.sh"]

const EVALS = import.meta.dir
const { values } = parseArgs({ options: { check: { type: "boolean", default: false } } })

// Files under a directory, relative to it and sorted.
const relativeFiles = (root: string): string[] =>
  readdirSync(root, { recursive: true, encoding: "utf8" })
    .filter((entry) => statSync(join(root, entry)).isFile())
    .sort()

const same = (from: string, to: string): boolean => {
  if (!existsSync(to)) return false
  if (statSync(from).isFile()) return readFileSync(from).equals(readFileSync(to))
  const left = relativeFiles(from)
  const right = relativeFiles(to)
  return (
    left.length === right.length &&
    left.every(
      (entry, index) =>
        entry === right[index] &&
        readFileSync(join(from, entry)).equals(readFileSync(join(to, entry))),
    )
  )
}

const stale: string[] = []
for (const dataset of readdirSync(join(EVALS, "shared"))) {
  const shared = join(EVALS, "shared", dataset)
  for (const task of readdirSync(join(EVALS, dataset))) {
    const root = join(EVALS, dataset, task)
    if (!existsSync(join(root, "task.toml"))) continue
    for (const [name, target] of Object.entries(LAYOUT)) {
      const from = join(shared, name)
      const to = join(root, target)
      if (!existsSync(from) || same(from, to)) continue
      stale.push(join(dataset, task, target))
      if (values.check) continue
      rmSync(to, { recursive: true, force: true })
      cpSync(from, to, { recursive: true })
      if (EXECUTABLE.includes(target)) chmodSync(to, 0o755)
    }
  }
}

if (values.check && stale.length > 0) {
  console.log(`Out of date with evals/shared, so run bun evals/sync.ts:\n${stale.join("\n")}`)
  process.exitCode = 1
} else {
  console.log(
    stale.length > 0 ? `Updated:\n${stale.join("\n")}` : "Every task matches evals/shared.",
  )
}
