---
role: doc-type (extends business-doc)
extends: business-doc
composes: [tenets, faqs]
description: Structure for a proposal that evaluates multiple options and makes a recommendation. Extends the business-doc substrate with a tenets-and-options structure. Use when the doc's job is to pick between candidate approaches, not just to analyze or recommend a single path.
---

# Proposal with options

A proposal extends the business document substrate: it keeps the narrative base (executive summary, background, recommendation) from `business-doc.md` and adds the machinery for evaluating options and committing to one. Read `business-doc.md` first for the executive-summary substance and the base structure; this file adds the options layer.

The tenets that adjudicate between options are governed by `tenets.md`. Compose that file for how to write them; this file covers how the options are structured and how the recommendation is marked. In a proposal, the tenets must discriminate between the options in scope.

## Template

```markdown
# Document Title

## Executive summary

## Background

## Tenets

(principles that adjudicate between options; see `tenets.md`)

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

When the proposal has settled its recommendation but left specific boundaries open, an FAQ section frames those edges better than a plain open-questions list. Read `faqs.md` for the question-led entry structure.

## Options as parallel prose

Each option gets the same set of subsections in the same order. Use `#### What it looks like`, `#### Who maintains it`, `#### Cost shape`, `#### Pros`, and `#### Cons`. Add a tenet-specific subsection (such as `#### Convergence with ecosystem norms`) when one tenet is doing substantial work for one option and the discussion does not fit inside Pros or Cons. Parallel structure lets readers compare options directly.

**Option headings stay short.** Use a terse label plus the `(Recommended)` marker where applicable. Do not load the heading with qualifiers.

- Good: `### Option 1: Open Source (Recommended)`
- Good: `### Option 2: Closed Source`
- Avoid: `### Option 1: Open source under our ownership (Recommended)`

**Mechanics versus consequences.** Each option section has a division of labor:

- `What it looks like` describes mechanics: the structure, behavior, and operational model of the option.
- `Cons` describes consequences: the costs incurred by choosing this option.

Keep them separate. A consequence argument in the mechanics section (for example, "this breaks zero-config and forces users to configure manually") gets restated in Cons and reads as redundancy. State the mechanic cleanly in `What it looks like` and let `Cons` carry the consequence argument. The same division applies to `Pros`: affirmative benefits only, without restating what the option looks like.

Pros and Cons should stand on their own merits for each option. Do not write Option 2's cons as inverses of Option 1's pros, or vice versa. If an option's con is only interesting because another option avoids it, reframe the point in terms of what the option actually costs.

**Cons that restate the same substance should be merged or dropped.** If two cons argue the same underlying gap with different framings (for example, "the developer can't fix it themselves" and "the developer must wait for our release cycle"), the second is duplicating effort. Merge into a single con paragraph that names the underlying cost once, or drop the weaker framing. The same applies to pros.

**Pros and cons paragraph leads use prose, not bolded labels.** The first sentence of each pros or cons paragraph carries the topic explicitly so the reader understands the claim without depending on a label above it. See the "Paragraph leads" section of `SKILL.md` for the pattern. The Tenets section retains its bolded labels (the principle itself is labeled), as do single-line callouts within an option section (such as **Staffing.** above the Pros).

**Tenets live in the option prose, not in a separate evaluation section.** Each option's subsections should address how that option fares against each tenet. A reader moving through the option's mechanics, cost, pros, cons, and any tenet-specific subsections should be able to see the tenet-level analysis emerge without flipping to a dedicated evaluation section. Adding a separate "Evaluation against tenets" section duplicates content from the options and weakens the narrative.

**Drop `Recommendation` and `Next steps` when they would only restate the option headings.** The `(Recommended)` marker on the option heading plus the option's prose often communicate the recommendation completely. Include a separate `Recommendation` section only when the recommendation involves synthesis beyond "pick option X", for example when the recommendation is staged, conditional, or depends on external factors that deserve explicit callout. Apply the same test to `Next steps`: include it only when concrete assignments, timelines, or prerequisites need to be surfaced outside the option prose.

## Marking recommended options

When a business document evaluates multiple options and commits to one, mark the recommendation directly in its heading with `(Recommended)` in parentheses. This surfaces the chosen path in the table of contents and in any heading-level skim, so readers know which option to weight as they read the comparison.

- Good: `### Option 1: Open Source (Recommended)`
- Good: `### Option 2: Closed Source`

Rules:

- Place the marker at the end of the heading, after the option's descriptive title.
- Use title case (`Recommended`) to match heading conventions.
- Apply the marker to exactly one option. Marking multiple options defeats the purpose.
- Do not use "(Preferred)", "(Leading)", or other soft variants. The convention is `(Recommended)` or nothing.
- Apply the marker only when the doc presents multiple parallel proposals. A doc with a single recommended proposal followed by an "Alternatives considered" section leaves the heading unmarked; the single proposal is the recommendation, and the rejected shapes live in "Alternatives considered" rather than as marked options.
- If the document evaluates options but does not make a recommendation, leave all headings unmarked and state the decision (or non-decision) in the Recommendation section.

Lead with the recommended option, ahead of the alternatives. Recommendation-first, alternatives-after: the reader should see the working position before the ones that lost. In prose sections that present postures or paths rather than parallel option headings, the same ordering holds: state the working recommendation, then the alternatives considered and rejected with their reasons. Listing options in alphabetical or logical-build order and marking one recommended halfway through buries the recommendation and lets the alternatives set the frame before the working position appears. The `(Recommended)` marker surfaces the choice but does not substitute for the ordering; when options build on each other in an argument, restate the recommendation at the top of the section.
