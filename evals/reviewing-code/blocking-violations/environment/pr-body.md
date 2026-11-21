# feat: resend a password reset link

Adds `resendReset`, which sends a fresh reset link and invalidates the account's earlier unused links, so a user who lost the first email can try again.

Delivers RESET-3.3 (a new link invalidates earlier unused links), tested in `lib/resend-reset.test.ts`.
