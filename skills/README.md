# Skills

Reusable skill definitions for agents. Each skill lives in its own directory with a `SKILL.md` and any supporting reference files. The Group column names the Claude Code plugin each skill ships in, in lowercase, as the root README describes.

| Skill | Group | Covers |
| :-- | :-- | :-- |
| [`writing-prose`](./writing-prose/) | Writing | Prose rules, PRDs, and internal documents |
| [`writing-code`](./writing-code/) | Writing | When a comment earns its place, in any language |
| [`answering-with-sources`](./answering-with-sources/) | Answering | Sourced answers with confidence levels |
| [`writing-typescript`](./writing-typescript/) | TypeScript | File-level conventions, typing, and layout |
| [`new-typescript-package`](./new-typescript-package/) | TypeScript | Scaffolding a workspace package or app |
| [`monorepo`](./monorepo/) | TypeScript | Workspace structure and dependency installs |
| [`new-monorepo`](./new-monorepo/) | TypeScript | Walking through a Bun monorepo's tooling and agent hooks |
| [`domain-modeling`](./domain-modeling/) | Design | The glossary and ADRs a project's code and docs share |
| [`setup-docs-workflow`](./setup-docs-workflow/) | Review | Setting up the RFC or PRD workflow, its guard, and coverage |
| [`coding-standards`](./coding-standards/) | Review | The rule table a reviewer enforces, and each rule's lifecycle |
| [`reviewing-behavior`](./reviewing-behavior/) | Review | Pre-checking behavior before the maintainer reads it |
| [`reviewing-code`](./reviewing-code/) | Review | Reviewing a diff against rules, by rule ID |
| [`reviewing-design`](./reviewing-design/) | Review | Reviewing a design document against its PRD |
| [`reflect`](./reflect/) | Agents | Routing what a session taught to the file that should hold it |
| [`wait-what`](./wait-what/) | Agents | Saying the last reply again in plain words |
| [`catch-me-up`](./catch-me-up/) | Agents | What changed since your last message, and what waits on you |
| [`milestone-report`](./milestone-report/) | Agents | The calls a milestone leaves for you, with their evidence |
| [`learn-mcp-apps`](./learn-mcp-apps/) | Learn MCP Apps | Building and debugging MCP Apps, and what hosts actually do |

## Writing skills

Two skills cover writing. [`writing-prose`](./writing-prose/) holds the rules for anything you write that is not code, layered so each builds on the one before: core rules, sentences, unambiguous Global English, and paragraphs and structure, then the structure for each kind of document. Those rules load with the skill and always apply. The layering and the developer-docs, briefing, and Global English rules come from pstack's `technical-writing`, which draws on [Diátaxis](https://diataxis.fr/), the [Google developer documentation style guide](https://developers.google.com/style), Simplified Technical English, and Global English. [`writing-code`](./writing-code/) holds the guidance for code that holds in any language, starting with comments: what earns one, what to delete, and how to clear them from a diff, turning an excuse for surprising code into a fix and a protective comment into a test or check. Language skills such as `writing-typescript` set the syntax.

Document structure lives in reference files, so a task only pays for the shape it needs. Asking for a PRD loads the PRD structure, a pull request body loads the briefing structure, and a docs page loads the developer-docs structure, and none loads the others.

### References

| File | Covers |
| :-- | :-- |
| [`writing-prose/references/prd.md`](./writing-prose/references/prd.md) | PRDs: executive summary, customer problem, numbered user stories with acceptance criteria, behavioral clarifications, open decisions |
| [`writing-prose/references/design-doc.md`](./writing-prose/references/design-doc.md) | Design documents: summary, traceability to acceptance criteria, design, decisions, scope, open questions |
| [`writing-prose/references/rfc.md`](./writing-prose/references/rfc.md) | RFCs: motivation, behavior as MUST, SHOULD, and MAY statements, design, and the status lifecycle |
| [`writing-prose/references/business-doc.md`](./writing-prose/references/business-doc.md) | Internal product and business docs: proposals, analyses, strategy memos, options-and-tenets templates |
| [`writing-prose/references/anti-patterns.md`](./writing-prose/references/anti-patterns.md) | The tripwire scan: phrase patterns, em-dash use, banned words, comparison closures, heading shapes |
| [`writing-prose/references/markdown-gfm.md`](./writing-prose/references/markdown-gfm.md) | GFM formatting: fences, lists, headings, tables, emphasis, blockquotes |
| [`writing-prose/references/developer-docs.md`](./writing-prose/references/developer-docs.md) | Tutorials, how-tos, reference, and explanation, after Diátaxis |
| [`writing-prose/references/briefings.md`](./writing-prose/references/briefings.md) | Pull request bodies, commit messages, issues, thread replies, and task reports |
| [`writing-prose/references/revising.md`](./writing-prose/references/revising.md) | Revising a shared document, superseding versions, moving content in, and changelogs |

