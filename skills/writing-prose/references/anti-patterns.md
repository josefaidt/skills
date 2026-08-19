# Anti-pattern tripwire

Quick reference for prose-writing. Pull this before drafting and cross-check before declaring a section done. Full reasoning in `SKILL.md` under "Rhetorical patterns to avoid," "Openings," "Punctuation," "Word choice," "Paragraph leads," "Cut content, not just words," "Comparison closures," and "Headings."

This file is optimized for a fast scan, not for explanation. If a tripwire fires and the rationale is unclear, open the corresponding section of `SKILL.md`.

Examples throughout are illustrative and domain-neutral. Match the construction, not the subject matter.

## Phrase patterns

| Tripwire                                                                                                                                                                                                 | Rewrite to                                                                                                                                                                                                                                                                             |
| :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `X is real, [reason]`                                                                                                                                                                                    | Drop the preamble. State the reason directly.                                                                                                                                                                                                                                          |
| `Not X, it's Y` / `X, not Y`                                                                                                                                                                             | Drop the negation. State the positive claim.                                                                                                                                                                                                                                           |
| Paragraph prefaced with a count (`three concrete workflows`, `two features`) but items not numbered inline                                                                                               | Prefix each item's opening sentence with `N/`. Continuation sentences within a single item stay unprefixed.                                                                                                                                                                            |
| `X — Y, Z, W — V` (em-dash-wrapped list inside a sentence)                                                                                                                                               | Use parens, or blend with "such as" or "including".                                                                                                                                                                                                                                    |
| `commits X to a longer arc` / `commits X to a longer vision`                                                                                                                                             | Quote the source. Drop the dramatic frame.                                                                                                                                                                                                                                             |
| `This document resolves X` / `The doc proposes X`                                                                                                                                                        | Drop meta-commentary. State the position.                                                                                                                                                                                                                                              |
| `we believe` / `it seems` / `arguably` / `it could be said`                                                                                                                                              | State the claim directly.                                                                                                                                                                                                                                                              |
| `Furthermore` / `Additionally` / `Moreover` / `In addition`                                                                                                                                              | Drop. Transition is implicit.                                                                                                                                                                                                                                                          |
| `unfortunately` / `please note that` / `it should be noted`                                                                                                                                              | Drop. Apologies and softeners are not needed.                                                                                                                                                                                                                                          |
| `highly` / `extremely` / `incredibly` / `really` / `just` / `simply` / `basically` / `actually` / `quite`                                                                                                | Drop. Intensifiers and filler.                                                                                                                                                                                                                                                         |
| `the headline is X` / `headline interest` / `more nuanced than the headline` (vague abstract noun)                                                                                                       | Name the specific data point or claim.                                                                                                                                                                                                                                                 |
| `the size of X does not justify Y` / `X is large enough to Y` (abstract-noun-plus-abstract-verb closer)                                                                                                  | Replace with a concrete claim. Say what is actually true, such as "not enough people have asked for it to justify the work."                                                                                                                                                           |
| Choppy adjacent sentence pair sharing a contrast or parallel (e.g. `Users leave because the tool outgrew its scope. The tool continues to serve the cases that fit.`)                                    | Join with a conjunction (`while`, `even as`, `because`, `although`) when the relationship is paired observation. Use the break only when emphasis demands it.                                                                                                                          |
| Choppy two-sentence answer to a question or setup (e.g. `A reasonable question is X. The answer is Y.`)                                                                                                  | Blend with a conjunction or relative clause. The split usually means the writer wanted an em dash and split the sentence to avoid it. The em dash was the warning, not the split. The underlying construction needs to flow as one thought.                                            |
| Spelled-out percent in body prose (e.g. `48 percent`, `79 percent`)                                                                                                                                      | Use the `%` symbol (e.g. `48%`, `79%`) for specific numerical percentages in body prose. Words are acceptable for narrative magnitudes ("over half," "two thirds"), not for specific data points.                                                                                      |
| `X would inherit Y` / `inherits from Y` / `descends from` / `evolves from` (when X and Y are independent projects with no fork, code-extension, or team-continuation relationship)                       | Use `provide`, `match`, `model on`, `ship the same`, or `share` instead. "Inherit" and its cousins imply parent-child, fork, or extension. When the projects are independent designs offering comparable capabilities, the verb overstates the relationship.                           |
| `long-lived process` / `long-lived service` (when the process can be torn down at any time)                                                                                                              | Drop the qualifier or replace with the precise property: `process`, `continuous HTTP server`, or whatever the actual execution model is. "Long-lived" implies persistence the system does not guarantee.                                                                               |
| `available as an escape hatch to anyone who reaches for it` / `users can reach for X` (implying a capability is reachable when the interface does not expose it)                                         | State what the interface actually does. If it does not accept the input, emit the artifact, or document the path, say so. "Not reachable until X ships" is an honest framing.                                                                                                          |
| `The X matters` / `The Y is important` / `The N shape matters` (bridge sentence asserting significance between an intro and its consequences)                                                            | Drop the bridge. Weave "why it matters" into the preceding sentence, or let the following sentences carry the significance on their own. Assertions of significance are not substitutes for significance.                                                                              |
| `The honest answer` / `honestly` / `to be honest` (the word `honest` as a rhetorical loader)                                                                                                             | Drop `honest`. State the claim directly. `Honest` reads as an AI-generated tell. It does rhetorical work without adding information, and its presence usually signals a claim the writer felt needed extra vouching.                                                                   |
| `X compounds Y` / `X hardens into Y` / `X sharpens into Y` / `X crystallizes into Y` (metaphorical verb applied to an abstract noun)                                                                     | State the plain claim. `Latency compounds the mismatch` becomes `Latency is a second problem` or a plain follow-on sentence. Metaphorical verbs treating abstract nouns as if they had physical properties (`compounds`, `hardens`, `sharpens`, `crystallizes`) are decorative filler. |
| `a slim slice` / `a narrow band` / `hardens into a defection reason` / `the horizon we care about` (decorative nominal descriptor for a plain claim)                                                     | Use the plain claim. `A slim slice` becomes `a small share` or `niche`. `Hardens into a defection reason` becomes `will drive users away`. `The horizon we care about` becomes `the timeframe the team is planning for`.                                                               |
| Compulsive triad — three parallel items in sentence after sentence (`X, Y, and Z. A, B, and C. M, N, and O.`)                                                                                            | Vary list length. Use pairs, quartets, or a full sentence. If a paragraph runs three back-to-back triads, rewrite most as prose.                                                                                                                                                       |
| Repeated-negation stack — three or more parallel negations in a row (`No config file, no build step, no plugin registry`)                                                                                | Fold into one plain sentence saying the same thing (`You skip the setup entirely`).                                                                                                                                                                                                    |
| Verbless fragment doing a sentence's job (`Actively developed. Ships weekly.`)                                                                                                                           | Give the fragment a subject and verb, or fold it into an adjoining sentence (`Development is active, with releases most weeks`).                                                                                                                                                       |
| Aphorism closer — the final sentence promotes the paragraph's specific point into a universal principle (`That is the argument for X`, `This is why Y matters`, `That is what Z looks like in practice`) | Delete the closer. The prior sentences already made the point; the promotion adds nothing.                                                                                                                                                                                             |
| Drama vocabulary applied to methodology (`survived`, `collapsed`, `adversarial baseline`, `escalation`)                                                                                                  | Say what happened in plain verbs. `Two metrics collapsed under the adversarial baseline` becomes `Two metrics stopped separating the groups once the control was added`.                                                                                                               |
| Register mixing — stiff formality plus bolted-on casualness in the same passage                                                                                                                          | Pick the register the venue calls for and hold it through the document. A doc that opens formally and slips into chatty explanations mid-way needs one register applied throughout.                                                                                                    |
| List wedged between subject and its verb (`The gaps, three-fold at the closest edge and roughly twenty-fold on average, make me confident`)                                                              | Split the sentence. State the qualifications separately, then the claim (`The closest gap is three-fold and the average is around twenty-fold. That margin is enough`).                                                                                                                |
| `real` / `actual` / `genuine` / `true` as a noun modifier on an abstract noun (`real utility`, `actual sustainability`, `genuine product-market fit`)                                                    | Drop the intensifier and add the specific claim. Distinct from the sentence-level `X is real` (covered above): this is the noun-modifier variant. Carve-out: named contrast is fine (`real disk writes, not a mocked filesystem`); the tell is the unsaid contrast.                    |
| Speculative gap-filling — hedged speculation dressed as background (`likely began his career in`, `maintains a low public profile`, `appears to have studied`)                                           | Cut the speculation or replace with a sourced fact. Distinct from cutoff disclaimers (`As of my last update`), which admit the gap; this one hides it behind plausible-sounding filler.                                                                                                |
| Numbered list inflation (`five reasons`, `seven takeaways`, `three key insights` padded to hit a round number)                                                                                           | List only the items that actually earn a slot. If there are two, list two. If the count is decorative, drop it.                                                                                                                                                                        |

