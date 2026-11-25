# Scaffold

The files `setup-docs-workflow` writes, for each workflow. Adapt the paths to the ones settled with the user, and replace `<maintainer>` with the maintainer's GitHub handle.

## `AGENTS.md` section, RFC workflow

```markdown
## Requirements and design

Each feature is an RFC in `docs/rfcs/<feature>.md`, holding its motivation, its behavior as `MUST`, `SHOULD`, and `MAY` statements with IDs such as `RESET-3.2`, and its design. Load `writing:writing-prose` to write one. The maintainer approves the behavior, and agents own the design.

| Status | Who acts | What happens |
| :-- | :-- | :-- |
| `draft` | Agent | Writes the Summary, Motivation, and Behavior sections in a pull request, runs `review:reviewing-behavior` until it comes back clean, then sets `review` |
| `review` | Maintainer | Reads the review comment and the behavior. Approves by committing `accepted` as the last change to the behavior, then merging |
| `accepted` | Agent | Writes the Design section in a new pull request, runs `review:reviewing-design` until it comes back clean, then cuts tasks from it |
| `implemented` | Agent | Set once every `MUST` statement has shipped with a test |

- A change to the Behavior section of an `accepted` or `implemented` RFC sets its status back to `review` in the same pull request, and the maintainer approves it there the same way. `bun run docs:guard` fails a pull request whose behavior changed after the last move from `review` to `accepted`.
- A test names each behavior it covers by ID in its title, as in `test("RESET-3.2 rejects a used link", ...)`. `bun run docs:coverage` lists every untested behavior, and fails when a `MUST` in an `implemented` RFC has no test. Code review blocks a pull request that claims a `MUST` with no test.
- Code review loads `review:reviewing-code`. A milestone ends with `agents:milestone-report`.
```

## `AGENTS.md` section, PRD workflow

```markdown
## Requirements and design

Each feature has a PRD in `docs/prd/<feature>.md`, with acceptance criteria IDs such as `RESET-3.2`, and a design document in `docs/design/<feature>.md`. Load `writing:writing-prose` to write either. The maintainer approves the PRD, and agents own the design.

1. An agent drafts the PRD in a pull request with `status: draft` and runs `review:reviewing-behavior` until it comes back clean.
2. The maintainer approves the PRD by setting `status: approved` and merging. A later change to a merged PRD goes through the maintainer the same way.
3. An agent writes the design document in a new pull request, runs `review:reviewing-design` until it comes back clean, then cuts tasks from it.

- A test names each criterion it covers by ID in its title, as in `test("RESET-3.2 rejects a used link", ...)`. `bun run docs:coverage` lists every untested criterion, and fails when a P0 criterion in an `implemented` PRD has no test. An agent sets `implemented` once every P0 criterion has shipped with a test.
- Code review loads `review:reviewing-code`. A milestone ends with `agents:milestone-report`.
```

## `package.json` scripts

```json
{
  "scripts": {
    "docs:coverage": "bun scripts/criteria-coverage.ts",
    "docs:guard": "bun scripts/behavior-guard.ts"
  }
}
```

Leave out `docs:guard` in the PRD workflow, since the guard reads RFCs only.

## CI steps

Fetch the full history at checkout, so the guard can read every commit on the branch:

```yaml
- uses: actions/checkout@v6
  with:
    fetch-depth: 0
```

Then add the steps beside the other checks:

```yaml
- name: Behavior guard
  if: ${{ !cancelled() && github.event_name == 'pull_request' }}
  run: bun run docs:guard --base origin/${{ github.base_ref }}

- name: Behavior coverage
  if: ${{ !cancelled() }}
  run: bun run docs:coverage
```

## `CODEOWNERS`

```
/docs/rfcs/            @<maintainer>
/docs/prd/             @<maintainer>
/CODING_STANDARDS.md   @<maintainer>
```

Use the document paths settled with the user. `CODING_STANDARDS.md` is listed because only the maintainer changes a rule's status.
