# TypeScript patterns

One example for each rule in `SKILL.md` whose table row leaves room for doubt.

## Parse at the boundary

The examples use Effect 4, where `Schema` and `Config` ship in the core `effect` package.

```typescript
import { Schema } from "effect"

const UserSchema = Schema.Struct({
  id: Schema.String.check(Schema.isUUID()),
  role: Schema.Literals(["admin", "member"]),
})
type User = typeof UserSchema.Type

const decodeUser = Schema.decodeUnknownSync(UserSchema)

const body: unknown = await response.json()
const user = decodeUser(body)
```

When another module owns the type, annotate the schema with it, so a schema that proves less than the type fails to compile.

```typescript
const UserSchema: Schema.Codec<User> = Schema.Struct({
  id: Schema.String.check(Schema.isUUID()),
  role: Schema.Literals(["admin", "member"]),
})
```

Env and config come through `Config`, which reads from the `ConfigProvider` in scope, the environment by default, so a test provides its own values instead of setting `process.env`.

```typescript
import { Config, Effect, Redacted } from "effect"

const ServerConfig = Config.all({
  port: Config.Port("PORT").pipe(Config.withDefault(3000)),
  apiKey: Config.Redacted("API_KEY"),
})

const program = Effect.gen(function* () {
  const { port, apiKey } = yield* ServerConfig
  return startServer({ port, apiKey: Redacted.value(apiKey) })
})
```

A third-party SDK's own published schemas are the one exception, used for their types only, so no second schema library parses anything in the repository.

```typescript
import type { McpUiToolMetaSchema } from "@modelcontextprotocol/ext-apps"
import type { z } from "zod"

type ToolMeta = z.infer<typeof McpUiToolMetaSchema>
```

Caught errors are `unknown` too.

```typescript
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : String(error)
}
```

## No `as` on unchecked data

```typescript
// avoid: widens, and checks nothing
const config = { theme: "dark", cols: 3 } as Config

// prefer: checked, and `theme` stays "dark"
const config = { theme: "dark", cols: 3 } satisfies Config
```

## Honest type guards

```typescript
// avoid: claims a User after checking one field
function isUser(value: unknown): value is User {
  return typeof value === "object" && value !== null && "id" in value
}

// prefer: the schema checks the whole shape
const isUser = Schema.is(UserSchema)
```

## Unions over optional bags

```typescript
// avoid: { loading: true, error: "x", diff: d } compiles
type DiffState = { loading: boolean; diff?: Diff; error?: string }

// prefer
type DiffState =
  { status: "loading" } | { status: "ready"; diff: Diff } | { status: "error"; error: string }
```

## Exhaustive switches

```typescript
switch (state.status) {
  case "loading":
    return null
  case "ready":
    return render(state.diff)
  case "error":
    return fail(state.error)
  default: {
    const unhandled: never = state
    throw new Error(`Unhandled state: ${String(unhandled)}`)
  }
}
```

## Brand IDs

```typescript
type TenantId = string & { readonly __brand: "TenantId" }
type UserId = string & { readonly __brand: "UserId" }

function isTenantId(input: string): input is TenantId {
  return isUuid(input)
}

function parseTenantId(input: string): TenantId {
  if (!isTenantId(input)) throw new Error(`Invalid tenant ID: ${input}`)
  return input
}

function revokeSessions(tenantId: TenantId, userId: UserId): Promise<void> {}
revokeSessions(userId, tenantId) // fails to compile
```

## Build bad values out

```typescript
// avoid: a comment holds the rule, and every reader must check it
type TimeRange = { start: Date; end: Date } // start <= end

// prefer: a negative range cannot be written; derive the end when needed
type TimeRange = { start: Date; durationMs: number }

type Pairs<T> = [T, T][]
```

## Pure logic, thin shell

```typescript
// pure: no request, no framework, testable with plain values
export function nextSessionExpiry(session: Session, now: Date): Date {}

// shell: parse, call, respond
app.post("/refresh", async (c) => {
  const session = Schema.decodeUnknownSync(SessionSchema)(await c.req.json())
  return c.json({ expiresAt: nextSessionExpiry(session, new Date()) })
})
```

## Strengthen only to remove a lie

```typescript
type NonEmpty<T> = [T, ...T[]]

// avoid: the `!` hides an empty list
function newest(sessions: Session[]): Session {
  return sessions.at(0)!
}

// prefer: an empty list cannot reach this function
function newest(sessions: NonEmpty<Session>): Session {
  return sessions[0]
}

const isNonEmpty = <T>(list: T[]): list is NonEmpty<T> => list.length > 0
```

