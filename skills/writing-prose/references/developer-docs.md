# Developer documentation

Developer documentation comes in four kinds, after [Diátaxis](https://diataxis.fr/). Each serves a reader in a different state, so a page that mixes two serves neither. When a page drifts into another kind, split it and link the two.

| Kind        | Reader                          | The page                                                                                                       |
| :---------- | :------------------------------ | :------------------------------------------------------------------------------------------------------------- |
| Tutorial    | Learning by doing               | Says what the reader will build. Every step produces a visible result, and the page says what they should see  |
| How-to      | Has a goal and knows the basics | Gets them to the goal with actions only, allowing forks. Its title names the task                              |
| Reference   | Looking up a fact               | Describes and nothing else. Dry, complete, and sure, structured like the thing it describes                    |
| Explanation | Wants to understand why         | Covers one bounded topic with its context: design decisions, history, constraints, and alternatives considered |

## Voice by kind

Explanation may hold a view, since weighing alternatives is its job. Everywhere else, keep opinion out. A tutorial or how-to that argues for its approach slows the reader down, and a reference that editorializes stops being trustworthy.

## Gotchas

1. **Explanation inside a tutorial.** The learner loses the thread. Give the reason one clause and link the explanation.
   - Avoid: three paragraphs on why sessions rotate, halfway through "Add sign-in to your app".
   - Prefer: "Sign in again. The session rotates on each sign-in ([why](./sessions.md))."
2. **A how-to that teaches.** The reader already knows the basics and wants the steps. Cut the background to a link.
3. **A reference that guides.** "You'll probably want to set this to 30" belongs in a how-to. The reference says what the option does, its type, and its default.
4. **A tutorial step with no visible result.** The learner cannot tell whether it worked. Say what they should see after each step.
5. **A title that names the feature instead of the task.** A how-to titled "Webhooks" makes the reader guess. Title it "Retry a failed webhook".
