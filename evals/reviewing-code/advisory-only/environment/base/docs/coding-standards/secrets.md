# Secrets

## secrets/no-tokens-in-logs

Logs and error reports leave the service and are kept for months, so a reset secret written there can reset the account from anywhere. Log the token's `id`, which is safe, never its secret.

A violation:

```ts
logger.info("reset link sent", { userId: user.id, secret })
```

The fix:

```ts
logger.info("reset link sent", { userId: user.id, tokenId: token.id })
```
