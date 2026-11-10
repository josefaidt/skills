# skills

A collection of agent skills. Each skill is a directory of markdown that tells a coding agent how to do one kind of task, such as writing a PRD, holding a prose style, or scaffolding a workspace package.

Skills follow the [Agent Skills](https://code.claude.com/docs/en/skills) format: a `SKILL.md` with YAML frontmatter, plus any reference files the skill loads on demand.

## Layout

```
.claude-plugin/
  marketplace.json          the plugins, each a group of skills
skills/
  writing-prose/            prose rules, plus doc structure on demand
    SKILL.md
    references/
      prd.md
      business-doc.md
      anti-patterns.md
      markdown-gfm.md
  answering-with-sources/   sourced answers with confidence levels
  writing-typescript/       file-level TypeScript conventions
  new-typescript-package/   workspace package scaffolding
  monorepo/                 workspace structure and dependency installs
    SKILL.md
    references/
      bun.md
  new-monorepo/             monorepo setup walkthrough: tooling, hooks, CI, and skills
    SKILL.md
    references/
  domain-modeling/          glossary and ADRs
  retro/                    session retrospectives that codify lessons
```

See [`skills/README.md`](./skills/README.md) for what each skill covers.

Each skill directory stands alone. A skill never requires another skill to be installed, so any one of them can be copied out on its own.

## Installing

### Claude Code plugins

The repo is a Claude Code plugin marketplace, `josefaidt-skills`, defined in [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json). Each plugin bundles the skills of one group:

| Plugin       | Skills                                                                     |
| :----------- | :------------------------------------------------------------------------- |
| `writing`    | `writing-prose`                                                            |
| `answering`  | `answering-with-sources`                                                   |
| `typescript` | `writing-typescript`, `new-typescript-package`, `monorepo`, `new-monorepo` |
| `design`     | `domain-modeling`                                                          |
| `agents`     | `retro`                                                                    |

Install a plugin from inside Claude Code:

```
/plugin install writing --marketplace josefaidt/skills
/plugin install answering --marketplace josefaidt/skills
/plugin install typescript --marketplace josefaidt/skills
/plugin install design --marketplace josefaidt/skills
/plugin install agents --marketplace josefaidt/skills
```

A plugin's skills take its name as a prefix, so `new-monorepo` runs as `/typescript:new-monorepo`. A plugin carries no version of its own, so its version is the commit it was read from, and every push to `main` is a new version.

To name the skills a project uses, declare the marketplace and its plugins in the project's `.claude/settings.json`:

```json
{
  "extraKnownMarketplaces": {
    "josefaidt-skills": {
      "source": { "source": "github", "repo": "josefaidt/skills" }
    }
  },
  "enabledPlugins": {
    "writing@josefaidt-skills": true,
    "typescript@josefaidt-skills": true
  }
}
```

Once someone trusts the folder, Claude Code adds the marketplace, but each person still installs the plugins, such as with `claude plugin install typescript@josefaidt-skills --scope project`. Until they do, `/plugin` reports each one as enabled in project settings but not installed.

### Copies in a repository

For an agent other than Claude Code, such as Codex, or to pin a skill's text inside a repository, vendor the skills with the [skills CLI](https://github.com/vercel-labs/skills). It copies each one into `.agents/skills/`, links it into `.claude/skills/`, and pins its source in `skills-lock.json`:

```sh
bunx skills add josefaidt/skills --skill writing-prose --skill writing-typescript -a claude-code -a codex -y
```

Skills with a `name` and `description` in frontmatter are discovered automatically either way. The agent reads the description to decide when a skill is relevant, so the description carries the trigger conditions.

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
7. Add the skill's path to one plugin's `skills` list in [`.claude-plugin/marketplace.json`](./.claude-plugin/marketplace.json), or add a plugin for a new group, and the row to the plugin table above. Then run `claude plugin validate .`, which checks the manifest's shape but not that each skill path exists, so check the path by hand.
