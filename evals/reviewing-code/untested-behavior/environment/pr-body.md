# feat: redeem a password reset link

Adds `redeemReset`, which sets the new password when the link is valid and marks the link used first, so two requests on one link cannot both succeed.

Delivers RESET-2.1 (a valid link sets the password), RESET-3.1 (links expire after 30 minutes), and RESET-3.2 (a used link is rejected).
