# CI

Examples for the CI step.

## `.github/actions/setup/action.yml`

A composite action, so each workflow that needs the toolchain installs it the same way.

```yaml
name: Setup
description: Install Bun and workspace dependencies

runs:
  using: composite
  steps:
    - uses: oven-sh/setup-bun@v2
      with:
        bun-version-file: .bun-version
    # A cold `bun ci` installs in seconds, faster than restoring a package cache
    - run: bun ci
      shell: bash
```

## `.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    types: [opened, synchronize, reopened, ready_for_review]
  push:
    branches: [main]
  workflow_call:

# One group per pull request, so a new push cancels the run for the commit it replaces
concurrency:
  group: ci-${{ github.event.pull_request.number || github.run_id }}
  cancel-in-progress: true

permissions:
  contents: read

jobs:
  # Every check runs in one job, since each job spends its first seconds on checkout and install
  # and GitHub bills each job rounded up to a whole minute. Each step runs even after an earlier one
  # fails, so a push reports every failure at once.
  ci:
    name: CI
    runs-on: ubuntu-24.04
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v6
      - uses: ./.github/actions/setup

      - name: Format check
        if: ${{ !cancelled() }}
        run: bun run fmt:check

      - name: Lint
        if: ${{ !cancelled() }}
        run: bun run lint --format github

      - name: Typecheck
        if: ${{ !cancelled() }}
        run: bun run typecheck

      - name: Build packages
        if: ${{ !cancelled() }}
        run: bun run build

      # the github-actions reporter annotates each failing assertion on the diff
      - name: Unit tests
        if: ${{ !cancelled() }}
        run: bun run test --reporter=default --reporter=github-actions
```
