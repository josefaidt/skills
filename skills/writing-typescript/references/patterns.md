# TypeScript patterns

One example for each rule in `SKILL.md` whose table row leaves room for doubt.

## Parse at the boundary

```typescript
import { z } from "zod"

const UserSchema = z.object({
  id: z.uuid(),
  role: z.enum(["admin", "member"]),
})
type User = z.infer<typeof UserSchema>

const body: unknown = await response.json()
const user = UserSchema.parse(body)
```

When another module owns the type, annotate the schema with it, so a schema that proves less than the type fails to compile.

```typescript
const UserSchema: z.ZodType<User> = z.object({ id: z.uuid(), role: z.enum(["admin", "member"]) })
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
const isUser = (value: unknown): value is User => UserSchema.safeParse(value).success
```

## Unions over optional bags

```typescript
// avoid: { loading: true, error: "x", diff: d } compiles
type DiffState = { loading: boolean; diff?: Diff; error?: string }

// prefer
type DiffState =
  | { status: "loading" }
  | { status: "ready"; diff: Diff }
  | { status: "error"; error: string }
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
  const session = SessionSchema.parse(await c.req.json())
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
const ConfigSchema = z.object({
  port: z.coerce
    .number()
    .int()
    .min(1, "PORT must be between 1 and 65535")
    .max(65535, "PORT must be between 1 and 65535"),
  apiKey: z
    .string()
    .min(1, "API_KEY is required. Generate one at https://example.com/settings/keys"),
})
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
│   └── ui/
├── scripts/
├── package.json
└── tsconfig.json
```

```json
{
  "name": "@<scope>/<name>",
  "bin": { "<name>": "./bin/<name>.ts" },
  "scripts": { "start": "bun run bin/<name>.ts" }
}
```
