# Agent configuration

Examples for the agent configuration step. Make each script in `.claude/hooks/` executable with `chmod +x`.

## `AGENTS.md`

Replace the placeholder under "What this is" with one paragraph saying what the project is and who it is for, and keep the Skills table matching the skills the repository installs. `CLAUDE.md` is a symlink to this file.

```markdown
# AGENTS.md

Guidance for coding agents working in this repository. `CLAUDE.md` is a symlink to this file, so Claude Code, Codex, and anything else reading `AGENTS.md` all get the same instructions. Edit this file, never the symlink.

This file holds what every session needs before it picks a skill, plus pointers. A rule that matters for one kind of task goes in the skill or document that governs that task.

`README.md` is the human-facing entry point. When onboarding someone, point them at it and `bun run setup`, since `scripts/setup.sh` is the single source of truth for what a checkout needs.

## What this is

<One paragraph: what the project is and who it is for.>

## Skills

Project skills live in `.agents/skills/`, symlinked into `.claude/skills/`. Load the matching skill before starting the work it covers.

| Skill                    | Load when                                                               |
| :----------------------- | :---------------------------------------------------------------------- |
| `writing-typescript`     | Writing or reviewing any TypeScript                                     |
| `new-typescript-package` | Adding a workspace package or app                                       |
| `monorepo`               | Deciding where code belongs, or adding or upgrading a dependency        |
| `writing-prose`          | Writing any prose, such as a README, an issue, or a pull request body   |
| `domain-modeling`        | Naming or renaming a domain concept, or editing `GLOSSARY.md` or an ADR |
| `conventional-commit`    | Writing a commit message                                                |

`retro` runs only when the user invokes it by name, and codifies what a session taught into the files future agents read.

Skills vendored from other repositories are pinned in `skills-lock.json`. Change them upstream and run `bunx skills update` rather than editing the copies here.

## Local setup

`bun run setup` bootstraps a checkout. Every step is idempotent, so re-run it to repair a workspace rather than debugging a half-set-up one. Claude Code sessions run it through a `SessionStart` hook, including in new worktrees.

Search the tree with `git grep`, which never opens a gitignored file such as `.env.local`.

Hooks run the static checks, so a Claude Code session never spends a tool call on them. A `PostToolUse` hook formats each file an `Edit` or `Write` changes, and a `Stop` hook runs `bun run check-changes` over everything the turn changed and hands any failure back before the turn can end. Do not run the formatter, the linter, or the type checker to confirm an edit; when the hook blocks, fix what it reports. Tests are not part of it, so run the ones a change needs. An agent without these hooks, such as Codex, runs `bun run check-changes` before it finishes.

## Project structure

A TypeScript monorepo on Bun workspaces.

- `apps/` holds what you run or deploy, such as a server, a site, or a CLI. Nothing imports an app.
- `packages/` holds what other workspaces import. A package has an entrypoint and no deploy target.

## Commands

This project uses `bun`, never `npm` or `pnpm`, at the version pinned in `.bun-version`. Run commands from the repo root.

- `bun run --filter <package-name> <script>` runs one workspace's script; `--filter '*'` fans out to all.
- `bun run test` runs each workspace's Vitest `test` script. Never run `bun test`, which starts Bun's own runner.
- `bun run typecheck` checks every workspace with `bun check`, then the root `scripts/` project.
- `bun run build` builds each package with a build step into its `dist/`.
- `bun run fmt` and `bun run lint` (oxfmt and type-aware oxlint), with `fmt:check` and `lint:fix`.
- `bun run check-changes [<base>]` runs the static checks CI runs on what changed since `<base>`, which defaults to where the branch left `origin/main`, and prints nothing when all of it passes.
- One-off `.ts` scripts run directly with `bun run <file>`.

## Markdown

Write each paragraph and list item in any markdown as one unbroken line, even in a file that is already hard-wrapped, since oxfmt keeps line breaks and never reflows them.

## Commits and pull requests

Commit messages and pull request titles follow Conventional Commits, `type(scope): summary`, and the `commit-msg` hook checks them with commitlint. When a branch needs commits from `main`, rebase it onto `origin/main` and push with `git push --force-with-lease`. Do not merge `main` into it.
```

## `.claude/settings.json`

The allow list covers the commands an agent runs on every task, and the deny list keeps dotenv files out of its context. The hooks wire in the four scripts below.

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
      "Bash(bun run check-catalog)",
      "Bash(bun run check-changes)",
      "Bash(bun run check-changes *)",
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
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-changes.sh snapshot",
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
            "command": "\"$CLAUDE_PROJECT_DIR\"/.claude/hooks/check-changes.sh check",
            "timeout": 300
          }
        ]
      }
    ]
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
# runs the formatter itself. check-changes.sh formats anything else a turn changes, such as a file
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

## `.claude/hooks/check-changes.sh`

```bash
#!/usr/bin/env bash
# Runs scripts/check-changes.sh over what each turn changed, so the agent never spends a tool call
# on the formatter, the linter, or the type checker.
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
# a worktree cut from a commit before the script landed has nothing to run
[[ -x scripts/check-changes.sh ]] || exit 0

session=default
if [[ $input =~ \"session_id\":\ *\"([A-Za-z0-9_-]+)\" ]]; then
  session="${BASH_REMATCH[1]}"
fi
# inside the git dir, so the state of a worktree goes away with it
state="$(git rev-parse --path-format=absolute --git-path claude-check-changes)"
mkdir -p "$state"
base="$state/$session.base"
pending="$state/$session.pending"

snapshot() {
  ./scripts/check-changes.sh --print-tree >"$base"
}

case "${1:-}" in
snapshot)
  [[ -f $pending ]] || snapshot
  ;;
check)
  # without a base, such as in the first turn after the hook was installed, there is no telling
  # what this turn changed, so start tracking from here
  if [[ ! -s $base ]] || ! git cat-file -e "$(cat "$base")^{tree}" 2>/dev/null; then
    snapshot
    exit 0
  fi
  if output="$(./scripts/check-changes.sh "$(cat "$base")" 2>&1)"; then
    rm -f "$pending"
    snapshot
    exit 0
  fi
  touch "$pending"
  printf 'These checks failed on the files this turn changed in %s. Fix them before you finish; the hook reruns them.\n\n%s\n' "$workspace" "$output" >&2
  exit 2
  ;;
*)
  echo "usage: check-changes.sh snapshot|check" >&2
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
