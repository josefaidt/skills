# Supervising a lane

A supervisor is a Sonnet session at `high` effort that runs one lane of a wave under the coordinator, so several tasks in that lane can run at once without their pull requests going stale against each other. It reads `main` once for the lane, settles in the briefs which task changes which part of each shared file, starts one session per task, and hands the coordinator one report once every pull request is ready and a trial merge of all of them passes. A lane that runs its tasks one at a time needs no supervisor, and most lanes don't need one at all, since the coordinator can brief parallel tasks itself.

Sonnet is enough because a supervisor's work is coordination: briefs, splitting shared files, follow-ups, a trial merge, and a report. It never merges, and the coordinator reads every pull request before it lands, so a supervisor's mistake costs a rebase. Start it on Opus at `high` only when its lane holds an Opus-sized task or splits a trust boundary, since a supervisor that briefs a task should be able to follow that task's design.

## What it owns

The files the coordinator gives its lane for the wave, and every structural choice about them: where a helper or a test lives, and the order its tasks' pull requests land in. No other session in the wave changes them.

## What it may do

1. Start one session per issue its charter names, each in its own worktree, from a branch at `origin/main`, on the model and effort the charter names.
2. Write each brief from current `main`, as [briefs.md](briefs.md) describes, naming the part of every shared file each session changes.
3. Send its sessions follow-ups for their own issues, such as a rebase.
4. Run the trial merge on its sessions' pull requests in the order it recommends merging them.

It never merges, never edits an issue or an owner document, never starts a session for an issue its charter does not name, and passes any refused command to the coordinator unchanged.

## The charter

The coordinator starts a supervisor with a charter in place of the task prompt. It tells the supervisor to load `coordinating-sessions` and follow this file, then names each issue in the lane with its model and effort, the files the lane owns, the open pull requests outside the lane that change them, and any facts the coordinator already checked on `main`.

## The lane report

When every pull request is ready and the trial merge passes, or when something needs the coordinator or the owner:

1. Each pull request, with its issue, its head commit, and the order the trial merge ran them in.
2. Each session's Decisions, and what the supervisor reconciled between them.
3. The trial merge's checks and what each reported.
4. What waits on the coordinator or the owner, such as a refused command, a dependency added, or a Docs to change entry.
5. Errors in its briefs that it or a session caught, for the next reflection.

The coordinator checks each pull request as "Reading a report" describes and merges them in the trial's order. When a pull request outside the lane merges first, it runs the trial merge again before the next merge.
