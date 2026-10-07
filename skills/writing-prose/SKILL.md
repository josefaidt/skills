---
name: writing-prose
description: Writing standards for prose and internal documents, covering any writing that is not code. Voice, sentence construction, punctuation, rhythm, openings, paragraph leads, comparison closures, headings, and GFM markdown, plus document structure for PRDs and for internal product and business docs. Use when the user asks to write, draft, or revise any prose, document, PRD, proposal, or analysis.
---

# Writing prose

Sentence-level and paragraph-level rules that apply to any writing, plus document structure loaded on demand for the doc type in hand. The rules below always apply. Read the matching reference file when the task has a document shape.

## Reference files

Reference files fall into three kinds. **Document structures** are whole doc types you compose top-to-bottom. **Components** are reusable structural pieces that more than one doc type pulls in. **Prose mechanics** are the always-relevant sentence- and markdown-level rules. A document structure names which components it composes; load the components it points to.

Document structures:

| File                         | Use when                                                                                                                                                                                            |
| :--------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `references/prd.md`          | Writing or revising a PRD (independent doc type): its own executive summary, customer problem, numbered user stories with acceptance criteria, behavioral clarifications, open decisions and/or FAQ |
| `references/business-doc.md` | Writing or revising an internal product or business doc (the substrate): base narrative structure and the executive-summary substance                                                               |
| `references/proposal.md`     | Writing a doc that evaluates multiple options and recommends one: extends `business-doc.md` with the tenets-and-options structure and marking                                                       |

Components (composed by the doc structures above):

| File                   | Use when                                                                                                                             |
| :--------------------- | :----------------------------------------------------------------------------------------------------------------------------------- |
| `references/tenets.md` | Writing the decision tenets that adjudicate a decision: definition, impostor taxonomy, discrimination test, format                   |
| `references/faqs.md`   | Writing an FAQ or open-questions section that frames the boundaries of a decision: question-led entries, answer discipline, ordering |

Prose mechanics:

| File                          | Use when                                                                                                                                                               |
| :---------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `references/anti-patterns.md` | Pre-write tripwire scan and post-write self-check for the most common prose failures (phrase patterns, em-dash use, banned words, comparison closures, heading shapes) |
| `references/markdown-gfm.md`  | Formatting markdown: fences, lists, headings, tables, emphasis, blockquotes                                                                                            |

## Sweeping and restructuring

Every anti-pattern in this skill is a _tell_, a construction that reads as AI-generated. Knowing the rules from memory doesn't defend against producing them, and this SKILL body is not the full catalog. `references/anti-patterns.md` holds the complete list, including tells the body only gestures at: topic-sentence rhythm across paragraphs, unbolded claim sentences standing in for labels, and colon-introduced elaboration used as a default. Reading the body is not a substitute for opening that file.

Sweep the tripwires before publishing, with `references/anti-patterns.md` open. Scan the draft against it section by section, resolve every tell fired (rewritten, or accepted with a documented reason), and confirm a final read-through fires no new tells. Between revisions the sweep is optional; before publishing it isn't. Sweeping mid-draft distracts from substance and produces mechanical, over-corrected prose.

The sweep is the author's own step, and delegating a review does not satisfy it. Run your own sweep first; the review pass below is the backstop. When you delegate that review to a subagent, name the tell classes in the prompt (paragraph rhythm and label-led leads, punctuation tells, banned words, comparison closures, headings), because a reviewer catches only what its instructions name.

When a tell fires, restructure the sentence or section rather than swapping one banned pattern for another. An em dash traded for a punchy colon, or a triad traded for an anaphora chain, is not a fix.

### Review pass

After running the sweep above, run a review pass (self-review, and optionally a delegated subagent review as a backstop). The review checks for structural issues, redundancy, and tone, not content accuracy. Only the author knows if the content is correct.

Review for:

