---
name: new-github-repo
description: Set up a GitHub repository so agents can file, size, and merge work in it, or bring an existing repository's settings and labels into line. Covers pushing `main` and making it the default branch, squash-only merges with auto-merge and branch deletion, the `kind:`, `priority:`, `size:`, and `status:` labels that route work to a model, `area:` labels for busy folders, a first milestone, and the `Issues and sessions` section of `AGENTS.md` that issue and coordination skills read. Use when creating a GitHub repository, when a repository has no labels or milestones yet, before the first issue or the first coordinated milestone, or when pull requests merge without closing their issues.
argument-hint: "[owner/repo]"
---

# New GitHub repository

This skill sets up the GitHub side of a repository: where `main` lives, how pull requests merge, the labels that sort and route issues, and the section of `AGENTS.md` that tells an agent how this repository runs its issues and sessions. Each step checks before it changes, so running it on a repository that is already set up changes nothing and reports that.

Every step is an outward change to the user's repository, so show the user the steps you will run and what each changes, and wait for their word before the first one. Their word covers the steps you listed and nothing later.

## Before you start

1. Resolve the repository: the argument, or `gh repo view --json nameWithOwner --jq .nameWithOwner` in the current checkout. Stop if `gh auth status` fails or the user can't administer it, as `gh api repos/<owner>/<repo> --jq .permissions.admin` shows.
2. Read what exists: `gh api repos/<owner>/<repo>`, `gh label list --repo <owner>/<repo> --limit 200`, `gh api 'repos/<owner>/<repo>/milestones?state=all'`, and `git ls-remote --heads origin`. Report what differs from each step below before changing anything.

## Steps

### 1. `main` on GitHub, and the default branch

Check `git ls-remote --heads origin main`. When it prints nothing, `main` exists only locally, and every pull request has nothing to target. Push it with `git push origin main` once the user agrees, since it publishes whatever local `main` holds.

Then make `main` the default branch: `gh api -X PATCH repos/<owner>/<repo> -f default_branch=main`. GitHub reads `Closes #N` only on a pull request into the default branch, so with any other default, every merge leaves its issue open. A repository whose first push was a feature branch has that branch as its default, which is easy to miss.

### 2. How pull requests merge

Set squash merges only, auto-merge on, and the head branch deleted after a merge:

```sh
gh api -X PATCH repos/<owner>/<repo> \
  -F allow_squash_merge=true -F allow_merge_commit=false -F allow_rebase_merge=false \
  -F allow_auto_merge=true -F delete_branch_on_merge=true \
  -f squash_merge_commit_title=COMMIT_OR_PR_TITLE -f squash_merge_commit_message=COMMIT_MESSAGES
```

A squash keeps one commit per pull request on `main`, which is what a reviewer and `git log` read. Auto-merge can then be turned on for a pull request, but GitHub only accepts it while something is pending, such as a required check or review. A repository with no branch protection merges a mergeable pull request at once, so `gh pr merge --squash` is the way to merge there. Tell the user so when they ask for auto-merge.

### 3. Labels

Create the label set in [references/labels.md](references/labels.md) with `gh label create --force`, which updates a label that already exists instead of failing. Leave every other label alone, and list any that overlap a label in the set, such as `bug` beside `kind:bug`, for the user to merge or delete.

The labels do three jobs: `kind:` says what an issue is, `priority:` orders it, and `size:` says how much reasoning it leaves its session, which picks the model a coordinator starts it on. `status:needs-human` marks work an agent must not pick up. Add `area:` labels only for the busiest folders, one per folder, from what `git log --stat` shows changes most, and ask the user before adding more than a few.

### 4. A first milestone

When the repository has no open milestone and the user has work in mind, create one named for what it delivers: `gh api repos/<owner>/<repo>/milestones -f title="<name>" -f description="<what it delivers>"`. Every open issue sits in exactly one milestone, so the issue skills need one to file into.

### 5. The `Issues and sessions` section of `AGENTS.md`

Write this section into `AGENTS.md`, filling each value from the repository. Issue and coordination skills read it for everything that differs between repositories, so a value left out is one each session has to guess.

```markdown
## Issues and sessions

- Repository: `<owner>/<repo>`. Issues use the labels in `new-github-repo`: `kind:`, `priority:`, `size:`, `status:needs-human`, and `area:<folder>` for <folders>.
- Checks, in order: `<name>`: `<command>`, one per check a pull request must pass, such as `fmt`: `cargo fmt --check`. A coordinator runs each on a trial merge, and a lockfile it regenerates names its command too, such as `Cargo.lock`: `cargo update --workspace`.
- CI: <runs these checks on each pull request | is off, so the coordinator runs them on a trial merge>.
- Owner documents, which change only with the owner's word: <VISION.md, an RFC's Behavior and status, ADRs, GLOSSARY.md>.
- Assignee for issues in flight: <a bot account, or none, in which case an open pull request alone marks an issue in flight>.
```

## Report

End with what changed and what was already right, step by step, and any label the user should merge or delete. Leave nothing half set: when a step fails partway, say which commands ran.
