---
key: RESET
status: accepted
---

# Password Reset RFC

## Summary

This RFC defines password reset: a user asks for a link by email, and the link lets them set a new password once. It covers requesting, redeeming, and expiring links, not sign-in.

## Motivation

Users who forget their password today have to email support, which takes a day on average and is the most common support request.

## Behavior

### 1. Requesting a link

A user who forgot their password gets a link by email.

- **RESET-1.1** A reset request for an existing account MUST send a link to the account's email.
- **RESET-1.2** A reset request MUST return the same response whether or not the account exists.
- **RESET-1.3** When a reset email bounces, the account's unused reset links SHOULD stop working.

### 2. Redeeming a link

- **RESET-2.1** A valid link MUST let the user set a new password.

### 3. Single-use links

A link works once, so a leaked link stops working after the user resets.

- **RESET-3.1** A reset link MUST expire 30 minutes after it is issued.
- **RESET-3.2** A used reset link MUST be rejected with "This link has already been used."
- **RESET-3.3** Issuing a new link SHOULD invalidate the account's earlier unused links.

### 4. Errors

- **RESET-4.1** Every error response SHOULD carry a stable `code`.

## Open questions

None.

## Design

### Traceability

| Behavior    | Delivered by           |
| :---------- | :--------------------- |
| `RESET-1.1` | `lib/request-reset.ts` |
| `RESET-1.2` | `lib/request-reset.ts` |
| `RESET-1.3` | `lib/reset-bounce.ts`  |
| `RESET-2.1` | `lib/redeem-reset.ts`  |
| `RESET-3.1` | `lib/tokens.ts`        |
| `RESET-3.2` | `lib/redeem-reset.ts`  |
| `RESET-3.3` | `lib/resend-reset.ts`  |
| `RESET-4.1` | `lib/errors.ts`        |
