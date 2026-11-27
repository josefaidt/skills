import { describe, expect, test } from "bun:test"
import { requestReset } from "./request-reset"
import { createUser } from "./test-helpers"

describe("requestReset", () => {
  test("RESET-1.1 sends a link to the account's email", async () => {
    const user = createUser()
    const sent: string[] = []
    await requestReset({
      tenantId: user.tenantId,
      email: user.email,
      send: async (to) => void sent.push(to),
    })
    expect(sent).toEqual([user.email])
  })

  test("RESET-1.2 returns the same response for an unknown email", async () => {
    const user = createUser()
    const send = async (): Promise<void> => {}
    const known = await requestReset({ tenantId: user.tenantId, email: user.email, send })
    const unknown = await requestReset({
      tenantId: user.tenantId,
      email: "nobody@example.com",
      send,
    })
    expect(unknown).toEqual(known)
  })
})
