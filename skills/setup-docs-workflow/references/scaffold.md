# Scaffold

The files `setup-docs-workflow` writes, for each workflow. Adapt the paths to the ones settled with the user, and replace `<maintainer>` with the maintainer's GitHub handle.

The `AGENTS.md` sections and CI steps below call the scripts as `bun run docs:guard` and `bun run docs:coverage`, which need the `package.json` scripts further down. A repository with no root `package.json`, such as a Rust project, gets no `package.json` from this skill. In that case write the commands as `bun scripts/behavior-guard.ts` and `bun scripts/criteria-coverage.ts` in the `AGENTS.md` section and the CI steps instead.

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
- A test names each behavior it covers by ID. In TypeScript the ID opens the title, as in `test("RESET-3.2 rejects a used link", ...)`. In Rust it opens the function name in snake_case, as in `fn reset_3_2_rejects_a_used_link()`, and a test that covers a second behavior names it in a doc comment above the function, as in `/// Also covers RESET-3.3.` `bun run docs:coverage` lists every untested behavior, and fails when a `MUST` in an `implemented` RFC has no test. Code review blocks a pull request that claims a `MUST` with no test.
- Code review loads `review:reviewing-code`. A milestone ends with `agents:milestone-report`.
```

## `AGENTS.md` section, PRD workflow

```markdown
## Requirements and design

Each feature has a PRD in `docs/prd/<feature>.md`, with acceptance criteria IDs such as `RESET-3.2`, and a design document in `docs/design/<feature>.md`. Load `writing:writing-prose` to write either. The maintainer approves the PRD, and agents own the design.

1. An agent drafts the PRD in a pull request with `status: draft` and runs `review:reviewing-behavior` until it comes back clean.
2. The maintainer approves the PRD by setting `status: approved` and merging. A later change to a merged PRD goes through the maintainer the same way.
3. An agent writes the design document in a new pull request, runs `review:reviewing-design` until it comes back clean, then cuts tasks from it.

- A test names each criterion it covers by ID. In TypeScript the ID opens the title, as in `test("RESET-3.2 rejects a used link", ...)`. In Rust it opens the function name in snake_case, as in `fn reset_3_2_rejects_a_used_link()`, and a test that covers a second criterion names it in a doc comment above the function, as in `/// Also covers RESET-3.3.` `bun run docs:coverage` lists every untested criterion, and fails when a P0 criterion in an `implemented` PRD has no test. An agent sets `implemented` once every P0 criterion has shipped with a test.
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

A repository with no root `package.json` gets none from this skill, since a `package.json` in a Rust project suggests a JavaScript toolchain that is not there. Call the scripts directly instead, with the same flags:

```sh
bun scripts/behavior-guard.ts --base origin/main
bun scripts/criteria-coverage.ts
```

## How tests name behavior

`criteria-coverage.ts` reads two kinds of test, and the `AGENTS.md` sections above teach both:

| Language | Which files | What counts as a test | How a test names `RESET-3.2` |
| :-- | :-- | :-- | :-- |
| TypeScript, JavaScript | `*.test.*` and `*.spec.*` | Anything in the file | The ID anywhere in the file, usually the title |
| Rust | Every tracked `.rs` file, so inline `#[cfg(test)] mod tests` in `src/` and files in `tests/` | A function marked `#[test]` or by a path ending in `::test`, such as `#[tokio::test]` or `#[gpui::test]`, with other attributes allowed between | The function name starts with `reset_3_2` followed by `_` or the end of the name, as in `fn reset_3_2_rejects_a_used_link()`. A second behavior goes in the function's own doc comment in the ID's normal form: `/// Also covers RESET-3.3.` |

A Rust name prefix counts only when its key, `reset` here, belongs to a document, so `fn parse_1_0_header()` is never read as an ID. When the key matches but the number is not in the document, the ID is reported as unknown, as a mistyped ID in a TypeScript test is. A function that is not a test never counts, whatever it is named.

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

Without a root `package.json`, the commands are `bun scripts/behavior-guard.ts --base origin/${{ github.base_ref }}` and `bun scripts/criteria-coverage.ts`. The job needs Bun, such as through `oven-sh/setup-bun`, since a Rust job does not install it.

## `CODEOWNERS`

```
/docs/rfcs/            @<maintainer>
/docs/prd/             @<maintainer>
/CODING_STANDARDS.md   @<maintainer>
```

Use the document paths settled with the user. `CODING_STANDARDS.md` is listed because only the maintainer changes a rule's status.
