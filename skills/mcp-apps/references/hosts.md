# Hosts

What specific hosts do, as observed rather than as specified. Host behavior changes without notice, so every entry carries the date it was seen. Re-probe before relying on one (see "Probing a host" in `patterns.md`), and add new observations here with their date and host version.

## Claude Desktop

### Capabilities offered to a View

Observed 2026-11-16 by a View reporting `getHostVersion()` and `getHostCapabilities()` on macOS:

```json
{
  "hostInfo": { "name": "Claude", "version": "1.0.0" },
  "hostCapabilities": {
    "openLinks": {},
    "downloadFile": {},
    "serverTools": {},
    "serverResources": {},
    "logging": {},
    "sandbox": {},
    "updateModelContext": { "text": {}, "image": {} },
    "message": { "text": {} }
  }
}
```

The report shows:

- No `sampling`, so `app.createSamplingMessage()` is rejected and a View can't get a completion without a visible chat turn.
- `ui/message` accepts text only, while `ui/update-model-context` also accepts images.
- An empty `sandbox`: no extra domains or permissions granted, as expected for a View that requested none.
- No `listChanged` on `serverTools` or `serverResources`.

The MCP client that connected to the server called itself `local-agent-mode-checkers` version `1.0.0`, used protocol `2025-11-25`, and sent `roots.listChanged` and the `io.modelcontextprotocol/ui` extension with `mimeTypes: ["text/html;profile=mcp-app"]`. Other chat modes may offer different capabilities.

### Running local servers

- Claude Desktop launches stdio servers from `mcpServers` in `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS) or `%APPDATA%\Claude\claude_desktop_config.json` (Windows). It doesn't see your shell's `PATH`, so give the runtime's absolute path, such as the `bun` that ran your install script.
- It starts two copies of each local server. The model's tool calls and the View's tool calls can reach different copies, so state shared in process memory diverges (see "Keeping state on the server" in `patterns.md`).
- It reads the config and starts servers at launch, so a changed server or a rebuilt View needs a full quit and reopen. A server entry that points at a git checkout runs whatever that checkout holds, which may be behind the branch you just merged.
- It appends each server's stderr, plus its own message log, to `~/Library/Logs/Claude/mcp-server-<name>.log`. Its own lines record methods but not arguments, so log arguments yourself. `~/Library/Logs/Claude/mcp.log` combines every server.
- It installs MCP Bundles (`.mcpb` files) by opening them. Whether MCP Apps render from a bundle install isn't documented, so fall back to a config entry if a View doesn't appear.

### Messages and consent

Claude asks the user to approve each `ui/message` from a View until they agree to that app's messages, or places the text in the message box for the user to send.

## Claude across surfaces

Claude documents its host rules in its own MCP Apps docs (linked in `sources.md`). As of 2026-11-16 they say:

- Interactive connectors work on the web, Desktop, Cowork, and mobile. The side panel and pinning aren't on mobile yet.
- The side panel, entry points, app tools, and embedded sites need a remote server, and a directory connector also needs a Verified listing.
- A `domain` is the first 32 hex characters of the SHA-256 of the server's URL, followed by `.claudemcpcontent.com`.
- `ui/download-file` blocks executable and script types such as `.exe` and `.js`.

Its pages on display modes, instance supersession (how Claude treats several Views of one app), transparent theming, and troubleshooting are worth reading before designing around those areas.

### Claude on the web and mobile

Claude on the web and on mobile reaches MCP servers from Anthropic's infrastructure, so a local server needs a public URL, such as from a Cloudflare quick tunnel, added as a custom connector. A tunneled server without auth is reachable by anyone with the URL until you stop it. An HTTP server that answers only requests whose `Host` header is localhost, plus an allowlist for the tunnel's hostname, guards against DNS rebinding.

### Claude Code

The Claude desktop app's Code tab connects its own MCP clients to the same servers. Whether it renders MCP Apps, and with which capabilities, hasn't been probed.

## Other hosts

- **ChatGPT** renders MCP Apps and keeps OpenAI's earlier Apps SDK API, `window.openai`, beside it. OpenAI's docs map each `window.openai` call to its `ui/*` method. Checkout, file upload, modals, and `widgetState` remain ChatGPT-only.
- **VS Code** (from Insiders, January 2026) and **Goose** were launch hosts.
- **Your own host** can use Vercel's AI SDK (`@ai-sdk/mcp` and `MCPAppRenderer` in `@ai-sdk/react`), MCP-UI's `AppRenderer`, or the SDK's `AppBridge`. `basic-host` in the ext-apps repo is the reference.

None of these have been probed with a capability report yet. Probe one before relying on a feature, and record what you find here.

## Not yet known

- Whether Claude Desktop re-reads a UI resource within a session, or caches it until restart.
- Whether the Claude desktop app's Code tab renders Views, and with which capabilities.
- Whether Views render from an `.mcpb` bundle install.
- Whether Claude runs the OAuth flow when a View's `callServerTool` gets a 401, the lazy sign-in in `auth.md`.
- Which Claude surfaces support Enterprise-Managed Authorization, and whether any host sets the ID-JAG `act` claim.
- Whether a `BroadcastChannel` reaches every View of one resource on Claude on the web, where each server's `domain` decides the origin.
