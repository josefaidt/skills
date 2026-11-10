---
name: retro
description: "Conduct a retrospective on a coding session and codify what it taught into the agent's environment: steering files, skills, coding and writing standards, the glossary, docs, and automated checks. Run at the end of a session, while its corrections are still in context, with optional focus topics to examine in depth alongside the full retrospective."
argument-hint: "[session] [focus topics to examine in depth]"
disable-model-invocation: true
---

The user has asked for a **retrospective**. You are suggesting improvements to the coding agent's **environment** to improve future runs. The environment is everything a future agent reads or runs before it acts: steering files, skills, coding and writing standards, the glossary, docs, and automated checks.

A retrospective works best at the end of a session, while the session is still in context. Each correction the user made, each file the agent hunted for, and each check that failed late is a lesson the next session can start with instead of rediscovering. Codifying it turns this session's feedback into the next session's defaults.

The skill takes an optional free-text argument. It may name the session to review, which step 2 reads, and it may name **focus topics**, which step 4 examines in depth on top of the full retrospective. A focus topic is anything the user wants more thought on than a sweep gives, such as a recurring failure, a part of the environment they distrust, or a question about how the repo is set up. With no argument, review the current session and run the sweep alone.

## Steps

1. Load the writing style guide the environment provides, such as the `writing-prose` or `writing-for-agents` skill. Every change you propose is prose that another agent will read.

2. Read the primary sources for the session the user specifies. This may mean searching through session logs on this machine (Claude Code keeps them under `~/.claude/projects/`, Codex under `~/.codex/sessions/`). If the user doesn't specify a session, default to the current one. The user's own words carry the strongest signal. Every correction, rejected draft, and repeated instruction marks something the environment failed to tell the agent.

3. Look for candidates for improvement in these categories.

- **Navigation**: how easy was it for the agent to find the right files? Are there hidden dependencies between files? Would a **navigation pointer** make it easier? _Use when_ the session took a long time to find a piece of information.
- **Automated checks**: are there automated checks that could catch errors the agent made? Linting, typing, tests, filesystem linters? Read the repo's own check command first (its `package.json`/build-tool `lint`/`check` scripts, its CI workflow), so a check that already exists but sits unwired or silently broken is the finding, not a reinvention. A repo with no **guardrail** (no pre-commit hook and no CI job running its lint/typecheck/test command) is itself a finding: an un-linted repo is a standing missed opportunity, not a neutral default. _Use when_ the agent made a mistake an automated check could have caught, or the repo has no guardrail at all.
- **Coding standards**: should the **reviewer agent** be given a new rule to enforce? Should an existing rule be removed or clarified? Classify the violation first: a **mechanical** one (a fixed syntactic pattern, a banned API, an import shape, a file-location rule) gets a deterministic check, full stop: a custom rule in the repo's own linter, a new pre-commit hook, or a new CI job, whichever the repo's language and existing guardrail make easiest to add. Default to building the check over writing the rule. Reserve the coding standards for genuine **judgement calls** (cross-file consistency, "matches the surrounding style," anything no guardrail could ever substitute for). _Use when_ the reviewer agent failed to catch a mistake, or the user corrected the agent's code.
- **Writing standards**: did the user rewrite or reject the agent's prose in a doc, issue, pull request, commit message, or code comment? Classify the correction the way **Coding standards** does. A **mechanical** one (a banned word, a required frontmatter field, line wrapping, a title format) gets a check, such as a markdown formatter or linter, a docs check, or a commit-message lint. A **judgement call** (voice, structure, what a document covers) goes in the writing style guide the agent loads before it writes. _Use when_ the user corrected how the agent wrote something.
- **Domain vocabulary**: did the agent use two words for one concept, choose a name the user corrected, or coin a term the code and docs now share? Record the settled term in `GLOSSARY.md`, with the synonyms to avoid. _Use when_ the user corrected a name, or a term's meaning shifted during the session.
- **Requirements**: did the agent ask the user a question, or settle one on its own, that a requirements or design document should have answered? Sort each question before proposing a fix. One whose answer changes what a user sees, does, or pays, or what data the product keeps about them, is **behavior**, and the fix is an acceptance criterion or clarification in the product requirements document, worded for the user to approve. Any other question is **design**, and the fix is a change to the design document the agent owns, so the next session finds the answer written down instead of asking or guessing. _Use when_ the agent asked the user something mid-implementation, the user answered a question the agent should have found written down, or a review reported a requirements gap.
- **Skills**: did the agent miss a skill whose description should have matched the task, follow one that gave stale or wrong guidance, or improvise a multi-step procedure that a skill should hold? A skill's description decides whether it loads, so a missed skill needs a sharper description before it needs a longer body. _Use when_ the agent missed, misread, or reinvented a skill.
- **Global AGENTS.md**: are there any steering instructions that should be moved to coding standards (or automated checks) instead? _Use when_ an `AGENTS.md` file is particularly large, in the repo or in the user's global scope.
- **Memory**: read the agent's memory index on every retrospective, whatever the session touched, and sort each entry. A note about one person's preferences or one machine stays. A lesson that holds for everyone who works in the repo moves into the skill or file whose task it governs and leaves memory, and a second copy of a rule the repo already states is deleted. A note that bridges until a pull request merges names that pull request, and is deleted once it has merged. Treat an instruction the user repeated from an earlier session the same way. _Run this on every retrospective._
- **Tool economy**: did the agent make expensive tool calls that could be streamlined? Is there any custom tooling (CLIs, MCP servers) that is particularly token-inefficient? _Use when_ the agent made an expensive tool call.
- **No-ops**: look for instructions in steering files that don't modify the agent's behavior. _Use when_ the steering files are large and unwieldy.
- **Information access**: look for opportunities to increase the agent's access to information. Teeing dev server logs, readonly access to third-party services. _Use when_ a crucial piece of information was not available to the agent.

