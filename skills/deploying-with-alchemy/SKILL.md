---
name: deploying-with-alchemy
description: Deploy a repository's Cloudflare resources with Alchemy from CI, keep its state in the account's shared state store, and recover when that state is lost. Covers the one alchemy-state-store every repository in an account shares, the repository tag on every Worker and on the store, the release workflow that refuses to deploy a stage with no state, why a resource another repository's tag names is never deleted, and rebuilding a stage's state from its live resources. Use when setting up or changing how a repository deploys to Cloudflare with Alchemy, running a release, cleaning up resources in a Cloudflare account, or when a deploy reports its state store missing or plans to create resources that already exist.
---

# Deploying with Alchemy

How a repository deploys its Cloudflare resources with [Alchemy](https://alchemy.run) so that several repositories can share one Cloudflare account safely. Every repository in the account keeps its state in one shared store, tags what it owns, and deploys only from a CI workflow that checks the stage's state first.

Alchemy names every resource it creates from an instance ID that it keeps only in the stage's state, such as the `ldzuykd6ymum5nr3` in the Worker name `games-gameserver-production-ldzuykd6ymum5nr3`. A deploy that finds no state picks new instance IDs, so it creates a second copy of every resource under new names, with new URLs and an empty new database, rather than updating the live ones. Most of the rules below exist to keep that state from being lost, and to stop a deploy when it is.

## Reference files

| File | Use when |
| :-- | :-- |
| `references/release-workflow.md` | Writing or changing the GitHub Actions workflows that release a stage |
| `references/rebuilding-state.md` | A stage's state is missing and its resources are still live |

## State: one shared store per account

Keep every deployed stage's state in the account's shared store, the one `Cloudflare.state()` deploys with no options. Use local state only under `alchemy dev`, which needs no Cloudflare account:

```typescript
import * as Cloudflare from "@alchemy.run/cloudflare"
import * as Alchemy from "alchemy"
import { Effect, Layer } from "effect"

const state = Layer.unwrap(
  Alchemy.ALCHEMY_DEV.pipe(
    Effect.map((dev) => (dev ? Alchemy.localState() : Cloudflare.state())),
    Effect.orDie,
  ),
)
```

The store is a Worker named `alchemy-state-store`, and a Durable Object inside it holds the state of every stack and stage in the account. Its access token and encryption key live in the account's Secrets Store. Alchemy files each record under its stack's name and stage, so two repositories share the store safely as long as their stacks have different names. Give each repository's stack a name that no other repository in the account uses.

Upgrade Alchemy in every repository that shares the store together. On startup, Alchemy compares the version of the store's server code with the version it expects. On any mismatch, it re-uploads its own copy of that code, even when its copy is the older one. The re-upload keeps the Durable Object and its data, and it runs without asking under `alchemy deploy --yes`. Two repositories on different Alchemy versions therefore re-upload the store back and forth on each deploy. A command that runs without `--yes` stops with an "out of date" error until the versions match.

`alchemy state ls` lists every stack and stage in the store, and `alchemy state read <stack>/<stage>/<logical id>` prints one record.

## Tags: every Worker names its repository

Give every Worker the repository declares a `repo:<owner>/<name>` tag, next to the `alchemy:stack`, `alchemy:stage`, and `alchemy:id` tags Alchemy adds itself. Cloudflare allows 10 tags on a Worker and Alchemy uses at most four, so one more always fits:

```typescript
const tags = ["repo:<owner>/<name>"]

export function api(bindings: ApiBindings): Cloudflare.WorkerProps<ApiBindings> {
  return { main: new URL("./lib/worker.ts", import.meta.url).href, env: bindings, tags }
}
```

Alchemy deploys the state store's Worker with no tags and has no option to add any. The release workflow adds the repository's tag to it after each deploy and keeps the tags already there, so the shared store carries one `repo:` tag for each repository that deploys with it. `references/release-workflow.md` has the step.

Cloudflare supports no tags on D1 databases, KV namespaces, or queues. Their names start with the stack's name, such as `Games-RoomsDatabase-production-fgdpbpg5zhcpdrwk`, so the stack name is what ties them to a repository.

## Releasing

Deploy a stage only from the release workflow, never from a laptop. The workflow runs CI, then:

1. Builds what the stack bundles.
2. Checks that the store holds the stage's state.
3. Deploys with `alchemy deploy --stage <stage> --yes`.
4. Tags the state store.
5. Reads the stack's outputs and smoke-tests them.

Every step that needs the Cloudflare API token runs under `op run`, so the token reaches only that command and stays out of the log. `references/release-workflow.md` has both workflow files.

Before you run a release that changes resources, run `alchemy deploy --stage <stage> --dry-run` and read the plan. A plan that creates a resource the stage already has, such as a second Worker for the same logical ID, means the state is wrong. Stop there rather than deploying.

## Deleting resources in a shared account

Never delete a Cloudflare resource that another repository owns. Before you delete a Worker, D1 database, or KV namespace that you did not create in the current task:

1. Read the Worker's tags with `GET /accounts/<account id>/workers/scripts/<name>/script-settings`, whose `result.tags` lists them.
2. Leave the Worker alone when a `repo:` tag names a repository other than the one you are working in. The same applies when an `alchemy:stack` tag names a stack your repository does not declare.
3. Leave `alchemy-state-store` alone, whatever its tags say. Deleting it deletes every repository's state at once.
4. For a database or namespace, which has no tags, match the stack name at the start of its name against the stacks each repository declares.

When you still can't tell who owns a resource, show the user its name, tags, and creation date, and ask whose it is. A question such as "where did this come from?" invites the guess that it was a test.

## When the state is missing

These signs mean the stage's state is gone while its resources still run:

- A deploy prints `Cloudflare State Store 'alchemy-state-store' not found; deploying it.` for an account that already had one.
- The release workflow's state check fails.
- A dry-run plans to create resources the stage already has.

Stop when you see any of them, and deploy nothing. `--adopt` doesn't help, because new instance IDs give the new resources names that never collide with the live ones. Rebuild the stage's records from the live resources with `references/rebuilding-state.md`, and confirm the dry-run plans no creates before the next release.
