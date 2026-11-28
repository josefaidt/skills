# Release workflow

Two GitHub Actions workflows release a stage. `release.yml` is the button you press in the Actions tab, and `deploy.yml` holds the steps, so another trigger, such as a release on a tag, can reuse them. They assume a `.github/workflows/ci.yml` that `workflow_call` can run, and a `.github/actions/setup` action that installs Bun and the workspace.

Replace these placeholders:

- `<Stack>` is the name the root stack passes to `Alchemy.Stack`.
- `<logical id>` is a resource every stage declares, such as the main Worker.
- `<owner>/<name>` is the repository.
- `appUrl` is a stack output holding the URL the smoke test requests.

## Secrets

Each GitHub environment, such as `production`, deploys one Alchemy stage. Its Cloudflare account ID and API token live in a 1Password Environment, which needs 1Password CLI 2.41.0 or later, and two GitHub environment secrets reach it:

- `OP_SERVICE_ACCOUNT_TOKEN` is a 1Password service account token that can read that Environment.
- `OP_ENVIRONMENT_ID` is the Environment's ID.

The API token needs Workers Scripts Edit, which also covers the state store and its tags, and an edit permission for each other resource type the stack declares, such as D1 Edit or Workers KV Storage Edit. It also needs Secrets Store access: the store keeps its access token and encryption key there, and Alchemy writes both the first time it deploys the store in an account.

## `release.yml`

```yaml
name: Release

on:
  workflow_dispatch:
    inputs:
      environment:
        description: Environment to release
        required: true
        type: choice
        options:
          - production

permissions:
  contents: read

jobs:
  release:
    name: Release ${{ inputs.environment }}
    uses: ./.github/workflows/deploy.yml
    with:
      environment: ${{ inputs.environment }}
    secrets: inherit
```

## `deploy.yml`

