# feat: look up an email's reset links for support

Adds `pendingResetsFor`, which lists the live reset links for an email in every tenant, so the support team can see whether a customer's link is still waiting.

Tested in `lib/support-lookup.test.ts`.

Exception: `tenancy/scoped-queries`. Support staff look a customer up by email before they know the tenant, and the lookup page sits behind the staff-only gateway.
