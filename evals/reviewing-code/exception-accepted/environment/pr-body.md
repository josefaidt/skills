# feat: expire reset links when the email bounces

Adds `recordResetBounce`, which the email provider's webhook calls when a reset email bounces, and expires the account's unused reset links.

Delivers RESET-1.3 (a bounce stops the account's unused links), tested in `lib/reset-bounce.test.ts`.

Exception: `logging/constant-messages`. The provider's bounce alerts match on the message `reset email bounced: <type>`, and `type` is one of three fixed values (`hard`, `soft`, `complaint`), so the event logs exactly three constant messages. No user data enters the message, and the tenant and user stay in the fields.
