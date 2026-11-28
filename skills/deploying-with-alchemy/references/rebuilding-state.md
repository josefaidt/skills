# Rebuilding a stage's state

How to rebuild a stage's Alchemy state from its live Cloudflare resources after the state store lost it, so the next deploy updates those resources instead of creating a second copy. Everything here runs on a laptop with the Alchemy profile for the account, and nothing reaches the shared store until the last step.

Each record needs the resource's instance ID, which you can recover from its name. Alchemy builds a physical name as `<Stack>-<logical id>-<stage>-` followed by the first 16 characters of the instance ID in lowercase base32, and 16 base32 characters are exactly the ID's first 10 bytes. The name never uses the other 6 bytes, so zeros there give back the same name. Some resources lowercase the whole name, such as a Worker's `games-gameserver-production-ldzuykd6ymum5nr3`, but the suffix is the same either way.

## 1. List the live resources

Collect each resource's name and ID from the Cloudflare API or dashboard:

- **Workers:** the script name and its ID (the `tag` in the scripts list).
- **D1 databases:** the name and the UUID.
- **KV namespaces:** the title and the ID.
- **URLs:** the last release's outputs, from its workflow log.

Resources without a physical name, such as an `Alchemy.KeyPair`, exist only in the state. They can't be recovered, so the next deploy creates them again. A key pair that signed something, such as a VAPID key for web push, invalidates whatever it signed.

## 2. Decode each instance ID

```typescript
const ALPHABET = "abcdefghijklmnopqrstuvwxyz234567"

function instanceIdFromName(name: string): string {
  const suffix = name.slice(-16).toLowerCase()
  const bits = [...suffix]
    .map((char) => {
      const value = ALPHABET.indexOf(char)
      if (value < 0) throw new Error(`${name} doesn't end in a base32 suffix`)
      return value.toString(2).padStart(5, "0")
    })
    .join("")
  const bytes = new Uint8Array(16)
  for (let index = 0; index < 10; index++) {
    bytes[index] = Number.parseInt(bits.slice(index * 8, index * 8 + 8), 2)
  }
  return Buffer.from(bytes).toString("hex")
}
```

Check each result against Alchemy's own encoder before you use it: `base32(Buffer.from(id, "hex")).slice(0, 16)` from `alchemy/src/Util/base32.ts` must equal the name's suffix.

## 3. Write the records locally

Write one JSON file per resource under `.alchemy/state/<Stack>/<stage>/<logical id>.json`, plus `__stack_output__.json` with the stack's outputs. Copy the shape from a record `alchemy dev` already wrote under `.alchemy/state/<Stack>/<dev stage>/` for the same resource, and change these fields:

- `instanceId`: the decoded ID.
- `providerMode`: `live`, where the dev record says `local`.
- `attr`: the live resource's names, IDs, URLs, and account ID, such as a Worker's `workerId`, `workerName`, and `url`, or a database's `databaseId` and `databaseName`.
- `bindings`: each binding pointing at the live resource it binds, such as a D1 binding's `databaseId`.

`props` can stay as the dev record has them, since a difference there only plans an update, which the next deploy makes anyway.

## 4. Dry-run against the local records

Copy `alchemy.run.ts` to a temporary entrypoint, such as `alchemy.recover.ts`, that keeps its state in `Alchemy.localState()` for every stage, and dry-run it:

```sh
bun x alchemy deploy alchemy.recover.ts --stage <stage> --dry-run --no-input
```

The plan must list no `create` or `replace` for any resource that exists, only `update` or `noop`. A `create` means that resource's record is missing or its instance ID decodes to a different name, so fix the record and run the dry-run again. A `create` for a resource that has no physical name, such as a key pair, is expected.

## 5. Copy the records into the shared store

The CLI has no command that writes a record, so copy them through a second temporary entrypoint whose state layer writes each local record into the Cloudflare store before handing the store to the CLI:

```typescript
import { makeLocalState } from "alchemy/State/LocalState"
import { State } from "alchemy/State/State"

const at = { stack: "<Stack>", stage: "<stage>" }

const state = Layer.effect(
  State,
  Effect.gen(function* () {
    const openRemote = yield* State
    return yield* Effect.cached(
      Effect.gen(function* () {
        const remote = yield* openRemote
        const local = yield* makeLocalState()
        for (const fqn of yield* local.list(at)) {
          const value = yield* local.get({ ...at, fqn })
          if (value !== undefined) yield* remote.set({ ...at, fqn, value })
        }
        yield* remote.setOutput({ ...at, value: yield* local.getOutput(at) })
        return remote
      }).pipe(Effect.orDie),
    )
  }),
).pipe(Layer.provide(Cloudflare.state()))
```

Use this layer as the stack's `state` in the temporary entrypoint, such as `alchemy.seed.ts`, and run any command that opens the store:

```sh
bun x alchemy state ls <Stack>/<stage> -c alchemy.seed.ts --no-input
```

`alchemy state migrate` can't do this step, because only stores that replace another store implement it, and the Cloudflare store doesn't.

## 6. Check, clean up, and release

1. Delete both temporary entrypoints and the local records under `.alchemy/state/<Stack>/<stage>/`.
2. Dry-run the real entrypoint, `bun x alchemy deploy --stage <stage> --dry-run`, which now reads the shared store. Expect the same plan as step 4.
3. Run the release workflow. Its state check now finds the stage's records.
