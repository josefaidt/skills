# Tenancy

## tenancy/scoped-queries

Every tenant owns its users and their reset tokens, and a lookup that skips the tenant filter can act on another tenant's account. The filter lives in `lib/db.ts`, in `usersFor` and `resetTokensFor`, so a handler never filters by tenant on its own.

A violation:

```ts
const user = db.users.find((candidate) => candidate.email === email)
```

The fix:

```ts
const user = usersFor(tenantId).findByEmail(email)
```

Not a violation: a script in `scripts/` that reads across tenants on purpose and says so in its pull request.
