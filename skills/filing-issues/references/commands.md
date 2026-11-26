# Commands

`<owner>/<repo>` is the repository the `Issues and sessions` section of `AGENTS.md` names. Quote any URL with a query string, since zsh globs `?`.

```sh
# Search before filing, as its own command
gh issue list --repo <owner>/<repo> --state all --search "<terms>"

# Labels and milestones
gh label list --repo <owner>/<repo> --limit 200
gh api 'repos/<owner>/<repo>/milestones?state=all' --jq '.[] | "\(.number)\t\(.title)\t\(.state)"'

# Create
gh issue create --repo <owner>/<repo> --title "<title>" --label kind:task,priority:2,size:md --milestone "<milestone title>" --body-file <file>

# The REST id that relationship calls take, which differs from the issue number
gh api repos/<owner>/<repo>/issues/<number> --jq .id

# Blocked by
gh api -X POST repos/<owner>/<repo>/issues/<blocked>/dependencies/blocked_by -F issue_id=<blocker id>
gh api -X DELETE repos/<owner>/<repo>/issues/<blocked>/dependencies/blocked_by/<blocker id>

# Sub-issue
gh api -X POST repos/<owner>/<repo>/issues/<parent>/sub_issues -F sub_issue_id=<child id>

# Swap a priority
gh issue edit <n> --repo <owner>/<repo> --remove-label priority:2 --add-label priority:1

# Pull requests that close an issue you edited
gh pr list --repo <owner>/<repo> --search "<n>" --state open
```

## Closing

| Case | Command |
| :-- | :-- |
| Merged, but the issue stayed open | `gh issue close <n> --reason completed --comment "Done in #<pr>."` |
| Duplicate | `gh issue close <n> --duplicate-of <original> --comment "<why>"` |
| Superseded by other work | `gh issue close <n> --reason "not planned" --comment "<what superseded it>"` |
| Decision answered elsewhere | `gh issue close <n> --reason completed --comment "<where the decision is recorded>"` |

## Auditing a milestone

```sh
gh api graphql -F owner=<owner> -F name=<repo> -F m=<milestone number> -f query='
query($owner: String!, $name: String!, $m: Int!) { repository(owner: $owner, name: $name) { milestone(number: $m) {
  issues(first: 100, states: OPEN) { nodes {
    number title labels(first: 20) { nodes { name } }
    blockedBy(first: 20) { nodes { number state } }
    blocking(first: 20) { nodes { number state } }
    subIssues(first: 30) { nodes { number state } }
    parent { number }
} } } } }'
```
