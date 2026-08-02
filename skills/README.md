# Skills

Reusable skill definitions for agents. Each skill lives in its own directory with a `SKILL.md` and any supporting reference files.

| Skill                                                 | Group      | Covers                                      |
| :---------------------------------------------------- | :--------- | :------------------------------------------ |
| [`writing-prose`](./writing-prose/)                   | Writing    | Prose rules, PRDs, and internal documents   |
| [`writing-typescript`](./writing-typescript/)         | TypeScript | File-level conventions, typing, and layout  |
| [`new-typescript-package`](./new-typescript-package/) | TypeScript | Scaffolding a workspace package or app      |
| [`monorepo`](./monorepo/)                             | TypeScript | Workspace structure and dependency installs |

## Writing skills

One skill covers writing. [`writing-prose`](./writing-prose/) holds the rules that apply to anything you write that is not code: voice, sentence construction, punctuation, rhythm, openings, paragraph leads, comparison closures, headings, terminology, and changelogs. Those rules load with the skill and always apply. The name pairs with `writing-typescript` on the axis that separates them, prose against code.

Document structure lives in reference files, so a task only pays for the shape it needs. Asking for a PRD loads the PRD structure; asking for a proposal loads the business-doc structure; neither loads the other.

### References

| File                                                                                       | Covers                                                                                                                               |
| :----------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| [`writing-prose/references/prd.md`](./writing-prose/references/prd.md)                     | PRDs: executive summary, customer problem, numbered user stories with acceptance criteria, behavioral clarifications, open decisions |
| [`writing-prose/references/business-doc.md`](./writing-prose/references/business-doc.md)   | Internal product and business docs: proposals, analyses, strategy memos, options-and-tenets templates                                |
| [`writing-prose/references/anti-patterns.md`](./writing-prose/references/anti-patterns.md) | The tripwire scan: phrase patterns, em-dash use, banned words, comparison closures, heading shapes                                   |
| [`writing-prose/references/markdown-gfm.md`](./writing-prose/references/markdown-gfm.md)   | GFM formatting: fences, lists, headings, tables, emphasis, blockquotes                                                               |

The anti-pattern catalog draws on two open-source skills that document AI writing tells:

- [kill-ai-smell](https://github.com/osolmaz/tools/blob/main/agents/skills/kill-ai-smell/SKILL.md) by osolmaz — strips recognizable markers of machine-generated writing across punctuation, sentence patterns, paragraph shape, headings, and page layout.
- [avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) by Conor Bronsdon — audits and rewrites content to remove AI-isms, with a deterministic detection engine and a word-replacement table.

## TypeScript skills

Three skills cover working in a TypeScript workspace, layered by scope: source files, one package, the whole repo.

| Skill                                                 | Covers                                                                                                                            |
| :---------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| [`writing-typescript`](./writing-typescript/)         | Source files: imports, no `any`, Zod validation, `as const`, class modifiers, kebab-case names, no barrels, `scripts/` placement. |
| [`new-typescript-package`](./new-typescript-package/) | A new package: scaffolding `package.json`, `tsconfig.json`, the entrypoint, and an optional rolldown build.                       |
| [`monorepo`](./monorepo/)                             | The repo: the `apps` and `packages` split, shared version pinning, and isolated `node_modules`.                                   |

`writing-typescript` sets `user-invocable: false`, so an agent loads it on its own when writing or reviewing TypeScript. `new-typescript-package` takes arguments, `<name>` and an optional `apps` or `packages` target directory that defaults to `packages`.

They cross-reference each other rather than repeating rules, and the scope boundary decides ownership: `writing-typescript` owns what applies to source files and a package's internal layout, `new-typescript-package` owns the file set a new package starts with, and `monorepo` owns everything above the package boundary.

### References

`monorepo` keeps package-manager syntax out of the skill body. The concepts hold anywhere; each reference file supplies the configuration for one package manager.

| File                                                         | Covers                                                                                      |
| :----------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| [`monorepo/references/bun.md`](./monorepo/references/bun.md) | `workspaces` and catalog config, `workspace:*`, the `bunfig.toml` linker, and filtered runs |

Bun is the only one documented so far. Add a sibling file and a row to the skill's reference table to cover another.