`sum(xs: number[])` stays `number[]`, since an empty list sums to 0.

## Derive, don't copy

```typescript
type User = typeof UserSchema.Type
const STATUS = { active: "active", suspended: "suspended" } as const
type Status = (typeof STATUS)[keyof typeof STATUS]

type SessionRow = Awaited<ReturnType<typeof getSession>>
type PublicUser = Pick<User, "id" | "role">
```

## Object arguments

```typescript
// avoid: swapping start and end still compiles
select(uri, 10, 1, 10, 4)

// prefer
select({ uri, start: { line: 10, column: 1 }, end: { line: 10, column: 4 } })
```

## Schema errors name the fix

```typescript
const Port = Schema.Int.check(
  Schema.isBetween({ minimum: 1, maximum: 65535 }, { message: "PORT must be between 1 and 65535" }),
)
const ApiKey = Schema.String.check(
  Schema.isNonEmpty({
    message: "API_KEY is required. Generate one at https://example.com/settings/keys",
  }),
)

const EnvConfig = Config.all({
  port: Config.schema(Schema.NumberFromString.pipe(Schema.decodeTo(Port)), "PORT"),
  apiKey: Config.schema(ApiKey, "API_KEY"),
})
```

## Throw or return the failure

```typescript
// a script: a bad file should stop it
const manifest = Schema.decodeUnknownSync(ManifestSchema)(JSON.parse(text))

// a handler: the failure becomes a response
const decodeBody = Schema.decodeUnknownEffect(MoveSchema)

const handleMove = (body: unknown) =>
  decodeBody(body).pipe(
    Effect.map((move) => applyMove(move)),
    Effect.catchTag("SchemaError", (error) => Effect.succeed(badRequest(error.message))),
  )
```

## Long-form modifiers

```typescript
class Client {
  public readonly baseUrl: string
  private readonly token: string
  public async get(path: string): Promise<Response> {}
  private buildHeaders(): Headers {}
}
```

## Imports

```typescript
import type { Room } from "@workspace/game-room"
import type { Server } from "node:http"
import { readFile } from "node:fs/promises"
import { useState } from "react"
import { Schema } from "effect"
import { renderBoard } from "./render-board"
```

## Types first

```typescript
import type { Move } from "./move"
import { Schema } from "effect"
export type { Move } from "./move"
export type Board = typeof BoardSchema.Type
interface Cursor {
  board: Board
  last: Move
}
export const BoardSchema = Schema.Struct({ cells: Schema.Array(Schema.String) })
export { applyMove } from "./apply-move"
```

A type can name a runtime value through `typeof`, as `Board` does, since types are erased and their order costs nothing at runtime.

## JSDoc on exported types

```typescript
/**
 * Input to `createTenant`, which creates a customer's production and development instances together.
 */
export interface CreateTenantInput {
  /**
   * Exact HTTPS origins the production instance accepts, such as `https://app.example.com`.
   * @default []
   */
  allowed_origins?: string[]
}
```

## Comment syntax

```typescript
/*
 * Every write reads, checks, and writes inside one `immediate` transaction, which holds SQLite's
 * write lock throughout, so two moves can't race.
 */
function makeStore(db: DatabaseSync) {
  // prepared once, since every move reads the game first
  const selectGame = db.prepare("select * from games where id = ?")
}

// BroadcastChannel takes no target origin, while the rule is written for window.postMessage
// oxlint-disable-next-line unicorn/require-post-message-target-origin
channel.postMessage(claim)
```

## Layout

```text
apps/<name>/
├── bin/<name>.ts
├── lib/
│   ├── server/
│   │   ├── routes.ts
│   │   └── routes.test.ts
│   └── ui/
├── scripts/
├── tests/
│   └── e2e/
│       ├── play-a-game.e2e.ts
│       └── game-server-client.ts
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

`routes.test.ts` is a unit test of `routes.ts`, so it sits beside it. `game-server-client.ts` serves only the end-to-end suite, so it sits in `tests/e2e/` with it, never in `lib/`.

```json
{
  "name": "@<scope>/<name>",
  "bin": { "<name>": "./bin/<name>.ts" },
  "scripts": { "start": "bun run bin/<name>.ts" }
}
```
