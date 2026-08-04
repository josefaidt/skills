---
role: doc-type (independent)
composes: [faqs]
description: Structure for a product requirements document — what a feature does, who it serves, and the acceptance bar for each behavior. Use when the "what" is decided and needs specifying. An independent doc type: it has its own executive-summary spec and evaluates no options, so it does not extend the business-doc substrate or compose the tenets structure. It composes the FAQ component for its reader-facing open questions.
---

# Writing PRDs

Structure for product requirements documents. A PRD defines what a feature does, who it serves, and the acceptance bar for each behavior. It is not a design doc (no architecture), not a proposal (no options to evaluate), and not a user guide (no tutorials). A PRD answers: "what must the product do, for whom, and how do we know it's done?"

The prose rules in `SKILL.md` are already in force. This file adds document shape only.

## Document structure

A PRD has five required sections in this order, and closes with an optional FAQ. Do not reorder, merge, or omit required sections. The closing resolves what the PRD leaves open, as an Open decisions list, an FAQ, or both (see "Open decisions and FAQ" below).

```markdown
# [Feature Name] PRD

## Executive summary

## Customer problem

## User stories

### Story N: [Story title] - [Priority]

## Behavioral clarifications

## Open decisions

## FAQ (optional)
```

### Executive summary

Three to five sentences. State:

1. What the document defines (the feature, by name).
2. The core behavior in one sentence (what the feature does at the highest level).
3. One or two key constraints or scope boundaries.
4. A note about what is explicitly out of scope for this document, if applicable.

End with a short list of requirement directions, the top-level decisions already made that constrain the design space. Format as a bullet list.

Example shape:

> This document defines the product requirements for [feature]: [one-sentence behavior]. [Scope boundary]. Note: [out-of-scope callout].
>
> **Requirement directions:**
>
> - [Decision 1]
> - [Decision 2]
> - [Decision 3]

### Customer problem

One to three paragraphs. Explain:

1. What the customer cannot do today (the gap).
2. What happens as a consequence (the pain, concrete rather than abstract).
3. Why this matters now (industry context, competitive pressure, or launch dependency).

Cite specific numbers, competitor names, or industry practices where possible. Do not hedge ("customers might want..."). State the problem as fact. If it needs qualification, qualify with a concrete condition ("customers building production applications need..."), not with uncertainty language.

#### Customer personas (optional)

When the feature targets a specific cohort rather than all customers, include a short personas subsection after the problem statement. Each persona is one to two sentences naming:

1. Who they are (role, team shape, or project stage).
2. How they would use this feature (their expected workflow or interaction pattern).
3. What distinguishes them from other customers who might not need this feature.

Personas help the reader understand which customer cohort drives the requirements and why the user stories are scoped the way they are. Keep them concrete. Name the kind of application they build, the scale they operate at, or the tools they already use. Do not write generic profiles ("a developer who wants things to work well").

```markdown
#### Customer personas

**Production-scale web teams.** Teams running customer-facing applications with real traffic who deploy multiple times per day. They expect deployment safety to be automatic, configured once at the environment level, then invisible during normal pushes.

**Solo developers with side projects.** Ship infrequently, have no monitoring. They benefit from safe defaults but will never configure a deployment strategy. The feature must work without their attention.
```

Include personas when the feature has a clear primary cohort, when multiple cohorts would use the feature differently, or when the distinction helps explain why certain stories are P0 versus P1. Omit them when the feature applies uniformly to all customers.

### User stories

The core of the document. Each story is a numbered section with a title and a priority tag.

#### Story format

```markdown
### Story N: [Descriptive title] - [Priority]

**As a** [role], **I want** [action], **so that** [outcome].

**Acceptance criteria:**

- [Observable, testable behavior]
- [Observable, testable behavior]
- ...
```

#### Numbering and titling

- Stories are numbered sequentially: Story 1, Story 2, Story 3.
- Titles are short noun phrases that name the capability: "Safe-by-default deploys", "Instant abort", "Sticky user assignment".
- Priority is appended after a dash: `- P0`, `- P1`, `- P2`.

#### The "As a / I want / so that" sentence

- **As a**: the specific role, not "a user". Use "developer", "platform engineer", "operator", or whatever role actually performs the action.
- **I want**: a concrete action the user takes or behavior they experience. Not an implementation detail.
- **so that**: the outcome or value to the user. This is the "why", and it explains why the feature matters to this role.

Write the sentence as a single line, not broken across multiple lines. Bold the markers: `**As a**`, `**I want**`, `**so that**`.

#### Acceptance criteria

Acceptance criteria define when the story is done. Each criterion is one bullet that describes an observable behavior.

Rules:

- Each criterion is a single sentence or short clause.
- Describe externally observable behavior, not implementation. "The CLI returns a structured response" not "the backend writes to the database".
- Be specific about values, states, and error messages. "Rejected with a clear error message: 'An active gradual deployment exists. Complete or abort it first.'" not "returns an error".
- Include boundary conditions: what happens at the edges (empty state, concurrent access, invalid input).
- Use present tense: "The platform assigns..." not "The platform will assign...".
- A story with no acceptance criteria is incomplete. Every story needs at least two criteria.
- When a criterion involves a set of options or presets, enumerate them inline as a nested list rather than describing them abstractly.

