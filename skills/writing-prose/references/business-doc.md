# Internal product and business documents

Structure for internal documents: requirements, proposals, and analyses written for stakeholders and decision-makers, not for customers.

The prose rules in `SKILL.md` are already in force. This file adds document shape only.

## Document types

| Type       | Purpose                                                        | Examples                                        |
| :--------- | :------------------------------------------------------------- | :---------------------------------------------- |
| `product`  | Requirements, user stories, specifications                     | `cli-user-stories.md`, `config-user-stories.md` |
| `business` | Proposals, analyses, strategy docs for leadership/stakeholders | `platform-strategy.md`, `vendor-comparison.md`  |

## Structure by type

### Product documents (`type: product`)

```markdown
# Document Title

Brief intro paragraph (1-3 sentences): what this covers and why.

## [Topic area]

### Key principles / model / overview

(if the domain needs framing before user stories)

## User stories

### P0: [Category]

- **As a** developer, **I want to** [action], **so that** [outcome].

### P1: [Category]

- **As a** developer, **I want to** [action], **so that** [outcome].
```

Product docs are requirements-driven. Lead with enough context to understand the domain, then user stories grouped by priority (P0, P1, P2). Include technical details only when they constrain the requirement.

For full PRD structure (acceptance criteria, behavioral clarifications, open decisions), read `prd.md`.

### Business documents (`type: business`)

```markdown
# Document Title

## Executive summary

(2-3 paragraphs: what, why, recommendation)

## Background

(context the reader needs)

## [Analysis / Evaluation / Problem]

(the substance of the document)

## Recommendation

(what you're proposing and why)

## Next steps

(what needs to happen, who needs to act)

## Appendix (optional)

(supporting data, detailed comparisons)
```

Business docs are narrative-driven. They build an argument: context → analysis → recommendation. Every section should advance the argument, not restate it.

#### Opening pattern (Executive summary first paragraph)

Business documents and strategy memos open with explicit context, not with examples or scenarios. The first paragraph establishes three things, in this order:

1. **What the product/effort is.** Name it, say what it does, name when it launches if relevant.
2. **Who the customer is.** The target audience and what they bring with them.
3. **What this document is for.** State the purpose and scope explicitly, often with the phrase "This document...", "We are meeting today to...", or "In this document, we describe...".

Customer scenarios, vivid examples, and storytelling are appropriate but come _after_ the context-setting paragraph. Use a transition like "Concretely:" or "A typical example:" to lead into them.

Reference opening shapes:

- _Vision framing:_ "Some of the largest customers in the segment have adopted [the operational model] and prefer to build new applications using [the approach]. Our vision is to make [the product] the fastest way for customers to turn code into a production application... In this document, we describe the significance of a delightful outer-loop experience..."
- _Competitive analysis:_ "Over the past decade, [the category] has evolved to serve two distinct categories of workloads... This document analyzes [the competitor]'s growing success in capturing developer mindshare, particularly among startups, and introduces [the response]..."
- _Working-group update:_ "Customers who build interactive and personalized end-user applications require cost-efficient and low-latency solutions... To address this challenge we formed a working group with a goal to align on a strategy for addressing customer needs. We are meeting today to provide an update on our progress and next steps."

Every example explicitly states the document's purpose. Without that explicit statement, readers infer the doc's intent from the substance, which is harder and less effective.

### Proposals with options

When a business document evaluates multiple options and makes a recommendation, extend the business template with a tenets-and-options structure:

```markdown
# Document Title

## Executive summary

## Background

## Tenets

(principles that adjudicate between options)

## Proposal

### Option 1: [Name] (Recommended)

#### What it looks like

#### Who maintains it

#### Cost shape

#### Pros

#### Cons

### Option 2: [Name]

#### What it looks like

#### Who maintains it

#### Cost shape

#### Pros

#### Cons

## Recommendation (optional)

## Next steps (optional)

## Appendix (optional)
```

**Option headings stay short.** Use a terse label plus the `(Recommended)` marker where applicable. Do not load the heading with qualifiers.

- Good: `### Option 1: Open Source (Recommended)`
- Good: `### Option 2: Closed Source`
- Avoid: `### Option 1: Open source under our ownership (Recommended)`

