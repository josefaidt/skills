import type { TenantId, User, UserId } from "./types"
import { usersFor } from "./db"

let next = 0

// Creates a user in a fresh tenant, so tests never share state.
export const createUser = (email = "ada@example.com"): User => {
  next += 1
  const user: User = {
    id: `user-${next}` as UserId,
    tenantId: `tenant-${next}` as TenantId,
    email,
  }
  usersFor(user.tenantId).add(user)
  return user
}
