---
name: writing-prose
description: Writing standards for prose and documents, covering any writing that is not code. Core rules, sentences, unambiguous Global English, paragraphs, headings, and punctuation, then the structure for each kind of document, from tutorials, how-tos, reference, and explanation to PRDs, proposals, and briefings such as pull request bodies, commit messages, and issue replies. Use whenever you write or revise prose a person will read, whether the user asked for it or it is part of other work, such as a document, PRD, README, issue or pull request body, comment reply, or the report that ends a task.
---

# Writing prose

Write so a tired reader understands on the first read, in the voice of a person who knows the subject. Each section below builds on the one before it. The core rules hold everywhere, the next layers sharpen sentences and paragraphs, and the kind of document adds its own structure on top.

## Core rules

- Cut every word that does no work.
- Use the short, everyday word: "use", not "utilize".
- Use the words a person would say out loud. Don't invent jargon, and say what a named pattern means the first time it appears.
- Write the real name of a file, command, flag, or symbol, not a description of it.
- Be specific: "a column rename fails the build", not "schema changes can cause issues".
- Write what is true now. Leave out who decided it and when, and never quote a chat as support.
- When a rule makes a sentence worse, fix the sentence another way or leave it alone.

## Sentences

- Use active voice and present tense. Say who does what. Passive voice is fine only when the actor is unknown or beside the point.
- Address the reader as "you", and describe the system in the third person.
- State positions directly, without hedges ("we believe", "arguably") or softeners ("please note", "unfortunately").
- Describe what the reader ships and gets, not the internal layer it runs on.
- Say what a thing is before what it does: the category first, the job second.
- Write instructions as commands, one per sentence. Put a condition or warning before the step it guards, and the common case first. Never write "simply", "easy", or "quickly" in a procedure.
- Fit the length to the document. Instructions and reference use short sentences that each carry one fact. Proposals and analyses use longer sentences that connect ideas into an argument. Either way, vary the length so a paragraph does not read as a list without bullets.
- Call each thing by one name everywhere, and use one name for the audience.
- Put a few words beside any ID, ticket number, or label the reader has not seen, as in "CLIENT-007 (the recovery link on the first screen)".
- Give every number a source, cited inline, and use the real figure, not a rounded one.

## Unambiguous sentences

Many readers read in a second language or through a translator. Leave no sentence open to two readings.

- Keep "only" and "not" next to the word they change: "the check runs only on `main`", not "the check only runs on `main`".
- Make every "it", "they", and "this" point at one obvious thing. Never use "this" or "which" to point at a whole clause.
- Break up long noun strings: "the timeout for a refresh token request", not "the refresh token request timeout".
- Keep "that" and the other small words that show structure, and never drop a verb.
- Say what "and" or "or" joins, and repeat the article in a series when it prevents a misread.
- Write no slashes and no "(s)". Make text in parentheses a full grammatical unit.
- Skip idioms, metaphors, and Latin abbreviations such as "e.g.", "i.e.", and "etc.".

## Paragraphs and structure

- **Paragraph leads.** One idea per paragraph, and the first sentence carries it. A bold label doing that job is a tell, except on a tenet, a one-line callout, or an appendix definition. Transitions come from the logic, not "Furthermore".
- **Cut content, not just words.** A paragraph that fills every slot (limitation, objection, fix, result, caveat) reads as generated. Merge points, drop the weakest, and say a thing once per document.
- **Closures.** A closing contrast must survive cross-examination. "X has no equivalent" usually means "X is harder", so say that or drop it.
- **Lists vs prose.** Numbered lists for steps, ranks, and reasons; bullets for unordered facts. Introduce a list with a full sentence and keep its items parallel. Items that form an argument are a paragraph. Inside a running paragraph that announces a count, mark each item `1/`, `2/`, and never start a line with one.
- **Headings.** Noun-phrase labels in sentence case, with no leading "The", no manual numbers, and no claim or slogan. One H1, which may use Title Case, and no skipped levels.
- **Punctuation.** Em dashes and semicolons are rare and deliberate. Oxford comma always. A period goes inside quotes only when quoting a full sentence.
- **Code and links.** Code font for commands, flags, files, variables, and literal values; plain text for concepts and product names. Link text says where the link goes.

## Kinds of document

Pick the kind before writing, and keep one document to one kind. Split and link rather than mixing them.

| Kind                                     | Reader wants                                                                     | Load                                                                                                                 |
| :--------------------------------------- | :------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| Tutorial, how-to, reference, explanation | To learn, to reach a goal, to look up a fact, or to understand why               | [references/developer-docs.md](references/developer-docs.md)                                                         |
| Briefing                                 | To act on a pull request, commit, issue, reply, or task report in under a minute | [references/briefings.md](references/briefings.md)                                                                   |
| PRD                                      | What a feature must do, for whom, and how to tell it is done                     | [references/prd.md](references/prd.md)                                                                               |
| Business document                        | A product or business analysis for stakeholders                                  | [references/business-doc.md](references/business-doc.md)                                                             |
| Proposal                                 | Options weighed against tenets, and a recommendation                             | [references/proposal.md](references/proposal.md), with [tenets](references/tenets.md) and [FAQs](references/faqs.md) |

[references/revising.md](references/revising.md) covers revising a shared document, writing a new version, moving content in, and changelogs. [references/markdown-gfm.md](references/markdown-gfm.md) covers markdown formatting.

## Known tells

These read as polished but mark text as generated. Each has a fuller entry in [references/anti-patterns.md](references/anti-patterns.md). When one fires, restructure the sentence rather than trade it for another tell.

- **Negate-and-pivot.** "It's not about speed, it's about correctness" argues against a claim nobody made. Write "Correctness matters more than speed."
- **Vouching preambles.** "The risk is real:", "The honest answer is", "This matters." Let the evidence carry the weight.
- **Em-dash-wrapped lists.** "Every library — A, B, C — ships its source" becomes "Libraries such as A, B, and C ship their source."
- **Colon as the default elaboration.** "The scope is broader: one command for any language" becomes "The scope is broader, with one command for any language."
- **Metronome paragraphs.** Paragraph after paragraph that opens with a short claim and trails evidence.
- **Labeled-bullet walls.** A run of `- **Term** — gloss` bullets standing in for an argument.
- **Triads, stacked negations, and aphorism closers.** "Fast, simple, and reliable" in every sentence, "No config, no build, no registry", or "That is why X matters."
- **Decorative metaphor.** "A slim slice", "hardens into a reason to leave."

## Before you publish

1. **Sweep.** With `references/anti-patterns.md` open, scan the draft section by section, fix each tell or keep it for a stated reason, and read once more for new ones. Sweep once the content settles, not mid-draft.
2. **Review.** Read for redundancy between sections, whether each section advances the point, tone, and rhythm. Check any budget the document's reference file sets, and that anything a revision added is set up and followed through everywhere it touches.
3. **Delegate only as a backstop.** A reviewer catches only what its prompt names, so name the tell classes when the user asks for one.

Skip both for a typo fix, a date change, or text the user has already approved.
