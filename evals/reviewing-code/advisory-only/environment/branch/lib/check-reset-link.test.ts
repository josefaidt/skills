import { describe, expect, test } from "bun:test"
import { checkResetLink } from "./check-reset-link"
import { createUser } from "./test-helpers"
import { issueToken } from "./tokens"

describe("checkResetLink", () => {
  test("accepts a fresh link", () => {
    const user = createUser()
    const { secret } = issueToken(user)
    expect(checkResetLink({ tenantId: user.tenantId, secret }).status).toBe(200)
  })

  test("RESET-3.1 rejects a link after 30 minutes", () => {
    const user = createUser()
    const { secret } = issueToken(user, Date.now() - 31 * 60 * 1000)
    expect(checkResetLink({ tenantId: user.tenantId, secret }).status).toBe(410)
  })
})
