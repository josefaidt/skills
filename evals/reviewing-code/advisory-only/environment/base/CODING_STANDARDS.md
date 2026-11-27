# Coding standards

The rules a reviewer enforces in this repository. Each finding cites a rule ID. A new rule starts as `advisory`, and only the maintainer moves a rule to `blocking` or `retired`.

| ID                          | Level  | Status   | Rule                                                                                       | Detail                                                                  |
| :-------------------------- | :----- | :------- | :----------------------------------------------------------------------------------------- | :---------------------------------------------------------------------- |
| `api/error-envelope`        | SHOULD | advisory | Error responses use `errorResponse`, so every error body carries a stable `code`           |                                                                         |
| `api/legacy-errors`         | SHOULD | retired  | Replaced by `api/error-envelope`                                                           |                                                                         |
| `logging/constant-messages` | SHOULD | blocking | A log message is a constant string, and every value goes in the log's fields               | [logging.md](docs/coding-standards/logging.md#loggingconstant-messages) |
| `secrets/no-tokens-in-logs` | MUST   | blocking | Reset secrets, session tokens, and API keys never appear in logs, errors, or telemetry     | [secrets.md](docs/coding-standards/secrets.md#secretsno-tokens-in-logs) |
| `tenancy/scoped-queries`    | MUST   | blocking | Every read or write of tenant data goes through a tenant-scoped helper, such as `usersFor` | [tenancy.md](docs/coding-standards/tenancy.md#tenancyscoped-queries)    |
| `tokens/single-use`         | MUST   | advisory | A reset token is marked used when it is redeemed, and a used token is never accepted       |                                                                         |
