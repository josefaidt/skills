---
role: doc-type (independent)
description: Structure for an RFC, one document holding why a feature exists, the behavior it must have as MUST, SHOULD, and MAY statements, and the design that delivers it. Use when one person both approves the behavior and owns the product, such as a side project, instead of a separate PRD and design document.
---

# Writing RFCs

An RFC defines one feature in one file: why it exists, what it must do, and how it is built. It has two owners. The maintainer approves the Motivation and Behavior sections, and an agent owns the Design section. The status in its frontmatter says which half is settled, and the merge to `main` that sets a status is the approval.

The prose rules in `SKILL.md` are already in force. This file adds document shape only.

## Document structure

```markdown
---
kind: rfc
key: RESET
status: draft
---

# Password Reset RFC

## Summary

## Motivation

## Behavior

### 1. [Capability]

## Open questions

## Design

### Traceability

### Decisions

### Out of scope
```

Summary, Motivation, Behavior, and Open questions are the maintainer's half. Design is the agent's half, and it may arrive in a later pull request than the rest.

## Status

| Status | Means |
| :-- | :-- |
| `draft` | An agent is writing or fixing the maintainer's half. Nobody else needs to read it |
| `review` | The behavior pre-check came back clean, and the maintainer's half waits on the maintainer |
| `accepted` | The maintainer merged the behavior. Design review can run, and the Behavior section changes only through a new `review` |
| `implemented` | Every `MUST` behavior has shipped with a test |
| `withdrawn` | Dropped before it shipped. The file stays, so its IDs are never reused |
| `superseded` | Replaced. Add `superseded-by` with the new RFC's path |

A change to the Behavior section of an `accepted` or `implemented` RFC sets the status back to `review` in the same pull request, so the change reaches the maintainer. Fixing a typo is still a change. The maintainer approves it in that pull request by committing `accepted` after the last change to the behavior, and the behavior guard fails a pull request whose behavior changed after that commit. An amended `implemented` RFC returns to `accepted`, and moves to `implemented` again once its new `MUST` statements have tests.

## Summary

Three to five sentences: what the RFC defines, the core behavior in one sentence, and the main scope boundary.

## Motivation

One to three paragraphs on what the user cannot do today, what that costs them, and why it matters now. Cite numbers, competitors, or issues where they exist. Personas are optional and follow the PRD's rule: include them only when the feature serves one cohort or different cohorts use it differently.

## Behavior

The contract the design and the tests answer to. Group statements under numbered capability headings, each with a one-line purpose, then the statements.

```markdown
### 3. Single-use links

A reset link works once, so a leaked link stops working after the user resets.

- **RESET-3.1** A reset link MUST expire 30 minutes after it is issued.
- **RESET-3.2** A used reset link MUST be rejected with "This link has already been used."
- **RESET-3.3** Issuing a new reset link SHOULD invalidate any earlier unused link for the same account.
```

Each statement:

- Opens with its bold ID: the key, the capability number, and the statement number.
- Holds one requirement, with its keyword in capitals: `MUST`, `MUST NOT`, `SHOULD`, `SHOULD NOT`, or `MAY`. Outside a statement, write requirements in plain present tense and never use these words in lowercase, so every requirement is a statement with an ID.
- Names its subject, and describes behavior a test can observe from outside: values, states, messages, and limits. A statement that names a table, a module, or an algorithm belongs in Design.

The keyword sets priority as well as strength. `MUST` is required for the RFC to ship: a pull request that claims a `MUST` with no test does not merge, and the RFC cannot be `implemented` while one is untested. `SHOULD` ships in this RFC unless Design gives a reason to defer it. `MAY` is optional.

IDs never move. The key is a short uppercase word, unique across the repository's RFCs and PRDs. Add a new statement at the end of its capability with the next number, and a new capability at the end of the section. To remove a statement, strike its text through and keep the ID, as in `- **RESET-3.3** ~~Issuing a new link SHOULD...~~`. To change its meaning, strike it and add a new statement.

When a behavior depends on several inputs, add a table under the capability with a column for each input and a final Behavior column, as a PRD's behavioral clarifications do.

## Open questions

Behavior the maintainer has not decided, each led by the author's recommendation: `- **[Question]** Recommendation: [position]. [One-sentence reason].` This section is empty before the status moves to `accepted`. A technical question goes in Design instead.

## Design

The agent's plan for delivering the Behavior section. Its reader is the agent that builds from it and the reviewer that checks it.

- **Traceability.** A table with a row for every `MUST` and `SHOULD` statement and the Design subsection that delivers it. A deferred `SHOULD` says why in the second column.
- **The design itself.** Subsections for the parts of the system the RFC touches, such as the data model, the interfaces, and each flow. Name the tables, routes, modules, and types the code will use, and write persisted shapes and public contracts out in full.
- **Decisions.** Each decision that had an alternative worth weighing: the choice, the alternatives, and why. Mark each decision that would cost a migration, a breaking change, or lost data to undo, and link its ADR. The maintainer reads this subsection.
- **Out of scope.** What this RFC does not build, including anything a reader might expect from its title.

When the design needs a behavior the Behavior section does not state, it does not settle it. It adds an open question and sets the status back to `review`.
