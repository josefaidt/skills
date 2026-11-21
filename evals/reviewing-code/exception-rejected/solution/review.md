**Verdict:** Request changes

### Blocking

| Rule | Where | Finding | Fix |
| :-- | :-- | :-- | :-- |
| `tenancy/scoped-queries` | `lib/support-lookup.ts:14`, `lib/support-lookup.ts:15` | Reads `db.users` and `db.resetTokens` across every tenant from `lib/` | Take the tenant as input and use `usersFor` and `resetTokensFor`, or ask the maintainer to change the rule for staff tools |

### Exceptions

- `tenancy/scoped-queries` rejected: a `MUST` rule takes no exception. Scope the lookup, or ask the maintainer to change the rule
