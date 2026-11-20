# Comment examples

The examples use TypeScript syntax, but each pattern holds in any language.

## Narration and restated names

```typescript
// avoid
// get the user by id
const user = await getUser(id)

// increment the retry count
retries += 1
```

Delete both. The code already says it.

## Explaining a surprise you own

```typescript
// avoid: the comment excuses a name that lies
// NOTE: this also deletes the user's sessions, not just the user
function removeUser(id: UserId) {}

// prefer: the name says what it does
function removeUserAndSessions(id: UserId) {}
```

## A constraint from outside

```typescript
// prefer: the platform forces it, and the comment says what breaks
// Workers forbid random values in global scope, so the key is generated on the first request
let signingKey: CryptoKey | undefined
```

## An upstream workaround

```typescript
// prefer: linked, so a reader knows when it can go
// the client drops the body on a 307 redirect: https://github.com/<owner>/<repo>/issues/<n>
const response = await fetch(url, { redirect: "manual" })
```

## A value's origin

```typescript
// prefer
// half the session lifetime, so a refresh always lands before expiry
const REFRESH_AFTER_MS = SESSION_TTL_MS / 2
```

## Constraint comments

```typescript
// avoid: nothing enforces it
// IMPORTANT: do not change this message, the CLI parses it
throw new Error("tenant not found")
```

Prefer a test that pins the message where the CLI depends on it, then delete the comment. Better still, give the CLI a structured error code to read instead of a message.

## Suppressions

```typescript
// avoid: silences a rule that catches real bugs
// @ts-expect-error
handler(request.body)

// prefer: parse, so the suppression has nothing to do
handler(RequestSchema.parse(request.body))
```

```typescript
// prefer: a false positive, with the reason above it
// BroadcastChannel takes no target origin, while the rule is written for window.postMessage
// oxlint-disable-next-line unicorn/require-post-message-target-origin
channel.postMessage(claim)
```

## History, banners, and dead code

```typescript
// avoid
// ===== HELPERS =====
// changed from a Map to an object in the v2 migration
// const cache = new Map()
```

Delete all three. Split the file if it needs sections, and leave history to version control.
