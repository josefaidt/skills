# feat: check a reset link before showing the form

Adds `checkResetLink`, so the reset page can tell a user their link is invalid, used, or expired before they type a new password.

Tested in `lib/check-reset-link.test.ts`.
