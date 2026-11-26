# Tasklist

The tasklist turns a milestone's open issues into a worklist: what to start, in what order, which work runs side by side, and which model each session starts on.

## Procedure

1. Run `bun scripts/tasklist.ts [milestone]`, which prints one line per open issue. With no argument it takes the lowest-numbered open milestone that still has open issues.
2. Read the bucket each line starts with.
   - `in-flight` has an open pull request that closes it, or the repository's assignee. Leave it alone and list it.
   - `ready` is a task, bug, or security fix with no open blockers.
   - `needs-you` is a `status:needs-human` issue with no open blockers.
   - `blocked` waits on the issues in its `blockedBy` column. List what each waits on.
   - `tracker` and `parent` are containers, not work.
3. Read the body of each ready task and check it against the bar in `filing-issues`. A task that fails goes to Opus at `xhigh`, and the note says why. Size any task that has no size label before going on, honestly and down when in doubt.
4. Order the ready tasks by priority, then by how many issues each unblocks through chains in the blocked bucket, then smaller first.
5. Group the ready tasks into lanes. Two tasks share a lane when they carry the same area label, or when both change the same files on `origin/main`, judged from the design sections each cites. Lanes run in parallel, and tasks inside a lane run one after another, unless a supervisor runs the lane. A blocked issue joins the lane of its blocker, after it. A small task that moves or deletes code goes before the tasks that would otherwise edit that code.
6. Move `priority:3` tasks that unblock nothing into a tail list for spare capacity.
7. Report in the format below.

## Report format

```markdown
| Lane | Order | Issue | Size | Model | Effort | Note |
| :-- | :-- | :-- | :-- | :-- | :-- | :-- |
| Tokens | 1 | [#4](https://github.com/<owner>/<repo>/issues/4) Move token helpers into their own module | sm | Haiku | medium | Moves code #5 would otherwise edit |
| Tokens | 2 | [#5](https://github.com/<owner>/<repo>/issues/5) Expire reset links after 30 minutes | md | Sonnet | high |  |
| Limits | 1 | [#7](https://github.com/<owner>/<repo>/issues/7) Rate-limit reset requests | md | Sonnet | high | Concurrent requests per account |
| Keys | 1 | [#11](https://github.com/<owner>/<repo>/issues/11) Sign reset tokens with rotating keys | lg | Opus | high | New trust boundary: signing keys |
```

Write every issue and pull request as a markdown link to its full URL. After the table, list **Needs you**, **Blocked, next up**, **In flight**, and **Tail**, then any `size:lg` task whose body covers more than one pull request, to split before it starts.

## Reading the output

Each line is tab-separated: bucket, issue, priority, size, areas, open blockers, open issues it blocks, and title. A missing label prints `priority:?` or `--`, which is the cue to label the issue before planning it.
