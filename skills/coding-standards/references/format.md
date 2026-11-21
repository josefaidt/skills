# Format

`CODING_STANDARDS.md` sits at the repository root and holds one table. Detail files live in `docs/coding-standards/`, one per area.

## The root file

```markdown
# Coding standards

The rules a reviewer enforces in this repository. Each finding cites a rule ID. A new rule starts as `advisory`, and only the maintainer moves a rule to `blocking` or `retired`. Mechanical rules live in the lint config, not here.

| ID | Level | Status | Rule | Detail |
| :-- | :-- | :-- | :-- | :-- |
| `secrets/no-tokens-in-logs` | MUST | blocking | Session tokens, reset tokens, and API secrets never appear in logs, errors, or telemetry | [secrets.md](docs/coding-standards/secrets.md#secretsno-tokens-in-logs) |
| `tenancy/scoped-queries` | MUST | blocking | Every query on tenant data filters by tenant ID in the data-access layer | [tenancy.md](docs/coding-standards/tenancy.md#tenancyscoped-queries) |
| `tokens/single-use` | MUST | advisory | A single-use token is invalidated when it is used and expires within its stated lifetime |  |
| `api/error-envelope` | SHOULD | advisory | Error responses use the shared error envelope with a stable `code` field |  |
| `ts/parse-at-the-boundary` | MUST | blocking | Parse at the boundary | `writing-typescript` |
| `api/legacy-errors` | SHOULD | retired | Replaced by `api/error-envelope` |  |
```

- Sort rows by ID, so a rule's area reads as a group.
- A row for a shared skill rule gives the rule's name from the skill in the Rule column and the skill's name in Detail.
- A retired row keeps its ID and replaces its rule text with why it was retired or what replaced it.
- Past roughly 100 rows, split the table into one table per area under an H2 for each, still in this one file, so the reviewer makes one read.

## A detail file

`docs/coding-standards/<area>.md` holds what a reviewer needs to judge a rule's harder cases. Give each rule an H2 heading that is its ID, so the root table can link to it.

````markdown
# Tenancy

## tenancy/scoped-queries

Every tenant owns its users, sessions, and keys, and a query that skips the tenant filter can return another tenant's rows. The filter lives in the data-access layer, so a handler never builds a tenant-scoped query on its own.

A violation:

```ts
const user = await db.query.users.findFirst({ where: eq(users.email, email) })
```

The fix:

```ts
const user = await usersFor(tenantId).findByEmail(email)
```

Not a violation: a migration or an admin script that reads across tenants on purpose and says so in its name, such as `scripts/backfill-all-tenants.ts`.
````

Write the rationale in a sentence or two, then a violation, the fix, and any case that looks like a violation and is not. Leave out history, such as the incident that prompted the rule. The pull request that added the rule holds it.
