import type { TenantId } from "./types"
import { resetTokensFor, usersFor } from "./db"
import { logger } from "./logger"

// The kinds of bounce the email provider reports.
type BounceType = "hard" | "soft" | "complaint"

type ResetBounceInput = {
  tenantId: TenantId
  email: string
  type: BounceType
}

// The email provider's webhook calls this when a reset email bounces.
export const recordResetBounce = ({ tenantId, email, type }: ResetBounceInput): void => {
  const user = usersFor(tenantId).findByEmail(email.toLowerCase())
  if (!user) return
  const now = Date.now()
  const tokens = resetTokensFor(tenantId).unusedFor(user)
  // Expire the links rather than marking them used, so a link that arrives late reads as expired.
  for (const token of tokens) token.expiresAt = now
  logger.warn(`reset email bounced: ${type}`, { tenantId, userId: user.id, expired: tokens.length })
}