## Banned words

Scan the draft against these lists. Each entry that appears is a tell.

- **Always banned:** `seamless`.
- **Marketing language:** `revolutionary`, `cutting-edge`, `best-in-class`, `world-class`, `next-generation`, `powerful`.
- **Filler words:** `basically`, `simply`, `just`, `very`, `really`, `actually`, `quite`, `fairly`.
- **Empty intensifiers:** `highly`, `extremely`, `incredibly`.
- **Inflated vocabulary** (plain word in parens): `utilize` (use), `demonstrate` (show), `commence` (start), `endeavor` (try), `ascertain` (find out), `leverage` (use, as verb), `robust` (reliable), `comprehensive` (thorough), `meticulous` (careful), `pivotal` (key), `underscore` (highlight), `delve` (look at).

## Punctuation tripwires

| Tripwire                                                                                                                                                   | Rewrite to                                                                                                                                                                                                                                                                                  |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Em dash in narrative paragraph                                                                                                                             | Comma, parenthesis, or sentence break. Em dashes are acceptable in appendix definition lists, not in narrative.                                                                                                                                                                             |
| Em dash leaves a choppy fragment when removed                                                                                                              | Blend the clauses with a conjunction or relative clause. Don't accept the fragment.                                                                                                                                                                                                         |
| Semicolon joining loosely related ideas                                                                                                                    | Use separate sentences. Semicolons are acceptable only when the second clause elaborates, contrasts, or completes the first.                                                                                                                                                                |
| Two semicolon-joined sentences in adjacent positions                                                                                                       | Convert at least one to comma + conjunction or two sentences. Repeated `X; Y. A; B.` reads as enumeration.                                                                                                                                                                                  |
| Back-to-back colon-introduced lists                                                                                                                        | Reshape the second one as prose.                                                                                                                                                                                                                                                            |
| Frequent colon-introduced elaboration across a section (3+ in close proximity)                                                                             | Rotate at least half to other constructions: appositive comma phrases, parens, or restructure so the elaboration becomes the predicate. Each colon is a structural "list incoming" signal; the cumulative effect reads as bullet-disguised-as-prose.                                        |
| Sentence-level colon-introduced elaboration as default style (`X is broader: Y` / `the question is X: Y` / `the failures are concentrated: of N runs, M%`) | Default to comma blend, parens, or sentence break. Reserve sentence-level colons for genuine 3+ item lists where prose alternatives are choppy. The "topic sentence + colon + clarification" rhythm reads as AI-generated prose because models reach for it as a default elaboration shape. |

