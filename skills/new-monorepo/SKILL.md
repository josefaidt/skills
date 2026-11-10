---
name: new-monorepo
description: Walk through setting up a Bun and TypeScript monorepo with apps/ and packages/, or bringing an existing repository onto the same tooling, one piece at a time with a working example of each file. Covers Bun workspaces and a version catalog, a strict tsconfig, oxfmt, type-aware oxlint on its strict categories, Vitest, commitlint and git hooks, a setup script, Claude Code hooks that format each edit and check each turn, GitHub Actions, AGENTS.md, and the agent skills the repo works with. Use when asked to create, scaffold, or bootstrap a monorepo, workspace, or TypeScript project, or to add this tooling to an existing one.
argument-hint: "[directory] [--scope <scope>]"
---

# New monorepo

This skill walks through setting up a TypeScript monorepo on Bun workspaces: the tooling that keeps every package formatted, linted, type checked, and tested, and the agent configuration that runs those checks on each turn. Each step says what its files do and points at a working example in `references/`. Write each file from its example, adapted to the repository, rather than pasting it whole: use the repository's names, the current version of each tool, and only what the repository will use. A step the user does not want, such as the Claude Code hooks in a repository no agent works in, can be left out, and the steps after it still hold.

Three skills cover the repo once it exists: `monorepo` decides where code goes and how dependencies resolve, `new-typescript-package` adds each package or app, and `writing-typescript` governs each source file.

## The stack

| Tool                        | Role                                                                                            | Configured in                                 |
| :-------------------------- | :---------------------------------------------------------------------------------------------- | :-------------------------------------------- |
| Bun 1.4 or later            | Package manager, script runner, and type checker (`bun check`)                                  | `package.json`, `bunfig.toml`, `.bun-version` |
| TypeScript 7                | Strict compiler baseline every package extends                                                  | `tsconfig.base.json`                          |
| oxfmt                       | Formatter, import order, and `package.json` key order                                           | `.oxfmtrc.jsonc`                              |
| oxlint with oxlint-tsgolint | Type-aware linter on its strict categories                                                      | `.oxlintrc.jsonc`                             |
| Vitest                      | Each package's `test` script                                                                    | Each package                                  |
| commitlint                  | Conventional Commits on every message                                                           | `.commitlintrc.json`, `.git-hooks/commit-msg` |
| Git hooks                   | Format and lint check on staged files, and a reinstall after a rebase that changes a dependency | `.git-hooks/`                                 |
| Claude Code hooks           | Setup on session start, format on each edit, and every static check before each turn ends       | `.claude/`                                    |
| GitHub Actions              | Every check on each pull request, in one job                                                    | `.github/`                                    |
| skills CLI                  | Agent skills vendored into the repo and pinned                                                  | `.agents/skills/`, `skills-lock.json`         |

## Starting from the template

