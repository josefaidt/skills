# Existing docs

A repository that already specifies features has habits worth keeping: where docs live, what they are called, and how the maintainer approves them. Before installing anything, find out what is there and ask the user how this workflow should meet it. Change nothing until the user picks.

## Inventory

For each kind of document the repository uses, record:

- where the files live and how they are named, such as `docs/specs/*.md`, `rfcs/0012-*.md`, or a wiki or issue tracker outside the repository
- the sections each holds, and which section states behavior a test could check
- any frontmatter, especially a status field and its values
- any ID scheme for requirements, and whether tests or commits cite it
- how approval happens today, such as a merged pull request, a label, a sign-off line, or nothing written down
- which documents describe features still being built, and which describe features that shipped

## What the scripts need

The scripts find documents by their content, not their path, so a document can stay where it is. To be seen, it needs:

| Marker | RFC | PRD |
| :-- | :-- | :-- |
| Frontmatter `key` | A short uppercase word, unique in the repository | Same |
| Frontmatter `kind` | `rfc`, or an H1 ending in "RFC" | `prd`, or an H1 ending in "PRD" |
| Frontmatter `status` | `draft`, `review`, `accepted`, `implemented`, `withdrawn`, or `superseded` | `draft`, `approved`, or `implemented`. None counts as `approved` |
| Behavior | Bold-ID bullets with `MUST`, `SHOULD`, or `MAY` under `## Behavior` | Bold-ID bullets under `### Story N: Title - P0` headings |

A document without a `key` is ignored, which is how a finished document stays out of the checks.

## Ask

Summarize the inventory in a few lines, then ask the user to pick one option, recommending the one that fits:

| Option | What changes | Recommend when |
| :-- | :-- | :-- |
| Adopt in place | Documents keep their paths, names, and other sections. Each one still being built gains the markers above, its behavior is rewritten as ID'd statements, and its status is mapped. `AGENTS.md` points at the existing paths | The existing docs already separate behavior from design, and the user likes where they live |
| Migrate | Documents still being built move to `docs/rfcs/` or `docs/prd/` with `git mv`, are restructured to the template in `prose:writing-prose`, and gain IDs. Shipped documents stay where they are, untouched | The existing docs mix behavior and design, or are scattered across places |
| Start fresh | Nothing existing changes. New features use the chosen workflow, and `AGENTS.md` says where the old documents live and that they are frozen | The existing docs are mostly about shipped features, or the user wants no churn |

Ask the questions the inventory leaves open in the same message, such as which status an existing "approved" or "in progress" maps to, and which documents count as still being built. When the repository's approval habit differs from a merged pull request, say how the workflow would change it.

## Apply

- Make the change in one pull request, separate from any feature work, so the user reviews the restructuring on its own.
- Never renumber or reword an existing requirement while adding IDs. Give each statement an ID in its current order, and put any statement that needs rewording in the pull request description as a question.
- Set the status of every adopted or migrated document to what the user mapped. A document that becomes `accepted` or `approved` must have no open questions left, or it goes in as `review` or `draft`.
- A migrated document keeps its history through `git mv`. Move it in its own commit before restructuring, so the diff of the restructuring reads on its own.
- For tests that already cite an old requirement ID, list them in the pull request and offer to rename the citations in a follow-up, rather than mixing test changes into the docs change.