Concrete rewrite examples for the em-dash and semicolon rules:

- Em dash producing a choppy fragment:
  - Avoid: "The decision shapes the release timeline. Resolution before the freeze."
  - Prefer: "The decision shapes the release timeline, and must be resolved before the freeze."
- Em-dash-wrapped list inside a sentence:
  - Avoid: "Every library — the first, the second, the third — publishes its source."
  - Prefer: "Libraries such as the first, second, and third publish their source."
- Semicolon splicing loosely related facts:
  - Avoid: "The build is fast; cold starts are rare." (two unrelated facts)
  - Prefer: "The build is fast. Cold starts are rare."

## Lead and reference tripwires

| Tripwire                                                                                                                                          | Rewrite to                                                                                                                                                                                                                                    |
| :------------------------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Bolded paragraph leads in pros, cons, or argumentative paragraphs                                                                                 | Rewrite the first sentence to carry the topic explicitly.                                                                                                                                                                                     |
| Section number used as a concept name (`the §4.3 primitive`)                                                                                      | Name the concept. Put the cross-reference in parens.                                                                                                                                                                                          |
| Cross-reference to the immediately preceding section the reader just finished (`§3 described the experience`, `As shown in the previous section`) | Drop it, or use a natural prose bridge (`Previously, we described the experience`). Reserve `§`-number cross-references for non-adjacent sections the reader is not currently near (a later section, an appendix, a distant earlier section). |
| Term introduced without an inline definition                                                                                                      | Add a parenthetical, "such as" phrase, or short comparison the reader recognizes.                                                                                                                                                             |

