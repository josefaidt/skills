import { describe, expect, test } from "bun:test"
import { resetTokensFor } from "./db"
import { resendReset } from "./resend-reset"
import { createUser } from "./test-helpers"

describe("resendReset", () => {
  test("RESET-3.3 invalidates the account's earlier unused links", async () => {
    const user = createUser()
    const send = async (): Promise<void> => {}
    await resendReset({ tenantId: user.tenantId, email: user.email, send })
    await resendReset({ tenantId: user.tenantId, email: user.email, send })
    expect(resetTokensFor(user.tenantId).unusedFor(user)).toHaveLength(1)
  })
})