#### Ordering stories

Order stories by dependency and narrative flow, not strictly by priority. A reader should be able to read top-to-bottom and understand the feature progressively. Put foundational behaviors first (the happy path), then control mechanisms (abort, pause), then edge cases and configuration.

Within that narrative order, tag each story's priority:

- **P0**: required. The feature does not work without it.
- **P1**: important, but the feature works without it. Include when scope allows.
- **P2**: optional. A nice-to-have that improves the feature but is not needed for it to function.

#### Story scope

Each story covers one user-facing capability. If a story has acceptance criteria that span two unrelated behaviors, split it. If two stories share all their acceptance criteria, merge them.

A story should not prescribe API shape, data model, or system architecture unless the requirement is genuinely about the API surface (for example, "the API returns field X" when that field is the user-facing contract). Implementation belongs in a design doc, not a PRD.

### Behavioral clarifications

After user stories, add a section that resolves ambiguities the stories leave open. This section answers "what happens when..." questions that span multiple stories or involve edge cases not worth a full story.

Format behavioral clarifications as:

- A short heading naming the ambiguity: "When does the environment-level config apply?"
- A prose explanation of the rule.
- A truth table or decision matrix when the behavior depends on multiple inputs.

Use tables for multi-variable decisions. A table with columns for each input variable and a final "Behavior" column eliminates ambiguity better than prose.

```markdown
### [Question the clarification answers]

[Prose explanation of the general rule.]

| #   | [Variable 1] | [Variable 2] | Behavior       |
| --- | ------------ | ------------ | -------------- |
| 1   | [value]      | [value]      | [what happens] |
| 2   | [value]      | [value]      | [what happens] |
```

Include a rationale sentence after the table when the "why" is non-obvious. ("The rationale: a customer manually specifying weights is orchestrating their own traffic split.")

### Open decisions and FAQ

A PRD closes by resolving what it leaves open. Two shapes cover distinct needs, and a PRD can carry one or both:

- **Open decisions** name things that are not yet settled and block or constrain implementation. This is the author's list of what still needs a call, each entry led by the recommendation the author is leaning toward.
- **FAQ** answers the questions a reader will actually ask about scope, predictable objections, and behavioral edges. This is reader-facing and question-led. Use it when the "what" is decided but readers will still test the boundaries.

Use Open decisions when items are genuinely undecided; use an FAQ when items are decided but need surfacing for the reader. When both apply, list Open decisions first (they gate the design) and the FAQ after.

#### Open decisions

List decisions not yet made that block or constrain implementation. Each decision is a bullet with:

1. The question, bolded.
2. A recommendation (if the author has one), introduced with "Recommendation:".
3. A brief rationale for the recommendation.

```markdown
- **[Question]** Recommendation: [position]. [One-sentence rationale].
```

Open decisions are not rhetorical. They name things that genuinely need resolution. If the answer is already decided, move it to the executive summary's requirement directions, encode it in a user story's acceptance criteria, or answer it in the FAQ.

#### FAQ

For a reader-facing FAQ, compose the FAQ component: read `faqs.md` for the question-led entry structure, answer discipline, and ordering. In a PRD, good FAQ questions map to scope boundaries ("what is deliberately out of scope?"), predictable objections, and the behavioral corner cases a reader will wonder about that were not worth a full behavioral clarification.

## Scope and anti-patterns

### What a PRD is not

- Not a design doc. Do not include architecture diagrams, API schemas, or sequence diagrams. Reference a separate design doc if one exists.
- Not a proposal with options. If you're evaluating approaches, write a proposal (see `proposal.md`). A PRD assumes the "what" is decided and specifies it.
- Not a user guide. Do not include tutorials, setup instructions, or walkthroughs.
- Not a project plan. Do not include timelines, staffing, or milestones.

### Common mistakes

- **Stories without acceptance criteria.** Every story needs criteria. "Ship gradual deployments" is a project goal, not a testable story.
- **Acceptance criteria that describe implementation.** "Uses database streams" is not an acceptance criterion. "Changes propagate within 5 seconds" is.
- **Vague roles.** "As a user" tells the reader nothing. Name the specific role.
- **Compound stories.** A story that says "I want to pause, resume, and abort" is three stories.
- **Missing edge cases.** If a behavior has a "but what if..." that matters to the customer, it belongs in acceptance criteria or behavioral clarifications. Do not leave it for the engineer to infer.

## Level of detail

The target level of detail for acceptance criteria: specific enough that two engineers reading the same criterion would build the same externally-observable behavior, but not so specific that it prescribes the implementation. Name exact error messages, exact field names in responses, and exact state transitions. Do not name database tables, internal service calls, or algorithm choices.

For presets, enums, or strategy names: list them by name with a one-line description of each. The reader should know exactly what the customer sees without opening a design doc.

## Language and tone

The rules in `SKILL.md` apply. Two of them bind harder in a PRD:

- Declarative. "The platform assigns each user to a version" not "the platform should assign" or "we will assign".
- No hedging. If the requirement is conditional, state the condition. Do not use "might", "could", or "should" to express uncertainty about whether the feature does something.

Acceptance criteria take short sentences. Longer, flowing sentences are acceptable in the customer problem section and behavioral clarifications where context-building matters.
