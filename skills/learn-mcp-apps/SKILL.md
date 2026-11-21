---
name: learn-mcp-apps
description: Build, debug, and reason about MCP Apps, the Model Context Protocol extension (io.modelcontextprotocol/ui, SEP-1865) that lets a server's tools render an interactive HTML View inside a host such as Claude or ChatGPT. Covers the protocol and its lifecycle, the @modelcontextprotocol/ext-apps SDK, design patterns for Views and app-only tools, observed host behavior such as what Claude Desktop offers a View, security, and where the official references live. Use when building or changing an MCP App's server or View, answering how the spec or SDK behaves, deciding what a View can do in a given host, or debugging a View that doesn't render, size, theme, or reach the model.
user-invocable: false
---

# MCP Apps

MCP Apps is an optional MCP extension, `io.modelcontextprotocol/ui`, stable since spec revision `2026-01-26`. A server declares an HTML resource under a `ui://` URI and links tools to it, and when the model calls one of those tools, the host renders that HTML in a sandboxed iframe, called the View, next to the conversation. The View talks to the host with MCP's own JSON-RPC over `postMessage`, so it can call the server's tools, feed the model context, and post messages into the chat.

This file is the map. The reference files hold the detail, so load the one the task needs.

## Reference files

| File | Load when |
| :-- | :-- |
| `references/protocol.md` | You need the wire format: resource and tool `_meta.ui`, capability negotiation, the lifecycle, every `ui/*` method, host context, display modes, caching, and the spec's own inconsistencies |
| `references/sdk.md` | Writing a View or server with `@modelcontextprotocol/ext-apps`: entry points, the `App` class, server helpers, style helpers, `AppBridge` for hosts and tests, and SDK behavior beyond the spec |
| `references/patterns.md` | Designing an app: the model and View data split, app-only tools, handing turns to the model, polling, several Views per conversation, server-side state, single-file builds, theming, probing a host, testing without one |
| `references/hosts.md` | Something depends on a specific host: Claude Desktop's capabilities, its two server copies, logs, consent prompts, web and mobile access, and what is still unknown |
| `references/security.md` | Reviewing a server or View: what the host enforces, what the server and View must do themselves, prompt injection through tool results and messages |
| `references/auth.md` | Signing users in or auditing access: whose token a View's calls carry, core MCP OAuth and lazy sign-in from a View, Enterprise-Managed Authorization and ID-JAG, client credentials, and what an audit trail can attribute |
| `references/sources.md` | You need the canonical spec, SDK, docs, examples, or a related project, or want to read further |

## How the pieces fit

```
Model ──tools/call──▶ Host ──tools/call──▶ Server
                       │  resources/read ui://… ──▶ (HTML + _meta.ui.csp)
                       ▼
               sandboxed iframe (View)
   ui/initialize ▶ initialized ▶ tool-input ▶ tool-result
   View ▶ Host: tools/call, ui/message, ui/update-model-context, size-changed …
```

- **Server.** Declares `ui://` resources with MIME type `text/html;profile=mcp-app`, and links tools through `_meta.ui.resourceUri`. Tools with `_meta.ui.visibility: ["app"]` are callable by the View but hidden from the model.
- **Host.** Negotiates the extension in `initialize`, fetches the resource, builds the CSP from `_meta.ui.csp`, renders the View, and proxies its requests to the server, approving or refusing each one.
- **View.** Receives the creating call's arguments and result as notifications, then acts through the host. It never talks to the server directly unless its CSP allows a network origin.

## Facts that trip people up

1. A View only sees the input and result of the tool call that created it. Every later call to a UI-linked tool renders a new View, and the old ones keep running. See `patterns.md`.
2. `content` is for the model and `structuredContent` is for the View. Hosts keep `structuredContent` out of the model's context, and a model given a drawable state in `content` redraws it as text.
3. A View can't run a model turn silently. `ui/message` posts a visible user message, often after the user approves, `ui/update-model-context` only informs the next turn, and `sampling/createMessage` works only where the host advertises `sampling`. Claude Desktop doesn't, as of 2026-11-16.
4. `visibility: ["app"]` hides a tool from the model, not from other clients. Validate its arguments on the server.
5. Register `ontoolinput` and `ontoolresult` before `app.connect()`. Notifications can arrive before a late handler exists.
6. The HTML loads as one string with no base URL. Inline every script and style, or declare each origin in `csp.resourceDomains`.
7. Put `csp`, `permissions`, `domain`, and `prefersBorder` on the resource contents' `_meta.ui`, never on the tool's.
8. Hosts may cache UI resources indefinitely, since the spec defines no invalidation. Version the `ui://` URI to force a fresh fetch.
9. Claude Desktop starts two copies of each local stdio server, so state kept in process memory diverges between the model's calls and the View's.
10. Check `getHostCapabilities()` before using a method that depends on a capability, and handle refusal, because every View request can be denied.
11. A View holds no credentials. Its tool calls ride the host's MCP connection and access token, the same as the model's, so the server can't tell them apart by token. See `auth.md`.
12. The spec's prose has known errors, such as an example that sends `initialize` instead of `ui/initialize`. `protocol.md` lists them.

## Working on an app

Ground answers in sources, not memory. The extension, the SDK, and host behavior all moved within a year:

1. **Read the installed SDK** for API questions. Its `.d.ts` files in `node_modules/@modelcontextprotocol/ext-apps/dist/src/` carry full doc comments, and `spec.types.d.ts` names the protocol version it targets.
2. **Read the spec** for protocol questions, at the revision the SDK targets. `sources.md` has the links.
3. **Probe the host** for questions about what a host does. Have the View report `getHostVersion()` and `getHostCapabilities()` to an app-only tool, and have the server log tool arguments to stderr.
4. **Say which you used.** State whether an answer comes from the spec, the SDK, or an observed host, and the version or date.

To start a new app:

1. Write the tool specs first, each with its `content` text, `structuredContent` schema, and `visibility`.
2. Build the View as a single-file bundle with a fallback for every host CSS variable it uses.
3. Register the resource with explicit `prefersBorder` and only the `csp` domains it needs.
4. Return useful `content` from every tool, so text-only hosts still work.
5. Add a dev host on `AppBridge` and a capability report before testing in a real host.

The MCP project's own skills, such as `create-mcp-app` and `migrate-oai-app`, scaffold from the official examples. They pair with this one, which holds the reasoning and the host observations.

When a View misbehaves in a host:

- **Doesn't appear.** Check that the host advertised the extension, that `resourceUri` matches a resource exactly, that the resource's MIME type is `text/html;profile=mcp-app`, and that the host is running the server build you think it is. Claude Desktop needs a full quit and reopen.
- **Blank or broken.** Look for CSP violations from external scripts, styles, or fonts, and for a `ui/initialize` that never completed.
- **Wrong size.** Check that the View sends `size-changed` (`autoResize`), and that its root isn't `100vh` under a flexible container.
- **Can't reach the model.** Read the host's capabilities, and expect `ui/message` to wait on user approval.
- **State mismatch.** Find which server process served which call, using process ids in the server log.

## Keeping this skill current

Each lesson goes in the file that owns its subject, so the next session finds it:

- A host observation goes in `hosts.md`, dated, with the host's name and version.
- A design lesson goes in `patterns.md`, with the constraint that causes it.
- A spec erratum or SDK change goes in `protocol.md` or `sdk.md`, with the version where it appears.
- A new canonical link goes in `sources.md`.

Update the version numbers above when the spec or SDK moves, and delete facts that stop being true instead of qualifying them.
