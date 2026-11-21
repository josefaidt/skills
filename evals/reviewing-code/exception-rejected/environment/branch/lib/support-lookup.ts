import { db } from "./db"
import { isExpired } from "./tokens"

type PendingReset = {
  tenantId: string
  userId: string
  tokenId: string
  expiresAt: number
}

// Lists an email's live reset links in every tenant, for the support team's lookup page.
export const pendingResetsFor = (email: string): PendingReset[] => {
  const now = Date.now()
  const accounts = db.users.filter((user) => user.email === email.toLowerCase())
  return db.resetTokens
    .filter(
      (token) =>
        token.usedAt === null &&
        !isExpired(token, now) &&
        accounts.some((user) => user.id === token.userId && user.tenantId === token.tenantId),
    )
    .map((token) => ({
      tenantId: token.tenantId,
      userId: token.userId,
      tokenId: token.id,
      expiresAt: token.expiresAt,
    }))
}