Concrete rewrite example for a label-led argumentative paragraph:

- Avoid: "**Trust.** The plugin runs inside every user's process..."
- Prefer: "Open source builds trust because users can audit what runs inside their process. The plugin runs in-process on every invocation..."

## Heading patterns

| Tripwire                                                                                                                                                                                                         | Rewrite to                                                                                                                                                                                                    |
| :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Slogan heading — a full subject-verb heading that pre-empts the section as a claim (`Capacity caps the batch`, `Trust is the currency`)                                                                          | Use a noun-phrase label (`Capacity limit`, `Trust`).                                                                                                                                                          |
| Comma-couplet title (`Local loop, remote box`, `Two jobs, one binary`, `Many providers, one loop`)                                                                                                               | Use a plain label (`Remote execution model`, `Scope`, `Supported providers`). The parallel two-beat slogan is a strong title-level AI tell.                                                                   |
| Imperative slogan (`Pick your path`, `Try it`, `Reuse what's warm`)                                                                                                                                              | Use a noun-phrase label (`Reading guide`, `First run`, `Cache reuse`).                                                                                                                                        |
| Repeated rhetorical frames across siblings (`Why X` / `How Y` / `What you get` chains, or one template stamped across siblings like `I want to try it / I want to wire up an agent / I want the full reference`) | Rewrite each heading with its own subject. Templates read as ad copy when stacked.                                                                                                                            |
| Title case in section headings (`Strategic Negotiations And Partnerships`)                                                                                                                                       | Sentence case (`Strategic negotiations and partnerships`). Capitalize the first word, proper nouns, and coined terms; lowercase the rest. This applies to section headings only; document titles (the H1 and frontmatter `title`) may use Title Case. |
| Reflexive `The` prefix on noun-phrase labels (`The memory-fit batch`, `The release timeline`)                                                                                                                    | Drop the article (`Memory-fit batch`, `Release timeline`). Keep `The` only where a full clause needs it.                                                                                                      |
| Manual heading numbers (`## 1. Overview`, `## 2. Design`)                                                                                                                                                        | Drop the numbers (`## Overview`, `## Design`). Let the renderer or publication system number sections if numbering is needed.                                                                                 |

After drafting, read the headings as a flat list and check that they are the same kind of thing: labels with labels, one register, one casing.

## Comparison closure tripwires

