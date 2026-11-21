# Evals

Harbor datasets that check whether a skill makes an agent do what the skill says, and how that holds across models and reasoning effort. Each dataset covers one skill. A task gives the agent a realistic job in a container, and a verifier scores the result with no model in the loop.

[Harbor](https://harborframework.com) runs the tasks. It needs Docker and an `ANTHROPIC_API_KEY`, and installs with `uv tool install harbor`.

## Datasets

### `reviewing-code`

Each task builds a small multi-tenant password reset service with a `CODING_STANDARDS.md` and an accepted RFC, checks out a `feature` branch, and asks the agent to review the pull request into `main`. The verifier compares the review with the findings the task expects. The instruction gives every agent the review's shape, with or without the skill, so a run with the skill and one without differ in judgment, not format.

| Task | The diff | What a good review does |
| :-- | :-- | :-- |
| `blocking-violations` | Logs a reset secret, skips the tenant filter, and invalidates every tenant's tokens with `\|\|` | Reports two blocking rules and the defect, and requests changes |
| `advisory-only` | Returns bare strings as error bodies | Reports one advisory rule and comments without blocking |
| `clean-diff` | Adds a correct redeem flow with tests for each behavior it claims | Approves with no findings |
| `untested-behavior` | A correct diff that claims a `MUST` it never tests | Requests changes for the untested behavior and nothing else |
| `exception-accepted` | Breaks a blocking `SHOULD` rule on purpose, with a reason specific to the change | Accepts the exception and approves |
| `exception-rejected` | Reads across tenants in `lib/` and claims an exception to the `MUST` rule against it | Rejects the exception, since a `MUST` takes none, and requests changes for the violation |

The verifier writes `reward.json` with these scores, each from 0 to 1:

| Score | Measures |
| :-- | :-- |
| `recall` | The share of expected findings, untested behaviors, and exceptions the review reports |
| `precision` | The share of the review's findings that match an expected one. Comments no rule backs lower it |
| `severity` | The share of matched findings filed as blocking or advisory as the rule's status says |
| `verdict` | Whether the verdict matches |
| `untouched` | Whether the repository is unchanged. A review that edits code scores 0 overall |
| `reward` | `untouched × (0.4 recall + 0.3 precision + 0.2 verdict + 0.1 severity)` |

`precision` is the score to watch. The review skill exists to stop findings that cite no rule, and `clean-diff` and `advisory-only` are where a reviewer without it adds them.

## Running

Check that every task is solvable and the verifier scores its reference review as 1:

```sh
harbor run -p evals/reviewing-code -a oracle
```

Run the skill on one model. `--skill` uploads the skills from this checkout, so a run always tests the working tree:

```sh
harbor run -p evals/reviewing-code -a claude-code -m anthropic/claude-sonnet-5-5 \
  --skill skills/reviewing-code --skill skills/writing-typescript -k 3
```

`-k 3` runs each task three times, since one run says little about a model that is right two times in three.

Run the same command without `--skill` for a baseline. The gap between the two is what the skill adds.

To compare models and effort, run one job per combination and compare the jobs in `harbor view ./jobs`:

```sh
for model in claude-haiku-5-5 claude-sonnet-5-5 claude-opus-5-5; do
  for effort in low high; do
    harbor run -p evals/reviewing-code -a claude-code -m "anthropic/$model" --effort "$effort" \
      --skill skills/reviewing-code --skill skills/writing-typescript -k 3
  done
done
```

Harbor documents `--effort` for agents that support it. Check that a Claude Code run's logs show the effort you asked for before you trust the comparison.

## Adding a task

Files every task in a dataset shares live in `shared/<dataset>/`: the fixture repository, the Dockerfile, the build script, the instruction, and the verifier. A task directory holds only what makes it different:

- `task.toml`
- `environment/branch/`, the files the pull request adds or changes
- `environment/pr-body.md`, whose first line becomes the commit message
- `tests/expected.json`, the findings, untested behavior IDs, exceptions, and verdict a good review has
- `solution/review.md`, the review a good reviewer would post

Then run `bun run evals:sync` to copy the shared files in, and run the oracle to confirm the new task scores 1. Edit a shared file in `shared/`, never in a task, and sync again. `bun run evals:sync --check` fails when a task's copy has drifted.

A finding's lines in `expected.json` are lines in the formatted file, so format the branch files before you write them down. A planted defect works best when the diff's own tests still pass, since a reviewer that only runs the tests should not find it for free.
