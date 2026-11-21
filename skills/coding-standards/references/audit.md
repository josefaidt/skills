# Auditing a repository's checks

Run an audit when a repository has gathered rules and checks in several places and the user no longer trusts what fires, or when creating `CODING_STANDARDS.md` in a repository that has never had one. The audit makes no change until the user approves its plan.

## Inventory

List every place a rule or check lives, and every rule or check in each:

- `CODING_STANDARDS.md` and `docs/coding-standards/`, if they exist
- the lint and format configs, and any custom lint rules
- git hooks, Claude Code hooks, and CI workflows
- `AGENTS.md`, `CLAUDE.md`, and any steering file they point to
- reviewer prompts, such as a review subagent's definition or a review step in a skill the repository vendors
- tests whose only job is to enforce a convention, such as a test that reads file names

For each entry, record what it checks, where it lives, and whether it fired in the repository's recent history. Search review comments on recent pull requests and the git log for evidence that it caught something.

## Sort

Put each entry in one of four groups:

1. **Keep as a check.** Mechanical, and a tool already enforces it. Nothing to do.
2. **Move to a check.** Mechanical, but enforced only by prose or a reviewer. Propose the lint rule, hook, or CI job that replaces the prose.
3. **Keep as a standard.** A judgment call with evidence that it caught a mistake. It gets an ID and a row, and it stays `blocking` only if it blocks today and the user confirms.
4. **Drop.** A duplicate of another entry, a preference with no failure behind it, an instruction no agent follows, or an entry with no evidence of ever firing. A dropped standard with an ID becomes a `retired` row. Anything else is deleted.

Every rule that is new to the table, or that moves out of prose into it, starts as `advisory`, whatever its old wording said.

## Report

Present the four groups as a table per group with the entry, where it lives, the evidence, and the proposed change. Put Drop first, since cutting is most of the value. Make the changes the user approves, in one pull request, so the before and after read as a single diff.