The anti-pattern catalog draws on two open-source skills that document AI writing tells:

- [kill-ai-smell](https://github.com/osolmaz/tools/blob/main/agents/skills/kill-ai-smell/SKILL.md) by osolmaz — strips recognizable markers of machine-generated writing across punctuation, sentence patterns, paragraph shape, headings, and page layout.
- [avoid-ai-writing](https://github.com/conorbronsdon/avoid-ai-writing) by Conor Bronsdon — audits and rewrites content to remove AI-isms, with a deterministic detection engine and a word-replacement table.

## Answering skills

[`answering-with-sources`](./answering-with-sources/) applies when an answer depends on documents, specs, code, or other sources rather than general knowledge. It prefixes substantive answers with a "Sources consulted" list, each source with its location and a High/Medium/Low confidence level, and prefers citing a specific source over answering from memory. It is model-invoked, so an agent reaches for it on its own when accuracy and provenance matter.

## TypeScript skills

Four skills cover working in a TypeScript workspace, layered by scope: source files, one package, the whole repo, and the tooling a repo starts with.

| Skill | Covers |
| :-- | :-- |
| [`writing-typescript`](./writing-typescript/) | Source files: no `any`, parsing at the boundary, unions, branded IDs, exhaustive switches, imports, comment syntax, class modifiers, kebab-case names, no barrels, one export per scoped package, and the `lib/`, `bin/`, and `scripts/` layout. |
| [`new-typescript-package`](./new-typescript-package/) | A new package or app: scaffolding `package.json`, `tsconfig.json`, the entrypoint or a runnable app's `bin/` executable, and an optional rolldown build. |
| [`monorepo`](./monorepo/) | The repo: the `apps` and `packages` split, shared version pinning, and isolated `node_modules`. |
| [`new-monorepo`](./new-monorepo/) | A new repo: Bun, TypeScript 7, oxfmt, type-aware oxlint, Vitest, commitlint, git hooks, Claude Code hooks, CI, `AGENTS.md`, and the skill plugins it enables. |

`writing-typescript` sets `user-invocable: false`, so an agent loads it on its own when writing or reviewing TypeScript. `new-typescript-package` takes arguments, `<name>` and an optional `apps` or `packages` target directory that defaults to `packages`. `new-monorepo` takes an optional target directory and `--scope`.

They cross-reference each other rather than repeating rules, and the scope boundary decides ownership: `writing-typescript` owns what applies to source files and a package's internal layout, `new-typescript-package` owns the file set a new package starts with, `monorepo` owns everything above the package boundary, and `new-monorepo` owns the root files and tooling a repo starts with.

`new-monorepo` walks through the setup one step at a time, and its reference files hold a working example of each root file for the agent to adapt, grouped by step. Change an example when the tooling it sets up changes, and check it by following the skill in an empty directory.

### References

`monorepo` keeps package-manager syntax out of the skill body. The concepts hold anywhere; each reference file supplies the configuration for one package manager.

| File | Covers |
| :-- | :-- |
| [`monorepo/references/bun.md`](./monorepo/references/bun.md) | `workspaces` and catalog config, `workspace:*`, the `bunfig.toml` linker and install settings, and filtered runs |

Bun is the only one documented so far. Add a sibling file and a row to the skill's reference table to cover another.

## Design skills

[`domain-modeling`](./domain-modeling/) builds and sharpens a project's domain model while you design: it challenges terms against the glossary, tests concepts with edge-case scenarios, keeps a `GLOSSARY.md` at the root of each area, and records hard-to-reverse decisions as ADRs in `docs/adr/`. Its reference files hold the glossary and ADR formats.

## Review skills

Five skills let a single maintainer trust work they do not read line by line. [`setup-docs-workflow`](./setup-docs-workflow/) sets up how a repository specifies features, adopting or migrating any docs it already has: an RFC per feature by default, holding its motivation, its behavior as `MUST`, `SHOULD`, and `MAY` statements with IDs such as `RESET-3.2`, and its design, or a PRD with a separate design document when someone else approves the behavior. It records the workflow and each status's owner in `AGENTS.md`, and installs two scripts: `behavior-guard.ts` fails a pull request that changes approved behavior without the maintainer approving it again, and `criteria-coverage.ts` lists behavior no test names by ID, failing when a required behavior of an implemented feature has none.

[`reviewing-behavior`](./reviewing-behavior/) pre-checks the half of an RFC or PRD the maintainer approves, fixing missing IDs and untestable or compound statements, and listing every value the author chose on the maintainer's behalf. [`reviewing-design`](./reviewing-design/) checks the design against that approved behavior and escalates only behavior gaps and hard-to-reverse decisions. [`coding-standards`](./coding-standards/) keeps `CODING_STANDARDS.md`, one table of the judgment calls a reviewer enforces, each with a stable ID such as `tenancy/scoped-queries`, a level, and a status. Every rule starts `advisory`, and the maintainer promotes it to `blocking` once its findings prove right, or retires it when they do not. [`reviewing-code`](./reviewing-code/) reviews a diff against that table and the language skills' rules, citing a rule ID on every finding, and reports only rule violations, defects, and required behavior with no test.

The pipeline follows Cloudflare's [standards enforcement](https://blog.cloudflare.com/engineering-standards-enforcement/): standards written as individual statements with stable IDs, a reviewer at each stage that cites them, and a promotion step before a rule blocks anything.

## Agent environment skills

[`reflect`](./reflect/) mines a session at its end for lessons that will still hold in six months and would change what a future agent does, and routes each to where it will fire: a mechanical mistake to an automated check, a judgment call to a standard, a missed skill to its description, a question to the requirements or design document, and a repo-wide note out of memory. It lists what it accepted, what it rejected and why, and what belongs in a backlog, and edits nothing until the user approves. It runs only when the user invokes it, with optional focus topics to examine in depth.

[`wait-what`](./wait-what/) and [`catch-me-up`](./catch-me-up/) cut an agent's reply down to what a person needs. `wait-what` says the last reply again in plain words, without jargon, IDs, or file paths. `catch-me-up` sums up what changed since the user's last message and lists each decision waiting on them, with the agent's pick and its risk. Both run only when the user invokes them.

[`milestone-report`](./milestone-report/) closes a milestone with the calls only the user can make: behavior the RFC or PRD does not settle, hard-to-reverse decisions, exceptions to blocking rules, rules ready to promote or retire with their finding counts, and required behavior with no test. It reads coverage from the `docs:coverage` script that `setup-docs-workflow` installs.

`reflect` takes its filters and its Accepted, Rejected, and Backlog report from the skill of the same name in [pstack](https://github.com/cursor/plugins/tree/main/pstack) by Lauren Tan (MIT), and `wait-what` and `catch-me-up` are adapted from its `bro` and `ketchup`. `writing-typescript` takes several of its type rules from pstack's `typescript-best-practices`, and `writing-code` adapts its comment rules from pstack's `no-comments`.

## MCP Apps skills

[`learn-mcp-apps`](./learn-mcp-apps/) covers MCP Apps, the extension that lets an MCP server's tools render an interactive HTML View inside a host such as Claude or ChatGPT. Its `SKILL.md` is a map: the mental model, the facts that most often trip up a build, and a table pointing at reference files for the protocol, the `@modelcontextprotocol/ext-apps` SDK, design patterns, observed host behavior, security, authorization, and canonical links. It complements the MCP project's own scaffolding skills by holding the reasoning and the dated host observations, and it says where each new lesson goes so it keeps growing with each demo. It sets `user-invocable: false`, so an agent loads it on its own when work touches an MCP App.

### References

| File | Covers |
| :-- | :-- |
| [`learn-mcp-apps/references/protocol.md`](./learn-mcp-apps/references/protocol.md) | Resource and tool `_meta.ui`, negotiation, lifecycle, every `ui/*` method, host context, caching, and the spec's own inconsistencies |
| [`learn-mcp-apps/references/sdk.md`](./learn-mcp-apps/references/sdk.md) | The SDK's entry points, `App`, server helpers, style helpers, `AppBridge`, and the transport |
| [`learn-mcp-apps/references/patterns.md`](./learn-mcp-apps/references/patterns.md) | Design patterns tied to the constraints that cause them |
| [`learn-mcp-apps/references/hosts.md`](./learn-mcp-apps/references/hosts.md) | Dated observations of Claude and other hosts, and open questions |
| [`learn-mcp-apps/references/security.md`](./learn-mcp-apps/references/security.md) | What the host enforces and what the server and View must do |
| [`learn-mcp-apps/references/auth.md`](./learn-mcp-apps/references/auth.md) | Whose token a View's calls carry, lazy sign-in, Enterprise-Managed Authorization and ID-JAG, and audit trails |
| [`learn-mcp-apps/references/sources.md`](./learn-mcp-apps/references/sources.md) | Verified links to the spec, SDK, docs, examples, and tools |
