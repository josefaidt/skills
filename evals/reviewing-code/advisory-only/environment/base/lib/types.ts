/** A tenant's ID. */
export type TenantId = string & { readonly brand: "TenantId" }

/** A user's ID. */
export type UserId = string & { readonly brand: "UserId" }

/** An account in one tenant. */
export type User = {
  /** The user's ID. */
  id: UserId
  /** The tenant that owns the account. */
  tenantId: TenantId
  /** The sign-in email, lowercased. */
  email: string
}

/** A password reset token. Only the hash of its secret is stored. */
export type ResetToken = {
  /** The token's ID, which is safe to log. */
  id: string
  /** The user the token resets. */
  userId: UserId
  /** The tenant that owns the user. */
  tenantId: TenantId
  /** SHA-256 of the secret, hex-encoded. */
  secretHash: string
  /** When the token expires, in epoch milliseconds. */
  expiresAt: number
  /** When the token was used, in epoch milliseconds, or null while unused. */
  usedAt: number | null
}
