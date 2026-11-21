**Verdict:** Comment

### Advisory

| Rule | Where | Finding | Fix |
| :-- | :-- | :-- | :-- |
| `api/error-envelope` | `lib/check-reset-link.ts:13`, `lib/check-reset-link.ts:14`, `lib/check-reset-link.ts:15` | Returns bare strings as error bodies | Return `errorResponse(status, code, message)` for each case |
