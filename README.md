# skills

A collection of agent skills. Each skill is a directory of markdown that tells a coding agent how to do one kind of task, such as writing a PRD, holding a prose style, or scaffolding a workspace package.

Skills follow the [Agent Skills](https://code.claude.com/docs/en/skills) format: a `SKILL.md` with YAML frontmatter, plus any reference files the skill loads on demand.

## Layout

```
skills/
  writing-prose/            prose rules, plus doc structure on demand
    SKILL.md
    references/
      prd.md
      business-doc.md
      anti-patterns.md
      markdown-gfm.md
  writing-typescript/       file-level TypeScript conventions
  new-typescript-package/   workspace package scaffolding
  monorepo/                 workspace structure and dependency installs
    SKILL.md
    references/
      bun.md
```

See [`skills/README.md`](./skills/README.md) for what each skill covers.

Each skill directory stands alone. A skill never requires another skill to be installed, so any one of them can be copied out on its own.

## Using a skill

Copy or symlink a skill directory into the agent's skills path. For Claude Code that is `.claude/skills/` in a project or `~/.claude/skills/` for every project:

```sh
ln -s "$PWD/skills/writing-prose" ~/.claude/skills/writing-prose
```

Skills with a `name` and `description` in frontmatter are discovered automatically. The agent reads the description to decide when a skill is relevant, so the description carries the trigger conditions.

## Development

The repo is a Bun workspace. It ships no source code, only markdown and the tooling that keeps it formatted.

```sh
bun install       # installs tooling and configures the git hooks path
bun run fmt       # format with oxfmt
bun run fmt:check # verify formatting without writing
bun run lint      # lint with oxlint
bun run lint:fix  # lint and apply fixes
```

`bun install` runs the `prepare` script, which points `core.hooksPath` at `.git-hooks`. The pre-commit hook formats staged files with oxfmt, runs `oxlint --fix` over staged JavaScript and TypeScript, and re-stages the results. It exits early when `CI` is set.

Tool versions are pinned in the root `package.json` catalog. Reference them from a workspace package with `"oxlint": "catalog:"` rather than a literal version.

## Adding a skill

1. Create `skills/<name>/SKILL.md` with `name` and `description` frontmatter. The `name` must match the directory.
2. Write the description so it states when to load the skill, not just what it contains. Discovery depends on it.
3. Put anything the skill needs only sometimes in `references/` and link to it from a table in `SKILL.md`, so the agent loads it on demand instead of up front.
4. Add `user-invocable: false` for skills an agent should load on its own, and `argument-hint` for skills a user invokes with arguments.
5. Keep the skill self-contained. Do not write a prerequisite that tells the agent to load a file in a sibling skill directory, because the relative path breaks the moment someone installs one skill without the other. Rules two skills share belong in a reference file inside one of them, or the two skills belong together as one.
6. Add a row to [`skills/README.md`](./skills/README.md).
