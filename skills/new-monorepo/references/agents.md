# Agent configuration

Examples for the agent configuration step. Make each script in `.claude/hooks/` executable with `chmod +x`.

## `AGENTS.md`

Replace the placeholder under "What this is" with one paragraph saying what the project is and who it is for, and keep the Skills table matching the skills the repository installs. `CLAUDE.md` is a symlink to this file.

````markdown
# AGENTS.md

Guidance for coding agents working in this repository. `CLAUDE.md` is a symlink to this file, so Claude Code, Codex, and anything else reading `AGENTS.md` all get the same instructions. Edit this file, never the symlink.

This file holds what every session needs before it picks a skill, plus pointers. A rule that matters for one kind of task goes in the skill or document that governs that task.

`README.md` is the human-facing entry point. When onboarding someone, point them at it and `bun run setup`, since `scripts/setup.sh` is the single source of truth for what a checkout needs.

## What this is

<One paragraph: what the project is and who it is for.>

## Skills

The skills are Claude Code plugins from the `josefaidt-skills` marketplace in [josefaidt/skills](https://github.com/josefaidt/skills), which `.claude/settings.json` declares along with the plugins this repository uses. Settings don't install a plugin, so each person installs them once:

```sh
claude plugin marketplace add josefaidt/skills
claude plugin install writing@josefaidt-skills --scope project
claude plugin install typescript@josefaidt-skills --scope project
claude plugin install design@josefaidt-skills --scope project
claude plugin install agents@josefaidt-skills --scope project
```

Load the matching skill before starting the work it covers.

| Skill                               | Load when                                                               |
| :---------------------------------- | :---------------------------------------------------------------------- |
| `typescript:writing-typescript`     | Writing or reviewing any TypeScript                                     |
| `typescript:new-typescript-package` | Adding a workspace package or app                                       |
| `typescript:monorepo`               | Deciding where code belongs, or adding or upgrading a dependency        |
| `writing:writing-prose`             | Writing any prose, such as a README, an issue, or a pull request body   |
| `design:domain-modeling`            | Naming or renaming a domain concept, or editing `GLOSSARY.md` or an ADR |

`agents:retro` runs only when the user invokes it by name, and codifies what a session taught into the files future agents read.

Codex and other agents don't read Claude Code plugins. To use the skills there, copy them in with `bunx skills add josefaidt/skills`, as the skills repository's README describes.

## Local setup

`bun run setup` bootstraps a checkout. Every step is idempotent, so re-run it to repair a workspace rather than debugging a half-set-up one. Claude Code sessions run it through a `SessionStart` hook, including in new worktrees.

Search the tree with `git grep`, which never opens a gitignored file such as `.env.local`.

Hooks run the static checks, so a Claude Code session never spends a tool call on them. A `PostToolUse` hook formats each file an `Edit` or `Write` changes, and a `Stop` hook formats, lints, and type checks everything the turn changed and hands any failure back before the turn can end. Do not run the formatter, the linter, or the type checker to confirm an edit; when the hook blocks, fix what it reports. Tests are not part of it, so run the ones a change needs. An agent without these hooks, such as Codex, runs `bun run fmt`, `bun run lint`, and `bun run typecheck` before it finishes.

## Project structure

A TypeScript monorepo on Bun workspaces.

- `apps/` holds what you run or deploy, such as a server, a site, or a CLI. Nothing imports an app.
- `packages/` holds what other workspaces import. A package has an entrypoint and no deploy target.

## Commands

This project uses `bun`, never `npm` or `pnpm`, at the version pinned in `.bun-version`. Run commands from the repo root.

- `bun run --filter <package-name> <script>` runs one workspace's script; `--filter '*'` fans out to all.
- `bun run test` runs each workspace's Vitest `test` script. Never run `bun test`, which starts Bun's own runner.
- `bun run typecheck` checks every workspace with `bun check`.
- `bun run build` builds each package with a build step into its `dist/`.
- `bun run fmt` and `bun run lint` (oxfmt and type-aware oxlint), with `fmt:check` and `lint:fix`.
- One-off `.ts` scripts run directly with `bun run <file>`.

## Markdown

Write each paragraph and list item in any markdown as one unbroken line, even in a file that is already hard-wrapped, since oxfmt keeps line breaks and never reflows them.

## Commits and pull requests

Commit messages and pull request titles follow Conventional Commits, `type(scope): summary`, and the `commit-msg` hook checks them with commitlint. When a branch needs commits from `main`, rebase it onto `origin/main` and push with `git push --force-with-lease`. Do not merge `main` into it.
````

## `.claude/settings.json`

The allow list covers the commands an agent runs on every task, and the deny list keeps dotenv files out of its context. The hooks wire in the four scripts below. The last two keys declare the `josefaidt-skills` marketplace and the plugins the repository uses, and they stay after `hooks`, where `claude plugin install` writes them, so an install leaves the file unchanged.

```json
{
  "$schema": "https://json.schemastore.org/claude-code-settings.json",
  "permissions": {
    "allow": [
      "Bash(bun ci)",
      "Bash(bun install)",
      "Bash(bun run build)",
      "Bash(bun run lint)",
      "Bash(bun run fmt)",
      "Bash(bun run fmt:check)",
      "Bash(bun run test)",
      "Bash(bun run test *)",
      "Bash(bun run typecheck)",
      "Bash(git add *)",
      "Bash(git commit *)",
      "Bash(git fetch origin main)",
      "Bash(git rebase origin/main)",
      "Bash(gh pr view *)",
      "Bash(gh pr checks *)",
      "Bash(gh pr list *)",
      "Bash(gh issue view *)",
      "Bash(gh issue list *)",
      "Read(**/.env.example)"
    ],
    "deny": ["Read(**/.env)", "Read(**/.env.local)", "Read(**/.env.*.local)"]
  },
  "hooks": {
    "SessionStart": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/setup-workspace.sh",
            "timeout": 300
          }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "EnterWorktree",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/setup-workspace.sh",
            "timeout": 300
          }
        ]
      },
      {
        "matcher": "Edit|Write|MultiEdit",
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/format-file.sh",
            "timeout": 30
          }
        ]
      }
    ],
    "UserPromptSubmit": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/turn-checks.sh snapshot",
            "timeout": 30
          }
        ]
      }
    ],
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/turn-checks.sh check",
            "timeout": 300
          }
        ]
      }
    ]
  },
  "enabledPlugins": {
    "writing@josefaidt-skills": true,
    "typescript@josefaidt-skills": true,
    "design@josefaidt-skills": true,
    "agents@josefaidt-skills": true
  },
  "extraKnownMarketplaces": {
    "josefaidt-skills": {
      "source": {
        "source": "github",
        "repo": "josefaidt/skills"
      }
    }
  }
}
```

## `.claude/hooks/session-workspace.sh`

Sourced by the other three, not run on its own. It needs `jq` to read the session directory from the hook input, and falls back to the project directory without it.

```bash
#!/usr/bin/env bash
# Sourced by the hooks that act on a checkout, to decide which one. A session forked into a new
# worktree can keep the original checkout as its project dir, so a hook that trusts
# CLAUDE_PROJECT_DIR or its own directory works on a checkout the session never edits. The hook's
# input names the session's own directory in `cwd`, which decides, with the project dir as the
# fallback. The directory must be a worktree of this repository, so a hook never acts on another
# repository.

# Prints the root of the checkout the session works in. Takes the hook's input JSON, which may be
# empty.
resolve_session_workspace() {
  local input="$1" session_dir="" toplevel project_dir="${CLAUDE_PROJECT_DIR:-$PWD}"
  if command -v jq >/dev/null 2>&1; then
    session_dir="$(printf '%s' "$input" | jq -r '.cwd // empty' 2>/dev/null || true)"
  fi
  if toplevel="$(git -C "${session_dir:-.}" rev-parse --show-toplevel 2>/dev/null)" &&
    [[ "$(git -C "$toplevel" rev-parse --path-format=absolute --git-common-dir)" == \
      "$(git -C "$project_dir" rev-parse --path-format=absolute --git-common-dir)" ]]; then
    printf '%s\n' "$toplevel"
  else
    printf '%s\n' "$project_dir"
  fi
}
```

## `.claude/hooks/setup-workspace.sh`

```bash
#!/usr/bin/env bash
# Brings a workspace up to a runnable state. Runs on session start and after EnterWorktree, so it
# fires in fresh worktrees, which start with none of the gitignored state a working checkout needs.
#
# The steps themselves live in scripts/setup.sh, the same command the README tells a person to run,
# so automation and docs cannot drift apart. This hook only decides whether a workspace needs the
# full bootstrap or a refresh.
#
# Anything a SessionStart hook prints to stdout is injected into Claude's context, so all output
# goes to stderr.
set -euo pipefail

# shellcheck source=session-workspace.sh
source "$(dirname "${BASH_SOURCE[0]}")/session-workspace.sh"
input=""
[[ -t 0 ]] || input="$(cat)"
workspace="$(resolve_session_workspace "$input")"
cd "$workspace"
echo "[setup-workspace] bootstrapping $workspace" >&2

# A warm workspace can still hold node_modules from before a pull changed bun.lock, so it installs
# from the lockfile, which takes well under a second when nothing changed and fails when a
# package.json asks for a package bun.lock lacks. It rebuilds the packages with a build step too,
# since an app that loads one from dist/ would otherwise run against a stale build. Add any other
# gitignored state the repo generates, such as generated types, to both branches.
if [[ -d node_modules ]]; then
  bun ci >&2
  bun run build >&2
  exit 0
fi

echo "[setup-workspace] cold workspace, running scripts/setup.sh" >&2
./scripts/setup.sh >&2
```

## `.claude/hooks/format-file.sh`

```bash
#!/usr/bin/env bash
# Formats the file an Edit or Write just changed, so the agent reads formatted code back and never
# runs the formatter itself. turn-checks.sh formats anything else a turn changes, such as a file
# a shell command wrote, and reports a file the formatter cannot parse.
set -euo pipefail

# shellcheck source=session-workspace.sh
source "$(dirname "${BASH_SOURCE[0]}")/session-workspace.sh"
input="$(cat)"
workspace="$(resolve_session_workspace "$input")"
workspace="$(git -C "$workspace" rev-parse --show-toplevel 2>/dev/null)" || exit 0
file="$(printf '%s' "$input" | bun -e 'const input = await Bun.stdin.json(); process.stdout.write(input.tool_input?.file_path ?? "")')"
# a file outside this checkout, such as one in the scratchpad, is not this repo's to format
[[ $file == "$workspace"/* ]] || exit 0
cd "$workspace"
# a file mid-edit may not parse yet, which the Stop hook reports once the turn ends
bun run fmt "$file" >/dev/null 2>&1 || true
```

## `.claude/hooks/turn-checks.sh`

```bash
#!/usr/bin/env bash
# Formats, lints, and type checks what each turn changed, so the agent never spends a tool call on
# the formatter, the linter, or the type checker.
#
# On UserPromptSubmit (`snapshot`) it records the working tree as the turn's base. On Stop (`check`)
# it checks every file that differs from that base, whether an Edit, a Write, a shell command, or a
# subagent changed it, and on a failure exits 2, which hands the output back to Claude and keeps the
# turn going until the checks pass. The base moves forward only once they pass, so a failure the
# turn could not fix is checked again at the end of the next one, while a file the user edits
# between two passing turns is never checked.
#
# Anything a UserPromptSubmit hook prints to stdout is injected into Claude's context, so nothing
# goes to stdout.
set -euo pipefail

# shellcheck source=session-workspace.sh
source "$(dirname "${BASH_SOURCE[0]}")/session-workspace.sh"
input="$(cat)"
workspace="$(resolve_session_workspace "$input")"
workspace="$(git -C "$workspace" rev-parse --show-toplevel 2>/dev/null)" || exit 0
cd "$workspace"

# The extensions oxfmt formats and oxlint lints, matching .git-hooks/pre-commit
FORMATTED='\.(ts|tsx|js|jsx|cjs|mjs|cts|mts|json|jsonc|yaml|yml|toml|css|scss|less|md|mdx|graphql|vue|svelte|html)$'
LINTED='\.(ts|tsx|js|jsx|cjs|mjs|cts|mts|vue|svelte|astro)$'
# A change to one of these can break a file that did not change, so it runs that check on the repo
FORMATS_ALL='^\.oxfmtrc\.jsonc?$'
LINTS_ALL='(^|/)\.oxlintrc\.jsonc?$'
TYPECHECKS='\.(ts|tsx|cts|mts)$|(^|/)tsconfig[^/]*\.json$|(^|/)package\.json$|^bun\.lock$'

session=default
if [[ $input =~ \"session_id\":\ *\"([A-Za-z0-9_-]+)\" ]]; then
  session="${BASH_REMATCH[1]}"
fi
# inside the git dir, so the state of a worktree goes away with it
state="$(git rev-parse --path-format=absolute --git-path claude-turn-checks)"
mkdir -p "$state"
base="$state/$session.base"
pending="$state/$session.pending"

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

changed=""
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

# Formats and lints the files that changed since a tree, and type checks the repo when a file the
# type checker reads changed. Prints the output of each check that fails.
check_since() {
  changed="$(git diff --name-only --no-renames --diff-filter=d "$1" "$(write_tree)")"
  [[ -n $changed ]] || return 0
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
  return "$failed"
}

case "${1:-}" in
snapshot)
  [[ -f $pending ]] || write_tree >"$base"
  ;;
check)
  # without a base, such as in the first turn after the hook was installed, there is no telling
  # what this turn changed, so start tracking from here
  if [[ ! -s $base ]] || ! git cat-file -e "$(cat "$base")^{tree}" 2>/dev/null; then
    write_tree >"$base"
    exit 0
  fi
  if output="$(check_since "$(cat "$base")" 2>&1)"; then
    rm -f "$pending"
    write_tree >"$base"
    exit 0
  fi
  touch "$pending"
  printf 'These checks failed on the files this turn changed in %s. Fix them before you finish; the hook reruns them.\n\n%s\n' "$workspace" "$output" >&2
  exit 2
  ;;
*)
  echo "usage: turn-checks.sh snapshot|check" >&2
  exit 1
  ;;
esac
```

## `.worktreeinclude`

```gitignore
# Gitignored files copied into a worktree when Claude Code first creates it.
# Gitignore syntax, matched against `git ls-files --others --ignored`.
#
# A bare pattern matches at any depth, so this one line covers the root file and every workspace
# package's. They are copied, not symlinked, and only at creation, so rotating a value in the main
# checkout leaves existing worktrees on the old copy.
.env.local
```
