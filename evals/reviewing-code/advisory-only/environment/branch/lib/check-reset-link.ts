import type { HandlerResponse } from "./http"
import type { TenantId } from "./types"
import { resetTokensFor } from "./db"
import { hashSecret, isExpired } from "./tokens"

type CheckResetLinkInput = {
  tenantId: TenantId
  secret: string
}

export const checkResetLink = ({ tenantId, secret }: CheckResetLinkInput): HandlerResponse => {
  const token = resetTokensFor(tenantId).findBySecretHash(hashSecret(secret))
  if (!token) return { status: 404, body: "This link is not valid." }
  if (token.usedAt !== null) return { status: 410, body: "This link has already been used." }
  if (isExpired(token)) return { status: 410, body: "This link has expired." }
  return { status: 200, body: { ok: true, expiresAt: token.expiresAt } }
}
