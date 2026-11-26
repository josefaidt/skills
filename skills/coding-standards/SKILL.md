---
name: coding-standards
description: Keep a repository's CODING_STANDARDS.md, the one table of rules a code reviewer enforces, each with a stable ID, a level, and a status. Covers what earns a rule, the table and detail-file format, adopting a rule from a shared skill, and moving a rule from advisory to blocking to retired. Use when creating CODING_STANDARDS.md, adding, changing, promoting, or retiring a rule, deciding whether a correction becomes a rule or a lint check, or auditing a repository's checks.
---

# Coding standards

`CODING_STANDARDS.md` is the list of judgment calls a reviewer enforces in one repository. A reviewer reads it in one pass and cites a rule by its ID, so each finding can be counted, and a rule earns its place by the findings it produces. Keep it short. Every rule costs review time on every pull request, and a rule nobody trusts teaches agents to ignore all of them.

The format is in [references/format.md](references/format.md). Auditing a repository that already has scattered checks is in [references/audit.md](references/audit.md).

## What earns a rule

A rule is a judgment call that a reviewer can make from a diff, such as "every query on tenant data filters by tenant ID". Route everything else elsewhere:

| The correction | Goes to |
| :-- | :-- |
| A fixed pattern a tool can match, such as a banned import or a file name shape | A lint rule, hook, or CI job. Never a row here, since a tool checks it on every edit |
| A question about what the product does | The requirements document |
| A preference with no failure behind it | Nowhere. Without a bug, a review comment, or a cost you can name, it is not a standard |
| A rule only one file or module needs | A test or a type in that module, which fails where the rule breaks |
| A rule every repository you own should share | The language skill, such as `writing-typescript`, and a row here only to raise its level |

Before adding a rule, search the table and the lint config for one that already covers it. When the agent broke an existing rule, the fix is how the reviewer missed it, not a second copy.

## Writing a rule

- Give it an ID of the form `<area>/<name>` in lowercase kebab case, such as `tenancy/scoped-queries`. The area groups related rules and names the detail file. An ID is never reused or renamed, since findings and history point at it.
- State the rule in one sentence that names the violation a reviewer would see in a diff. "Session tokens never appear in logs, errors, or telemetry" can be checked. "Handle secrets carefully" cannot.
- Set the level with RFC 2119 meaning. `MUST` means a violation is a defect, and no pull request can claim an exception to it. When a case keeps coming up that a `MUST` rule should allow, change the rule, such as with a "Not a violation" case in its detail file. `SHOULD` means a violation needs a reason the reviewer can read in the pull request.
- Link a detail file only when the rule needs rationale, examples, or edge cases to judge. Most rules need none.

## Status

Status is separate from level, so a `MUST` can run on trial before it blocks anything.

| Status | The reviewer |
| :-- | :-- |
| `advisory` | Reports a violation and does not block. Every new rule starts here |
| `blocking` | Requests changes on a `MUST` violation, and on a `SHOULD` violation with no accepted exception |
| `retired` | Ignores the rule. The row stays, so old findings still resolve |

Only the user changes a status. An agent proposes the change with its evidence, and the evidence is the findings that cite the rule across reviews. A finding is dismissed when the user replies to the review with `Dismissed: <rule ID>` and a reason, and fixed when a later commit changes the flagged code:

- **Promote** a rule to `blocking` once it has produced at least three findings the implementer fixed and none the user dismissed as wrong.
- **Retire** a rule when the user dismissed two of its findings as wrong, when a lint rule now covers it, or when it produced no finding across three milestones. A rule with no findings may still shape what the implementer writes, so say which of these applies and let the user decide.
- **Rewrite** a rule whose findings are right but keep needing a second read to judge. A rewritten rule gets a new ID and starts as `advisory`, and the old row is retired.

## Rules from shared skills

Language skills, such as `writing-typescript`, carry rules for every repository, each with its own ID. These count as `SHOULD` and `advisory` until this table says otherwise. Add a row for a skill rule only to change its level or status, with the skill named in the Detail column, and never restate its text. When the table and a skill disagree, the table wins.