**Tenets.** Principles the document commits to for the purpose of this decision. Three to five tenets is typical. Each tenet is a full-sentence statement followed by a short rationale paragraph. Phrase tenets as principles the document adopts for this decision, in the same voice you would use for a product tenet. Each tenet should discriminate between the options in scope. If every option scores the same on a tenet, the tenet is not doing work in the decision and should be dropped.

**Tenets must also distinguish from each other.** A tenet that overlaps in scope or argument with another tenet does not double the discrimination, it duplicates it. Read the tenet titles side by side: if a reader could conflate them, sharpen the framing so each covers a distinct dimension. Useful axes to split on include present versus future (one tenet about today's location, another about long-term ownership), location versus engagement (where the artifact lives versus how the team participates), or scope (qualifiers like "established" or "long-term" can pin a tenet to a specific category). If two tenets still read as the same argument after sharpening, drop one.

**Options as parallel prose.** Each option gets the same set of subsections in the same order. Use `#### What it looks like`, `#### Who maintains it`, `#### Cost shape`, `#### Pros`, and `#### Cons`. Add a tenet-specific subsection (such as `#### Convergence with ecosystem norms`) when one tenet is doing substantial work for one option and the discussion does not fit inside Pros or Cons. Parallel structure lets readers compare options directly.

**Mechanics versus consequences.** Each option section has a division of labor:

- `What it looks like` describes mechanics: the structure, behavior, and operational model of the option.
- `Cons` describes consequences: the costs incurred by choosing this option.

Keep them separate. A consequence argument in the mechanics section (for example, "this breaks zero-config and forces users to configure manually") gets restated in Cons and reads as redundancy. State the mechanic cleanly in `What it looks like` and let `Cons` carry the consequence argument. The same division applies to `Pros`: affirmative benefits only, without restating what the option looks like.

Pros and Cons should stand on their own merits for each option. Do not write Option 2's cons as inverses of Option 1's pros, or vice versa. If an option's con is only interesting because another option avoids it, reframe the point in terms of what the option actually costs.

**Cons that restate the same substance should be merged or dropped.** If two cons argue the same underlying gap with different framings (for example, "the developer can't fix it themselves" and "the developer must wait for our release cycle"), the second is duplicating effort. Merge into a single con paragraph that names the underlying cost once, or drop the weaker framing. The same applies to pros.

**Pros and cons paragraph leads use prose, not bolded labels.** The first sentence of each pros or cons paragraph carries the topic explicitly so the reader understands the claim without depending on a label above it. See the "Paragraph leads" section of `SKILL.md` for the pattern. The Tenets section retains its bolded labels (the principle itself is labeled), as do single-line callouts within an option section (such as **Staffing.** above the Pros).

**Tenets live in the option prose, not in a separate evaluation section.** Each option's subsections should address how that option fares against each tenet. A reader moving through the option's mechanics, cost, pros, cons, and any tenet-specific subsections should be able to see the tenet-level analysis emerge without flipping to a dedicated evaluation section. Adding a separate "Evaluation against tenets" section duplicates content from the options and weakens the narrative.

**Drop `Recommendation` and `Next steps` when they would only restate the option headings.** The `(Recommended)` marker on the option heading plus the option's prose often communicate the recommendation completely. Include a separate `Recommendation` section only when the recommendation involves synthesis beyond "pick option X", for example when the recommendation is staged, conditional, or depends on external factors that deserve explicit callout. Apply the same test to `Next steps`: include it only when concrete assignments, timelines, or prerequisites need to be surfaced outside the option prose.

### Marking recommended options

When a business document evaluates multiple options and commits to one, mark the recommendation directly in its heading with `(Recommended)` in parentheses. This surfaces the chosen path in the table of contents and in any heading-level skim, so readers know which option to weight as they read the comparison.

- Good: `### Option 1: Open Source (Recommended)`
- Good: `### Option 2: Closed Source`

Rules:

- Place the marker at the end of the heading, after the option's descriptive title.
- Use title case (`Recommended`) to match heading conventions.
- Apply the marker to exactly one option. Marking multiple options defeats the purpose.
- Do not use "(Preferred)", "(Leading)", or other soft variants. The convention is `(Recommended)` or nothing.
- If the document evaluates options but does not make a recommendation, leave all headings unmarked and state the decision (or non-decision) in the Recommendation section.
