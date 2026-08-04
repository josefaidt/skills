---
role: component
composed-by: [business-doc, proposal, prd]
description: Substance for an FAQ or open-questions section that frames the boundaries of a decision. Compose from any doc that has settled its recommendation but left specific edges open. Holds question-led entry structure, answer discipline, and ordering.
---

# Writing great FAQs

An FAQ section in a proposal or decision doc surfaces the questions a reader will actually ask and the decision boundaries the doc is still working out. It is not marketing filler and not a glossary. Done well, it is where a reader tests the edges of the proposal: what is in, what is out, what is decided, and what is still open.

## When to use an FAQ

Use an FAQ, rather than a plain "Open questions" list, when the unresolved points and scope boundaries read best as questions a reader would pose. A proposal that has settled its core recommendation but left specific boundaries open is the common case. For a pure list of ranked action items or dependencies, a numbered "Next steps" list is fine; reach for the FAQ when each item is genuinely a question with an answer.

## Lead with the question

Each entry opens with the actual question, phrased the way a reader would ask it, in bold. Do not lead with a topic label or a summary of the question.

- Avoid: **Deploy payload boundary.** Does the payload root at the package or the repo?
- Prefer: **Does the upload payload root at the package directory or the repository?**

The label form makes the reader decode the topic before they reach the question. The question form lets them scan the bold lines and jump to the one they care about.

## Answer discipline

- One question, one answer. If an answer needs several paragraphs, the question is really a body section.
- State the position first: the current answer, or that the point is open. If open, name the crux — the thing that has to be decided — not just that it is undecided.
- Keep it to a few sentences. The FAQ marks the boundary of the decision; it is not a place to re-argue the body.
- Answer honestly. If the answer is "no" or "not yet," say so plainly.

## Frame the boundaries of the decision

Good FAQ questions map to real edges of the proposal:

1. **Scope.** What is deliberately out of scope, and why?
2. **Open decisions.** What has the doc not settled, and what is the crux of each?
3. **Predictable objections.** What will a careful reader push on — an overlap with an existing mechanism, a risky default, a naming choice?
4. **Behavioral edges.** What happens in the corner case the reader will wonder about — the empty input, the conflicting flag, the missing file?

If a question has no real answer boundary, if it exists only to tee up a feature, cut it. The FAQ earns trust by naming the hard parts, not by staging easy ones.

## Ordering

Order questions by what the reader hits first, then by how load-bearing the answer is. Lead with the question most likely to block agreement.
