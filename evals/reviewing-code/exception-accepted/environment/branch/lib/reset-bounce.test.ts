import { describe, expect, test } from "bun:test"
import { recordResetBounce } from "./reset-bounce"
import { createUser } from "./test-helpers"
import { isExpired, issueToken } from "./tokens"

describe("recordResetBounce", () => {
  test("RESET-1.3 expires the account's unused links when a reset email bounces", () => {
    const user = createUser()
    const { token } = issueToken(user)
    recordResetBounce({ tenantId: user.tenantId, email: user.email, type: "hard" })
    expect(isExpired(token)).toBe(true)
  })

  test("RESET-1.3 leaves another account's links alone", () => {
    const user = createUser()
    const other = createUser("grace@example.com")
    const { token } = issueToken(other)
    recordResetBounce({ tenantId: user.tenantId, email: user.email, type: "hard" })
    expect(isExpired(token)).toBe(false)
  })
})