1. **Redundancy between sections.** Flag any paragraph that restates earlier content without adding new information.
2. **Structural flow.** Does each section advance the argument, or just repeat the thesis?
3. **Tone.** Flag marketing language, hedging, or filler.
4. **Style compliance.** Run the anti-pattern tripwire scan from `references/anti-patterns.md`.
5. **Executive summary length.** Verify the executive summary meets the budget for the doc type and flag it if it does not. A PRD executive summary is one paragraph of three to five sentences (around 120 words) followed by requirement-direction bullets, with no second paragraph (see `prd.md`). A business or proposal executive summary is one paragraph of roughly 100-150 words with no lists (see `business-doc.md`). Report the sentence count (PRD) or word count (business) so the author can confirm.
6. **Revision coherence.** Flag information that one section presents without related sections accounting for it: a concept or term introduced in one place that the sections meant to develop or reference it do not, a detail that another section's logic should reflect but does not, or a claim that a preceding section contradicts or fails to set up. These indicate content added in isolation during a revision rather than integrated across the document.
7. **Paragraph rhythm and leads.** Flag any run of three or more paragraphs that open with a short claim sentence followed by supporting detail (the topic-sentence metronome), and any paragraph whose first sentence functions as an unbolded label. Rewrite to weave claim and evidence into one thought, or vary the opening. Pros and cons paragraphs are the exception, since their leads are intentionally topic-first.

Skip the review for minor edits (typo fixes, date updates) and for changes the user has already reviewed and approved.

## Revising a document

When new information comes to light during a revision (a decision, a reframing, a fact), integrate it across the whole document, not into one section in isolation. Adding a claim to one section while the sections that should set it up, reference it, or follow from it stay unchanged leaves the document internally inconsistent, and the new content reads as an orphan the surrounding prose does not account for.

Before finalizing a revision, trace the new information through the document. Does an earlier section need to introduce it? Does a later section need to reflect it? Does any existing claim now contradict it? Put each piece at the altitude its section calls for, with a high-level framing in the summary, the mechanism in the body, and the open question in the open-decisions or FAQ section, rather than stacking every facet into the section you happened to be editing. Revising the surrounding content to account for new information is part of the edit, not optional cleanup.

This is the authoring habit. The revision-coherence check in the review pass is the backstop.

## Version supersession

When creating a superseding revision of a document (v2 revising v1, v3 revising v2), treat the prior version as source material to bring forward, not as an authoritative companion doc.

- **Do not cite prior versions in body prose.** Body prose is the current position. Phrases like "as v2 described," "v2 covered this," or "the pattern captured in v2" treat the prior version as an external authority. It is not, because the current version supersedes it. Adopt the claim as the current version's own, or update it, or drop it. Do not attribute it to v2.
- **Cite prior versions only in frontmatter references and the reference-documents appendix.** The frontmatter `references` block and any bibliography-style appendix are the correct place to name prior versions, typically alongside a brief note on what content those versions carry (often detail cut from the current version).

Common failure modes:

- **v2 as a source of authority.** "The proposed answer is the primitive that v2 described in §4.3" — the current version is now the authoritative source for that proposal.
- **v2 as a source of detail.** "As v2 covered..." followed by a summary of the v2 content. If the detail matters, include it in the current version. If it doesn't, drop the reference.
- **v2 as a source of evidence.** "The signal captured in v2..." — the underlying evidence (interviews, support tickets, GitHub issues) is the actual source. Cite it directly rather than routing through v2.

## Verify inherited claims

