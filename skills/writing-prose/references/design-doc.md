---
role: doc-type (independent)
description: Structure for a design document, the plan for building what one PRD asks for. Use when the PRD is settled and the work needs a technical plan before it is broken into tasks.
---

# Writing design documents

A design document says how the product will deliver one PRD. Its readers are the agents that build from it and the reviewer that checks it against the PRD, so it is precise rather than persuasive. The user reads its Decisions section and little else. A design that needs another PRD's work is a sign that PRD should change, not that one design should cover two.

The prose rules in `SKILL.md` are already in force. This file adds document shape only.

## Document structure

```markdown
---
prd: docs/prd/password-reset.md
---

# [Feature name] design

## Summary

## Traceability

## Design

## Decisions

## Out of scope

## Open questions
```

### Summary

Three to five sentences: what the design builds, the PRD it implements by title, and the approach in one sentence.

### Traceability

A table with a row for each acceptance criterion in the PRD's in-scope stories, by ID, and the Design subsection that delivers it. Every P0 and P1 criterion appears. A criterion the design leaves for later says so in the second column with the reason.

```markdown
| Criterion                             | Delivered by          |
| :------------------------------------ | :-------------------- |
| `RESET-1.1` (request a reset link)    | Token issue flow      |
| `RESET-3.2` (a used link is rejected) | Token redemption flow |
```

### Design

Subsections for the parts of the system the PRD touches, such as the data model, the interfaces, and each flow. Name the tables, routes, modules, and types the code will use. Write the persisted shapes and public contracts out in full, since they are the parts that cost the most to change later. Leave out what the code will make obvious, such as private helpers.

### Decisions

Each decision that had an alternative worth weighing: what was chosen, what else was considered, and why. Mark each decision that would cost a migration, a breaking change, or lost data to undo, and link its ADR. This is the section the user reads, so write each entry so it stands on its own.

### Out of scope

What this design does not build, including anything a reader might expect from the PRD's title.

### Open questions

Technical questions the design has not settled. A question whose answer changes what a user sees, does, or pays is not a design question. Move it to the PRD's open decisions.
