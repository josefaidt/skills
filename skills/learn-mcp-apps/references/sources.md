# Sources

Canonical and widely used references for MCP Apps, each loaded and checked on 2026-11-16. Official means published by the MCP project, Anthropic, OpenAI, Microsoft, or Vercel. Prefer these over memory, and prefer the spec and the installed SDK over secondary docs when they disagree.

## Spec

| Link | What it is |
| :-- | :-- |
| [Stable spec, `2026-01-26`](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx) | The normative text. The newest stable revision. |
| [Draft spec](https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/draft/apps.mdx) | The next revision. It adds sampling from Views, `ui/download-file`, `ui/notifications/request-teardown`, View-registered tools, and a WebMCP section. |
| [SEP-1865 page](https://modelcontextprotocol.io/seps/1865-mcp-apps-interactive-user-interfaces-for-mcp) | The proposal as accepted, status Final |
| [SEP-1865 pull request](https://github.com/modelcontextprotocol/modelcontextprotocol/pull/1865) | The discussion behind the design, merged 2026-01-28 |
| [Extensions SEP-2133](https://modelcontextprotocol.io/seps/2133-extensions) | How extensions are negotiated. It replaced SEP-1724, which has no docs page. |

## Official docs

| Link | What it is |
| :-- | :-- |
| [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview) | The MCP docs' introduction, with a list of clients |
| [Build an MCP App](https://modelcontextprotocol.io/extensions/apps/build) | Setup, the agent skills, and testing in Claude and `basic-host` |
| [Extensions overview](https://modelcontextprotocol.io/extensions/overview) | Extension lifecycle, `io.modelcontextprotocol/ui` negotiation, and `server/discover` in protocol `2026-07-28` |
| [Extension support matrix](https://modelcontextprotocol.io/extensions/client-matrix) | Which clients support which extensions, maintained by the community |

## SDK

| Link | What it is |
| :-- | :-- |
| [`modelcontextprotocol/ext-apps`](https://github.com/modelcontextprotocol/ext-apps) | The repository holding the spec, the SDK, examples, and skills |
| npm [`@modelcontextprotocol/ext-apps`](https://www.npmjs.com/package/@modelcontextprotocol/ext-apps) | The package. 2.1.0, which adds two-way WebMCP interop through `document.modelContext`, is published, but the `latest` tag still points at 2.0.4. |
| [API docs](https://apps.extensions.modelcontextprotocol.io/api/) | Generated reference plus guides. The lowercase guide paths, such as `documents/quickstart.html`, `patterns.html`, `migrate-to-v2.html`, and `migrate-openai-app.html`, are current. Capitalised paths such as `Patterns.html` still load but are stale v1 pages. |
| [Examples](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples) | Starters (`basic-server-react`, `-vue`, `-svelte`, `-preact`, `-solid`, `-vanillajs`) and demos such as `map`, `threejs`, `pdf`, `system-monitor`, and `qr` (Python) |
| [`basic-host`](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples/basic-host) | The reference host, on port 8080 with its sandbox proxy on 8081, listing servers in `SERVERS` |
| [Official agent skills](https://github.com/modelcontextprotocol/ext-apps/tree/main/plugins/mcp-apps) | `create-mcp-app`, `add-app-to-server`, `convert-web-app`, and `migrate-oai-app`. Install with `/plugin install mcp-apps@mcp-apps`. Some READMEs give a stale marketplace name. |

## Hosts

| Link | What it is |
| :-- | :-- |
| [Claude: get started with MCP Apps](https://claude.com/docs/connectors/building/mcp-apps/getting-started) | Claude's host-specific rules, including the `domain` format and which features need a remote server. Its sibling pages cover display modes, entry points, app tools, sending messages, embedded sites, downloads, transparent theming, instance supersession, external links, and troubleshooting. [`llms.txt`](https://claude.com/docs/llms.txt) lists them. |
| [Claude: download files](https://claude.com/docs/connectors/building/mcp-apps/download-files) | `app.downloadFile`, its capability gate, and the blocked file types |
| [Claude help center: interactive connectors](https://support.claude.com/en/articles/13454812-use-interactive-connectors-in-claude) | Where interactive connectors work for users |
| [OpenAI: add UI to your MCP server](https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt/) | MCP Apps in ChatGPT, mapping `window.openai` calls to `ui/*` methods and naming the ChatGPT-only features |
| [VS Code: MCP Apps support](https://code.visualstudio.com/blogs/2026/01/26/mcp-apps-support) | Microsoft's announcement for VS Code |
| [AI SDK: MCP Apps](https://ai-sdk.dev/docs/ai-sdk-core/mcp-apps) | Building your own host with Vercel's AI SDK: `mcpAppClientCapabilities`, `splitMCPAppTools`, and `readMCPAppResource` in `@ai-sdk/mcp`, and `MCPAppRenderer` in `@ai-sdk/react` |

## Authorization

| Link | What it is |
| :-- | :-- |
| [MCP authorization spec](https://modelcontextprotocol.io/specification/latest/basic/authorization) | Core OAuth 2.1 authorization for HTTP servers, revision `2026-07-28` |
| [MCP authorization extensions](https://modelcontextprotocol.io/extensions/auth/overview) | The overview of MCP's optional authorization extensions |
| [Enterprise-Managed Authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) | ID-JAG applied to MCP, with a vendor support table |
| [OAuth Client Credentials](https://modelcontextprotocol.io/extensions/auth/oauth-client-credentials) | Machine-to-machine access with no user present |
| [ID-JAG draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-identity-assertion-authz-grant/) | The IETF OAuth working group draft, revision `-06` of 2026-10-31 |
| [Auth0: what is ID-JAG](https://auth0.com/blog/what-is-id-jag/) | A plain-language explainer, and how Cross App Access (XAA) relates |
| [`lazy-auth-server` example](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples/lazy-auth-server) | A View triggering core MCP OAuth on demand through a 401, plus URL elicitation |

## Announcements

- [MCP Apps proposal](https://blog.modelcontextprotocol.io/posts/2025-11-21-mcp-apps/), 2025-11-21.
- [MCP Apps launch](https://blog.modelcontextprotocol.io/posts/2026-01-26-mcp-apps/), 2026-01-26. It names Claude on the web and Desktop, Goose, VS Code Insiders, and ChatGPT as the first hosts.

## Testing tools

| Link | What it is |
| :-- | :-- |
| [MCP Inspector app review](https://github.com/modelcontextprotocol/inspector/blob/main/docs/mcp-app-review.md) | Rendering and reviewing a View in the official inspector, which has partial MCP Apps support |
| [MCPJam](https://www.mcpjam.com/) ([docs](https://docs.mcpjam.com), [source](https://github.com/MCPJam/inspector)) | A community inspector for MCP Apps and ChatGPT apps |

## Related projects

- [MCP-UI](https://mcpui.dev/) ([source](https://github.com/MCP-UI-Org/mcp-ui), [MCP Apps adapter](https://mcpui.dev/guide/mcp-apps)): the community project that pioneered UI resources. It now implements MCP Apps, and `@mcp-ui/client` provides an `AppRenderer` for hosts.
- [OpenAI Apps SDK docs](https://developers.openai.com/apps-sdk), now branded Plugins: ChatGPT's earlier API, which informed the spec.
