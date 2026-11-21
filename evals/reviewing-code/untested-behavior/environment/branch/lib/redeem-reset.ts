import type { HandlerResponse } from "./http"
import type { TenantId, User } from "./types"
import { resetTokensFor } from "./db"
import { errorResponse } from "./errors"
import { logger } from "./logger"
import { hashSecret, isExpired } from "./tokens"

type RedeemResetInput = {
  tenantId: TenantId
  secret: string
  newPassword: string
  setPassword: (user: Pick<User, "id" | "tenantId">, password: string) => Promise<void>
}

export const redeemReset = async ({
  tenantId,
  secret,
  newPassword,
  setPassword,
}: RedeemResetInput): Promise<HandlerResponse> => {
  const token = resetTokensFor(tenantId).findBySecretHash(hashSecret(secret))
  if (!token) return errorResponse(404, "invalid_link", "This link is not valid.")
  if (token.usedAt !== null)
    return errorResponse(410, "used_link", "This link has already been used.")
  if (isExpired(token)) return errorResponse(410, "expired_link", "This link has expired.")

  // Mark the token used before the password changes, so two requests racing on one link cannot both succeed.
  token.usedAt = Date.now()
  await setPassword({ id: token.userId, tenantId }, newPassword)
  logger.info("password reset", { tenantId, userId: token.userId, tokenId: token.id })
  return { status: 200, body: { ok: true } }
}
