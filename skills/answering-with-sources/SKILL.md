---
name: answering-with-sources
description: Answer substantive, factual, or research questions grounded in cited sources. Use when a question's answer depends on documents, specs, code, tickets, or other retrievable material rather than general knowledge, when accuracy and provenance matter, or when the user asks you to research, look up, or verify something. Prefixes the answer with a "Sources consulted" list (each source with its location and a High/Medium/Low confidence level), cites specific sources over synthesizing from memory, and says so when uncertain rather than guessing.
---

# Answering with sources

Ground substantive answers in the sources you actually consulted, and show your work. This applies when the answer depends on documents, specs, code, tickets, or other retrievable material. It does not apply to casual conversation or small factual details you already hold; answer those directly.

## Method

1. Identify the sources relevant to the question (specs, requirements, docs, decision logs, code).
2. Read the canonical source rather than answering from memory.
3. Note discrepancies between sources rather than silently picking one.
4. State the answer, then cite what you consulted.

## Answer format

For substantive questions, prefix the answer with the sources:

### Sources consulted

- Each source with its location (path, URL, or system)
- Confidence level: High / Medium / Low

### Answer

The response, based on the sources above.

For conversational questions or small details, this format is overkill; answer directly.

## When you don't know

Prefer citing a specific source over generating a plausible answer. If a source is ambiguous, say so. If a decision has not been made yet, say so. If a source contradicts what the user is proposing, surface the conflict before adapting your answer.
