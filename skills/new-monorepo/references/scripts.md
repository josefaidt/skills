# Scripts

Examples for the setup and checks step. Make each shell script executable with `chmod +x`.

## `scripts/setup.sh`

Add each step a checkout needs here, such as generating types or migrating a local database, and keep each one safe to run twice.

```bash
#!/usr/bin/env bash
# One-command local bootstrap: dependencies, local env files, and the packages with a build step.
# Safe to re-run at any time, since every step is idempotent, so this is also the way to repair a
# half-set-up workspace. Add each new step the repo needs here, and keep it idempotent.
set -euo pipefail

cd "$(dirname "$0")/.."

# CI installs dependencies through .github/actions/setup and sets SKIP_INSTALL=1, so the install
# runs only once
if [[ "${SKIP_INSTALL:-}" != "1" ]]; then
  echo "==> installing dependencies"
  bun ci
fi

echo "==> creating missing .env.local files from their examples"
# never overwrite an existing .env.local, which may hold real values
for example in .env.example apps/*/.env.example packages/*/.env.example; do
  [[ -e "$example" ]] || continue
  local_env="${example%.example}.local"
  if [[ ! -e "$local_env" ]]; then
    cp "$example" "$local_env"
    echo "    created $local_env"
  fi
done

# an app that loads a package from dist/ runs against what this builds
echo "==> building the packages with a build step"
bun run build

echo "==> ready"
```

## `scripts/check-changes.sh`

Add a line to `PATH_CHECKS` for each `check-*` script the repository grows, with the paths whose change should run it.

```bash
#!/usr/bin/env bash
# Runs the static checks CI runs, scoped to the files that changed since a base, and prints nothing
# when they pass, so the Claude Code Stop hook in .claude/hooks/check-changes.sh can hand a failure
# straight back to the agent. It formats the changed files, lints them, typechecks the repo when a
# TypeScript file or a config the type checker reads changed, and runs each root script in
# PATH_CHECKS whose paths changed.
#
#   check-changes.sh [<base>]     check what changed since <base>, a commit or a tree
#   check-changes.sh --print-tree print the hash of the working tree, which the hook stores as the
#                                 next turn's base
#
# The base defaults to where the branch left origin/main. A commit counts from where the branch left
# it, so `origin/main` on a branch that is behind it checks only what the branch changed, not what
# main added since. The whole working tree is compared to the base, untracked files included, so an
# edit counts however it was made.
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

# The extensions oxfmt formats and oxlint lints, matching .git-hooks/pre-commit
FORMATTED='\.(ts|tsx|js|jsx|cjs|mjs|cts|mts|json|jsonc|yaml|yml|toml|css|scss|less|md|mdx|graphql|vue|svelte|html)$'
LINTED='\.(ts|tsx|js|jsx|cjs|mjs|cts|mts|vue|svelte|astro)$'
# A change to one of these can break a file that did not change, so it runs that check on the repo
FORMATS_ALL='^\.oxfmtrc\.jsonc?$'
LINTS_ALL='(^|/)\.oxlintrc\.jsonc?$'
TYPECHECKS='\.(ts|tsx|cts|mts)$|(^|/)tsconfig[^/]*\.json$|(^|/)package\.json$|^bun\.lock$'

# Each root script and the changed paths that run it, one `<script> <extended regex>` per line. Add a
# line for each check-* script the repo grows, and one for `build` once a package's build can fail on
# what the typecheck accepts.
PATH_CHECKS='check-catalog (^|/)package\.json$'

# Hashes the working tree into a tree object by staging everything into a copy of the index. The copy
# keeps the real index untouched, and starting from it lets git rehash only the files whose stat data
# changed.
write_tree() {
  local dir index
  dir="$(mktemp -d)"
  index="$(git rev-parse --git-path index)"
  if [[ -f $index ]]; then cp "$index" "$dir/index"; fi
  GIT_INDEX_FILE="$dir/index" git add --all >/dev/null
  GIT_INDEX_FILE="$dir/index" git write-tree
  rm -rf "$dir"
}

if [[ ${1:-} == --print-tree ]]; then
  write_tree
  exit 0
fi

if [[ -n ${1:-} ]]; then
  base="$1"
  kind="$(git cat-file -t "$base")"
elif kind="$(git cat-file -t origin/main 2>/dev/null)"; then
  base=origin/main
elif git rev-parse --verify --quiet HEAD >/dev/null; then
  # never pushed, so check what the working tree changed since the last commit
  base=HEAD
  kind=commit
else
  # no commits yet, so check everything
  base="$(git hash-object -t tree /dev/null)"
  kind=tree
fi
if [[ $kind == commit ]]; then
  base="$(git merge-base "$base" HEAD 2>/dev/null || printf '%s' "$base")"
fi

changed="$(git diff --name-only --no-renames --diff-filter=d "$base" "$(write_tree)")"
[[ -n $changed ]] || exit 0

failed=0

# Prints the changed paths that match an extended regex.
matching() {
  printf '%s\n' "$changed" | grep -E "$1" || true
}

# Runs a command, and prints its output only when it fails. Output that says every file was ignored
# counts as a pass.
run() {
  local output
  if output="$("$@" 2>&1)"; then return 0; fi
  case "$output" in
  *"Expected at least one target file"* | *"No files found to lint"*) return 0 ;;
  esac
  printf '$ %s\n%s\n\n' "$*" "$output"
  failed=1
}

# Runs a command with newline-separated paths appended as arguments, keeping any spaces in a path.
run_on() {
  local paths="$1"
  shift
  run xargs -0 "$@" < <(printf '%s\n' "$paths" | sed 's|^|./|' | tr '\n' '\0')
}

if [[ -n "$(matching "$FORMATS_ALL")" ]]; then
  run bun run fmt
elif [[ -n "$(matching "$FORMATTED")" ]]; then
  run_on "$(matching "$FORMATTED")" bun run fmt
fi

if [[ -n "$(matching "$LINTS_ALL")" ]]; then
  run bun run lint
elif [[ -n "$(matching "$LINTED")" ]]; then
  run_on "$(matching "$LINTED")" bun run lint
fi

if [[ -n "$(matching "$TYPECHECKS")" ]]; then
  run bun run typecheck
fi

while read -r script pattern <&3; do
  [[ -n $script && -n "$(matching "$pattern")" ]] || continue
  run bun run "$script"
done 3<<<"$PATH_CHECKS"

exit "$failed"
```

