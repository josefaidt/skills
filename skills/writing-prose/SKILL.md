---
name: writing-prose
description: Writing standards for prose and internal documents, covering any writing that is not code. Voice, sentence construction, punctuation, paragraph leads, headings, identifiers a reader has not seen, stating the current position, and GFM markdown, plus document structure for PRDs, proposals, and internal product and business docs. Use whenever you write or revise prose a person will read, whether the user asked for it or it is part of other work, such as a document, PRD, proposal, analysis, README, issue or pull request body, or the report that ends a task.
---

# Writing prose

Write so a reader follows the argument in one pass, in the voice of a person who knows the subject. The rules below hold for any prose. When the work has a document shape, load the reference file for it.

## Reference files

| File                                                       | Load when                                                                                   |
| :--------------------------------------------------------- | :------------------------------------------------------------------------------------------ |
| [references/anti-patterns.md](references/anti-patterns.md) | Sweeping a draft before you publish it. The full catalog of tells, each with a rewrite      |
| [references/markdown-gfm.md](references/markdown-gfm.md)   | Formatting markdown: fences, lists, headings, tables, emphasis                              |
| [references/revising.md](references/revising.md)           | Revising a shared document, writing a new version of one, moving content in, or a changelog |
| [references/prd.md](references/prd.md)                     | Writing or revising a PRD                                                                   |
| [references/business-doc.md](references/business-doc.md)   | Writing an internal product or business document                                            |
| [references/proposal.md](references/proposal.md)           | Writing a document that weighs options and recommends one, on top of `business-doc.md`      |
| [references/tenets.md](references/tenets.md)               | Writing the tenets that decide between options                                              |
| [references/faqs.md](references/faqs.md)                   | Writing an FAQ or an open-questions section                                                 |

## Rules

| Rule                        | Summary                                                                                                                                                                                                                               |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Voice                       | Active voice and present tense. "You" for the reader, third person for the system. State positions without hedges ("we believe", "arguably") or softeners ("please note", "unfortunately").                                           |
| The reader's terms          | Describe what the audience ships and gets, not the internal layer it runs on. Implementation belongs in implementation sections.                                                                                                      |
| Openings                    | Say what a thing is before what it does: the category first, the job second. A fragment ("A hosting platform for…") or a statement of purpose is not an identity sentence.                                                            |
| Sentence length             | Product docs use short sentences that each state one fact. Business docs use longer sentences that connect ideas into an argument. Either way, vary the length so a paragraph does not read as a list without bullets.                |
| Paragraph leads             | One idea per paragraph, and the first sentence carries it. A bold label doing that job is a tell, except on a tenet, a one-line callout, or an appendix definition. Transitions come from the logic, not "Furthermore".               |
| Cut content, not just words | A paragraph that fills every slot (limitation, objection, fix, result, caveat) reads as generated. Merge points, drop the weakest, and leave the reader a step to infer. Say a thing once per document.                               |
| Plain, concrete words       | "Use", not "utilize". Real numbers, commands, and examples over abstractions. Every intensifier earns its place or goes.                                                                                                              |
| One term per thing          | Pick one name for each concept and for the audience, and keep it. Refer to a concept by its name, never by its section number.                                                                                                        |
| Define on first use         | Anchor a term the reader may not know with a parenthetical or a familiar comparison. Put a few words beside any ID, task label, or ticket number the reader has not seen, as in "CLIENT-007 (the recovery link on the first screen)". |
| Evidence                    | A number needs a source, cited inline as `(see [Source](url))`. Use the real figure, not a rounded one. A claim you cannot source becomes an observation or goes.                                                                     |
| Defensible closures         | A closing contrast must survive cross-examination. "X has no equivalent" usually means "X is harder", so say that or drop the closure.                                                                                                |
| Lists vs prose              | Numbered lists for steps, ranks, and reasons; bullets for unordered facts. Items that form an argument are a paragraph. Inside a running paragraph that announces a count, mark each item `1/`, `2/`; never start a line with one.    |
| Punctuation                 | Em dashes and semicolons are rare and deliberate. Oxford comma always. A period goes inside quotes only when quoting a full sentence.                                                                                                 |
| Headings                    | Noun-phrase labels in sentence case, no leading "The", no manual numbers. A document's title may use Title Case. Read the headings as a flat list and fix the outliers.                                                               |
| Code in prose               | Inline code for commands, flags, files, variables, and literal values. Concepts and product names stay plain text.                                                                                                                    |
| The current position        | Write what is true now, as if fresh. Leave out who decided it and when, and never quote a chat as support. An ADR keeps its context, since recording the decision is its job.                                                         |

## Known tells

These read as polished but mark text as generated. Each has a fuller entry in `references/anti-patterns.md`. When one fires, restructure the sentence; trading an em dash for a colon, or a triad for an anaphora chain, is the same tell in a new coat.

- **Negate-and-pivot.** "It's not about speed, it's about correctness" argues against a claim nobody made. Write "Correctness matters more than speed."
- **Vouching preambles.** "The risk is real:", "The honest answer is", "This matters." Drop the preamble and let the evidence carry the weight.
- **Em-dash-wrapped lists.** "Every library — A, B, C — ships its source" becomes "Libraries such as A, B, and C ship their source."
- **Colon as the default elaboration.** "The scope is broader: one command for any language" becomes "The scope is broader, with one command for any language." Save colons for real lists.
- **Metronome paragraphs.** Three paragraphs in a row that open with a short claim and trail evidence. Lead some with the evidence, or open with a longer sentence.
- **Labeled-bullet walls.** A run of `- **Term** — gloss` bullets in an argument. Write the connecting prose, or move the list to an appendix.
- **Compulsive triads and stacked negations.** "Fast, simple, and reliable" in every sentence, or "No config, no build, no registry." Vary the count or say it once plainly.
- **Aphorism closers.** "That is why X matters" restates the paragraph as a principle. Delete it.
- **Decorative metaphor.** "A slim slice", "hardens into a reason to leave." Write the plain claim.

## Before you publish

1. **Sweep.** With `references/anti-patterns.md` open, scan the draft section by section, fix each tell or keep it for a stated reason, and read once more to check the fixes made no new ones. Sweeping mid-draft pulls attention off substance, so do it once the content settles.
2. **Review.** Read for redundancy between sections, whether each section advances the argument, tone, and paragraph rhythm. Check the executive summary against its budget in the document's reference file, and check that anything a revision added is set up and followed through everywhere it touches.
3. **Delegate only as a backstop.** A reviewer catches only what its prompt names, so when the user asks for a subagent review, name the tell classes: paragraph leads and rhythm, punctuation, banned words, closures, and headings.

Skip both for a typo fix, a date change, or text the user has already approved.
