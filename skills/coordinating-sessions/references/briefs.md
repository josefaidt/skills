# Briefs

A brief is the prompt that starts a task session. The issue holds the outcome and the check, the design holds the strategy, and the brief holds today's files, written from current `main` right before the session starts. The session trusts the brief over its own reading, so every value in it must be right.

## The opening prompt

Start each session with this prompt, then the brief's notes after it.

```text
Address #<n>. Load the `addressing-issues` skill and follow it through the report, including the review in the same session. A coordinator session started this one under the coordinating-sessions skill. Do not merge and do not turn on auto-merge. Leave owner documents and shared docs to the coordinator, and list what they need under Docs to change. After you report, push nothing more: if an automated review flags something, report the finding and the fix you propose instead.
```

When `addressing-issues` is not installed, write its steps into the brief: sync with `origin/main`, read the issue and the design it links, do the work with a test named by each behavior's ID, run the checks, open a draft pull request, review it, mark it ready, and report.

## What the notes hold

1. **The work, from current `main`.** The files the cited design sections reach today, each file a `Done when` item reaches, and every file that names a file the task moves or renames, found with `git grep -n <name>` over the whole tree. Read each before sending, since an issue's list goes stale.
2. **What merged since the issue was filed**, by pull request, when it changes what the task builds on. Name the stub an earlier task left for this one, such as a function that returns a placeholder.
3. **Seams for later tasks.** When this task leaves something for a later one, say what to leave and where, so the later brief can name it.
4. **Shared files.** When another running session changes the same file, give each section to one session, name the order they merge in, and say which one rebases. Module lists and import blocks conflict trivially, so name them too.
5. **Security rules that already hold**, such as which hosts may skip certificate checks, when the task touches network or authentication code, so a new path keeps them.
6. **What the owner asked**, quoted, when it changes the task.
7. **The model and effort's limits.** For a Haiku task, say that a task bigger than its brief is a stop, not a reason to push on.

Name the file that declares a type or field the task relies on, rather than restating its shape. Check each concrete value the brief adds, such as a path, a symbol, or a number, against `origin/main` before sending it, and say when a value is the coordinator's choice rather than a document's.

## Starting before a blocker merges

Start a task before its blocker merges only when it builds on the blocker's code and waiting would idle its lane. Cut it from the blocker's branch, name that branch and commit in the brief, and tell the session to rebase with `git rebase --onto origin/main <that commit>` once the blocker squash-merges, so the blocker's commits aren't replayed. Merge in blocker order.
