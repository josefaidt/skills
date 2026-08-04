---
role: doc-type (substrate)
composes: [tenets, faqs]
extended-by: proposal
description: Structure for internal product and business documents — requirements, analyses, and strategy memos for stakeholders and decision-makers. The substrate doc type: holds the base narrative structure and the executive-summary substance. Proposals that evaluate options extend it (see proposal.md).
---

# Internal product and business documents

Structure for internal documents: requirements, proposals, and analyses written for stakeholders and decision-makers, not for customers. This is the substrate doc type. A proposal that evaluates multiple options extends this structure with tenets and options; read `proposal.md` for that layer.

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

(one paragraph: core problem, then recommendation)

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

When the document evaluates multiple options and makes a recommendation, extend this template with the tenets-and-options structure in `proposal.md`. When a decision doc has settled its recommendation but left specific boundaries open, an FAQ section frames those edges better than a plain open-questions list (see `faqs.md`).

## Executive summary

The executive summary is the paragraph a reader who reads nothing else should be able to leave with the full working position. The substance below governs business docs and proposals alike. (PRDs use a different executive-summary shape; see `prd.md`.)

### Opening pattern (first paragraph)

Business documents and strategy memos open with explicit context, not with examples or scenarios. The first paragraph establishes three things, in this order:

1. **What the product/effort is.** Name it, say what it does, name when it launches if relevant.
2. **Who the audience is.** The target audience and what they bring with them.
3. **What this document is for.** State the purpose and scope explicitly, often with the phrase "This document...", "We are meeting today to...", or "In this document, we describe...".

Scenarios, vivid examples, and storytelling are appropriate but belong later in the document, in Background or the problem section, not in the one-paragraph executive summary.

Reference opening shapes:

- _Vision framing:_ "Some of the largest customers in the segment have adopted [the operational model] and prefer to build new applications using [the approach]. Our vision is to make [the effort] the fastest way for them to turn intent into a production result... In this document, we describe the significance of a first-class end-to-end experience..."
- _Competitive analysis:_ "Over the past decade, [the category] has evolved to serve two distinct categories of workloads... This document analyzes [the competitor]'s growing success in capturing mindshare, particularly among [the segment], and introduces [the response]..."
- _Working-group update:_ "[The audience] who build [the workload] require [the constraint]... To address this challenge we formed a working group with a goal to align on a strategy for addressing their needs. We are meeting today to provide an update on our progress and next steps."

Every example explicitly states the document's purpose. Without that explicit statement, readers infer the doc's intent from the substance, which is harder and less effective.

### What doesn't belong in an executive summary

The executive summary carries substance: the context the reader needs, the working position or recommendation, and the load-bearing reasons for it. A reader who reads only this paragraph should get the full working position. Anything else dilutes the paragraph's job.

- **Doc-structure roadmaps.** "§1 sets up X, §2 covers Y, §3 concludes with Z." A table of contents already does this. Prose attention on the executive summary should land on the argument, not on the doc's shape. If the reader needs a specific reading order, put it in a separate one-line note (or omit it; most docs read top-to-bottom).
- **Tactical detail.** Executive summaries state positions and load-bearing rationale. Implementation specifics, feature-level detail, API shapes, per-item pricing, and section-level walkthroughs belong in the body. If a claim needs a paragraph of qualifying detail, cite it and let the section that owns the claim carry the detail.
- **Meta-commentary about method.** "This document uses a working-backwards approach to..." Reserve method notes for the section where the method matters, or drop them if the method is standard for the doc type.
- **Feature-level specifics.** Names of specific commands, message shapes, internal system diagrams, or per-tier pricing. Substitute the higher-level abstraction that carries the reader through the argument. Save specifics for the section (problem or experience) where they earn their place.

Test: read the executive summary out loud. Every sentence should either establish context (subject, audience, purpose), state a position, or carry a load-bearing reason. If a sentence describes what the doc will do rather than what the doc argues, it's structural meta-commentary and should be cut. If a sentence names specific features or implementation details, it's tactical and belongs in the body.

### Length and shape

The executive summary is exactly one paragraph. It states the core problem in plain terms and then the recommendation, at the altitude of the document's intent. Anything longer stops being a summary: a second paragraph almost always means context-setting or tactical detail crept in, and that detail belongs in Background or the body.

- **Word target.** Around 100-150 words. If the draft approaches 250, body-level detail or "here's what the doc will do" meta-commentary crept in.
- **No numbered or bulleted lists inside the executive summary.** Lists inflate the summary into a mini-body-section and dilute the "reader gets the full working position" rule. If several claims carry the argument, weave them into prose and let the body sections expand each.
- **Problem, then recommendation.** Lead with the core problem in simple terms, then the recommendation. Keep both at the doc's intent level; leave mechanisms, feature names, and per-option detail to the body.
- **Name the root problem, not a symptom.** State the underlying cause, not the surface annoyance it produces. If the problem as written could be resolved by a cosmetic change while the real constraint remained, it is naming a symptom. Use the framing the person who would resolve it would recognize as the actual constraint.
