# Protocol

The wire-level reference for MCP Apps: what a server declares, what crosses the iframe boundary, and in what order. It follows the stable spec, revision `2026-01-26`, and marks what only the draft spec and the SDK add. When this file and the spec disagree, the spec wins, and when the spec and the SDK disagree, check which one the host you target follows.

## Parties

- **Server.** An ordinary MCP server. It declares `ui://` resources and links tools to them.
- **Host.** The MCP client application, such as Claude Desktop. It renders the View, proxies the View's requests to the server, and decides what the View may do.
- **View.** The HTML document the host renders in a sandboxed iframe. It acts as an MCP client of the host, speaking JSON-RPC 2.0 over `postMessage`.
- **Sandbox proxy.** Web hosts only. An outer iframe on a different origin from the host that loads the View in an inner iframe and relays messages. Methods starting `ui/notifications/sandbox-` stop at the proxy.

## Capability negotiation

The host advertises support in the core MCP `initialize` request under the extension ID `io.modelcontextprotocol/ui`:

```json
{
  "capabilities": {
    "extensions": { "io.modelcontextprotocol/ui": { "mimeTypes": ["text/html;profile=mcp-app"] } }
  }
}
```

`mimeTypes` is required. A server should check it before registering UI-linked tools (the SDK's `getUiCapability(clientCapabilities)` reads it) and should still return a meaningful `content` array from every tool, because a host without the extension shows text only.

## UI resources

A UI resource is a normal MCP resource with three constraints:

- The URI starts with `ui://`.
- The MIME type is `text/html;profile=mcp-app` (the SDK's `RESOURCE_MIME_TYPE`).
- The content is a complete HTML5 document in `text`, or base64 in `blob`.

Hosts fetch it with `resources/read`. A server may leave UI-only resources out of `resources/list`, since hosts discover them through tool metadata.

Rendering settings live in `_meta.ui` on the resource contents returned by `resources/read`, and the declaration may repeat them:

| Field                 | Meaning                                                                                                                                                 |
| :-------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `csp.connectDomains`  | Origins for fetch, XHR, and WebSocket. Maps to `connect-src`.                                                                                           |
| `csp.resourceDomains` | Origins for scripts, styles, images, fonts, and media. Maps to `script-src`, `style-src`, `img-src`, `font-src`, `media-src`. Wildcard subdomains work. |
| `csp.frameDomains`    | Origins for nested iframes. Omitted means `frame-src 'none'`.                                                                                           |
| `csp.baseUriDomains`  | Allowed `<base>` URIs. Omitted means `base-uri 'self'`.                                                                                                 |
| `permissions`         | `camera`, `microphone`, `geolocation`, `clipboardWrite`, each `{}`. Hosts MAY map them to the iframe `allow` attribute, so feature-detect.              |
| `domain`              | A dedicated sandbox origin, for OAuth callbacks, CORS, or API key allowlists. The format is host-specific, such as `{hash}.claudemcpcontent.com`.       |
| `prefersBorder`       | `true` asks the host for a visible border and background, `false` for none. Set it explicitly, because host defaults differ.                            |

The SDK types `csp` and `permissions` as `never` on tool metadata, so they belong on the resource, never on the tool.

Without `csp`, the host must apply this default, and it must never allow a domain the resource did not declare:

```
default-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';
img-src 'self' data:; media-src 'self' data:; connect-src 'none';
```

## Linking tools to a View

```json
{
  "name": "get_weather",
  "inputSchema": { "type": "object", "properties": { "location": { "type": "string" } } },
  "_meta": { "ui": { "resourceUri": "ui://weather/dashboard", "visibility": ["model", "app"] } }
}
```

`visibility` defaults to `["model", "app"]`:

- Without `"model"`, the host must keep the tool out of the model's tool list.
- Without `"app"`, the host must reject the View's `tools/call` for it.
- A View can only call tools on its own server connection.

The flat `_meta["ui/resourceUri"]` key (the SDK's `RESOURCE_URI_META_KEY`) is deprecated. Write `_meta.ui.resourceUri`.

## Lifecycle

1. The host lists tools and may prefetch and cache the linked resources.
2. The model calls a tool with a `resourceUri`. In parallel, the host renders the View (web hosts go through the sandbox proxy handshake first).
3. The View sends `ui/initialize` with `appInfo`, `appCapabilities`, and `protocolVersion`. The host answers with `hostInfo`, `hostCapabilities`, and `hostContext`.
4. The View sends `ui/notifications/initialized`. The host must not send the View anything before this.
5. The host sends `ui/notifications/tool-input-partial` zero or more times while arguments stream, then `ui/notifications/tool-input` once with the complete arguments.
6. The host sends `ui/notifications/tool-result` with the `CallToolResult`, or `ui/notifications/tool-cancelled` with a `reason`.
7. The interactive phase: the View calls tools, sends messages, updates model context, and reports its size, and the host pushes context changes.
8. Before removing the View, the host sends the `ui/resource-teardown` request and should wait for the response.

A View only ever receives the input and result of the tool call that created it. Later tool calls by the model, even to tools linked to the same resource, either create a new View or reach no View at all.

## View to host

| Method                          | Kind         | Purpose                                                                                                                        |
| :------------------------------ | :----------- | :----------------------------------------------------------------------------------------------------------------------------- |
| `ui/initialize`                 | request      | Handshake. Carries `appCapabilities`, including `availableDisplayModes` and `tools`.                                           |
| `ui/notifications/initialized`  | notification | Ends the handshake.                                                                                                            |
| `tools/call`                    | request      | Calls a tool on the View's server through the host.                                                                            |
| `resources/read`                | request      | Reads a server resource through the host.                                                                                      |
| `notifications/message`         | notification | Logs to the host.                                                                                                              |
| `ping`                          | request      | Health check.                                                                                                                  |
| `ui/message`                    | request      | Adds a user message to the chat and starts a turn. The host MAY ask the user first.                                            |
| `ui/update-model-context`       | request      | Sets `content` and `structuredContent` the model sees on later turns. Each call replaces the last, and it never starts a turn. |
| `ui/open-link`                  | request      | Asks the host to open a URL.                                                                                                   |
| `ui/request-display-mode`       | request      | Asks for `inline`, `fullscreen`, or `pip`. The response holds the mode actually set.                                           |
| `ui/notifications/size-changed` | notification | Reports `width` and `height`. Required for hosts to size flexible containers.                                                  |

The draft spec and SDK 2.0.4 add `sampling/createMessage`, `ui/download-file`, and `ui/notifications/request-teardown` (the View asks the host to close it). The SDK also sends `resources/list` and types `ui/message` content as an array of content blocks. Each depends on a matching host capability. See `sdk.md`.

## Host to View

| Method                                  | Kind         | Purpose                                                                                      |
| :-------------------------------------- | :----------- | :------------------------------------------------------------------------------------------- |
| `ui/notifications/tool-input-partial`   | notification | Best-effort partial arguments while streaming. Never act on them.                            |
| `ui/notifications/tool-input`           | notification | Complete arguments, sent once.                                                               |
| `ui/notifications/tool-result`          | notification | The `CallToolResult`: `content`, `structuredContent`, `_meta`.                               |
| `ui/notifications/tool-cancelled`       | notification | The call was cancelled, with an optional `reason`.                                           |
| `ui/notifications/host-context-changed` | notification | A partial `hostContext`. Merge it into what you hold.                                        |
| `ui/resource-teardown`                  | request      | The View is about to go away. Save state, then respond.                                      |
| `tools/call`, `tools/list`              | request      | Draft spec. Calls tools the View itself registers, when it declares `appCapabilities.tools`. |

## Host context

`hostContext` arrives in the `ui/initialize` result and changes through `host-context-changed`:

- `toolInfo`: the `id` of the `tools/call` request and the `tool` definition.
- `theme`: `light` or `dark`.
- `styles.variables`: CSS custom properties, such as `--color-background-primary`, `--font-sans`, `--border-radius-md`, and `--shadow-sm`. The full list is the `McpUiStyleVariableKey` type. Hosts should use `light-dark()` values.
- `styles.css.fonts`: `@font-face` rules or `@import` statements.
- `displayMode` and `availableDisplayModes`.
- `containerDimensions`: `height` or `maxHeight`, and `width` or `maxWidth`. A fixed value means the host controls that axis and the View fills it, a max means the View sizes itself up to it, and omitted means unbounded.
- `locale` (BCP 47), `timeZone` (IANA), `userAgent`, `platform` (`web`, `desktop`, or `mobile`), `deviceCapabilities` (`touch`, `hover`), and `safeAreaInsets`.

## Host capabilities

The `ui/initialize` result's `hostCapabilities` says what the View may use. The stable spec lists `openLinks`, `serverTools`, `serverResources`, `logging`, and `sandbox` (the `permissions` and `csp` the host actually granted). The draft spec and the SDK add `downloadFile`, `updateModelContext` and `message` (each listing supported content modalities, such as `{ "text": {} }`), and `sampling` (with `tools` when tool use works). Check a capability before using the method behind it.

## Display modes

The View lists the modes it supports in `appCapabilities.availableDisplayModes`, and the host lists its own in `hostContext.availableDisplayModes`. The View requests only modes both support and handles a response mode that differs from the request. The host never switches the View to a mode the View didn't declare, and it reports changes through `host-context-changed`.

## Tool result fields

- `content`: the text the model reads, and all a text-only host shows.
- `structuredContent`: data for the View to render. Hosts keep it out of the model's context.
- `_meta`: metadata such as timestamps, for neither the model nor the user.

## Caching

The spec says only that hosts MAY prefetch and cache UI resources. It defines no TTL, ETag, or version field, and servers may leave UI-only resources out of `list_changed` notifications, so cache lifetime is up to the host. The `ui://` document never goes through HTTP, so browser caching doesn't apply to it. Subresources loaded from `resourceDomains` do use the browser's HTTP cache, partitioned by the sandbox origin. To force hosts to fetch a new View, put a version or content hash in the URI.

## Spec inconsistencies

The `2026-01-26` text contradicts itself in places. Don't copy these from the spec:

1. Its hand-rolled transport example sends `initialize`. The method is `ui/initialize`.
2. That example's listener rejects on any message with a different `id`, so an unrelated notification fails the request. Ignore messages that don't match.
3. It calls `ui/resource-teardown` a notification, but it has an `id` and expects a response.
4. The "restrictive default" CSP sets `connect-src 'none'`, while the CSP construction example sets `connect-src 'self'`.
5. The `allow` attribute example drops `clipboardWrite`.
6. The theming fallback example uses `--border-radius-small`. The standard key is `--border-radius-sm`.
7. The negotiation example uses `protocolVersion` `2024-11-05`, which predates the extensions mechanism.
8. `tool-input` is sent at most once, yet the interactive-phase diagram shows it again after a View-initiated `tools/call`. That `tools/call` returns its result as the response, not as notifications.
