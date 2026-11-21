import { describe, expect, test } from "bun:test"
import { pendingResetsFor } from "./support-lookup"
import { createUser } from "./test-helpers"
import { issueToken } from "./tokens"

describe("pendingResetsFor", () => {
  test("lists an email's live links in every tenant", () => {
    const first = createUser("lin@example.com")
    const second = createUser("lin@example.com")
    issueToken(first)
    issueToken(second)
    expect(pendingResetsFor("LIN@example.com").map((reset) => reset.tenantId)).toEqual([
      first.tenantId,
      second.tenantId,
    ])
  })

  test("leaves out expired links", () => {
    const user = createUser("mae@example.com")
    issueToken(user, Date.now() - 31 * 60 * 1000)
    expect(pendingResetsFor(user.email)).toEqual([])
  })
})
