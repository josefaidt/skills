---
name: reviewing-behavior
description: Pre-check the part of an RFC or PRD the maintainer approves, its motivation and its behavior statements or acceptance criteria, before the maintainer reads it. Fixes what an agent can, such as missing IDs, untestable or compound statements, and implementation details, and surfaces the decisions only the maintainer can make. Use when an RFC in draft or a PRD is ready for review, before setting an RFC's status to review, or when asked to check requirements.
---

# Reviewing behavior

The maintainer approves what a feature does, and nothing else in the loop can. This review makes sure that when the maintainer reads an RFC's Motivation and Behavior sections, or a PRD's stories, the only question left is whether these are the right behaviors. Everything an agent can fix gets fixed first, and every decision the author made on the maintainer's behalf is put where the maintainer will see it.

Prose style is the author's own sweep under the writing guide, not this review's job.

## Inputs

1. The RFC or PRD, and the version on `main` when one exists.
2. The other RFCs and PRDs in the repository, to check that the key is unique and the behavior does not contradict them.
3. `GLOSSARY.md`, when it exists, for the names the statements should use.

## Checks an agent fixes

These have one right answer. Fix them in the document and rerun the review.

- **IDs.** The frontmatter has a `key` no other RFC or PRD uses. Every statement or criterion opens with a bold ID that starts with that key. No ID repeats, and no ID that exists on `main` has moved, been renumbered, or been reused for different text. A removed one is struck through, not deleted.
- **Keywords.** In an RFC, each statement holds one capitalized `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, or `MAY`, and the words never appear in lowercase anywhere in the Behavior section. In a PRD, each story heading carries a P0, P1, or P2 tag.
- **One requirement each.** A statement that joins two behaviors with "and" or "or" becomes two statements.
- **Observable.** Each statement describes what a user, a client, or a test sees: a value, a state, a message, a limit. Rewrite one that names a table, a module, a library, or an algorithm in terms of what it does, and move the mechanism to Design.
- **Specific.** Replace words a test cannot check, such as "quickly", "appropriate", "securely", or "user-friendly", with the value they stand for. When the value is not known, that is a maintainer decision, below.
- **Names.** Each statement uses the glossary's term for each concept, and one term per concept across the document.

## Checks that go to the maintainer

These need a call the author cannot make. Add each to the Open questions section with the author's recommendation, or to the report below, rather than settling it in the text.

- **Values the author chose.** Every number, limit, default, duration, and message the maintainer did not state, such as a 30-minute expiry. List each one with its ID, so the maintainer approves it knowingly instead of by not objecting.
- **Missing edges.** For each capability, ask what happens on invalid input, on a second attempt, on concurrent use, at a limit, and when a dependency fails. An edge with no statement and no obvious answer is a question.
- **Conflicts.** Two statements that cannot both hold, or a statement that contradicts another RFC or PRD.
- **Scope against motivation.** A capability the Motivation does not call for is scope to confirm or cut. A problem the Motivation names that no capability addresses is a gap.

## Report

When the agent-fixable checks pass, set an RFC's status to `review` in the same pull request and post this, so the maintainer reads the decisions before the document:

```markdown
**Ready for you:** docs/rfcs/password-reset.md (`RESET`)

### Values I chose

- `RESET-3.1` (link lifetime): 30 minutes, the common default for reset links
- `RESET-4.2` (request limit): 5 per hour per account

### Open questions

- Should a reset sign out every other session? Recommendation: yes, since a reset usually follows a suspected compromise.

### Scope to confirm

- Capability 5 (reset by SMS) serves no problem in the Motivation. Cut it, or add the problem.
```

Leave out the fixes the agent made. The diff holds them. When nothing needs the maintainer beyond reading the behavior, say so in one line.
