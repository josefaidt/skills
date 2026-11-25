---
name: milestone-report
description: Write the report that closes a milestone, holding only what the user must think hard about. Covers product behavior waiting on approval, hard-to-reverse decisions, exceptions to blocking rules, rules ready to promote or retire with their finding counts, and required behavior with no test. Use when a milestone's pull requests have merged, when asked for a milestone report, or when asked what in a milestone needs the user's review.
---

# Milestone report

A milestone ends with one report the user can clear in a single sitting. Agents settled everything else during the milestone, through design reviews, code reviews, and the checks, so the report holds only the calls an agent cannot make and the evidence for each. When an item could be settled without the user, settle it before writing the report rather than listing it.

Keep this turn read-only, apart from running the coverage check below. Do not merge, close, or change anything the report asks the user to decide.

## Gather

1. **Scope.** Find the milestone's RFCs, or its PRDs and design documents, and its merged pull requests from wherever the repository tracks milestones, such as a GitHub milestone (`gh pr list --state merged --search 'milestone:"<name>"'`) or a Linear project.
2. **Design reviews.** Collect each "For you" item from the milestone's design reviews that the RFC, the PRD, or an ADR has not since settled, and each open question in an RFC at `stage: review`.
3. **Code reviews.** Read the review comments on each pull request. Count the findings for each rule ID, and sort each finding as fixed (a later commit changed the flagged code, or the next review stopped reporting it), dismissed (the user replied `Dismissed: <rule ID>`), or merged unfixed. Collect every exception and every rule candidate.
4. **Rules.** Read `CODING_STANDARDS.md` and its history for the milestone, so you know each rule's status, which rules are new, and when each last produced a finding.
5. **Coverage.** Run `bun run docs:coverage`, or `bun scripts/criteria-coverage.ts` in a repository with no root `package.json`, to list the behaviors no test names, and the IDs tests name that no document defines. When the repository has neither, search the test files for each `MUST` statement's or P0 criterion's ID yourself, in a Rust test as the snake_case name prefix (`reset_3_2_`) or an `Also covers` doc comment, and suggest the `setup-docs-workflow` skill to install the check.

## What goes in

| Section | Holds |
| :-- | :-- |
| Behavior | Questions about what a user sees, does, or pays, or what data the product keeps, that the RFC or PRD does not answer yet. Word each as the change to the behavior the user would approve |
| Hard to reverse | Each decision that would cost a migration, a breaking change, or lost data to undo, with whether an ADR records it |
| Exceptions | Each accepted exception to a `blocking` `SHOULD` rule, each rejected exception to a `MUST` rule as a possible change to that rule, and each finding that merged unfixed |
| Rules | Each rule ready to promote, retire, or rewrite under the repository's thresholds, with its counts. Each rule candidate that came up in more than one pull request |
| Coverage | Required behaviors (`MUST` or P0) with no test first, then expected ones (`SHOULD` or P1). Each RFC or PRD that has every required behavior tested and is not yet `implemented`. IDs in tests that no document defines |

Leave out findings that were fixed, advisory findings that merged unfixed on a rule nobody proposes to change, the list of tasks, and how the work went. The pull requests hold that.

## Shape

Use plain words and short sentences, as one person catching another up. Put a few words beside every rule or behavior ID, as in "`RESET-3.2` (a used link is rejected)".

1. One sentence naming how many calls wait on the user, or saying none do.
2. What shipped, in at most three lines, named the way the user knows each feature.
3. The sections above, in that order, leaving out any that are empty. Give each item the call, your pick, the evidence, and the risk if the user picks the other way, in about 30 words. When several items share one call, such as three rules ready to promote, state the call once and list the items under it.

Never shrink a decision to a count to save space. The report grows with the number of decisions, and a milestone that produces too many to clear in one sitting is a sign the next one should be smaller.