```yaml
name: Deploy

on:
  workflow_call:
    inputs:
      environment:
        description: GitHub environment to deploy, which names the Alchemy stage
        required: true
        type: string

concurrency:
  group: release-${{ inputs.environment }}
  cancel-in-progress: false

permissions:
  contents: read

jobs:
  validate-environment:
    name: Validate environment
    runs-on: ubuntu-24.04
    outputs:
      stage: ${{ steps.environment.outputs.stage }}
    steps:
      - name: Resolve environment
        id: environment
        env:
          TARGET_ENVIRONMENT: ${{ inputs.environment }}
        run: |
          case "${TARGET_ENVIRONMENT}" in
            production)
              echo "stage=production" >> "${GITHUB_OUTPUT}"
              ;;
            *)
              echo "::error title=Unsupported environment::${TARGET_ENVIRONMENT} is not a supported release environment"
              exit 1
              ;;
          esac

  ci:
    name: CI
    uses: ./.github/workflows/ci.yml

  deploy:
    name: Deploy ${{ inputs.environment }}
    needs: [ci, validate-environment]
    runs-on: ubuntu-24.04
    timeout-minutes: 30
    environment:
      name: ${{ inputs.environment }}
      url: ${{ steps.urls.outputs.app_url }}
    outputs:
      app_url: ${{ steps.urls.outputs.app_url }}
    env:
      OP_ENVIRONMENT_ID: ${{ secrets.OP_ENVIRONMENT_ID }}
      STAGE: ${{ needs.validate-environment.outputs.stage }}
    steps:
      - uses: actions/checkout@v6
      - uses: ./.github/actions/setup
      - name: Install 1Password CLI
        uses: 1password/install-cli-action@1a3160d5e9de1ae0803eaa08a88746f5ae3daa50 # v4.1.0
        with:
          version: 2.42.0
      # Alchemy reads Cloudflare credentials only from the environment in CI, so fail before
      # anything is built when one is missing. `op run` hands the token to this one command and
      # conceals it in the command's output.
      - name: Check Cloudflare credentials
        env:
          OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
        run: op run --environment "${OP_ENVIRONMENT_ID}" -- bun x alchemy provider check-env
      - name: Build the apps
        run: bun run build:apps
      # A deploy that finds no state creates a second copy of the stack under new names, so stop
      # when the store has no record of a resource every stage declares.
      - name: Check the stage's state
        env:
          OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
        run: |
          records="$(op run --environment "${OP_ENVIRONMENT_ID}" -- bun x alchemy state ls "<Stack>/${STAGE}" --no-input)"
          printf '%s\n' "${records}"
          if ! grep -q "<Stack>/${STAGE}/<logical id>" <<<"${records}"; then
            echo "::error title=Missing state::The state store has no records for <Stack>/${STAGE}, so a deploy would create a second copy of the stack. Rebuild the stage's state before deploying."
            exit 1
          fi
      # `--yes` approves the plan, which Alchemy otherwise asks a terminal to confirm. A deploy also
      # applies any D1 migrations that haven't run, so there is no separate migration step.
      - name: Deploy the stack
        env:
          OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
        run: op run --environment "${OP_ENVIRONMENT_ID}" -- bun x alchemy deploy --stage "${STAGE}" --yes
      # Alchemy makes the state store's Worker with no tags, so add this repository's tag to it,
      # keeping the tags other repositories added. A store upgrade during a deploy can re-upload
      # the Worker, so this runs after every deploy.
      - name: Tag the state store
        env:
          OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
          STATE_STORE: alchemy-state-store
          REPO_TAG: repo:<owner>/<name>
        run: |
          op run --environment "${OP_ENVIRONMENT_ID}" -- bash -euo pipefail -c '
            url="https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/workers/scripts/${STATE_STORE}/script-settings"
            auth="Authorization: Bearer ${CLOUDFLARE_API_TOKEN}"
            tags="$(curl --fail --show-error --silent --header "${auth}" "${url}" |
              jq --compact-output --arg tag "${REPO_TAG}" "(.result.tags // []) + [\$tag] | unique")"
            curl --fail --show-error --silent --request PATCH --header "${auth}" \
              --header "content-type: application/json" --data "{\"tags\":${tags}}" "${url}" |
              jq --exit-status --arg tag "${REPO_TAG}" ".result.tags | index(\$tag) != null"
          '
      # The stack's URLs depend on the account's workers.dev subdomain, so read them from the
      # outputs the deploy just saved. In CI other lines can surround the JSON, so pick each URL
      # out by its key.
      - name: Read the stack's URLs
        id: urls
        env:
          OP_SERVICE_ACCOUNT_TOKEN: ${{ secrets.OP_SERVICE_ACCOUNT_TOKEN }}
        run: |
          raw="$(op run --environment "${OP_ENVIRONMENT_ID}" -- bun x alchemy state read "<Stack>/${STAGE}/output" --no-input)"
          printf '%s\n' "${raw}"
          app_url="$(grep -oE "\"?appUrl\"?: *[\"']https://[^\"']+" <<<"${raw}" | grep -oE "https://[^\"']+" | tail -n 1 || true)"
          if [ -z "${app_url}" ]; then
            echo "::error title=Missing URL::Couldn't find appUrl in the output above"
            exit 1
          fi
          echo "app_url=${app_url}" >> "${GITHUB_OUTPUT}"

  smoke-test:
    name: Smoke test ${{ inputs.environment }}
    needs: [deploy]
    runs-on: ubuntu-24.04
    timeout-minutes: 5
    env:
      APP_URL: ${{ needs.deploy.outputs.app_url }}
    steps:
      - name: Check the app answers
        run: |
          curl --fail --show-error --silent \
            --retry 12 --retry-all-errors --retry-delay 5 \
            --output /dev/null \
            "${APP_URL}/"
```

## What each guard catches

- **Check Cloudflare credentials** fails in seconds when the 1Password Environment lacks the account ID or API token, before the build spends minutes.
- **Check the stage's state** stops a deploy into an empty store, which would otherwise create a second copy of the stack. The first deploy of a new stage fails here too, by design: run that one deploy by hand with a dry-run first, then let the workflow take over.
- **Tag the state store** fails when the tag doesn't come back from Cloudflare, so a token that can't edit Worker settings shows up at once.
- **The smoke test** requests the deployed app, so a deploy that succeeded but serves errors still fails the release.
