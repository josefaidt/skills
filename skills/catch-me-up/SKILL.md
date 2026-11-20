---
name: catch-me-up
description: Catch the user up on what changed in this chat since their last message, in plain words, and list every decision waiting on them with enough to make it from the reply alone. Runs only when the user invokes it.
disable-model-invocation: true
---

# Catch me up

Assume the user remembers their last message and nothing after it. Tell them what changed since then and what waits on them, so they can decide from this reply alone. Notifications and subagent or session reports are not their messages.

Keep this turn read-only. Do not change code, start anything, or post anything. Check the current state of each pull request, CI run, and session this chat touched before you describe it.

## Voice

Use plain words and short sentences, with no jargon, as one person catching up another. Say what changed for the user, not how you did it, as in "the tests pass" rather than "CI is green". Leave out rule IDs, hashes, file paths, commands, and counts unless the user needs one to act. Call each pull request, branch, or session by a name the user would know.

## Shape

1. One sentence naming what waits on the user, or saying nothing does. If nothing happened and nothing waits, say so and stop.
2. What happened, in under 100 words: one line per thing the user asked for, saying what came of it and whether it is done, running, failed, or unchecked. Never call something done that still waits on the user. Put a screenshot or a small diagram first when a picture explains a change faster than words, at most six boxes with a few words each, and only from facts you have.
3. The decisions. Each is a call only the user can make, such as an approval, a merge, a product choice, or access you lack. Work you can still do yourself is not one, and never invent one to fill the list. For each, give in about 30 words the call, your pick, what it changes for users, the evidence for your pick, and the risk, even when low. When several items share a call, state the call and your pick once, then one line per item, riskiest first. For a choice between options, give each option's gain and cost.

Never drop a decision or shrink it to a count to save words. The reply grows with the number of decisions.
