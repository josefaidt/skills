---
name: filing-issues
description: How to organize a repository's GitHub issues so a session with no memory can carry each one to a merged pull request, and how to file, edit, close, and audit them. Covers the hierarchy of milestones, trackers, tasks, decisions, and parents; the header line each body opens with; kind, priority, size, status, and area labels; sizing by the reasoning an issue leaves its session, which picks the model; the bar a task must meet; blocked-by relationships and sub-issues; the rule that a blocker is never less urgent than what it blocks; how to sort a finding into a fix, a decision, a filed issue, or nothing; and the gh commands for each. Use when filing or editing issues, cutting tasks from a design, adding a dependency, closing an issue, auditing a milestone, or deciding what to do with a finding you would otherwise note as a follow-up, for later, or a TODO.
---

# Filing issues

An issue exists so a session with no memory of the project can carry it to a merged pull request without a call a person would want to review. Keep issues few, thin, and linked, so the owner's attention goes to decisions rather than triage.

Read the `Issues and sessions` section of `AGENTS.md` first. It names the repository, its labels, its checks, and its owner documents. When it is missing, run `new-github-repo` or ask the user, rather than guessing a label. Load `writing-prose` before drafting a body, since an issue is a briefing. [references/issue-body.md](references/issue-body.md) has the body format and how to write a `Done when`, and [references/commands.md](references/commands.md) has the `gh` commands.

## Hierarchy

Milestones are releases or efforts, and every open issue sits in exactly one.

| Kind | Holds | Label | Title |
| :-- | :-- | :-- | :-- |
| Tracker | The parent for one feature, linking its RFC or PRD | `kind:tracker` | A noun phrase: `Password reset` |
| Task | One pull request's worth of work | `kind:task`, or `kind:bug` or `kind:security` for a defect | An imperative: `Expire reset links after 30 minutes` |
| Decision | A question answered before tasks can proceed | `kind:decision`, plus `status:needs-human` on a behavior question | Starts with `Decide` |

A tracker links its RFC and holds no requirements. A task with sub-issues is a parent: it keeps its kind, drops its size, and takes a noun phrase. GitHub's sub-issue links form the tree. A behavior question, meaning one about what a user sees, does, or pays, or what data the product keeps, belongs to the owner. A design question belongs to an agent, and the session that hits one answers it in the design.

## Labels and titles

Use only labels that exist, read with `gh label list`. Never create, rename, or delete one unless the user asks. When none fits, name the label you would add and why.

| Prefix | Rule |
| :-- | :-- |
| `kind:` | Exactly one, from the hierarchy |
| `priority:` | Exactly one, `0` most urgent to `3` |
| `size:` | Exactly one on every task and decision that is not a parent |
| `status:needs-human` | On a behavior decision, or work that needs a person's hands, such as a real device, an account, or a key |
| `area:` | One per labeled folder whose behavior the issue changes |

| Priority | The issue |
| :-- | :-- |
| `priority:0` | Is on the critical path to the milestone, or fixes a security defect in shipped code |
| `priority:1` | Is needed for the milestone |
| `priority:2` | Belongs in the milestone, which holds without it |
| `priority:3` | Waits for spare capacity, and nothing depends on it |

Choose the priority, milestone, and size yourself and name them in your report. A value the user sets stands. Titles use sentence case and never name the kind.

## Sizing

Size measures the reasoning an issue leaves its session, never the files or lines it touches, and it picks the model a coordinator starts it on.

| Label | Scope | Model |
| :-- | :-- | :-- |
| `size:sm` | Menial: the issue spells out the change, and nothing is left to decide or check beyond the repository's checks. A rename, a move, a version bump, a docs-only edit, a fix whose exact change the finding gives | Haiku |
| `size:md` | The default. The design bounds the approach, and the session reasons through edge cases, ordering, concurrency, tests, or callers that change | Sonnet |
| `size:lg` | Crosses modules, sets a trust boundary, or its shape depends on what the session finds, and still fits one reviewable pull request | Opus |

