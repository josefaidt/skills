# Security

MCP Apps runs a server's HTML inside the host and lets it act on the user's behalf, so both sides need defending. The spec's threat model lists a malicious server shipping harmful HTML, a View escaping its sandbox, a View calling tools it shouldn't, a View exfiltrating host data, and a View phishing the user. This file covers what each party enforces and what a demo most often gets wrong.

## What the host enforces

- The View runs in a sandboxed iframe. A web host adds a sandbox proxy on a separate origin, granted `allow-scripts` and `allow-same-origin`.
- The CSP comes from the resource's `_meta.ui.csp` and is restrictive by default, with `object-src 'none'` always. The host may tighten it but must never allow an undeclared domain.
- The host keeps `visibility: ["app"]` tools out of the model's list, rejects a View's call to a tool without `"app"`, and blocks calls to other servers.
- The host may ask the user before `ui/message`, `ui/open-link`, or a sampling request, and may refuse any of them.

None of this protects your server from callers other than the host.

## What the server must do

1. **Validate every tool's arguments,** app-only tools included. `visibility` is a host convention, and any MCP client can call any tool the server exposes.
2. **Bind HTTP servers to localhost and check the `Host` header** against an allowlist, which stops DNS rebinding. Send no CORS headers unless a browser client needs them.
3. **Treat a tunnel as public.** A server exposed through a tunnel without auth is open to anyone holding the URL.
4. **Quote client-sent values in logs.** Client names, versions, and tool arguments can carry newlines that forge log lines, or escape codes that reach a terminal. Write them as JSON, also escape DEL, the C1 controls, and U+2028 and U+2029, and cap their length.
5. **Declare only the domains the View needs** in `csp`, and the narrowest `permissions`.

## What the View must do

1. **Escape everything from tool results before rendering.** `structuredContent` and `content` can carry text a user or a third party wrote. Render it as text, never through `innerHTML` or `dangerouslySetInnerHTML`.
2. **Check message origins in a hand-written bridge.** Accept messages only from `window.parent`, compare `event.source`, ignore anything that isn't JSON-RPC 2.0, and match responses to requests by `id`.
3. **Expect the host to say no.** Every request can fail through denial, missing capability, or teardown. Handle the rejection without leaving the View stuck.

## Prompt injection

Text crosses into the model's context in three places: a tool result's `content`, `ui/update-model-context`, and `ui/message`. Anything there that came from outside the system, such as a user's name in a shared game, a document title, or a web page, can carry instructions aimed at the model. Keep untrusted text out of the model's context where it isn't needed, label it as data where it is, and never let a View forward arbitrary third-party text as a `ui/message`, which arrives as the user's own words.

## Using the user's model

Sampling through the host (`sampling/createMessage`) spends the user's model access. Hosts gate it behind the `sampling` capability and may require approval. A View that falls back to calling a model API from its server spends your account instead, and its key must stay on the server, never in the View's HTML.
