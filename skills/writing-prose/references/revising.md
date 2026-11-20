# Revising documents

A revision leaves the document reading as one piece written today. The gotchas below are the ways a revision usually breaks that.

## Carry new information through the whole document

New information, such as a decision, a reframing, or a fact, lands everywhere it touches, not only in the section you were editing. Before you finish, trace it: does an earlier section need to introduce it, does a later one need to reflect it, and does any claim now contradict it? Put each part at its section's altitude, with the framing in the summary, the mechanism in the body, and the open question in the open decisions or FAQ.

- Avoid: a new constraint stated in one requirement while the summary and the FAQ still describe the old behavior.
- Prefer: the summary names the constraint, the requirement specifies it, and the FAQ answer that assumed otherwise is rewritten.

## Supersede prior versions without citing them

A v2 treats v1 as source material, not as an authority beside it. Body prose never says "as v1 described" or "the pattern captured in v1": adopt the claim as this version's own, update it, or drop it. Cite the underlying evidence, such as the interviews or tickets, rather than routing through the old version. Name prior versions only in the frontmatter references or a references appendix, with a note on what detail they still hold.

## Move content by rewriting it

Content moved in from an issue, a chat, or another kind of document is rewritten into the structure the target sets. Before moving it, say what the target form needs, and push back on a move that would only copy.

## Re-verify inherited claims

A claim was true when its source was written, and that is all. Before finishing a document that carries content forward, check four kinds of claim against current sources:

1. **Dates.** A "launching Q2" written before Q2 is now either stale or done.
2. **Audience.** Persona lists and named competitors drift.
3. **Scope.** Capabilities, integrations, and feature lists change.
4. **Roadmap.** Delivery dates and owners move.

## Changelogs

Add a `## Changelog` at the bottom of a document only once others have read a version of it and the change is one they would need to know about, or when the user asks. Before it is shared, a changelog is noise.

```markdown
## Changelog

### YYYY-MM-DD

#### Added

- `integration create`: second path for existing projects

#### Changed

- Story 3: raised the session limit from 10 to 50
```

Group entries under Added, Changed, and Removed, leaving out empty groups. Each entry is one line in past tense with no closing period, and starts with the section or story it touches. Add a new date heading per revision, merge same-day revisions under one, and leave earlier entries alone.
