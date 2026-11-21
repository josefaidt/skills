**Verdict:** Request changes

### Blocking

| Rule | Where | Finding | Fix |
| :-- | :-- | :-- | :-- |
| `tenancy/scoped-queries` | `lib/resend-reset.ts:22`, `lib/resend-reset.ts:27` | Finds the user and loops over reset tokens through the unscoped `db` tables | Use `usersFor(tenantId).findByEmail` and `resetTokensFor(tenantId).unusedFor(user)` |
| `secrets/no-tokens-in-logs` | `lib/resend-reset.ts:33` | Logs the reset secret | Drop `secret` from the log fields; `tokenId` is already there |
| Defect | `lib/resend-reset.ts:28` | `\|\|` marks every unused token in every tenant as used, so one resend breaks other users' links | Use `&&`, or iterate only the user's unused tokens |

### Behavior

- `RESET-3.3` (a new link invalidates earlier unused links): tested in `lib/resend-reset.test.ts`, though the test does not check other accounts' tokens