Size `md` unless the task is plainly menial or plainly large. A task that asks its session to choose a test, read a caller, or weigh an edge case is not `sm`, since a small model then needs a longer brief and more follow-ups than the larger model it saved. Never size `lg` because a task feels important.

Every issue costs the same overhead whatever its size: a brief, the session's reading before it starts, a review, a report, and a merge. So file fewer, larger issues. Work one session carries in one reviewable pull request is one issue, and small work in the files a task already changes joins that task rather than standing alone. Split only where the split buys something: a part that must land first, a part that needs a different model, a part that needs the owner's hands, or a diff too large to read in one sitting. Work bigger than `size:lg` is a parent with sized sub-issues.

## Relationships

A blocked-by relationship means the issue cannot start or finish until the other closes. A sub-issue link means it is part of a parent or tracker. Record both in GitHub, never as a label or a body line. Two tasks that only share files need no relationship, since the coordinator settles overlap in each wave's briefs.

Fix these yourself and name them in your report:

1. **Priority inversion.** A blocker is never less urgent than anything it blocks, directly or through a chain.
2. **Milestone inversion.** A blocker sits in the same milestone as what it blocks, or an earlier one.
3. **Cycles.** The usual cause is a `Done when` that needs work the issue itself blocks. Move that check into the blocked issue.

## The bar

The session that picks up a task reads `AGENTS.md`, the skills, the issue and its comments, the RFC statements and design subsections it links, and its coordinator's brief, which names today's files. A task meets the bar when it has:

1. no open question, because every choice is settled in the body or the design, or split into a blocking decision
2. a link to each RFC statement and design subsection it builds, by ID and heading
3. the decisions it rests on, linked to where they were made
4. a `Done when` of outcomes a reviewer confirms from the diff or by running the code
5. a size of `size:lg` or smaller

A task that fails the bar goes to Opus or a person, whatever its size.

## Follow-ups

Sort each finding the work turns up before writing it down anywhere, without asking the user.

1. Fix it in this pull request when the issue's statements or `Done when` need it, or when it sits in a file the pull request already changes and fits the task's size.
2. When it shows that an RFC or the issue is wrong or silent, file one decision issue, with `status:needs-human` only when the answer is behavior. When the gap blocks the `Done when`, stop instead.
3. File anything else outside the scope yourself, under the effort it belongs to, including a security fix a review turns up in merged code. When an open task that no session has started changes the same files, add the finding to that task's body rather than filing a new one. Ask first only when it adds behavior no RFC asks for.
4. Drop a nit that changes no behavior.

Search for an existing issue before filing. Writing "follow-up", "for later", or "TODO" in a pull request, a comment, or a doc is not a record, so link the issue from each place the gap is written.

## Filing, editing, closing, and auditing

**Filing.** Search with `gh issue list --state all --search` as its own command and read each hit, since same-day duplicates from parallel sessions are the most common clutter. Choose labels and milestone, check the design and decisions that already answer part of it, write the body to a scratch file, check it against the bar, create it, then add its relationships and sub-issue link and check priorities across every edge you added.

**Cutting tasks from a design.** File one wave at a time, when it is ready to start, so each `Done when` is written against the tree that builds it. Check that the wave's tasks together cover every `MUST` statement they claim, each exactly once, and that their blocked-by edges match the order the design needs.

**Editing.** Fetch the body to a file right before editing, since other sessions edit the same issues. An open pull request that closes the issue builds against the copy its author read, so comment on it with what changed.

**Closing.** A merged pull request closes its issue only when it targets the default branch. After a merge, check the issue closed, and close it yourself with a comment naming the pull request when it didn't. Otherwise close an issue yourself only as a duplicate, superseded, or a decision answered elsewhere, each with a comment saying why. Ask before closing for any other reason.

**Auditing a milestone.** Run the audit query, record as relationships the dependencies bodies state in prose, check each issue against merged work since it was filed, look for duplicates, and check the gotchas under "Relationships" and for tasks missing a size or parent.