| Tripwire                                                                                          | Rewrite to                                                                                                          |
| :------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------ |
| `X has no equivalent path` / `Y is unavailable` (absolute absence the writer cannot fully defend) | Soften to `limited`, `harder`, `no comparable`. Or drop the closure and let the prior sentences carry the contrast. |

## Pattern recurrence notes

Patterns observed to fire repeatedly across sessions, with extra context for the contexts where they fire hardest.

### `X, not Y` in scope-boundary writing

The `X, not Y` pattern is the highest-recurrence failure when writing scope, positioning, or differentiation prose. Documents that define what something is also define what it is not, and every "the audience is A, not B" or "we ship X, not Y" or "the trigger is M, not N" is the same construction. Watch for it especially when writing tenets, scope boundaries, "what this isn't" sections, and audience definitions.

Symptoms:

- "The audience is the newcomer, not the expert."
- "A successor to the old parser, not a competitor to the compiler."
- "The trigger is a failed build, not a flaky test."
- "We ship the defaults, not the configuration surface."
- "The plugin API is not a second path for the same task."

Rewrite each as a positive claim with the contrast lifted into its own sentence if it is load-bearing:

- "The audience is the newcomer who has written one script. Expert workflows belong in the plugin API."
- "The new parser picks up everything the old one handled. The compiler remains the answer for full programs."
- "A failed build triggers the alert."
- "The section covers defaults and their rationale. Configuration syntax is out of scope here."

Ask: would the positive claim alone communicate the boundary? If yes, drop the negation. If the contrast is genuinely load-bearing, split into two sentences. The first sentence states what the thing is. The second sentence carries the contrast on its own evidence.

### Repeated abstract nominalizations

Reaching for the same abstract noun ("substrate," "surface," "shape," "footprint," "machinery," "plumbing") four or more times in close proximity reads as jargon scaffolding. The first use is precise. The fourth use is filler.

Symptoms:

- "The parser is the substrate. The linter validates the substrate. The substrate accommodates incremental edits." (`substrate` 3x in 3 sentences)
- "The config surface, the plugin surface, the CLI surface, the editor surface..." (`surface` repeated as a coordinating noun)

Rewrite by varying the term, substituting the concrete referent (the parser, the token stream, the syntax tree), or restructuring the paragraph so the abstract noun does not have to do the same work in every sentence. If the term genuinely is the most precise word, anchor it once and let pronouns or paraphrase carry the rest.

### Colon-introduced elaboration

Colons signal "list or elaboration incoming." Each colon is a structural cue. Used sparingly and intentionally, they sharpen prose. Used as a default elaboration shape, they pile up into a stylistic tic that reads as bullet-disguised-as-prose, or worse, as AI-generated text.

The pattern fires hardest in topic-sentence-plus-elaboration constructions: `X is Y: specific Y`, `the question is X: nuance about X`, `the cohort is Z: detail about Z`. AI models reach for this rhythm as a default because it neatly packages a claim and its supporting detail in one sentence. Reading several of these in sequence is the tell.

Symptoms:

- "The long-term scope is broader: a single command that builds any project regardless of language."
- "Only one of those requests argues for a plugin system: consistency across editors."
- "The failing suite is overwhelmingly integration tests: of roughly 900 failures, 78% touch the network."
- "Teams stopped using the tool for one of several reasons: needing offline builds, adding custom loaders..."
- "The design is the same one the plugin API would use: handlers registered on top of the event bus."
- "The task runs under the sandbox model: request-scoped invocation, a 30-second cap, no persistent process."

Rewrite alternatives, in order of preference:

1. **Comma blend.** "The long-term scope is broader, with the goal of a single command that builds any project regardless of language."
2. **Predicate elaboration.** "Only one of those requests, consistency across editors, argues for a plugin system."
3. **Parenthetical.** "Teams stopped using the tool for several reasons (needing offline builds, adding custom loaders, ...)."
4. **Sentence break with evidence flow.** "The failing suite is overwhelmingly integration tests. Of roughly 900 failures, 78% touch the network."
5. **"Such as" or "including" prose blend.** "The design is the same one the plugin API would use, with handlers registered on top of the event bus."