## `scripts/check-catalog.ts`

```ts
/*
 * Fails when a workspace declares a cataloged package by version instead of `catalog:`,
 * references `catalog:` for a package the catalog does not define, or pins by version a
 * package that another workspace also pins, which belongs in the catalog.
 *
 * Peer dependency ranges are exempt, since they state what consumers may install.
 */
import { Glob } from "bun"
import { z } from "zod"

/*
 * The dependency sections a version pin is checked in.
 */
const SECTIONS = ["dependencies", "devDependencies", "optionalDependencies"] as const

/*
 * The subset of `package.json` this check reads.
 */
const manifestSchema = z.object({
  /*
   * Package name, used only to label violations.
   */
  name: z.string().optional(),
  /*
   * Workspace globs and the shared version catalog, present only in the root manifest.
   */
  workspaces: z
    .object({
      /*
       * Globs of workspace directories.
       */
      packages: z.array(z.string()).optional(),
      /*
       * Package name to version range.
       */
      catalog: z.record(z.string(), z.string()).optional(),
    })
    .optional(),
  dependencies: z.record(z.string(), z.string()).optional(),
  devDependencies: z.record(z.string(), z.string()).optional(),
  optionalDependencies: z.record(z.string(), z.string()).optional(),
})

/*
 * Pins allowed to stay off the catalog, keyed by manifest path.
 * Remove an entry when the issue that holds it back lands.
 */
const EXEMPT: Readonly<Record<string, readonly string[]>> = {}

const root = manifestSchema.parse(await Bun.file("package.json").json())
const catalog = root.workspaces?.catalog ?? {}

const manifests = ["package.json"]
for (const pattern of root.workspaces?.packages ?? []) {
  for await (const path of new Glob(`${pattern}/package.json`).scan({ onlyFiles: true })) {
    if (!path.includes("node_modules")) manifests.push(path)
  }
}

const violations: string[] = []
/*
 * Each package pinned by version off the catalog, mapped to the manifests that pin it.
 */
const pinnedBy = new Map<string, Set<string>>()
for (const path of manifests.toSorted()) {
  const manifest =
    path === "package.json" ? root : manifestSchema.parse(await Bun.file(path).json())
  for (const section of SECTIONS) {
    for (const [name, version] of Object.entries(manifest[section] ?? {})) {
      if (EXEMPT[path]?.includes(name)) {
        console.warn(`${path}: ${name} is exempt from the catalog; see EXEMPT in this script`)
      } else if (name in catalog && version !== "catalog:") {
        violations.push(`${path}: ${section}.${name} is "${version}", expected "catalog:"`)
      } else if (version === "catalog:" && !(name in catalog)) {
        violations.push(
          `${path}: ${section}.${name} uses "catalog:" but is not in workspaces.catalog`,
        )
      } else if (version !== "catalog:" && !version.startsWith("workspace:")) {
        pinnedBy.set(name, (pinnedBy.get(name) ?? new Set()).add(path))
      }
    }
  }
}

for (const [name, paths] of pinnedBy) {
  if (paths.size > 1) {
    violations.push(
      `${name} is pinned in ${[...paths].join(", ")}; add it to workspaces.catalog and use "catalog:"`,
    )
  }
}

if (violations.length > 0) {
  console.error(`Catalog check failed:\n${violations.map((v) => `  ${v}`).join("\n")}`)
  process.exit(1)
}
process.stdout.write(`Catalog check passed for ${manifests.length} manifests.\n`)
```
