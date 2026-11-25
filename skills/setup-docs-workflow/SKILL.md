---
name: setup-docs-workflow
description: Set up how a repository specifies features and gets them approved, in a new repository or one that already has its own docs. Picks a workflow (an RFC per feature, or a PRD with a design document), adopts or migrates any existing docs, records the workflow and its lifecycle in AGENTS.md, and installs the scripts and CI steps that guard approved behavior and find behavior with no test. Use when starting a project's requirements and design docs, bringing an existing repository's specs or RFCs into this workflow, switching to RFCs, or when the docs workflow seems broken or out of date. Also use when asked to plan, spec, or propose a feature in a repository whose AGENTS.md has no "Requirements and design" section.
argument-hint: "[rfc | prd]"
---

# Setting up the docs workflow

A repository specifies each feature in documents that say what it must do and how it is built. The maintainer approves the behavior, agents own the design, and a pair of scripts keeps the two honest: one fails when approved behavior changes without the maintainer approving it again, and one lists behavior that no test names. This skill sets that up once and checks it on later runs. Each step is idempotent, so run it again to repair a repository rather than editing by hand.

## Workflows

| Workflow | Documents | Use when |
| :-- | :-- | :-- |
| `rfc` (default) | `docs/rfcs/<feature>.md`, one file holding behavior and design | One person approves the behavior and owns the product, such as a side project |
| `prd` | `docs/prd/<feature>.md` and `docs/design/<feature>.md` | Someone who never reads the design approves the behavior, such as a client or a product stakeholder |

Take the workflow from the argument. Without one, keep the workflow the repository already uses, and otherwise ask, recommending `rfc`. Both workflows use the same IDs (`KEY-n.m`), so the review skills and scripts work on either, and a repository can hold old PRDs while new features use RFCs.

## Steps

1. **Read the repository.** Look for an `AGENTS.md` or `CLAUDE.md`, any requirements, specs, RFCs, PRDs, ADRs, or design docs wherever they live, `CODING_STANDARDS.md`, the root `package.json`, the CI workflows, and a `scripts/` directory. Report what exists before changing anything.
2. **Settle existing docs.** When the repository already specifies features in its own way, follow [references/existing-repo.md](references/existing-repo.md) to ask the user whether to adopt those docs in place, migrate them, or leave them and start new features in the chosen workflow. Do this before writing anything, since the answer decides the paths in every later step.
3. **Record the workflow in `AGENTS.md`.** Add or replace its "Requirements and design" section with the one for the chosen workflow from [references/scaffold.md](references/scaffold.md), using the paths settled in step 2. It names where each document lives, who acts at each status, and which skill each step loads, so every session knows the process without loading this skill.
4. **Install the scripts.** Copy [scripts/criteria-coverage.ts](scripts/criteria-coverage.ts) and, for the `rfc` workflow, [scripts/behavior-guard.ts](scripts/behavior-guard.ts) into the repository's `scripts/`. Add the `package.json` scripts from the scaffold reference. Each script runs on Bun from the repository root, finds documents by their frontmatter wherever they live, and depends on nothing else.
5. **Wire CI.** Add the steps from the scaffold reference to the job that runs the other checks, and fetch the full history at checkout, since the guard reads the branch's commits.
6. **Offer code owners.** When agents open pull requests under an account other than the maintainer's, such as a bot or a GitHub App, offer the `CODEOWNERS` lines from the scaffold reference, so a change to approved documents needs the maintainer's review. Skip this when agents push as the maintainer, since GitHub never lets an author approve their own pull request.
7. **Run both scripts** and report their output. A document without a `key` in its frontmatter is invisible to them, so a repository whose old docs have none reports zero behaviors rather than failing.

Create nothing empty. `docs/rfcs/`, `docs/adr/`, `GLOSSARY.md`, and `CODING_STANDARDS.md` appear with their first entry, from the skill that writes it.

## Checking an existing setup

On a repository that already has the workflow, compare each piece against this skill and report the differences: the `AGENTS.md` section, each script against this skill's copy, the `package.json` scripts, and the CI steps. A script that differs may hold a local fix, so show the diff and ask before replacing it. Then run both scripts. Change only what the user approves.