Rule of thumb: **default to none.** Reserve sentence-level colons for genuine 3+ item lists where prose alternatives produce a choppy enumeration. If a section has more than one or two colons across all its paragraphs, the default has slipped, and at least half should restructure. Section headings and frontmatter are exempt; this rule applies to body prose.

### Topic-sentence rhythm across paragraphs

When every paragraph in a section opens with a short, punchy claim sentence followed by three to five sentences of supporting detail, the rhythm itself becomes the most visible feature of the section. Readers stop reading the content and start noticing the metronome. This is the AI-tell that mimics what a slide deck would look like with the lead sentence bolded.

The pattern is not wrong as an individual paragraph shape. Topic-sentence-first is a fine paragraph form. The failure is using it as the only paragraph form in a section. Three or four consecutive paragraphs all opening `Short claim. Detail. Detail. Detail.` is the symptom.

Symptoms:

- A section with six paragraphs in a row, all opening `Now isn't the right window for a plugin system.`, `The escape hatch is not urgent.`, `The next release has the same problem.`, `Layering a wrapper over the existing API is not a partial solution that buys time.`, `The criteria that would move us off deferral are quantitative and signal-based.`, `Deferring carries a cost.`

Rewrite alternatives:

- **Lead with evidence, build to claim.** Some paragraphs work better with the claim landing as a conclusion drawn from the evidence. "Survey and issue-tracker data show breadth without concentration. Requests for custom loaders appear at low frequency relative to configuration questions. Until that changes, now is not the right window for a plugin system."
- **Lead with a connector or qualifier.** Open with a word or short phrase that signals the paragraph's role in the argument. "Pulling plugin support into the release adds risk...", "Layering a wrapper over the existing API does not buy time...", etc.
- **Interleave claim and evidence.** Don't put all the evidence in the trailing sentences. Let one piece of evidence lead, then the claim, then more evidence in support.
- **Vary sentence length.** If every paragraph's first sentence is short, change the rhythm by occasionally opening with a longer sentence that combines setup and claim.

Rule of thumb: in a section with three or more argumentative paragraphs, no more than half should follow the same opening rhythm. If the rhythm is uniform, the section reads as bullet points with the bullets removed.

### Trade-off vs consequence

A trade-off is a deliberate choice between alternatives where the writer accepted the downside. A consequence is a knock-on effect of a separate decision. Proposal docs frequently label any downside as a "trade-off," which conflates the two and weakens the framing. Reading "trade-off," the reader expects the alternative being weighed and the reason for choosing this side. If the paragraph does not articulate the alternative, it is describing a consequence, not a trade-off.

Symptoms:

- "The trade-off is that two config formats coexist underneath what should look like one system..." — the downside follows from the earlier choice to keep supporting both formats, not from the API design the section was discussing, which makes it a consequence rather than a trade-off being weighed.

Rewrite alternatives:

- Use "consequence" when the downside follows from a separate, upstream decision: "One consequence of supporting both formats..."
- Drop the framing entirely if the section is not articulating a choice. State the situation directly: "Two config formats coexist..."
- Reserve "trade-off" for paragraphs that explicitly weigh the alternative: "We chose X over Y because A and B, trading off C."

Ask: is the alternative being weighed in this paragraph? If yes, "trade-off" fits. If the paragraph is just stating a downside, "consequence" or no framing is more accurate.

### Reasoning chain skipped between evidence and conclusion

Analysis prose often makes inferential claims (claim Y follows from observation X) where the writer skips the bridge sentence explaining why X implies Y. The bridge feels obvious to the writer because they made the inference and moved on. The reader has not, and reads the claim as authoritative narration they cannot evaluate.

This pattern fires alongside `is real`, `headline`, and other AI-prose tells, but it is more fundamental. Those tells dress up unsupported claims; this pattern produces them. A claim with a tell that has solid reasoning underneath edits cleanly into prose. A claim without reasoning cannot be saved by word choice.

