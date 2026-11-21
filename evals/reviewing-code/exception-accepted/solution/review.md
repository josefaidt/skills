**Verdict:** Approve

### Behavior

- `RESET-1.3` (a bounce stops the account's unused links): tested in `lib/reset-bounce.test.ts`

### Exceptions

- `logging/constant-messages` accepted: `type` takes one of three fixed values, so the bounce logs three constant messages the provider's alerts match, and no user data enters the message
