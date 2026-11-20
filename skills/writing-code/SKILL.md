---
name: writing-code
description: Language-agnostic guidance for writing code a reader understands from the code itself, starting with when a comment earns its place and how to clear out the ones that do not. Use when writing or reviewing code in any language, when a diff adds comments, lint or type-checker suppressions, or TODOs, or when asked to clean up or remove comments.
user-invocable: false
---

# Writing code

Write code whose names, types, and shape say what it does, so a reader never needs prose to follow it. A comment is for what the code cannot say. Most comments in generated code are narration that goes stale on the next change, and the rest often excuse a surprise the code could have removed.

When the repository has a `CODING_STANDARDS.md` or a comment rule of its own, read it first. Its rules win where they differ. Language skills, such as `writing-typescript`, set the comment syntax. Examples for each rule are in [references/comments.md](references/comments.md).

## Comments

Before writing a comment, try to make it unnecessary: rename, extract a function, narrow a type, or restructure. Write one only when a careful reader would otherwise get the code wrong, or would have to work out again what its author already knew.

| Keep                        | When                                                                                                                                                                 |
| :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| A constraint from outside   | Behavior forced by something you cannot reshape, such as a platform limit, a protocol, a vendor API, or a spec requirement. Say what breaks if someone simplifies it |
| An upstream workaround      | A fix for a bug in a dependency or the platform, linking the upstream issue so a reader knows when it can go                                                         |
| Dense logic                 | Logic that stays hard once the code is as plain as it can be, such as a bit mask or rejection sampling, explained at the lines it covers                             |
| A value's origin            | A number or limit whose source is not obvious, such as a timeout set relative to another one                                                                         |
| API docs                    | Doc comments that define a public contract: what a declaration is, its units, formats, defaults, and invariants                                                      |
| Legal and generated headers | A license header, or a line naming the script that generated the file                                                                                                |
| A justified directive       | A formatter or lint directive whose rule is wrong for this line, with the reason beside it                                                                           |

| Delete                                        | Instead                                                                                |
| :-------------------------------------------- | :------------------------------------------------------------------------------------- |
| Narration of the next line                    | Nothing. The code says it                                                              |
| A name or type restated                       | Nothing, or a better name                                                              |
| Section banners                               | Reorder or split the file                                                              |
| History ("changed to fix…")                   | The commit message                                                                     |
| Commented-out code                            | Version control                                                                        |
| A bare `TODO`                                 | An issue, linked from the `TODO`                                                       |
| An explanation of a surprise in your own code | Remove the surprise with a rename, an extraction, a type, or a redesign                |
| "Do not remove", "IMPORTANT"                  | A test, type, assertion, or lint rule that enforces it. A claim nobody can verify goes |

A comment changes with its code or goes. When unsure whether a keep reason still holds, read the code it points at and trace the symbol it names. A reason you cannot confirm is a reason to delete, not to shorten the comment into a smaller excuse.

## Known gotchas

1. **The excuse comment.** A paragraph justifying odd code you own is the signal that the code needs reshaping. Writing the justification feels like diligence, but the next reader still trips over the code. Fix the shape, or file the redesign and keep the comment short and linked.
2. **Suppressions.** A lint or type-checker suppression silences a rule that may catch real bugs. Look up the rule. If it protects correctness or safety, fix the code and drop the suppression. Keep one only for a false positive or a style-only rule, with the reason on the line above.
3. **Constraint comments.** "Do not change this wording" or "talk to X first" protects nothing a tool can see. Encode the constraint where it fails loudly, such as a snapshot test, a type, or a CI check, then delete the comment. If it cannot be encoded, keep it with a link to where the constraint is recorded.
4. **Comments on foreign code.** Surprising behavior in a dependency is a fair keep. The same surprise in your own module is not, because you can change the module.

## Clearing comments from a diff

When asked to clean up comments, or as part of reviewing your own diff before opening a pull request:

1. Scope to the given files, or the diff against the base branch, working tree included. Leave code outside the scope alone.
2. Sort each comment as a keep, a delete, or a reshape, by the tables above. A reshape names the symbol to rename, extract, type, or redesign.
3. Delete what goes, and make the trivial reshapes directly, such as deleting a dead path or calling the real API. For a reshape that needs design, sketch it and report it rather than widening the change.
4. For each constraint comment, offer the cheapest encoding and wait for approval before adding it. Without approval, delete the comment and report the constraint as unenforced.
5. Report the deletions, the reshapes made and left open, any encodings, and anything you kept with its reason.