Before finalizing any document that pulls forward content from a prior source (a prior version, another team's memo, an earlier draft), re-verify each factual claim against current context. Claims that were accurate when originally written can go stale between revisions.

Four categories to check every time:

1. **Time references.** Compare inherited dates, quarters, and launch windows against the current calendar. A "launching Q2 2026" claim carried forward when the current date is already in Q3 2026 is either stale or refers to something that has already happened.
2. **Audience and persona.** Compare inherited audience or persona definitions against the project's current persona or spec sources. Phrasings that narrow the audience to a specific list, or that add or drop specific competitors or tools, are often stale.
3. **Product scope.** Compare inherited product or scope claims against the current spec and any customer-facing docs. Capabilities, supported integrations, feature lists, and roadmap positions all shift over time.
4. **Roadmap and delivery.** Compare inherited roadmap and delivery-ownership claims against the current planning source (a roadmap, a status review, or updated planning docs).

Do not treat inherited claims as verified simply because they appeared in a prior source. The prior source was correct at its own writing; the current context may have moved. Verifying is a pre-finalize step, not an "if time permits" step.

## Voice and stance

- Active voice. Never passive. "The CLI creates the resource" not "the resource is created by the CLI."
- Present tense throughout. "The command exits with code 1" not "the command will exit with code 1."
- Second person ("you") for reader-facing content. Third person for describing system behavior.
- State positions directly. No hedging ("we believe", "it seems", "arguably", "it could be said").
- No apologies or softeners ("unfortunately", "please note that", "it should be noted").
- Frame product or platform work in audience-experience terms, not implementation terms. The reader doesn't see internal layers; they see what they ship and what they get. If a sentence describes the product's job in terms of the internal component it runs on, rewrite to describe what the audience experiences. Implementation context belongs in implementation sections.
  - Avoid: "The product's job is to make streaming straightforward to ship on the internal compute layer."
  - Prefer: "The product's job is to make streaming work by default for customers."

## Rhetorical patterns to avoid

These constructions read as polished prose but function as AI-generated tells. Rewrite them as direct claims.

### "Not X, it's Y" and its variants

The pattern sets up a contradiction the reader did not raise, then pivots to the writer's preferred framing. It sounds assertive but substitutes rhetorical contrast for evidence. Disguised forms include "X does not eliminate Y — it shifts Y's shape" and "closed source doesn't reduce cost, it just changes where the cost lands." Any construction that negates a claim no one made and pivots to an alternative belongs in this category.

State the positive claim on its own terms. If the contrast is load-bearing, build it into a sentence that stands up without the pivot, or move the comparison into the section where it is genuinely being argued rather than pre-empting it in a definition or principle.

- Avoid: "It's not about speed — it's about correctness."
- Prefer: "Correctness matters more than speed."
- Avoid: "Closed source does not eliminate security work; it shifts its shape."
- Prefer: "Closed source still requires disclosure handling, vulnerability scanning, and patch cadence."

### "The X is real, [here's why]"

The construction claims credibility for X before establishing it, then lists supporting points. Drop the preamble. State the reason directly and let the evidence do the work of making the claim credible.

- Avoid: "The risk is real: agentic PR volume is growing."
- Prefer: "Agentic PR volume on comparable repositories grew from X to Y over the last two years."

## Openings

Say what the thing is before what it does. State the category in the first sentence and the practical job in the second. Applies to documents, section leads, and product intros.

- Avoid: "The product hosts frontend and fullstack projects with preview environments per branch."
- Prefer: "The product is a hosting platform for frontend and fullstack projects. Each branch gets a preview environment."

Forms that don't count as identity sentences: headless fragments ("A hosting platform for..."), buried identity (opening with an imperative benefit and stating the category three screens down), and pseudo-identity ("is designed to be the layer between X and Y" states purpose, not category).

## Sentence construction

### Product documents

Product docs use short, declarative sentences. Each sentence states one fact or one behavior. This makes specs scannable and unambiguous.

Good:

> The CLI prints the deployment URL and exits. The build continues service-side.

Bad:

> The CLI prints the deployment URL and exits, and then the build continues service-side in the background.

### Business documents

Business docs use longer, flowing sentences that connect related ideas with commas and subordinate clauses. Avoid choppy construction where every sentence is the same length and structure. Blend related ideas into compound sentences so the prose reads as an argument, not a list of facts.

Good:

> The product competes with three incumbents, each of which treats documentation as a product surface rather than a support artifact.

Bad:

> The product competes with the first incumbent. It also competes with the second. It also competes with the third. Each of these treats documentation as a product surface.

### Rhythm

Vary sentence length. A paragraph of identically-structured sentences reads like a bulleted list without bullets. Follow a long sentence with a short one. Use a short sentence for emphasis after building context.

Good:

> The cold start adds ~362ms of startup latency for every command. This is the bar the tool must clear.

## Punctuation

Em dashes and semicolons are tells when they appear more than occasionally. Both have legitimate uses. Use them sparingly, with intent, and only when necessary. See `references/anti-patterns.md` for concrete Avoid/Prefer rewrites.

- **Em dashes.** Most uses can be rewritten as a comma, parenthesis, sentence break, or "such as" phrase. If you reach for one, ask whether the sentence works without it. When removing an em dash leaves a choppy fragment, fix the rhythm rather than accept the fragment (blend the clauses with a conjunction or relative clause, or keep the em dash if the alternative is genuinely worse).
  - Avoid: "The decision shapes the timeline. Resolution before the deadline."
  - Prefer: "The decision shapes the timeline, and must be resolved before the deadline."
- **Em-dash-wrapped lists.** Don't use em dashes to wrap a list inserted into a sentence. Blend with "such as" or "including" instead. The wrapper is one of the strongest tells.
  - Avoid: "Every library — the first, the second, the third — publishes its source."
  - Prefer: "Libraries such as the first, second, and third publish their source."
- **Em-dash carve-outs.** Em dashes are acceptable in definition-style list items in appendices (e.g., "**Closed-source safe** — whether shipping this as closed source is technically and practically viable"). They are not acceptable in narrative paragraphs. Write the character itself (`—`) where one is warranted. Do not substitute a double hyphen (`--`), which GFM renders literally as two hyphens.
- **Semicolons.** Work when joining two closely related independent clauses where the second elaborates, contrasts, or completes the first, and the prose flows better than with a sentence break. Prefer separate sentences when the ideas could stand alone.
  - Acceptable: "The choice does not change whether developers can deploy; it shapes the perception developers have of the provider before they try."
  - Avoid: "The build is fast; cold starts are rare." (two unrelated facts; use separate sentences)
- Oxford comma always.
- Periods inside quotation marks only when quoting a complete sentence. Otherwise outside.
- When listing reasons or rationales, use a numbered list (`1.`, `2.`, `3.`) rather than unordered bullets. Reasons have an implicit order of presentation that bullets obscure, and numbering lets later text refer to "reason 2" or "the third reason" without ambiguity.
- Avoid back-to-back colon-introduced lists. After a sentence ending in a colon followed by a list, the next sentence or paragraph should not also use the same construction. The cumulative effect reads as choppy enumeration rather than prose.

## Word choice

- Concrete over abstract. Specific numbers, specific commands, specific examples.
- Plain words over inflated ones: "use" not "utilize", "show" not "demonstrate", "start" not "commence".
- State claims directly. Each intensifier or filler word must earn its slot.
- See the Banned words section of `references/anti-patterns.md` for the marketing-language, filler-word, empty-intensifier, and inflated-vocabulary scan lists.

## Terminology

- Use consistent terms throughout a document (pick one and stick with it).
- Prefer specific product or service names over generic descriptions when the specificity is load-bearing.
- Pick one term for the audience (for example, "developer" or "customer") and use it consistently. Do not alternate between "user", "developer", and "customer" for the same group.

## Introducing specialized terms

When introducing a non-obvious term in prose, anchor it with an inline definition or comparison the reader recognizes. The reader shouldn't have to wait for a later section or click a cross-reference to know what the term refers to.

The definition is short: a parenthetical, a "such as" phrase, or a brief comparison to a familiar reference point. It does not replace deeper coverage later in the doc; it just gives the first-use reader enough to keep going.

- Avoid: "Customers expect a managed primitive for live data and 1:M fan-out."
- Prefer: "Customers expect a managed primitive (a single hosted building block, like Cloudflare Durable Objects or Firebase Realtime) for live data and 1:M fan-out."

Once a concept has a name, refer to it by that name, not by the section that defines it. Phrasings like "the §4.3 primitive" or "the section 6 commitment" treat a section number as the concept's identifier, which reads as shorthand and couples the prose to the document structure. Use the concept's name; put the cross-reference in parens or alongside.

- Avoid: "The §4.3 primitive serves bidirectional gRPC..."
- Prefer: "The managed real-time primitive (proposed in §4.3) serves bidirectional gRPC..."

## Evidence and claims

- Quantitative claims require a specific source. "55% work primarily in AI-enabled IDEs (see [Survey](url))" not "most developers use AI tools."
- Cite inline with parenthetical format: `(see [Source Name](url))`.
- When referencing internal documents, use the document title as link text.
- Do not round numbers to sound impressive. Use the actual figure.
- If a claim cannot be sourced, rewrite it as an observation or remove it.

## Paragraphs

- Each paragraph advances one idea. If you're making two points, use two paragraphs.
- Opening sentence states the point. Remaining sentences support it with evidence or specifics.
- No paragraph should restate the thesis of the document. State it once in the intro, then move forward.
- Transitions between paragraphs should be implicit in the logical flow, not explicit connectors ("Furthermore", "Additionally", "Moreover", "In addition").

## Paragraph leads

The first sentence of each paragraph should carry the point through prose, not through a bolded label above it. A reader who skims should understand what the paragraph argues from the first sentence alone.

Bolded labels are appropriate for:

1. Tenet headings — the tenet itself is a labeled principle, and the bold marks it as such.
2. Named callouts in business documents — single-line asides like **Staffing.** above an otherwise unrelated paragraph.
3. Definition-style list items in appendices — for example, **Closed-source safe** — whether...

Bolded labels are not appropriate for pros and cons paragraphs in proposal sections, or for argumentative paragraphs in any narrative section. If a paragraph is leaning on a label to convey what it argues, rewrite the opening sentence to carry the topic explicitly.

- Avoid: "**Trust.** The plugin runs inside every user's process..."
- Prefer: "Open source builds trust because users can audit what runs inside their process. The plugin loads in-process on every invocation..."
- Avoid: "**Bounded maintenance.** Inbound issues arrive only through internal channels..."
- Prefer: "Closed source bounds the code-contribution surface. External code review, community PR review, and agentic PR volume do not arise..."

A useful test: read only the first sentence of each pros/cons paragraph in sequence. If you cannot tell which option each is about and what each is arguing, the leads are still label-led.

## Cut content, not just words

A paragraph can pass every sentence-level rule and still read as generated when it fills every argumentative slot (limitation, objection, fix, result, caveat, confidence) with one sentence per slot. The fix is deletion. Merge points, drop the weakest one, and leave an inferential step for the reader. A detail that appears elsewhere in the document doesn't need to appear again.

## Comparison closures

When closing a paragraph that contrasts two options, the closure must be defensible on its own terms. A common failure mode is overclaim — closing with "X has no equivalent path", "Y is unavailable", or any sentence that asserts an absolute absence the writer cannot fully defend.

Test each comparison closure against this question: would the writer defend it under cross-examination? If the answer involves "well, it's harder, not impossible" or "in practice, but technically not always," the closure is overclaiming. Rewrite as a softer claim ("limited", "harder", "no comparable") or drop the closure and let the prior sentences carry the contrast on their own.

- Avoid: "Closed source has no equivalent path."
- Avoid: "The alternative approaches have no handoff path under closed source."
- Prefer: "Closed source has no comparable visibility in those surfaces."
- Prefer: (drop the closure entirely; the paragraph's earlier sentences already make the comparison)

## Headings

Headings are noun-phrase labels, not sentences. Use sentence case: capitalize the first word, proper nouns, and coined terms; lowercase the rest. Drop reflexive "The" prefixes on labels. See the heading tripwires in `references/anti-patterns.md` for the banned shapes (slogans, comma couplets, imperative frames, rhetorical-frame chains, manual numbering) with rewrites.

Document titles are the exception. A document's H1 and its frontmatter `title` may use Title Case, and a document's proper title keeps that capitalization wherever it is cited (for example, a PRD titled "Deployment Safety PRD" keeps its Title Case name in references and links). The sentence-case rule governs section headings, H2 and below.

Exception: a heading may be a full sentence when the sentence is a load-bearing claim the section exists to defend. Use rarely; two in a row almost never earn it.

After drafting, read the section headings as a flat list. If some are labels and some are slogans, rewrite the outliers.

## Lists vs prose

- Use numbered lists for sequential steps or ranked items.
- Use bullet lists for unordered options or properties.
- Do not use bullet lists as a substitute for writing prose. If the items form an argument, write them as a paragraph. If they're discrete facts, a list is fine.
- List items should be parallel in grammatical structure.

When a single paragraph is prefaced with a count (`three concrete workflows`, `two features`) and its items run inline as sentences within that paragraph, prefix each item's opening sentence with `N/` so the reader can track the enumeration. Continuation sentences within a single item stay unprefixed. This grounds the count from the preface in the body and marks the boundary between items so the reader can scan them.

- Avoid: `The absence hits three concrete workflows. A developer who... A production team... A developer who...`
- Prefer: `The absence hits three concrete workflows. 1/ A developer who... 2/ A production team... 3/ A developer who...`

`N/` is an inline device only and never stands in for a markdown list. When items sit on their own lines or in their own paragraphs, they are a list: use a GFM ordered list (`1.`, `2.`, `3.`) when order or reference matters, and a bulleted list (`-`) otherwise. Never begin a line or paragraph with `N/`.

- Avoid: a `## Changes` section of separate paragraphs that open `1/ ...`, `2/ ...`, `3/ ...`
- Prefer: the same items as a GFM ordered list, `1. ...`, `2. ...`, `3. ...`

## Code references in prose

- Use inline code for commands, flags, file names, environment variables, and values: `deploy`, `--env`, `config.jsonc`, `CI=true`.
- Do not use inline code for concepts or product names: write the product name in plain text, "preview environment" not "`preview` environment" (unless referring to the literal string value).

## Changelogs

Some documents are published as versioned files, meaning stakeholders have them open and reference specific content. For these documents, maintain a `## Changelog` section at the bottom (after References, if present) so readers can see what changed between versions.

Add a changelog when the document has already been shared with stakeholders **and** the user requests it or the revision is substantive enough that someone reading the previous version would need to know what changed. Do not add a changelog to documents that haven't been shared yet. It's noise until someone else is reading the doc.

```markdown
## Changelog

### YYYY-MM-DD

#### Added

- New section, user story, command, or concept

#### Changed

- Modified behavior, updated wording, revised priority

#### Removed

- Deleted section, deprecated flag, removed option
```

Group entries under Added/Changed/Removed (omit empty groups). Reference the specific section or story number when possible.

Entry style:

- One line per change. No multi-sentence entries. Enough for a reader to decide whether to re-read the section.
- Start with the entity or scope: "`integration create`: clarified two-path behavior"
- Use past tense in changelogs (exception to the present-tense rule): "Added", "Changed", "Removed".
- No periods at the end of changelog entries.

When revising a document that already has a changelog, append a new date heading for the current session's changes and leave previous entries alone. If multiple revisions happen on the same date, combine them under one heading.
