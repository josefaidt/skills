---
role: component
composed-by: [business-doc, proposal]
description: Substance for writing decision tenets — the principles that adjudicate a decision. Compose from any doc type whose argument turns on tenets (business docs, options proposals). Holds the decision-tenet definition, the impostor taxonomy, the discrimination test, and the format choice.
---

# Tenets

Substance for tenets: the principles a document commits to for the purpose of a decision. This is the single source of truth for what a tenet is and how to write one. Doc-type references compose it and add any local specialization (for example, `proposal.md` requires tenets that discriminate between the options in scope).

## Tenets are decision tenets, not document tenets or workstream tenets

Tenets in a strategy or proposal doc are principles that shape and guide a specific decision. When you apply a tenet to a candidate option, it should produce (or strongly push toward) a decision outcome. Three to five tenets is typical. Each tenet is a full-sentence statement with a short rationale; how that rationale is formatted (succinct list item versus bold-led paragraph) is covered below. Phrase tenets as principles the document adopts for this decision, in the same voice you would use for a product tenet.

A tenet must discriminate between the options in scope. If every option scores the same on a tenet, the tenet is not doing work in the decision and should be dropped. Common tenet failures:

- **Document tenets.** "This document covers X." Describes the doc, not the decision.
- **Workstream tenets.** "The team will ship in two milestones." Describes execution, not the decision the doc is making.
- **Descriptive-not-discriminating tenets.** "This is a hosting service." True, but every option preserves this, so it does not help pick between them.
- **Back-solved tenets.** Tenets written backward from the recommended option, so they read as that option's pros (a tenet like "Match established meanings" when the recommendation is a particular choice). A reader should not be able to reconstruct the recommendation from the tenets alone. Frame tenets as goals the solution must meet, derived from the problem, phrased so they would read the same before any option was chosen.

A useful test: state the tenet, then imagine applying it to each candidate option. Does the tenet produce a "yes / no / partial" answer that pushes the decision one way or the other? If yes, the tenet is doing work. If applying it to any option produces "not applicable" or "true but neutral," the tenet needs sharpening or dropping.

## Don't mirror tenets one-to-one with the alternatives you reject

When each tenet has a matching rejected alternative and every alternative re-derives the tenet it fails, the Tenets and Alternatives sections restate each other. Keep tenets at the level of goals the solution must meet, and let each rejected alternative name the tenet it fails in a clause rather than re-arguing it. If you could delete the Tenets section and reconstruct it verbatim from the Alternatives, the two are too tightly coupled.

## Tenets must distinguish from each other

A tenet that overlaps in scope or argument with another tenet does not double the discrimination, it duplicates it. Read the tenet titles side by side: if a reader could conflate them, sharpen the framing so each covers a distinct dimension. Useful axes to split on include present versus future (one tenet about today's location, another about long-term ownership), location versus engagement (where the artifact lives versus how the team participates), or scope (qualifiers like "established" or "long-term" can pin a tenet to a specific category). If two tenets still read as the same argument after sharpening, drop one.

## Tenet format

**Match the tenet format to how much each tenet needs to say.** Two forms work; the length of the rationale decides between them.

Use an _ordered list_ when each tenet stays succinct: a bold short name, a full-sentence statement, and at most a sentence or two of rationale that still reads as a single compact unit. Numbering gives an at-a-glance count and a scannable structure the reader can return to.

```
1. **Short name.** Full-sentence tenet statement, plus at most a sentence of rationale.
2. **Short name.** ...
```

The list form holds only while the items stay short. A numbered list whose items each carry a multi-sentence rationale paragraph turns into walls of text nested under numbers: hard to read, and it indents awkwardly when the doc exports to Word. If you cannot state a tenet succinctly, that is the signal to switch forms, not to cram the rationale into the list item.

Use _bold-led paragraphs_ when each tenet needs a multi-sentence explanation: one paragraph per tenet, no numbering, the bold tenet name leading each. (Tenet headings are one of the carve-outs where a bold lead is correct; see the Paragraph leads section of `SKILL.md`.)

```
**Short name.** Full-sentence tenet statement. Rationale that explains the reasoning and names how the tenet applies to the options in scope, running across as many sentences as it genuinely needs.
```

Do not split the difference by pairing a one-line numbered item with a separate indented rationale paragraph under it. That hybrid is the exact form that reads as walls of text. Keep the whole tenet inside a succinct list item, or commit to bold-led paragraphs.

Give each tenet a short name in the bold headline (`Framework-based front door`, `One resource model`). The short name is what the reader parses when scanning and what the doc references later. Reference tenets by name in paragraph form ("the one-resource-model tenet", "this tenet"); reserve numbered references ("per T2") for the ordered-list form, and only when the doc actually needs to point back to a specific tenet.
