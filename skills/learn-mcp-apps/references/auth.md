# Authorization

Authorization in an MCP App lives on the connection between the host and the server, not in the View. This file covers whose credentials a View's calls carry, core MCP authorization and the lazy sign-in pattern a View can trigger, MCP's enterprise and machine-to-machine extensions, and ID-JAG, the OAuth grant that lets an identity provider broker app-to-app access with an audit trail.

## Whose credentials a View uses

A View holds no token. Its `tools/call` goes to the host, and the host forwards it over its own MCP connection, so it carries the same access token as the model's calls. The server can't tell a View's call from the model's by the token. Only the tool name tells them apart, and only to the extent that the host enforces `visibility`.

Never put a token or API key in the View's HTML. The View is a document anyone with the resource can read. A View that must call an API directly, through `csp.connectDomains`, needs its own sign-in, and a dedicated `_meta.ui.domain` gives it a stable origin for OAuth callbacks and API allowlists (see `protocol.md`).

## Core MCP authorization

Core MCP authorization ([spec](https://modelcontextprotocol.io/specification/latest/basic/authorization), revision `2026-07-28`) is optional and applies to HTTP servers. A server that uses it acts as an OAuth 2.1 resource server:

- It publishes Protected Resource Metadata (RFC 9728) naming its authorization server.
- It accepts only tokens issued for it as the audience, which clients request with the `resource` parameter (RFC 8707).
- It answers a missing or invalid token with HTTP 401.
- Its authorization server implements OAuth 2.1 with RFC 8414 or OpenID Connect discovery.

A stdio server doesn't use OAuth. The host launches it, so it reads credentials from its environment.

## Lazy sign-in from a View

The ext-apps [`lazy-auth-server`](https://github.com/modelcontextprotocol/ext-apps/tree/main/examples/lazy-auth-server) example signs the user in only when a View needs protected data:

1. The server answers `initialize`, `tools/list`, and public tools without a token, so the View renders before any sign-in.
2. The View calls a protected tool with `callServerTool`, for example from a "Sign in" button.
3. The server answers 401 with `WWW-Authenticate: Bearer resource_metadata="…"`.
4. The host follows the metadata to the authorization server, runs the authorization-code flow with PKCE, and retries the call with the token.
5. The result reaches the View as the `callServerTool` response. The View handles a rejection, as it would any refused request.

The example also covers the cases around it:

- Short access and refresh token lifetimes, so silent refresh and full re-authentication are easy to watch.
- Session revocation through a protected tool.
- Mounting under a base path. RFC 8414 and RFC 9728 discovery documents sit at the origin's root with the path inserted after `/.well-known/…`, so the host app must rewrite those paths into the mount.
- A browser-based host has to read `WWW-Authenticate`, so the server exposes it through CORS.

This is the standard MCP flow with a deferred trigger, not ID-JAG. It needs a remote HTTP server, and whether a given host handles a 401 from a View-initiated call is host behavior, so probe it (see `hosts.md`).

URL elicitation is the companion pattern for a server that needs the user to sign in somewhere else, such as a third-party account. The server asks the host to open a URL, either by blocking inside the tool call or by failing with error `-32042` (`UrlElicitationRequired`) and succeeding when the call is retried.

## ID-JAG

ID-JAG (Identity Assertion JWT Authorization Grant, [IETF draft](https://datatracker.ietf.org/doc/draft-ietf-oauth-identity-assertion-authz-grant/)) lets an enterprise identity provider grant one application scoped, short-lived access to another application's API for a signed-in user, with no consent screen at the second application. It is an OAuth working group draft on the standards track, revision `-06` of 2026-10-31, so details can still change. Okta and Auth0 call the pattern Cross App Access (XAA) (see [Auth0's explainer](https://auth0.com/blog/what-is-id-jag/)).

The draft names four roles: the client, the IdP authorization server, the resource authorization server, and the resource server. The client gets access in two steps:

1. **Token exchange at the IdP** (RFC 8693). The client sends the user's identity assertion, such as an ID token, a SAML assertion, or a refresh token, with `grant_type=urn:ietf:params:oauth:grant-type:token-exchange`, `requested_token_type=urn:ietf:params:oauth:token-type:id-jag`, one `audience` (the resource authorization server), and usually a `resource`. The IdP applies its administrators' policy and returns the ID-JAG.
2. **JWT bearer grant at the resource authorization server** (RFC 7523). The client sends the ID-JAG as `assertion` with `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer` (or `jwt-dpop` when DPoP-bound). The server applies its own local policy and issues an ordinary access token.

The ID-JAG is a grant, not an access token. It is a JWT with header `typ: oauth-id-jag+jwt`. RS256 is mandatory to implement, and resource authorization servers should also accept ES256. It requires the claims `iss`, `sub`, `aud`, `client_id`, `jti`, `exp`, and `iat`, and may carry `resource`, `scope`, `authorization_details`, `act`, `tenant`, `auth_time`, `acr`, `amr`, and `email`, among others.

## MCP's authorization extensions

MCP's [authorization extensions](https://modelcontextprotocol.io/extensions/auth/overview) are never active by default, and client and server negotiate each one.

[Enterprise-Managed Authorization](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) (`io.modelcontextprotocol/enterprise-managed-authorization`) is ID-JAG applied to MCP:

1. The user signs in to the MCP client, such as Claude, through the enterprise IdP, and the client keeps the ID token or SAML assertion.
2. The client exchanges it at the IdP for an ID-JAG whose `audience` is the MCP server's authorization server.
3. The client presents the ID-JAG to that authorization server with the JWT bearer grant and receives an MCP access token.

The user never sees the MCP server's authorization page. The page's vendor table lists Okta and Ping Identity among others as available, Auth0 as early access, and Keycloak as experimental, and notes that implementations track different draft revisions.

[OAuth Client Credentials](https://modelcontextprotocol.io/extensions/auth/oauth-client-credentials) (`io.modelcontextprotocol/oauth-client-credentials`) covers machine-to-machine access with no user present. The client authenticates with a signed JWT assertion (RFC 7523, recommended) or a client ID and secret, and sends `resource` with the request.

## What the audit trail shows

ID-JAG moves the record of access to the IdP. Each exchange names the client that asked (`client_id`, such as the MCP host), the user (`sub`), the target (`aud` and `resource`), and the `scope`, under policy an administrator controls and can revoke. That replaces the pattern where a user hands a personal token or API key to a model provider, which leaves no record of which application used it.

The trail stops at the host. The model's calls, a View's calls, and a user's clicks in a View all travel over the host's one MCP connection with one access token, so none of these records says which of them made a call. Attributing calls at that level takes server-side logging per tool, with app-only tools kept separate from the model's, plus whatever the host logs. The draft's optional `act` claim can name an actor, but no host has been seen setting it.

A server that calls a downstream API for the user needs a grant of its own for that API. URL elicitation gets one through the user. Whether an MCP server can act as an ID-JAG client for the downstream call is an open question, since it holds an MCP access token rather than the user's identity assertion.

## Choosing a mechanism

| Situation                                                             | Mechanism                                                      |
| :-------------------------------------------------------------------- | :------------------------------------------------------------- |
| A local stdio demo                                                    | Credentials from the server's environment, and no OAuth        |
| A remote server with per-user data                                    | Core MCP authorization, signing in up front or lazily on a 401 |
| An organization that wants IT to grant access with no per-app consent | Enterprise-Managed Authorization, built on ID-JAG              |
| A service with no user present                                        | OAuth Client Credentials                                       |
| A server that needs the user's account elsewhere                      | URL elicitation                                                |
