# Logging

## logging/constant-messages

Alerts and log searches match on the message, so each event logs one constant message. A value in the message splits one event into many messages that no alert matches, and puts data where field-level redaction never looks.

A violation:

```ts
logger.info(`reset link sent to ${user.email}`, { tenantId })
```

The fix:

```ts
logger.info("reset link sent", { tenantId, userId: user.id })
```
