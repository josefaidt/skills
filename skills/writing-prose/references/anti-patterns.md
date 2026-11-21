# Anti-patterns

The catalog to sweep a draft against before publishing. Each entry is a construction that reads as generated, with the rewrite that fixes it. Examples are domain-neutral, so match the construction, not the subject.

When a tell fires, restructure rather than swap one tell for another. If a tell keeps firing across sessions, add it here.

## Phrases

| Tell | Rewrite |
| :-- | :-- |
| `Not X, it's Y` / `X, not Y` / `X doesn't remove Y, it shifts it` | State the positive claim. If the contrast carries weight, give it its own sentence. It fires most in scope and audience writing. |
| `X is real:` / `The honest answer is` / `It's worth noting` | Drop the vouching and state the claim. |
| `The X matters.` / `The stakes are high.` between a setup and its consequences | Drop the bridge. The sentences around it carry the significance or need rewriting. |
| `This is why X matters` / `That is what Y looks like in practice` as a closer | Delete. The paragraph already made the point. |
| `This document proposes X` | State the position. |
| `Furthermore` / `Additionally` / `Moreover` | Drop. The logic carries the transition. |
| `real` / `genuine` / `actual` on an abstract noun (`real utility`) | Drop it and add the specific claim. A named contrast is fine: "real disk writes, not a mocked filesystem". |
| Metaphorical verb or noun on an abstraction (`compounds`, `hardens into`, `a slim slice`) | Write the plain claim: "a small share", "users will leave". |
| Drama words for method (`survived`, `collapsed`, `adversarial`) | Plain verbs: "stopped separating the groups once the control was added". |
| A verb that overstates a relationship (`inherits`, `descends from` between independent projects) | Use the accurate verb: `matches`, `models on`, `shares`. |
| A qualifier the system does not guarantee (`long-lived`, `always available`) | Name the actual property, or drop the qualifier. |
| Speculation dressed as background (`likely began`, `appears to have`) | Cut it or replace it with a sourced fact. |
| A count padded to a round number (`five key insights`) | List what earns a slot. Two is fine. |
| Three parallel items in sentence after sentence | Vary the count, or write a sentence. |
| Three or more stacked negations (`No config, no build, no registry`) | One plain sentence: "You skip the setup." |
| Verbless fragments doing a sentence's job (`Ships weekly.`) | Give it a subject and verb, or fold it into a neighbor. |
| A list wedged between subject and verb | State the qualifications first, then the claim, in separate sentences. |
| Two choppy sentences that are one thought (`A fair question is X. The answer is Y.`) | Join them with a conjunction or relative clause. |
| The same abstract noun four times nearby (`surface`, `substrate`, `shape`) | Name the concrete thing, or anchor the term once and use pronouns. |
| Formal register with casual asides bolted on | Pick the register the venue calls for and hold it. |
| `48 percent` for a data point | `48%`. Words are for rough magnitudes, such as "over half". |

## Banned words

- **Marketing:** `seamless`, `revolutionary`, `cutting-edge`, `best-in-class`, `world-class`, `next-generation`, `powerful`.
- **Filler and intensifiers:** `basically`, `simply`, `just`, `very`, `really`, `actually`, `quite`, `fairly`, `highly`, `extremely`, `incredibly`.
- **Connotation:** `cheap` for a price, since it also means low quality. Write "inexpensive" or "low-cost".
- **Inflated** (plain word in parens): `utilize` (use), `demonstrate` (show), `commence` (start), `endeavor` (try), `ascertain` (find out), `leverage` (use), `robust` (reliable), `comprehensive` (thorough), `meticulous` (careful), `pivotal` (key), `underscore` (highlight), `delve` (look at).

## Punctuation

| Tell | Rewrite |
| :-- | :-- |
| Em dash in a narrative paragraph | A comma, parentheses, or a new sentence. Appendix definition lists may keep one, written as `—`, never `--`. |
| Removing the em dash leaves a fragment | Join the clauses: "The decision shapes the timeline, and must be settled before the freeze." |
| A list wrapped in em dashes mid-sentence | "such as" or "including": "Libraries such as A, B, and C publish their source." |
| A semicolon joining unrelated facts (`The build is fast; cold starts are rare.`) | Two sentences. Keep a semicolon only when the second clause completes the first. |
| `X is broader: Y` as the habitual way to elaborate | A comma, an appositive, parentheses, or a new sentence. More than one or two colons in a section means the default slipped. |
| Back-to-back colon-introduced lists | Rewrite the second as prose. |

## Paragraphs and structure

**Metronome rhythm.** Every paragraph in a section opens with a short claim and trails three sentences of support. One such paragraph is fine; a run of them reads as slides. Lead some paragraphs with evidence and land the claim last, open with a longer sentence that joins setup and claim, or put evidence between claim sentences. No more than half the argumentative paragraphs in a section should share one opening shape.

**Label-led paragraphs.** "**Trust.** The plugin runs inside…" leans on the label to say what the paragraph argues. Write "Open source builds trust because users can audit what runs in their process." Read the first sentence of each paragraph in sequence; you should be able to tell what each argues.

**Labeled-bullet walls.** Five or more `- **Term** — gloss` bullets in an argument are fragments that explain nothing. Write the prose that connects them, vary the items, or move them to a glossary.

**Lists disguised as prose.** Criteria written as a run of fragments ("Issue volume past a threshold. Requests shifting to loaders.") make the reader rebuild the list. Use a real list, or write connected narrative.

**Skipped reasoning.** "Plugins need sandboxing" skips why. Add the bridge: "Plugins run code the maintainers did not write inside the host process, which is what sandboxing addresses." A skeptical reader should be able to trace each conclusion from the evidence on the page.

**Trade-off versus consequence.** A trade-off weighs a named alternative. A downside that follows from an earlier decision is a consequence, so call it that or state it plainly.

**Overclaiming closures.** "Closed source has no equivalent path" fails if the honest version is "harder". Write "no comparable visibility", or drop the closure.

## Headings

| Tell | Rewrite |
| :-- | :-- |
| A sentence that pre-argues the section (`Trust is the currency`) | A label: `Trust` |
| A comma couplet (`Two jobs, one binary`) | A plain label: `Scope` |
| An imperative slogan (`Pick your path`) | A label: `Reading guide` |
| One frame stamped across siblings (`Why X`, `How Y`, `What you get`) | Give each heading its own subject |
| Title Case below the H1 | Sentence case |
| A leading `The` (`The release timeline`) | `Release timeline` |
| Manual numbers (`## 2. Design`) | `## Design` |

## References

| Tell | Rewrite |
| :-- | :-- |
| A section number as a concept's name (`the §4.3 primitive`) | Name the concept, with the reference in parentheses |
| `As the previous section showed`, pointing one section back | Drop it. Save cross-references for sections the reader is not near |
| A term or ID used without a gloss | A parenthetical, a "such as" phrase, or a familiar comparison |