Symptoms:

- "Third-party plugins, the extensibility half of 'fast and extensible', and the cross-project view of reuse need a stable ABI, versioned hooks, and sandboxing." — the claim that plugins "need" those three things skips the bridge. Plugins by definition run code the maintainers did not write inside the host process, which is what sandboxing addresses, and that sentence is the one the reader needs to follow the inference.
- "The alternative library is closest to our design but unmaintained." — the "closest" claim has no shown comparison; the reader has to take the writer's word.

Rewrite alternatives:

- Add the bridge sentence: name why the data implies the conclusion. "Plugins run code the maintainers did not write inside the host process, which is what sandboxing and a stable ABI address."
- Lead with evidence, build to claim. Reverses the order: state what is true, then say what follows. The conclusion lands as a reading the reader already saw coming.
- Cite a source where the connection is established: "The comparison table in the evaluation notes explains why each requirement maps to a different extension point."

Ask: would a reader who is skeptical of the claim be able to trace it from evidence to conclusion using only the prose on the page? If not, the bridge is missing.

### Bullet-list-disguised-as-prose

Content that is genuinely a list (action items, criteria, observations, options) written as prose paragraphs becomes harder to read, not easier. The reader does the work of mentally re-listing the content. The list shape is what the writer should have used.

The pattern shows up in two forms:

1. **Colon-introduced lists across consecutive paragraphs.** "Continue gathering signal: track issue volume, monitor fork activity, watch competing tools. Readiness work that does not require a build commitment: confirm the ABI, confirm the versioning story, confirm the sandbox. Community engagement: stay in conversation with plugin authors, translate their asks into issues." Each paragraph is a single thought that the writer split into a colon-introduced list inside the paragraph. The reader is doing list-reading inside paragraph-reading.
2. **Choppy short sentences.** "The criteria that would move us off deferral are quantitative and signal-based. Issue volume crossing a threshold to be defined. Request mix shifting toward custom loaders. Specific adopters that name plugins as a blocker." Each criterion is a sentence fragment, not a complete sentence. The reader assembles them into a list anyway.

Rewrite alternatives:

- **Use an actual list when the content is a list.** Numbered list for ordered items (criteria, ranked options, sequential steps). Bulleted list for unordered items.
- **Blend into narrative when the content is a sequence of related observations.** Use connectors (`In parallel`, `At the same time`, `Building on this`) so the items flow together rather than reading as a list.
- **Reduce to the essential thread.** If the list is a workstream summary, name the thread once and explain the work. "The team continues watching for signal across three vectors: issue volume, plugin-author demand, and the competitive landscape." (Yes, this uses a colon. The whole paragraph becoming one sentence is the point.)

Ask: would the reader be better served by an actual numbered or bulleted list? If yes, use one. If no, the prose needs to flow as narrative, not enumeration.

### Labeled-bullet walls

Runs of bullets shaped `- **Label** — one-sentence gloss` (or `- **Label.** Sentence`) are the signature layout unit of AI-generated landing copy. Measured landing pages run 50–95% this one shape; human documentation almost never uses it. A wall of these is parallel fragments, none of which explains anything.

The pattern is not wrong as an individual bullet. Definition-style list items in appendices and glossaries use it correctly (see `SKILL.md` "Punctuation" — the em-dash carve-out for appendix definitions). The failure is stamping the shape across a section, replacing the prose that should carry the argument.

Symptoms:

- 5+ consecutive `- **Term** — description` bullets in a section that is not an appendix or glossary.
- Every bullet in a proposal option is a labeled fragment, no prose paragraphs between them.
- The section reads as a wall of parallel two-beat units.

Rewrite alternatives:

- **Convert to prose.** Merge the items into a paragraph that connects them. The connective tissue is the argument.
- **Vary shape.** If the list is genuinely a list, some items are longer, some are questions, some are full sentences without a label.
- **Move the wall to an appendix.** Definition-style bullets are correct in a glossary or reference section, not in the argument itself.

