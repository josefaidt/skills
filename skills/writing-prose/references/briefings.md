# Briefings

A briefing is writing a person acts on: a pull request body, a commit message, an issue, a reply in a thread, or the report that ends a task. The reader reads it once, often between other work, so it says what changed and what they need to do in under a minute. Everything else lives where it already is, such as the diff, the logs, or the linked document.

## Shape

1. **Lead with what the reader needs.** What changed for them, what they must decide, or what they must do. A reader who stops after the first two sentences should be able to act.
2. **Say outcomes, not activity.** "Sign-in now works after a reload" tells the reader something. "Updated the session handler and added a test" retells the diff.
3. **Link, don't paste.** Logs, commit lists, metric tables, and long output go in a link or an attachment.
4. **Name what you did not do.** Anything left out, unverified, or deferred, with where it is tracked.
5. **End with the ask**, when there is one, as a single question.

## By kind

| Kind              | Holds                                                                                                                                             |
| :---------------- | :------------------------------------------------------------------------------------------------------------------------------------------------ |
| Pull request body | The outcome and the approach in two or three sentences, then at most a few notes on what a reviewer would otherwise miss, then how it was checked |
| Commit message    | A header that says what the change does in the imperative, and a body that says why, when the why is not obvious                                  |
| Issue             | The problem, the outcome that ends it, and how someone checks that outcome. The steps belong to whoever picks it up                               |
| Reply in a thread | The answer first: what changed and where, or why nothing changed. Then anything the other person needs to do                                      |
| Task report       | What is now true, what is left or unverified, and the one decision that waits on the reader                                                       |

## Gotchas

1. **The inventory.** A list of every file touched and what each function now does. The reviewer reads the diff for that, and the list buries the one thing they would have missed.
   - Avoid: "Updated `lib/proxy.ts` to call `proxyRequest`, added `configurePreviewServer` in `plugin.ts`, and updated the tests."
   - Prefer: "`vite preview` now runs the same proxy as `vite dev`, so a preview build sends the visitor's address instead of the server's."
2. **The history.** What an earlier commit did or what a reviewer asked for. The timeline holds it.
3. **Jargon and IDs without a gloss.** A reader outside the work does not know what "T6" or "the SEC-1 fix" means. Say what it is, or leave it out.
4. **The bare "done".** A reply that says "done" or "won't fix" with no commit, link, or reason leaves the asker to go find out.
5. **A closing word next to an issue number.** Many trackers read "fixes #12" or "closes #12" as a command, even inside "this does not fix #12". Write "leaves #12 open".
