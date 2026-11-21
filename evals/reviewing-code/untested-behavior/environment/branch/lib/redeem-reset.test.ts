import { describe, expect, test } from "bun:test"
import { redeemReset } from "./redeem-reset"
import { createUser } from "./test-helpers"
import { issueToken } from "./tokens"

const setPassword = async (): Promise<void> => {}

describe("redeemReset", () => {
  test("RESET-2.1 sets the new password with a valid link", async () => {
    const user = createUser()
    const { secret } = issueToken(user)
    const changed: string[] = []
    const response = await redeemReset({
      tenantId: user.tenantId,
      secret,
      newPassword: "correct horse battery staple",
      setPassword: async (_, password) => void changed.push(password),
    })
    expect(response.status).toBe(200)
    expect(changed).toEqual(["correct horse battery staple"])
  })

  test("RESET-3.1 rejects a link issued more than 30 minutes ago", async () => {
    const user = createUser()
    const { secret } = issueToken(user, Date.now() - 31 * 60 * 1000)
    const response = await redeemReset({
      tenantId: user.tenantId,
      secret,
      newPassword: "x",
      setPassword,
    })
    expect(response.status).toBe(410)
  })
})
