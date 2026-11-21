# SDK

`@modelcontextprotocol/ext-apps` is the official TypeScript SDK for MCP Apps, published from the `modelcontextprotocol/ext-apps` repository alongside the spec. This file describes version 2.0.4, which targets protocol `2026-01-26` (its `LATEST_PROTOCOL_VERSION`) and already implements the draft spec's additions. Version 2.1.0, which adds two-way WebMCP interop through `document.modelContext`, is published, but npm's `latest` tag still installs 2.0.4. The API moves between releases, so confirm a name against the installed package's `.d.ts` files before relying on it:

```sh
grep -h '"version"' node_modules/@modelcontextprotocol/ext-apps/package.json
grep -rn 'LATEST_PROTOCOL_VERSION =' node_modules/@modelcontextprotocol/ext-apps/dist/src/spec.types.d.ts
```

Its peer dependencies are `@modelcontextprotocol/client`, `@modelcontextprotocol/core`, and `@modelcontextprotocol/server` 2.x, `zod` 4.2 or later, and optionally React 17 to 19.

## Entry points

| Import | For | Holds |
| :-- | :-- | :-- |
| `@modelcontextprotocol/ext-apps` | The View | `App`, `PostMessageTransport`, style helpers, method constants, the zod schemas and types |
| `@modelcontextprotocol/ext-apps/react` | The View | `useApp`, `useAutoResize`, `useDocumentTheme`, `useHostStyles` |
| `@modelcontextprotocol/ext-apps/server` | The server | `registerAppTool`, `registerAppResource`, `getUiCapability`, `EXTENSION_ID`, `RESOURCE_MIME_TYPE` |
| `@modelcontextprotocol/ext-apps/app-bridge` | A host | `AppBridge`, the host side of the protocol |
| `…/app-with-deps`, `…/react-with-deps` | The View | The same as above with dependencies bundled in |
| `…/schema.json` | Anything | The protocol as JSON Schema |

## Server helpers

`registerAppTool(server, name, config, callback)` wraps `McpServer.registerTool` and requires `_meta.ui` with `resourceUri` and `visibility`. `registerAppResource(server, name, uri, config, readCallback)` wraps `registerResource` and defaults the MIME type to `text/html;profile=mcp-app`. Its `config._meta.ui` appears on the `resources/list` entry as a fallback, and `_meta.ui` on the contents the read callback returns takes precedence, so put `csp`, `permissions`, `domain`, and `prefersBorder` on the contents. `getUiCapability(clientCapabilities)` returns the host's `{ mimeTypes }` or `undefined`, so a server can register text-only tools for hosts without the extension.

## The App class

`new App(appInfo, appCapabilities?, options?)` is the View's client. `options.autoResize` defaults to `true`, `options.strict` turns timing warnings into thrown errors, and `options.allowUnsafeEval` re-enables zod's JIT, which the SDK switches off by default because Views run under a CSP without `unsafe-eval`.

Register handlers first, then `await app.connect()`, which defaults to a `PostMessageTransport` to `window.parent`. `connect()` sends `ui/initialize`, stores the host's answer, sends `initialized`, and starts size reporting.

| Member | Protocol | Notes |
| :-- | :-- | :-- |
| `ontoolinput`, `ontoolinputpartial`, `ontoolresult`, `ontoolcancelled` | Host notifications | One-shot. Set before `connect()`, or the notification can arrive before the handler exists. |
| `onhostcontextchanged` | `host-context-changed` | The SDK merges each change into `getHostContext()` before calling you. |
| `onteardown` | `ui/resource-teardown` | Return after saving state. |
| `addEventListener(event, fn)` |  | Adds listeners. The `on*` setters replace the previous handler. |
| `getHostCapabilities()`, `getHostVersion()`, `getHostContext()` |  | `undefined` until `connect()` resolves. |
| `callServerTool({ name, arguments })` | `tools/call` | Takes an object, never a bare tool name. Resets its timeout on progress. |
| `readServerResource(params)`, `listServerResources(params?)` | `resources/read`, `resources/list` |  |
| `sendMessage({ role: "user", content: [...] })` | `ui/message` | `content` is an array of content blocks. |
| `updateModelContext({ content?, structuredContent? })` | `ui/update-model-context` |  |
| `openLink({ url })` | `ui/open-link` |  |
| `downloadFile({ contents })` | `ui/download-file` | Embedded resources or resource links. Needs `hostCapabilities.downloadFile`. |
| `requestDisplayMode({ mode })` | `ui/request-display-mode` |  |
| `requestTeardown()` | `ui/notifications/request-teardown` | Asks the host to close the View. |
| `createSamplingMessage(params)` | `sampling/createMessage` | A model completion through the host. Throws unless `hostCapabilities.sampling` exists. With `tools`, needs `sampling.tools`. |
| `sendLog(params)` | `notifications/message` |  |
| `sendSizeChanged`, `setupSizeChangedNotifications()` | `size-changed` | Automatic with `autoResize`. It measures `<html>` at `height: max-content`, so a View whose root is `100vh` reports the container's height and never shrinks. |
| `registerTool(name, config, cb)` | Host's `tools/call` to the View | The View exposes its own tools to the host, with `enable()`, `disable()`, `update()`, and `remove()` handles that send `tools/list_changed`. |

Most methods warn when called before `connect()` finishes the handshake and will throw in a future release, so load data in `ontoolresult`, not during module evaluation.

## Style helpers

- `applyDocumentTheme(theme)` sets `data-theme` and `color-scheme` on `<html>`, and `getDocumentTheme()` reads them back.
- `applyHostStyleVariables(variables, root?)` sets each variable inline on `<html>`, overriding your stylesheet's fallbacks.
- `applyHostFonts(css)` adds the host's font CSS in one `<style id="__mcp-host-fonts">`, once.

The React hooks `useDocumentTheme` and `useHostStyles` wrap these, and `useApp` creates and connects an `App`.

## The host side

`AppBridge` implements the host's half, so it doubles as a test harness for a View. Construct it with an MCP `Client` (or `null`), `hostInfo`, and `hostCapabilities`, set `setHostContext(...)`, connect it to a `PostMessageTransport` pointed at the iframe, and drive it:

- `sendToolInput`, `sendToolInputPartial`, `sendToolResult`, `sendToolCancelled`, and `sendHostContextChange` push to the View.
- `oninitialized`, `onsizechange`, `onmessage`, `onupdatemodelcontext`, `onopenlink`, `ondownloadfile`, `onrequestdisplaymode`, `onrequestteardown`, `onloggingmessage`, and `oncreatesamplingmessage` handle what the View sends.
- `oncalltool`, `onreadresource`, and `onlistresources` override proxying to the server.
- `teardownResource()` sends `ui/resource-teardown`, and `callTool()` calls tools the View registered.

`sendSandboxResourceReady` and `onsandboxready` implement the web sandbox-proxy handshake.

## The transport

`PostMessageTransport(target = window.parent, source?)` posts every message with target origin `"*"`. When given a `source` window it drops messages from any other window. `App.connect()` passes `window.parent` for both. It ignores non-JSON-RPC messages and reports malformed JSON-RPC as an error.

## Speaking the protocol without the SDK

The protocol is small enough to write by hand: a `postMessage` bridge on the View side and a JSON-RPC dispatcher on the server side. Reuse the published zod schemas (`McpUiInitializeResultSchema`, `McpUiToolResultNotificationSchema`, and the rest from the main entry, plus core's JSON-RPC schemas) so nothing redefines the wire format. Test the hand-written bridge against `AppBridge` to confirm it interoperates.
