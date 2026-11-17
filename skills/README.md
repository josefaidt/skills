# Skills

Reusable skill definitions for agents. Each skill lives in its own directory with a `SKILL.md` and any supporting reference files. The Group column names the Claude Code plugin each skill ships in, in lowercase, as the root README describes.

| Skill                                                 | Group          | Covers                                                       |
| :---------------------------------------------------- | :------------- | :----------------------------------------------------------- |
| [`writing-prose`](./writing-prose/)                   | Writing        | Prose rules, PRDs, and internal documents                    |
| [`answering-with-sources`](./answering-with-sources/) | Answering      | Sourced answers with confidence levels                       |
| [`writing-typescript`](./writing-typescript/)         | TypeScript     | File-level conventions, typing, and layout                   |
| [`new-typescript-package`](./new-typescript-package/) | TypeScript     | Scaffolding a workspace package or app                       |
| [`monorepo`](./monorepo/)                             | TypeScript     | Workspace structure and dependency installs                  |
| [`new-monorepo`](./new-monorepo/)                     | TypeScript     | Walking through a Bun monorepo's tooling and agent hooks     |
| [`domain-modeling`](./domain-modeling/)               | Design         | The glossary and ADRs a project's code and docs share        |
| [`retro`](./retro/)                                   | Agents         | Codifying what a session taught into the agent's environment |
| [`mcp-apps`](./mcp-apps/)                             | MCP extensions | Building and debugging MCP Apps, and what hosts actually do  |

## Writing skills

One skill covers writing. [`writing-prose`](./writing-prose/) holds the rules that apply to anything you write that is not code: voice, sentence construction, punctuation, rhythm, openings, paragraph leads, comparison closures, headings, terminology, identifiers the reader has not seen, stating the current position, and changelogs. Those rules load with the skill and always apply. The name pairs with `writing-typescript` on the axis that separates them, prose against code.

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

## Answering skills

[`answering-with-sources`](./answering-with-sources/) applies when an answer depends on documents, specs, code, or other sources rather than general knowledge. It prefixes substantive answers with a "Sources consulted" list, each source with its location and a High/Medium/Low confidence level, and prefers citing a specific source over answering from memory. It is model-invoked, so an agent reaches for it on its own when accuracy and provenance matter.

## TypeScript skills

Four skills cover working in a TypeScript workspace, layered by scope: source files, one package, the whole repo, and the tooling a repo starts with.

| Skill                                                 | Covers                                                                                                                                                                                                                    |
| :---------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [`writing-typescript`](./writing-typescript/)         | Source files: imports, no `any`, Zod validation, `as const`, class modifiers, kebab-case names, no barrels, one export per scoped package, `lib/` for supporting modules, `bin/` for runnable apps, `scripts/` placement. |
| [`new-typescript-package`](./new-typescript-package/) | A new package or app: scaffolding `package.json`, `tsconfig.json`, the entrypoint or a runnable app's `bin/` executable, and an optional rolldown build.                                                                  |
| [`monorepo`](./monorepo/)                             | The repo: the `apps` and `packages` split, shared version pinning, and isolated `node_modules`.                                                                                                                           |
| [`new-monorepo`](./new-monorepo/)                     | A new repo: Bun, TypeScript 7, oxfmt, type-aware oxlint, Vitest, commitlint, git hooks, Claude Code hooks, CI, `AGENTS.md`, and the skill plugins it enables.                                                             |

`writing-typescript` sets `user-invocable: false`, so an agent loads it on its own when writing or reviewing TypeScript. `new-typescript-package` takes arguments, `<name>` and an optional `apps` or `packages` target directory that defaults to `packages`. `new-monorepo` takes an optional target directory and `--scope`.

They cross-reference each other rather than repeating rules, and the scope boundary decides ownership: `writing-typescript` owns what applies to source files and a package's internal layout, `new-typescript-package` owns the file set a new package starts with, `monorepo` owns everything above the package boundary, and `new-monorepo` owns the root files and tooling a repo starts with.

`new-monorepo` walks through the setup one step at a time, and its reference files hold a working example of each root file for the agent to adapt, grouped by step. Change an example when the tooling it sets up changes, and check it by following the skill in an empty directory.

### References

`monorepo` keeps package-manager syntax out of the skill body. The concepts hold anywhere; each reference file supplies the configuration for one package manager.

| File                                                         | Covers                                                                                                           |
| :----------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| [`monorepo/references/bun.md`](./monorepo/references/bun.md) | `workspaces` and catalog config, `workspace:*`, the `bunfig.toml` linker and install settings, and filtered runs |

Bun is the only one documented so far. Add a sibling file and a row to the skill's reference table to cover another.

## Design skills

[`domain-modeling`](./domain-modeling/) builds and sharpens a project's domain model while you design: it challenges terms against the glossary, tests concepts with edge-case scenarios, keeps a `GLOSSARY.md` at the root of each area, and records hard-to-reverse decisions as ADRs in `docs/adr/`. Its reference files hold the glossary and ADR formats.

## Agent environment skills

[`retro`](./retro/) runs a retrospective at the end of a session and proposes changes to what the next agent reads or runs, such as steering files, skills, standards, the glossary, and automated checks, each tied to a correction or a cost from the session. It runs only when the user invokes it, with optional focus topics to examine in depth.

## MCP extension skills

[`mcp-apps`](./mcp-apps/) covers MCP Apps, the extension that lets an MCP server's tools render an interactive HTML View inside a host such as Claude or ChatGPT. Its `SKILL.md` is a map: the mental model, the facts that most often trip up a build, and a table pointing at reference files for the protocol, the `@modelcontextprotocol/ext-apps` SDK, design patterns, observed host behavior, security, and canonical links. It complements the MCP project's own scaffolding skills by holding the reasoning and the dated host observations, and it says where each new lesson goes so it keeps growing with each demo.

### References

| File                                                                   | Covers                                                                                                                               |
| :--------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| [`mcp-apps/references/protocol.md`](./mcp-apps/references/protocol.md) | Resource and tool `_meta.ui`, negotiation, lifecycle, every `ui/*` method, host context, caching, and the spec's own inconsistencies |
| [`mcp-apps/references/sdk.md`](./mcp-apps/references/sdk.md)           | The SDK's entry points, `App`, server helpers, style helpers, `AppBridge`, and the transport                                         |
| [`mcp-apps/references/patterns.md`](./mcp-apps/references/patterns.md) | Design patterns tied to the constraints that cause them                                                                              |
| [`mcp-apps/references/hosts.md`](./mcp-apps/references/hosts.md)       | Dated observations of Claude and other hosts, and open questions                                                                     |
| [`mcp-apps/references/security.md`](./mcp-apps/references/security.md) | What the host enforces and what the server and View must do                                                                          |
| [`mcp-apps/references/auth.md`](./mcp-apps/references/auth.md)         | Whose token a View's calls carry, lazy sign-in, Enterprise-Managed Authorization and ID-JAG, and audit trails                        |
| [`mcp-apps/references/sources.md`](./mcp-apps/references/sources.md)   | Verified links to the spec, SDK, docs, examples, and tools                                                                           |
