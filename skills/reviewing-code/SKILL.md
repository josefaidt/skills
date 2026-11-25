---
name: reviewing-code
description: Review a diff or pull request against the repository's CODING_STANDARDS.md, its REVIEW.md, and the language skills' rules, citing a rule ID on every finding, and report defects, untested required behavior, and claimed exceptions in a fixed format. Use when asked to review code, a branch, a diff, or a pull request, or when acting as the reviewer in an implement-then-review loop.
---

# Reviewing code

Review the diff, not the repository, and judge it only against rules that are written down. A finding cites a rule ID, so the findings can be counted and the rules that produce them can be promoted, rewritten, or retired. A comment that cites no rule is a preference, and preferences are what make agents stop trusting a review. The one exception is a defect, which you always report.

## Scope

1. Diff the branch against its base, working tree included when the branch is local. Review only changed lines and the code they call or change the behavior of.
2. Read the pull request body for the behavior IDs it claims to deliver, from an RFC or a PRD, and any exceptions it claims.
3. Leave out what the static checks cover. When the format, lint, or type check did not run on this diff, run it and report its failures as they are, rather than judging those rules by eye.

## Review instructions

Read `REVIEW.md` at the repository root when it exists, along with each `REVIEW.md` in a directory that holds a changed file, which adds checks for changes under that path. Read each from the base with `git show <base>:<path>`, never from the branch, so a change cannot loosen its own review. When the diff changes a `REVIEW.md`, say that the change does not apply to itself.

`REVIEW.md` holds the repository's own review procedure, such as how to find the requirements a change answers to, what else to check on every change, what not to report, and how its severities, verdict, and output map onto this skill's. Follow it alongside this skill. Where the two differ, `REVIEW.md` wins, as `CODING_STANDARDS.md` wins over a language skill's rules.

## Rules

Read `CODING_STANDARDS.md` at the repository root when it exists, then the rules of the language skills that match the changed files, such as `writing-typescript` for `.ts` files. The table wins where the two disagree, and it sets each rule's level and status. A skill rule the table does not list is `SHOULD` and `advisory`.

Skip a rule that a lint rule in the repository's config already enforces, and a rule whose status is `retired`. Open a rule's detail file only when its one-line text is not enough to judge the case in front of you.

## Findings

Report three kinds of finding, and any kind `REVIEW.md` adds, and nothing else:

| Kind | What it is |
| :-- | :-- |
| Rule violation | The diff breaks a rule. Cite its ID, level, and status |
| Defect | Code that does the wrong thing, which a test could show, such as a wrong branch, an unhandled error path, a race, a missing tenant or permission check, or data loss |
| Untested behavior | The pull request claims a behavior, such as `RESET-3.2`, and no test in the diff or the repository names that ID, in its title for a TypeScript test or as the snake_case prefix of its name for a Rust one (`fn reset_3_2_rejects_a_used_link()`), or in the doc comment above it (`/// Also covers RESET-3.3.`) |

Style you would have written differently, naming you would change, and refactors the diff did not need are not findings. When you see a judgment call that keeps coming up and no rule covers it, list it once under "Rule candidates" at the end, with the evidence, and do not count it against the diff.

Each finding names the file and line, what the code does, and the fix in a sentence. Group repeats of one rule into one finding with every location.

## Exceptions

A pull request may break a `SHOULD` rule on purpose by naming its ID and a reason in the body, as in "Exception: `api/error-envelope`, the webhook endpoint answers in the provider's error format". Accept an exception whose reason is specific to this change and shows the rule's risk does not apply. Reject a reason that applies to any change, such as "out of scope" or "time". An accepted exception is not a finding: list it under Exceptions and leave the violation out of the tables.

A `MUST` rule takes no exception. Reject one claimed against a `MUST` rule, report the violation as usual, and say that the way through is a change to the rule, such as a narrower scope or a "Not a violation" case in its detail file, which only the user approves. Code the rule's detail file already says is not a violation is not an exception and needs no claim.

List every exception, accepted or rejected, in the review, since the milestone report collects them for the user.

## Verdict

- **Request changes** for any defect, any violation of a `blocking` `MUST` rule, any violation of a `blocking` `SHOULD` rule with no accepted exception, and any untested required behavior, meaning a `MUST` statement in an RFC or a criterion of a P0 story in a PRD. A behavior's ID starts with its document's `key`, so find the RFC or PRD with that key in its frontmatter to read its level.
- **Comment** when every finding is `advisory` or an untested `SHOULD`, `MAY`, P1, or P2 behavior.
- **Approve** when nothing is found. Accepted exceptions and rule candidates do not change the verdict.

Never approve a diff you wrote. When the implementer and the reviewer are the same session, report the findings and leave the verdict to another agent or the user.

## Output

Post the review in this shape, or the one `REVIEW.md` sets, leaving out any empty section, so the next review and the milestone report can find each rule ID by searching review comments. When the user thinks a finding is wrong, they reply `Dismissed: <rule ID>` with a reason, and that reply is what counts against the rule.

```markdown
**Verdict:** Request changes

### Blocking

| Rule | Where | Finding | Fix |
| :-- | :-- | :-- | :-- |
| `secrets/no-tokens-in-logs` | `lib/reset.ts:42` | Logs the reset token on a failed lookup | Log the token's ID instead |
| Defect | `lib/session.ts:88` | An expired session passes when `exp` is missing | Treat a missing `exp` as expired |

### Advisory

| Rule | Where | Finding | Fix |
| :-- | :-- | :-- | :-- |
| `api/error-envelope` | `routes/reset.ts:17` | Returns a bare string on a 400 | Return the shared error shape |

### Behavior

- `RESET-3.1` (the link expires after 30 minutes): tested in `lib/reset.test.ts`
- `RESET-3.2` (a used link is rejected): no test

### Exceptions

- `api/error-envelope` accepted: the webhook endpoint must answer in the provider's error format, which the provider parses
- `tenancy/scoped-queries` rejected: a `MUST` rule takes no exception. Scope the query, or ask the user to change the rule

### Rule candidates

- Handlers that catch an error and return 200 appeared in three files. No rule covers it.
```