Before proposing a new rule, search for one that already says it, and search the open issues for one that already tracks the change. When an issue does, the candidate is that issue: name it, and fold the change into its plan and acceptance criteria. When the agent broke a rule a file already states, the finding is why the agent never read it (**Navigation**) or why nothing enforced it (**Automated checks**). A second copy of the rule fixes neither.

Two kinds of change stay out of a proposal unless the user asks for them. 1/ Writing a gap in the release process, such as a disabled workflow or a missing branch protection, into a skill, a doc, or a pull request body. Proposing the check itself is fine. 2/ A step that has an agent spawn subagents on its own, since subagents run only when the user asks or approves. Propose a check, a rule, or a checklist instead.

4. When the argument names focus topics, examine each one in depth once the sweep in step 3 is done. The sweep still runs in full, since a focus topic adds to the retrospective and never narrows it. For each topic:

- Trace every moment in the session that touches it, including the ones that went well, and read the repo files that govern it, even those the session never opened.
- Find the root cause: what the environment told the agent, or failed to tell it, that led to what happened. Stop at a cause a change to the environment could fix, rather than at the agent's mistake.
- Weigh the topic against every category in step 3 instead of filing it under the first that fits, and compare at least two ways to address it, with what each costs to maintain.
- When the session holds no evidence on the topic, say so, and reason from the repo and from earlier sessions rather than inventing a lesson.

A focus topic can conclude that nothing should change. Say so plainly, with the reasons, rather than proposing a weak change to fill the slot.

5. Present the candidates from step 3 to the user, in order of severity: what the gap cost this session, and how often it will recur. For each one, name the file it changes and the wording or check you would add, so the user approves the exact change. Report each focus topic in its own section after the ranked list, with the reasoning that led to its conclusion and the changes it proposes in the same form, so a topic the user asked about never displaces a more severe finding from the sweep. A candidate both steps reach appears once, under its focus topic.

6. Make the changes the user approves. Offer to track anything they defer, such as in an issue, so the lesson outlives the session.

## Reference

### Implementation vs Review

Remember that all work goes through two stages: implementation and review. The implementation agent has the most **context pressure**. They are responsible for exploration, writing code, and debugging failures.

The review agent has the least context pressure. It receives a diff, so no exploration needed. It often does not need to write code or debug.

This means that the review agent should be responsible for imposing coding standards, not the implementation agent.

### Files

You have access to several files in the repo, and to the agent's own memory:

- `CLAUDE.md`/`AGENTS.md`: these files are pushed to the context window of any agent working in this repo. They should be used sparingly, usually only for **navigation pointers** to other files.
- `CODING_STANDARDS.md` and `docs/coding-standards/`: the root file maps one standard for each rule ID prefix. A new rule goes in the standard its prefix names, and a new prefix gets its own file and a row in the map.
- `GLOSSARY.md`: the domain vocabulary the code, docs, and conversations share. Agents read it when they name things, so a term that settles during a session goes here rather than in `AGENTS.md`.
- Docs: use docs as references files, pointed to by other files. Look for existing docs before writing new ones.
- Requirements and design documents: the product requirements the user approves, and the design documents an agent derives from them. A question the user had to answer during implementation belongs in one of them, so the next session reads it instead of asking.
- Skills: use skills for docs (since their description goes into the agent's context window), or for user-invoked commands. Follow the style guide from step 1. A skill vendored from another repository is pinned to its source, so propose the change upstream rather than editing the copy. Keep a skill self-contained so another repository can use it, with no issue numbers and no step numbers of another skill.
- Memory: notes the agent keeps for one user on one machine, such as Claude Code's auto memory. Nobody else reads them, so a lesson that holds for everyone who works in the repo belongs in one of the files above.
