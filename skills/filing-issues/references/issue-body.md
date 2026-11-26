# Issue body

An issue body holds what changes slowly, the outcome and how to check it, and leaves what changes daily, the files and steps, to the brief a coordinator writes from current `main`. A reader who stops after the parts below knows what the issue is for, and a body that runs past a screen is usually two issues.

## Header

Every task and decision opens with a blockquote before its first heading.

```text
> **Owner decision required. Not for automated pickup.**
> RFC: docs/rfcs/password-reset.md (RESET-3) · Milestone: Accounts · Parent: #40
```

The first line appears only with `status:needs-human`. The second names the RFC and the capability it builds, as `(RESET-3)`, or a single statement, as `(RESET-3.2)`, then the milestone and the parent, leaving out any that do not apply. Dependencies live only in GitHub's relationships.

## Parts

| Part | Holds |
| :-- | :-- |
| Opening paragraph | The problem in a sentence or two, the decision or document it follows from, and what the result is for |
| `Outcome` | What a person can see when it is done |
| `Behavior` | The statement IDs it delivers, each with a few words, such as `RESET-3.2` (a used link is rejected) |
| `Design` | Links to the design subsections it builds, by heading |
| `Decisions` | Optional. A choice the work rests on that the design does not hold, such as a new dependency |
| `Done when` | What must be true when the work is done, each item a reviewer confirms from the diff or by running the code |
| `Not in this issue` | What it leaves out, with the issue that covers each item |

A task has no `Work` list of files or steps. The coordinator's brief names them from current `main`.

## Writing `Done when`

Each item states an outcome, and the session and reviewer choose the check. Name a command only when the outcome is that command's result, such as the checks passing, or a test named by a statement's ID that fails without the change.

- Avoid: "`git grep oldName` returns nothing." It also matches applied migrations and designs left as written, so it fails on a correct change.
- Prefer: "No source file outside `migrations/` refers to `oldName`."

Known gotchas:

1. **Conditional behavior.** Behavior that shows only under a condition, such as a taken port or a setting turned on, names the condition, since a check on a quiet machine never reaches the code.
2. **Checks before merge.** Every item is one a session confirms before merge. A check that needs the owner's hands, such as a run in the real app with a real account, goes in a `status:needs-human` issue the task blocks.
3. **Seams.** A task that leaves a stub for a later task names the stub and the task that fills it, so the later brief finds it.
4. **Absence tests.** Ask for a test that something is absent only when a statement states the absence. Otherwise a search confirms it.

## What to leave out

Leave out line numbers and pasted code, which go stale before pickup, and link a statement by ID or a design subsection by heading instead of copying it.
