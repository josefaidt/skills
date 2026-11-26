#!/usr/bin/env bun
/*
  Trial-merges pull requests onto `origin/main` in a scratch worktree and runs the repository's
  checks on the merged tree, so a coordinator sees whether they pass together before the first one
  merges. One pull request can change a signature or a file another relies on where git reports no
  conflict, and only a run over the merged tree catches it.

    bun scripts/trial-merge.ts --check <name>=<command>... [--setup <command>]
      [--lockfile <file>=<command>]... [--keep] <pr>...

  It merges each pull request's head in the order given, with git hooks off, since these commits
  never leave the scratch worktree. A conflict in a file named by `--lockfile` alone keeps `main`'s
  copy and runs that file's command to regenerate it, as the later pull request would when it
  rebases, such as `--lockfile Cargo.lock="cargo update --workspace"` or
  `--lockfile bun.lock="bun install"`. Any other conflict stops the run and names the files. Then it
  runs `--setup` when given, then each `--check` in order, each command through `sh -c` in the merged
  tree, writing its output to a log and printing one line for it.

  Afterward it removes the worktree, unless `--keep` is passed, and the refs it fetched, and keeps
  the logs. It exits 1 when a merge or a check fails, and 2 on a bad argument. It depends on nothing
  but Bun and git.
*/
import { closeSync, openSync } from "node:fs"
import { mkdir, mkdtemp } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { parseArgs } from "node:util"
import { $ } from "bun"

const USAGE =
  "usage: bun scripts/trial-merge.ts --check <name>=<command>... [--setup <command>] [--lockfile <file>=<command>]... [--keep] <pr>..."

function splitPair(value: string): [string, string] | undefined {
  const index = value.indexOf("=")
  if (index <= 0 || index === value.length - 1) return undefined
  return [value.slice(0, index), value.slice(index + 1)]
}

const { values, positionals } = parseArgs({
  args: process.argv.slice(2),
  options: {
    check: { type: "string", multiple: true },
    setup: { type: "string" },
    lockfile: { type: "string", multiple: true },
    keep: { type: "boolean" },
  },
  allowPositionals: true,
})

const checks = (values.check ?? []).map(splitPair)
const lockfiles = new Map(
  (values.lockfile ?? []).map(splitPair).filter((pair) => pair !== undefined),
)
if (
  positionals.length === 0 ||
  positionals.some((pr) => !/^\d+$/.test(pr)) ||
  checks.length === 0 ||
  checks.some((pair) => pair === undefined) ||
  lockfiles.size !== (values.lockfile ?? []).length
) {
  process.stderr.write(`${USAGE}\n`)
  process.exit(2)
}

const scratch = await mkdtemp(join(tmpdir(), "trial-merge-"))
const tree = join(scratch, "tree")
const logs = join(scratch, "logs")
await mkdir(logs)
const refPrefix = `refs/trial-merge/${process.pid}`

async function isStepPassing(name: string, command: string): Promise<boolean> {
  const log = join(logs, `${name.replaceAll(/[^\w.-]/g, "-")}.log`)
  const descriptor = openSync(log, "w")
  try {
    const child = Bun.spawn(["sh", "-c", command], {
      cwd: tree,
      stdin: "ignore",
      stdout: descriptor,
      stderr: descriptor,
    })
    const isPassed = (await child.exited) === 0
    process.stdout.write(`${name}: ${isPassed ? "ok" : `FAILED, see ${log}`}\n`)
    return isPassed
  } finally {
    closeSync(descriptor)
  }
}

async function isMerged(pr: string): Promise<boolean> {
  const merged =
    await $`git -C ${tree} -c core.hooksPath=/dev/null merge --quiet --no-edit ${refPrefix}/${pr}`
      .nothrow()
      .quiet()
  if (merged.exitCode === 0) {
    process.stdout.write(`merge #${pr}: ok\n`)
    return true
  }
  const conflicted = (await $`git -C ${tree} diff --name-only --diff-filter=U`.text())
    .split("\n")
    .filter((path) => path !== "")
  const lockfile = conflicted.length === 1 ? conflicted[0] : undefined
  const regenerate = lockfile === undefined ? undefined : lockfiles.get(lockfile)
  if (lockfile === undefined || regenerate === undefined) {
    const reason =
      conflicted.length > 0
        ? `CONFLICT in ${conflicted.join(", ")}`
        : merged.stderr.toString().trim()
    process.stdout.write(`merge #${pr}: ${reason}\n`)
    return false
  }
  await $`git -C ${tree} checkout --ours ${lockfile}`.quiet()
  if (!(await isStepPassing(`lockfile-${pr}`, regenerate))) return false
  await $`git -C ${tree} add ${lockfile}`.quiet()
  await $`git -C ${tree} -c core.hooksPath=/dev/null commit --quiet --no-edit`.quiet()
  process.stdout.write(`merge #${pr}: ok, with ${lockfile} regenerated\n`)
  return true
}

let isPassing = true
try {
  const heads = positionals.map((pr) => `pull/${pr}/head:${refPrefix}/${pr}`)
  await $`git fetch --quiet origin main ${heads}`
  await $`git worktree add --quiet --detach ${tree} refs/remotes/origin/main`
  const base = (await $`git -C ${tree} rev-parse --short HEAD`.text()).trim()
  process.stdout.write(`trial-merge: onto origin/main at ${base}, logs in ${logs}\n`)

  for (const pr of positionals) {
    if (!(await isMerged(pr))) {
      isPassing = false
      break
    }
  }
  if (isPassing && values.setup !== undefined) {
    isPassing = await isStepPassing("setup", values.setup)
  }
  if (isPassing) {
    for (const pair of checks) {
      if (pair !== undefined && !(await isStepPassing(pair[0], pair[1]))) isPassing = false
    }
  }
} finally {
  if (values.keep) {
    process.stdout.write(`trial-merge: kept the merged tree at ${tree}\n`)
  } else {
    await $`git worktree remove --force ${tree}`.nothrow().quiet()
  }
  for (const pr of positionals) {
    await $`git update-ref -d ${refPrefix}/${pr}`.nothrow().quiet()
  }
}

process.stdout.write(`trial-merge: ${isPassing ? "passed" : "failed"}\n`)
process.exit(isPassing ? 0 : 1)
