# ADR format

An ADR (architecture decision record) is a short document that records a decision and the reason for it. ADRs live in a `docs/adr/` directory and take a four-digit sequence number and a slug, as in `0001-slug.md` and `0002-slug.md`. Create the directory lazily, when the first ADR is needed.

## Template

```md
# {Short title of the decision}

{One to three sentences on the context, what was decided, and why.}
```

That is the whole template, and an ADR can be a single paragraph. Its value lies in recording that a decision was made and why. When the other documents in its `docs/` directory open with frontmatter, the ADR does too, above the heading.

## Optional sections

Include these only when they add something a reader needs. Most ADRs need none of them.

- **Status**, when decisions get revisited. Write it as a line under the heading, such as `Status: superseded by ADR-0007`, with a value of `proposed`, `accepted`, `deprecated`, or `superseded by ADR-NNNN`. A line in the body stays clear of any `status` field the directory's frontmatter already defines.
- **Considered options**, when the rejected alternatives are worth remembering.
- **Consequences**, when non-obvious downstream effects need calling out.

## Numbering

Scan the `docs/adr/` directory you are writing to for its highest number, and add one. Each ADR directory numbers its records on its own, so a context's first ADR is `0001` even when the root `docs/adr/` already holds others.

## What qualifies

The three tests in `SKILL.md` decide whether a decision earns an ADR. A decision that is easy to reverse needs no record, because you will reverse it when you need to. An unsurprising one leaves nobody wondering why, and one with no real alternative leaves nothing to record beyond doing the obvious thing.

Decisions that pass all three tend to fall into these kinds.

- **Architectural shape.** "We're using a monorepo." "The write model is event-sourced, and the read model is projected into Postgres."
- **Integration patterns between contexts.** "Ordering and Billing communicate through domain events, not synchronous HTTP."
- **Technology choices that carry lock-in**, such as a database, message bus, auth provider, or deployment target. A library qualifies only when swapping it out would take a quarter.
- **Boundary and scope decisions.** "Customer data is owned by the Customer context, and other contexts reference it by ID only." The explicit nos are as valuable as the yeses.
- **Deliberate deviations from the obvious path.** "We're using manual SQL instead of an ORM because X." Any choice where a reasonable reader would assume the opposite qualifies, and the record stops the next engineer from "fixing" something deliberate.
- **Constraints not visible in the code.** "We can't use AWS because of compliance requirements." "Response times must be under 200ms because of the partner API contract."
- **Rejected alternatives when the rejection is non-obvious.** If you considered GraphQL and picked REST for subtle reasons, record it, or someone will suggest GraphQL again in six months.
