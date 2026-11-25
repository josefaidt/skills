---
name: reviewing-design
description: Review a design against the behavior it must deliver, either an RFC's Design section against its Behavior section or a design document against its PRD, and against the repository's coding standards, before any task is cut from it. Checks that every MUST and SHOULD behavior traces to the design and nothing in the design traces to no behavior, catches design choices that change product behavior, and flags hard-to-reverse decisions for the user. Use when a design document is drafted or revised, before breaking it into tasks, or when asked to review a design, spec, or technical plan.
---

# Reviewing a design

A design is the agent's plan for building the behavior the user approved, written as the Design section of an RFC or as a design document beside a PRD. The user approves the behavior and mostly does not read the design, so this review is the only check on the plan before a milestone of code is built from it. It sorts what it finds into two piles: what the agent fixes in the design itself, and the few things only the user can decide.

Run it after the design is drafted and again after each revision, and cut no tasks until it comes back with nothing for the agent to fix.

## Inputs

1. The behavior: an RFC's Behavior section, or the PRD a design document names. Its frontmatter `key` prefixes every ID, such as `RESET-3.2` for capability or story 3, statement or criterion 2.
2. The design: the RFC's Design section, or the design document.
3. `CODING_STANDARDS.md` and any ADRs in `docs/adr/`, when they exist.

Review an RFC's design only once its status is `accepted`, so the design is never checked against behavior the user has not approved. When a design document names no PRD, stop and ask which one it implements.

In what follows, a traced behavior is a `MUST` or `SHOULD` statement in an RFC, or a criterion of a P0 or P1 story in a PRD. Of those, `MUST` and P0 are required, and `SHOULD` and P1 are expected, as in the coverage check.

## Checks

### Traceability

Map every traced behavior to the part of the design that delivers it. Use the design's own traceability table when it has one, and check each row against the section it points to rather than trusting the table.

- A `MUST` or P0 behavior with no part of the design behind it is a gap. So is a `SHOULD` or P1 behavior the design neither delivers nor defers with a reason.
- A part of the design that serves no behavior is scope nobody asked for. It is either a missing behavior, which goes to the user, or work to cut.
- A behavior the design meets only partly, such as handling the happy path but not the expiry case the statement names, is a gap.

### Behavior the requirements do not settle

Flag any choice in the design whose answer changes what a user sees, does, or pays, or what data the product keeps about them, when the behavior does not already decide it. Examples are an error message, a default, a limit, a retention period, or what happens on a second attempt. The agent does not settle these in the design. In an RFC, add each to Open questions with a recommendation and set `stage: review` on the RFC again. With a PRD, add each to the PRD's open decisions.

Check the open questions or open decisions too. A design that depends on one cannot be finished until the user settles it.

### Hard-to-reverse decisions

Flag each decision that would cost a migration, a breaking change, or lost data to undo:

- a persisted data shape, such as a table, a key format, or a stored JSON document
- a public contract, such as an API route, an SDK signature, a webhook payload, or a token format
- a security boundary, such as how sessions, tenants, or permissions are checked
- a new external service or dependency the product cannot run without
- what data is kept, for how long, and how it is deleted

For each one, say whether an ADR records it. A decision that is hard to reverse, surprising without context, and the result of a trade-off needs one.

### Standards

Check the design against the rules in `CODING_STANDARDS.md` that a design can break before any code exists, such as where a tenant filter lives or which layer parses input. Cite the rule ID, as in a code review.

## Report

The agent fixes its own pile and runs the review again. Only the user's pile leaves the loop.

```markdown
**Design:** docs/rfcs/password-reset.md (`RESET`)

### For you

- **Behavior:** the RFC does not say whether a reset signs out the account's other sessions. Added to Open questions and set `stage: review` again. Pick: sign them out, since a reset usually follows a suspected compromise.
- **Hard to reverse:** reset tokens are stored as SHA-256 hashes keyed by token ID. No ADR yet.

### Fixed in the design

- `RESET-2.3` (a used link shows "This link has already been used") had no design. Added to the token flow.
- The design added an admin "resend reset" endpoint no behavior asks for. Removed.
```

Write each item for the user so they can decide from the report alone: what the question is, the design's pick, and the reason. When the user's pile is empty, say so in one line.