[josefaidt/bun-oxc-monorepo-template](https://github.com/josefaidt/bun-oxc-monorepo-template) holds the result of these steps, apart from the skills. For a new repository, `bun create josefaidt/bun-oxc-monorepo-template <directory>` copies it without its history, renames the root package to the directory name, and runs `git init` and `bun install`. It also attempts a first commit, which the `commit-msg` hook rejects, so the files stay staged. Then describe the project in `README.md` and `AGENTS.md`, rename the `@workspace` scope in `tsconfig.base.json` and `AGENTS.md` if the user wants another, and continue from step 8.

## Before you start

- Run `bun --version` and `git --version`. The setup needs Bun 1.4 or later for `bun check`. When Bun is missing or older, ask the user before installing it with `brew install oven-sh/bun/bun` or the installer on bun.sh, or upgrading it with `bun upgrade`.
- Settle the names with the user: the directory, which the first argument names and which defaults to the current one, the root package name, which defaults to the directory name, and the scope, the `@<scope>/` prefix every workspace package takes, which defaults to the root package name.
- When the directory already holds a `package.json`, read "Adopting an existing repository" first.
- Run every command from the repository root, and commit only when the user asks.

## Steps

### 1. The workspace

Run `git init -b main` when the directory holds no repository. Stop and ask when it sits inside another repository's working tree, since the git hooks path belongs to a repository root. Create `apps/` and `packages/`.

Write `package.json`, `bunfig.toml`, `.bun-version`, and `.gitignore` from `references/root-files.md`. The root `package.json` lists `apps/*` and `packages/*` as workspaces and holds the catalog, the version range of each dependency that more than one package uses. `bunfig.toml` installs with the isolated linker, so a package imports only what its own `package.json` declares, writes exact versions, and holds back any release younger than three days.

Run `bun install`. It writes `bun.lock` and runs the `prepare` script, which points `core.hooksPath` at `.git-hooks/`. Then run `bun outdated` and raise each catalog range that lags its latest release.

### 2. TypeScript

Write `tsconfig.base.json` from `references/root-files.md`.

The base config is the strict baseline every package extends, and it names no ambient types, so each package lists its own runtime's. Its `customConditions` entry, `@<scope>/source`, lets a package with a build step point the type checker and the tests at its TypeScript source while an app loads `dist/`. `bun check` is the type checker: each package's `typecheck` script runs it, and the root script runs every package's.

### 3. Formatting and lint

Write `.oxfmtrc.jsonc` and `.oxlintrc.jsonc` from `references/format-and-lint.md`. Then run `bun run fmt`, and again after each later step, so every file takes this repository's formatting rather than the example's.

oxfmt formats code, sorts imports and `package.json` keys, and never wraps prose, so each paragraph of markdown stays on one line and a diff shows the sentence that changed.

oxlint runs type-aware through `oxlint-tsgolint`, which reads each package's `tsconfig.json`. Its categories do most of the configuration:

- `correctness`, `suspicious`, `pedantic`, and `perf` are on as errors. oxlint turns on `correctness` alone by default, and the other three add the rules for strict development, including the type-aware `no-unsafe-*` family.
- `style` and `restriction` stay off, since they hold conventions to choose between rather than defects, and so does `nursery`, which holds rules still in development.
- The `rules` block switches off the pedantic and perf rules that flag ordinary code far more often than a defect, such as size limits, `require-await`, and `strict-boolean-expressions`. When another fires across code that is correct, switch it off the same way, with a comment saying why.
- The `rules` block turns on the style and restriction rules that enforce `writing-typescript`, such as no `any`, kebab-case filenames, and no barrel files.

`eslint/no-undef` stays off, since the type checker already reports a name it cannot resolve, so the root config covers every package and none needs its own. When a package uses React, add `react` and `jsx-a11y` to `plugins` and switch off `react/react-in-jsx-scope`, which the automatic JSX runtime made obsolete.

### 4. Commits and git hooks

Write `.commitlintrc.json` and the three hooks in `.git-hooks/` from `references/git-hooks.md`, and make the hooks executable.

- `pre-commit` checks the formatting and lint of what is staged, so a file with unstaged edits is checked as it will be committed.
- `commit-msg` runs commitlint, which holds each message to Conventional Commits.
- `post-rewrite` runs `bun ci` after a rebase that changed `bun.lock` or a `package.json`, since nothing else reinstalls mid-session.

### 5. The setup script

Write `scripts/setup.sh` from `references/scripts.md`, and make it executable. It bootstraps a checkout in one command: dependencies, each missing `.env.local` from its `.env.example`, and the packages with a build step. Every step is idempotent, so the README and the session hook both run it, and re-running it repairs a half-set-up checkout.

### 6. Agent configuration

Write `AGENTS.md`, `.claude/settings.json`, the four scripts in `.claude/hooks/`, and `.worktreeinclude` from `references/agents.md`. Make the hook scripts executable, and run `ln -s AGENTS.md CLAUDE.md` so Claude Code and Codex read the same file.

In `AGENTS.md`, describe the project in one paragraph saying what it is and who it is for, from the user's request or by asking them, and follow `writing-prose`. Write a `README.md` for people too: what the project is, the prerequisites, `bun run setup`, the root commands, and the layout.

The hooks run the checks so an agent never spends a tool call on them:

| Event                                                | Script                    | Does                                                                                                                                                                                      |
| :--------------------------------------------------- | :------------------------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `SessionStart`, and `PostToolUse` on `EnterWorktree` | `setup-workspace.sh`      | Runs `scripts/setup.sh` in a fresh worktree, and `bun ci` and the build in a warm one                                                                                                     |
| `PostToolUse` on `Edit`, `Write`, and `MultiEdit`    | `format-file.sh`          | Formats the file, so the agent reads formatted code back                                                                                                                                  |
| `UserPromptSubmit`                                   | `turn-checks.sh snapshot` | Records the working tree as the turn's base                                                                                                                                               |
| `Stop`                                               | `turn-checks.sh check`    | Formats and lints the files the turn changed, type checks the repo when a file the type checker reads changed, and on a failure exits 2, which keeps the turn going until the checks pass |

`session-workspace.sh` is sourced by the other three to find the checkout a forked session works in. `.worktreeinclude` lists the gitignored files Claude Code copies into a new worktree, such as `.env.local`.

### 7. CI

Write `.github/actions/setup/action.yml` and `.github/workflows/ci.yml` from `references/ci.md`. One job runs every check, and each step runs even after an earlier one fails, so a push reports every failure at once.

### 8. Skills

Vendor the skills `AGENTS.md` lists, for Claude Code and Codex:

```sh
bunx skills add josefaidt/skills --skill writing-typescript --skill new-typescript-package --skill monorepo --skill writing-prose --skill domain-modeling --skill retro -a claude-code -a codex -y
bunx skills add github/awesome-copilot --skill conventional-commit -a claude-code -a codex -y
```

The CLI writes each skill to `.agents/skills/`, links it into `.claude/skills/`, and pins its source in `skills-lock.json`. Then run `bun run fmt` once, since the repository's formatter can lay out a skill's markdown differently from the repository it came from. Add or drop a skill only with the user's say, and keep the Skills table in `AGENTS.md` matching what is installed.

### 9. The first package

Add the first package with `new-typescript-package` when the user has named what they are building. The root scripts fan out with `--if-present`, so every check also passes before any package exists.

### 10. Verify

Run each command, and fix anything that fails before you report the setup done:

```sh
bun run setup
bun run fmt:check
bun run lint
bun run typecheck
bun run test
bun run build
echo "chore: set up the monorepo" | bun x commitlint
```

`chore: set up the monorepo` fits the first commit when the user asks for one, and the `commit-msg` hook checks it.

## Adopting an existing repository

Walk the same steps, and merge each example into the file the repository already has rather than replacing it:

- `package.json`: add the catalog entries, scripts, and devDependencies the repo lacks, and keep its own. Move each dependency that two packages pin by version into the catalog.
- `tsconfig.base.json`: add the compiler options the repo lacks. A stricter option surfaces type errors across the repo, so land it in its own commit and fix what it reports there.
- `bunfig.toml`: switching to the isolated linker surfaces every phantom dependency at once, as `monorepo` describes. Give that its own commit too.
- `.oxlintrc.jsonc`: turning on the categories can report hundreds of errors in code written without them. Turn them on one at a time, and switch off a rule that fires across correct code before fixing what remains.
- `.gitignore`, `.oxfmtrc.jsonc`, `.claude/settings.json`, and `AGENTS.md`: add the lines and sections the repo lacks, and keep its own.

Do the adoption apart from feature work, and run the verification step once each merge lands.

## Changing the setup later

Each piece has one place to change, so the repo stays in step with itself.

- **A TypeScript script in `scripts/`**: give `scripts/` a `tsconfig.json` that extends `../tsconfig.base.json` with `"types": ["bun"]`, and add `&& bun check -p scripts` to the root `typecheck` script.
- **A new setup step**: add it to `scripts/setup.sh`, kept idempotent, and to the warm branch of `.claude/hooks/setup-workspace.sh` when a pull can make it stale, such as generated types.
- **A rule that fits one package**: add an `overrides` entry to `.oxlintrc.jsonc` with that package's `files` glob, such as a framework's file naming.
- **A package that builds**: its `exports` map lists the `@<scope>/source` condition first, pointing at the TypeScript entrypoint, so the type checker and the tests read source while an app loads `dist/`. `new-typescript-package` covers it.
- **A bundler that reads nothing outside its project root**, such as Next.js with Turbopack: set `globalStore = false` in `bunfig.toml` so packages install inside the repository.
- **A file Claude Code worktrees need** but git ignores, such as an `.env.local`: add it to `.worktreeinclude`.
- **Newer tool versions**: edit the range in the root catalog and run `bun install`. The `minimumReleaseAge` in `bunfig.toml` holds back any release younger than three days.
