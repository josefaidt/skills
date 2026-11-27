import type { ResetToken, TenantId, User } from "./types"

// In-memory tables stand in for the database.
const users: User[] = []
const resetTokens: ResetToken[] = []

// Handlers read and write tenant data only through these, which apply the tenant filter.
export const usersFor = (tenantId: TenantId) => ({
  findByEmail: (email: string): User | undefined =>
    users.find((user) => user.tenantId === tenantId && user.email === email),
  add: (user: User): void => {
    if (user.tenantId !== tenantId) throw new Error("user belongs to another tenant")
    users.push(user)
  },
})

export const resetTokensFor = (tenantId: TenantId) => ({
  add: (token: ResetToken): void => {
    if (token.tenantId !== tenantId) throw new Error("token belongs to another tenant")
    resetTokens.push(token)
  },
  findBySecretHash: (secretHash: string): ResetToken | undefined =>
    resetTokens.find((token) => token.tenantId === tenantId && token.secretHash === secretHash),
  unusedFor: (user: User): ResetToken[] =>
    resetTokens.filter(
      (token) => token.tenantId === tenantId && token.userId === user.id && token.usedAt === null,
    ),
})

// Unscoped tables, for scripts that read across tenants on purpose.
export const db = { users, resetTokens }
