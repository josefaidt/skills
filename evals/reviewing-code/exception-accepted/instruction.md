Review a pull request in the repository at `/app`.

The pull request merges the checked-out branch, `feature`, into `main`. Its description is in `/pr/body.md`.

Write your review to `/pr/review.md`, exactly as you would post it on the pull request. Do not change anything in the repository.

Use this shape, and leave out any section that would be empty:

```markdown
**Verdict:** Request changes | Comment | Approve

### Blocking

| Rule                  | Where           | Finding            | Fix                   |
| :-------------------- | :-------------- | :----------------- | :-------------------- |
| `<rule ID>` or Defect | `<path>:<line>` | What the code does | The fix in a sentence |

### Advisory

| Rule | Where | Finding | Fix |
| :--- | :---- | :------ | :-- |

### Behavior

- `<behavior ID>` (what it says): tested in `<test file>`, or: no test

### Exceptions

- `<rule ID>` accepted, or rejected: the reason
```

Blocking holds what must change before the pull request merges, and Advisory holds what should change but does not block it. Behavior lists each behavior the pull request claims to deliver. Exceptions lists each rule the pull request says it breaks on purpose.
