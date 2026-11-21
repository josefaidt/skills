import type { HandlerResponse } from "./http"
import type { TenantId } from "./types"
import { db } from "./db"
import { errorResponse } from "./errors"
import { logger } from "./logger"
import { issueToken } from "./tokens"

type ResendResetInput = {
  tenantId: TenantId
  email: string
  send: (to: string, secret: string) => Promise<void>
}

const ACCEPTED: HandlerResponse = { status: 202, body: { ok: true } }

export const resendReset = async ({
  tenantId,
  email,
  send,
}: ResendResetInput): Promise<HandlerResponse> => {
  if (!email) return errorResponse(400, "missing_email", "Enter the email for your account.")
  const user = db.users.find((candidate) => candidate.email === email.toLowerCase())
  if (!user) return ACCEPTED

  // RESET-3.3: a new link invalidates the account's earlier unused links
  const now = Date.now()
  for (const token of db.resetTokens) {
    if (token.userId === user.id || token.usedAt === null) token.usedAt = now
  }

  const { token, secret } = issueToken(user)
  await send(user.email, secret)
  logger.info("reset link resent", { tenantId, userId: user.id, tokenId: token.id, secret })
  return ACCEPTED
}
