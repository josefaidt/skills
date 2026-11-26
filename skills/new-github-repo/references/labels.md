# Labels

The label set every repository gets. Create or update each with `gh label create <name> --repo <owner>/<repo> --color <color> --description "<description>" --force`.

## Kind

Exactly one on every issue. The label is the only record of an issue's kind.

| Name | Color | Description |
| :-- | :-- | :-- |
| `kind:task` | `8fb38a` | One pull request's worth of work, or a parent of several |
| `kind:bug` | `7d8f3c` | Defect in shipped code |
| `kind:security` | `55601f` | Security defect in shipped code |
| `kind:decision` | `4f7553` | A question answered before tasks proceed: behavior by the owner, design by an agent |
| `kind:tracker` | `2f4f3a` | Tracks one feature's RFC or PRD and its tasks |

## Priority

Exactly one on every issue.

| Name | Color | Description |
| :-- | :-- | :-- |
| `priority:0` | `9b1c1c` | On the critical path to the milestone, or a security fix in shipped code |
| `priority:1` | `c9452b` | Needed for the milestone |
| `priority:2` | `e3875a` | Belongs in the milestone, which holds without it |
| `priority:3` | `f3c3a6` | Spare capacity, and nothing depends on it |

## Size

Exactly one on every task and decision that is not a parent. Size measures the reasoning an issue leaves its session, never the files it touches, and it picks the model a coordinator starts.

| Name | Color | Description |
| :-- | :-- | :-- |
| `size:sm` | `f5e2a8` | Small: the design settles every choice. Runs on Haiku |
| `size:md` | `e5bd4f` | Medium: the design bounds the approach, the session reasons through edge cases. Runs on Sonnet |
| `size:lg` | `b9860b` | Large: crosses modules or its shape depends on what the session finds, still one PR. Runs on Opus |

## Status

| Name                 | Color    | Description                                    |
| :------------------- | :------- | :--------------------------------------------- |
| `status:needs-human` | `5b6f82` | A person handles this, so no agent picks it up |

## Area

Optional, one per busy folder, all in one color.

| Name            | Color    | Description         |
| :-------------- | :------- | :------------------ |
| `area:<folder>` | `b88a5c` | Changes `<folder>/` |
