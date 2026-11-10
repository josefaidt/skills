# GLOSSARY.md format

A `GLOSSARY.md` lists the terms one context uses, each with a short definition and the words to avoid for the same concept. It sits at the root of the area it covers, never in a `docs/` or source directory.

## Structure

```md
# {Context Name}

{One or two sentences on what this context is and why it exists.}

## Language

**Order**: {A one or two sentence description of the term} _Avoid_: Purchase, transaction

**Invoice**: A request for payment sent to a customer after delivery. _Avoid_: Bill, payment request

**Customer**: A person or organization that places orders. _Avoid_: Client, buyer, account
```

## Rules

- **Be opinionated.** When several words name the same concept, pick the best one and list the others under `_Avoid_`.
- **Keep definitions tight.** Use one or two sentences at most, and define what the term is. What it does belongs in the code and the docs that describe it.
- **Include only terms specific to this context.** General programming concepts such as timeouts, error types, and utility patterns stay out, even when the project uses them heavily. Before adding a term, ask whether the concept is unique to this context or a general programming concept, and add only the first kind.
- **Group terms under subheadings** when natural clusters emerge. A flat list works when every term belongs to one cohesive area.

## Single and multi-context repositories

Most repositories have a single context and one `GLOSSARY.md` at the repository root.

A repository with several contexts has a `GLOSSARY_MAP.md` at its root that lists the contexts, where each one lives, and how they relate. Each context keeps its own `GLOSSARY.md` at its own root.

```md
# Glossary Map

## Contexts

- [Ordering](./packages/ordering/GLOSSARY.md): receives and tracks customer orders
- [Billing](./packages/billing/GLOSSARY.md): generates invoices and processes payments
- [Fulfillment](./packages/fulfillment/GLOSSARY.md): manages warehouse picking and shipping

## Relationships

- **Ordering → Fulfillment**: Ordering emits `OrderPlaced` events; Fulfillment consumes them to start picking
- **Fulfillment → Billing**: Fulfillment emits `ShipmentDispatched` events; Billing consumes them to generate invoices
- **Ordering ↔ Billing**: Shared types for `CustomerId` and `Money`
```

Work out which structure applies before writing.

- When a root `GLOSSARY_MAP.md` exists, read it to find the contexts.
- When only a root `GLOSSARY.md` exists, the repository has a single context.
- When neither exists, create a root `GLOSSARY.md` once the first term is resolved.

With several contexts, infer which one the current topic belongs to, and ask when it is unclear.