Ask: would a reader trying to follow the argument be better served by prose? If yes, convert. If the list is genuinely reference material, isolate it in a subsection labeled as such.

### Bridge sentences and decorative descriptors

Two related tells fire in analytical prose that reads as AI-generated: bridge sentences that assert significance without adding it, and decorative nominal descriptors that reach for metaphor when a plain claim would land the point.

**Bridge sentences** are short sentences that assert the importance of the surrounding text without adding new information. Common shapes:

- `The interaction shape matters.`
- `The X pattern is important.`
- `The stakes are real.`
- `The honest answer is...`
- `It's worth noting that...`

The pattern shows up between an introduction and its consequences, or between related claims. It substitutes assertion of significance for the significance itself, and it reads as filler because the surrounding prose either already carries the significance (making the bridge redundant) or fails to (in which case the bridge can't rescue it).

Symptoms:

- "The library popularized the pattern with its streaming API... The interaction shape matters. A `cancel` call from the caller..." — the bridge sits between the API description and its consequences, adding nothing.
- "The honest answer today is that polling works..." — `honest` is doing rhetorical work; the sentence would land the same claim more directly without it.

Rewrite by folding the significance into the preceding sentence, or by letting the consequence sentences carry it on their own. If the paragraph structure needs a bridge to make sense, the paragraph structure needs rewriting.

**Decorative nominal descriptors** are metaphorical noun phrases and verb-noun compounds that dress up a plain claim:

- `a slim slice` (for "a small share")
- `a narrow band` (for "a specific subset")
- `hardens into a defection reason` (for "will drive users away")
- `sharpens into a decision point` (for "forces a decision")
- `within the horizon we care about` (for "in the timeframe we're planning for")
- `Latency compounds the mismatch` (for "Latency is a second problem")

The reach for metaphor signals that the writer wanted the sentence to feel weighty. Plain claims feel less impressive but read as prose the writer trusts. When you find yourself reaching for a metaphor, write the plain claim first. Keep the metaphor only if it adds a specific dimension the plain claim misses, and if it does, use it once, not repeatedly.

Symptoms:

- "batch jobs and scheduled reports remain a slim slice" — `slim slice` is metaphor for "small share." Plain is better.
- "Long-running workloads (nightly jobs, report generation, data backfills) sit inside a slim slice of the audience." — same pattern, repeated in the same document.
- "'no offline mode' hardens into a defection reason within the horizon the team cares about" — two decorative constructions in one clause (`hardens into a defection reason` + `within the horizon we care about`).
- "Latency compounds the mismatch: a round-trip on every emitted event rules out interactive use." — `compounds the mismatch` is a metaphorical verb; the plain "Latency is a second problem" or dropping the bridge entirely would land the argument.

Rewrite alternatives:

- **Plain substitution.** `slim slice` → `small share`, `niche`, or a specific fraction.
- **Drop the metaphor entirely.** `hardens into a defection reason within the horizon we care about` → `users will pick other tools if the gap stays open too long`.
- **Sentence break with plain follow-on.** `Latency compounds the mismatch: [X]` → `[X]. And every emitted event requires a round-trip, which rules out interactive use.`

Rule of thumb: if a paragraph contains more than one decorative nominal descriptor, the paragraph is over-metaphored. Rewrite until one or none remain.

## How to use this file

1. **Before writing a section.** Skim the tables. The most common failures are the phrase patterns and the em-dash-wrapped list.
2. **After writing a section.** Search for each tripwire phrase in the text you wrote (`is real`, `--`, `Furthermore`, banned words). If one fires, fix it before submitting for review.
3. **Before declaring a doc done.** Run the publishing sweep from `SKILL.md` § "Sweeping and restructuring" against these tables.

If a tripwire fires repeatedly across sessions, add it here.
