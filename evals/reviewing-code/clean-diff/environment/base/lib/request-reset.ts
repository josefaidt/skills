import type { HandlerResponse } from "./http"
import type { TenantId } from "./types"
import { usersFor } from "./db"
import { errorResponse } from "./errors"
import { logger } from "./logger"
import { issueToken } from "./tokens"

type RequestResetInput = {
  tenantId: TenantId
  email: string
  send: (to: string, secret: string) => Promise<void>
}

// RESET-1.2: the same response whether or not the account exists, so it reveals nothing
const ACCEPTED: HandlerResponse = { status: 202, body: { ok: true } }

export const requestReset = async ({
  tenantId,
  email,
  send,
}: RequestResetInput): Promise<HandlerResponse> => {
  if (!email) return errorResponse(400, "missing_email", "Enter the email for your account.")
  const user = usersFor(tenantId).findByEmail(email.toLowerCase())
  if (!user) return ACCEPTED
  const { token, secret } = issueToken(user)
  await send(user.email, secret)
  logger.info("reset link sent", { tenantId, userId: user.id, tokenId: token.id })
  return ACCEPTED
}
