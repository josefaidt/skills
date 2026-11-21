import type { ResetToken, User } from "./types"
import { createHash, randomBytes, randomUUID } from "node:crypto"
import { resetTokensFor } from "./db"

// RESET-3.1
const LIFETIME_MS = 30 * 60 * 1000

export const hashSecret = (secret: string): string =>
  createHash("sha256").update(secret).digest("hex")

export const issueToken = (user: User, now = Date.now()): { token: ResetToken; secret: string } => {
  const secret = randomBytes(32).toString("base64url")
  const token: ResetToken = {
    id: randomUUID(),
    userId: user.id,
    tenantId: user.tenantId,
    secretHash: hashSecret(secret),
    expiresAt: now + LIFETIME_MS,
    usedAt: null,
  }
  resetTokensFor(user.tenantId).add(token)
  return { token, secret }
}

export const isExpired = (token: ResetToken, now = Date.now()): boolean => now >= token.expiresAt
