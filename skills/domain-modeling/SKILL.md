---
name: domain-modeling
description: Build and sharpen a project's domain model, the vocabulary its code and docs share and the hard-to-reverse decisions that shape it. Covers challenging terms against the glossary, sharpening vague language, testing concepts with edge-case scenarios, checking claims against the code, keeping a GLOSSARY.md at the root of each area and ADRs in its docs/adr/ directory, and deciding when a decision earns an ADR. Use when discussing codebase terminology, naming or renaming a domain concept, writing or editing a GLOSSARY.md or GLOSSARY_MAP.md, or recording or editing an ADR.
---

# Domain modeling

Domain modeling is the active practice of building and sharpening a project's domain model while you design. You challenge terms, invent edge-case scenarios, and write each term and decision down as soon as it settles. Reading the glossary for vocabulary is a habit any session can pick up without this skill, so load it when you are changing the model rather than consuming it.

## File structure

An area's glossary is a `GLOSSARY.md` at its root, and its ADRs live in its `docs/adr/` directory. Neither ever goes inside a source directory such as `src/` or `lib/`. Most repositories have a single context, so the glossary sits at the repository root.

```
/
├── GLOSSARY.md
├── docs/
│   └── adr/
│       ├── 0001-event-sourced-orders.md
│       └── 0002-postgres-for-write-model.md
└── src/
```

A `GLOSSARY_MAP.md` at the repository root marks a repository with several contexts and points to where each one lives. A context is a package, app, or service with its own root. It keeps its `GLOSSARY.md` at that root and its ADRs in a `docs/adr/` directory beside its source.

```
/
├── GLOSSARY_MAP.md
├── docs/
│   └── adr/                  ← system-wide decisions
└── packages/
    ├── ordering/
    │   ├── GLOSSARY.md
    │   ├── docs/
    │   │   └── adr/          ← context-specific decisions
    │   └── src/
    └── billing/
        ├── GLOSSARY.md
        ├── docs/
        │   └── adr/
        └── src/
```

Create files lazily, once you have something to write. A `GLOSSARY.md` appears when its first term is resolved, and a `docs/adr/` directory when its first ADR is needed. When you create the first glossary, add a pointer to it wherever the repository lists its docs for agents, such as `AGENTS.md`, so other sessions read it for vocabulary.

An ADR follows the conventions of the `docs/` directory it lands in. If the other documents there open with frontmatter, follow a naming scheme, or appear in a generated index, the ADR does the same.

## During the session

### Challenge against the glossary

When the user uses a term that conflicts with the language in the glossary, call it out immediately. "The glossary defines 'cancellation' as X, but you seem to mean Y. Which is it?"

### Sharpen fuzzy language

When the user uses a vague or overloaded term, propose a precise canonical one. "You're saying 'account'. Do you mean the Customer or the User? Those are different things."

### Discuss concrete scenarios

When the discussion turns to how domain concepts relate, stress-test the relationships with specific scenarios, inventing edge cases that make the user say exactly where one concept ends and the next begins.

### Cross-reference with code

When the user states how something works, check whether the code agrees, and surface any contradiction. "The code cancels entire Orders, but you just said partial cancellation is possible. Which is right?"

### Update the glossary inline

Update the glossary the moment a term is resolved, instead of batching terms for the end of the session. `references/glossary-format.md` has the format and the rules for single and multi-context repositories.

The glossary holds definitions and nothing else, so implementation details, specs, and scratch notes belong somewhere else.

### Offer ADRs sparingly

Offer an ADR (architecture decision record) only when a decision meets all three tests.

1. **Hard to reverse.** Changing your mind later carries a meaningful cost.
2. **Surprising without context.** A future reader will wonder why it was done this way.
3. **The result of a real trade-off.** There were genuine alternatives, and you picked one for specific reasons.

When any of the three is missing, skip the ADR. `references/adr-format.md` has the template, the numbering, and the kinds of decisions that qualify.
