# Patterns

Design patterns for MCP Apps, each tied to a constraint of the protocol or of real hosts. Most come from building demos that ran in Claude Desktop, so they hold there. Check them against other hosts before relying on them.

## Splitting data between the model and the View

Every tool result serves two readers. Put what the model needs to reason about in `content` as plain text, and what the View renders in `structuredContent`, which hosts keep out of the model's context. A position, a list, or a chart's series goes in `structuredContent`, and `content` says only what the model must know to act, such as whose turn it is and the legal moves.

Models copy what they see into their replies. When `content` holds a drawable state such as a board or a table, the model redraws it in text under the View. Tell the model in the server instructions, the tool description, and the result text that the user already sees the View, and that it should not draw, list, or explain what the View shows.

## Defining a tool once

Write each tool as one spec holding its name, description, input schema, result schema, and `_meta.ui`. The server mounts a handler from the spec, and the View calls tools through the same spec, parsing `structuredContent` with its result schema. The name and argument shape are then never written twice, and a schema change breaks the type check on both sides.

## App-only tools

Tools with `visibility: ["app"]` give the View a private API on its server, for actions such as a user's move, a refresh, or a form submission. Keep the model's tools and the View's tools separate even when they do similar work: a user-move tool that only ever moves the user's pieces can't be used by the model to play for the user, and the model's move tool can't be called by the View.

The host hides these tools from the model, but nothing hides them from other clients. Validate their arguments on the server as strictly as any other tool's.

## Handing the turn to the model

A View can't start a model turn silently. To pass control to the model after a user acts in the View:

1. Call `ui/update-model-context` with everything the model needs, such as the new state and the legal options. It replaces the previous context, so send the whole picture each time.
2. Send a short `ui/message`, such as "I played 11-15.", to start the turn.

Claude asks the user to approve each `ui/message` until they agree to the app's messages, or places the text in the message box for the user to send. Design for a turn that never starts.

## Seeing the model's later moves

A View receives the input and result of the tool call that created it, and nothing from later calls. When the model acts through a tool without a `resourceUri`, or one that opens a fresh View, the existing View has to find out some other way. Poll an app-only getter tool while waiting, stop polling once the state changes, and stop entirely when the View is retired or torn down.

## Several Views in one conversation

Every call to a UI-linked tool renders a new View, and hosts keep the earlier ones running. Decide which one is live, and read the host's own guidance first, such as Claude's instance supersession page (see `sources.md`). One approach: each View announces its id on a `BroadcastChannel` named for its resource URI, and every View that hears a newer id greys out and stops polling and messaging the model. A `BroadcastChannel` reaches only same-origin documents in the same browser, so it works when the host gives every View of a resource the same origin. Test that with your host before relying on it.

## Keeping state on the server

The View is disposable: hosts tear it down, users reload, and conversations reopen days later. Keep state on the server, keyed by an id that the tool result carries, and have the View fetch it on load through an app-only tool. Show a clear message when the id is unknown, such as after a database reset, rather than an error.

A local stdio server may run as more than one process. Claude Desktop starts two copies of each, and the model's calls can reach one while the View's reach the other, so in-memory state diverges. Use storage that several processes can share, such as SQLite in WAL mode, and do each read-check-write in one `begin immediate` transaction.

## Building the View

The host loads the View as a single HTML string with no server behind it, so relative URLs for scripts, styles, and images resolve nowhere. Bundle everything inline. With Vite, `vite-plugin-singlefile` does this, and the server imports the built file as text. Anything that must load from the network needs its origin in `csp.resourceDomains` or `csp.connectDomains`.

## Theming and sizing

Give every host CSS variable you use a fallback in your stylesheet, then apply the host's values over it. Key your palette on `data-theme` so `applyDocumentTheme` switches it, and merge every `host-context-changed` into the context you hold. Apply `safeAreaInsets` as padding added to your own.

Let content set the height. Report it with `size-changed`, or let `autoResize` do it, and avoid a root of `100vh` or `height: 100%` unless the host gave a fixed `containerDimensions.height`.

## Reaching the model

| Need                                          | Use                                                    | Visible to the user                                |
| :-------------------------------------------- | :----------------------------------------------------- | :------------------------------------------------- |
| Start a model turn                            | `ui/message`                                           | Yes, as a user message, often after approval       |
| Inform the model's next turn                  | `ui/update-model-context`                              | Host-dependent, never starts a turn                |
| A completion with no chat turn                | `sampling/createMessage` (`app.createSamplingMessage`) | Host-dependent. Needs `hostCapabilities.sampling`. |
| A completion when the host offers no sampling | An app-only tool whose server calls a model API        | No, and it runs on your account, not the user's    |

## Probing a host

Hosts differ in capabilities, consent prompts, and context fields, and few document them. Have the View report what it got: after `connect()`, call an app-only tool with `getHostVersion()` and `getHostCapabilities()` (or the full `getHostContext()`), and have the server log every tool call's arguments to stderr. The `initialize` request's `clientInfo` and `capabilities` are worth logging too. Quote every client-sent value as JSON in the log, since any client can put a newline or a terminal escape code in a name.

## Testing without a host

Build a dev host page that renders the View in an iframe with the SDK's `AppBridge`, forwards `/mcp` to your server from its own origin, and plays the model's part with scripted or random moves. Show the text the model would receive on each turn in a side panel. Query parameters for theme, width, and the user's side make the variations quick to check. The reference `AppBridge` also checks a hand-written View bridge against the SDK.

## Architecture options

MCP is already JSON-RPC 2.0, and a tool is a name, a description, and a JSON Schema, so an RPC interface or a set of zod schemas can generate the tool list. Hosts speak only MCP, though, so a different RPC system, such as Cap'n Web, fits behind the MCP server as its backend, with each tool forwarding to a method on a stub. Capability passing and promise pipelining don't survive the trip, since tool results are JSON and the model makes one call per step.

A View can also open its own connection to a backend listed in `csp.connectDomains`. That traffic skips the host entirely: the host can't audit it, the model never sees it, and the host's auth doesn't cover it. Prefer app-only tools unless you need streaming or capabilities the MCP path can't carry.
