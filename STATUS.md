# STATUS

## Phase 1 — repo, approach, controls shell, screens 1 to 5

### Approach: Option B, and why not Option A
Option A was tried first and abandoned inside the timebox. Evidence:

- Next 12.2.5 **does** compile under Node 26: webpack finished, then the build failed on
  a missing peer dependency during type-check.
- But a working static export also needed: 113 API routes deleted, 4 server-rendered
  pages excluded, `output: "standalone"` changed, the auth wrapper bypassed, and every
  network call mocked. The app redirects to login without a session, so no onboarding
  screen renders until all of that is done.

Option B reaches the same place with less machinery, because the onboarding page is
**store-driven**: it renders every step component at once and each one shows or hides
itself based on state. Seeding those stores puts any screen on screen directly, which is
also exactly what a step-jumping prototype needs.

### Two credentials found in swagat-frontend, worth rotating
1. **Sentry auth token** committed in `next.config.js` on `origin/release` (line 107,
   `sntrys_...`). In git history, not just the working tree.
2. **AWS access key id** in a presigned URL inside a comment in
   `store/useExporterMilestoneStore.ts` (line 27). Expired, and it is the key id rather
   than the secret, but it should not be published.

Both were stripped from this repo before the first commit. Seven `.env.*` files are also
tracked in that repo; none were copied here.

### Built
- Repo created, public, Pages serving `docs/` from `main`.
- 773 source files imported from `origin/release` by tracing the import graph from the
  onboarding components, plus the 75 images and 7 fonts they reference.
- Mock layer: fixtures for REST and GraphQL, no network access of any kind.
- Analytics and monitoring disabled outright.
- Controls: left rail, business-type bar, variant toggle, Back/Next, Reset, presenter
  mode (P), (i) panel per screen, URL hash routing with working browser back/forward.

### Screens working
1. Sign up, with the referral variant
2. Email code
3. Mobile number, with the WhatsApp opt-in
4. Terms and how you found us, all eight options
5. Business PAN, including the (i) that explains the fourth-letter rule
6. Business details also already renders, ahead of schedule, including the two
   ₹10 lakh income pills for freelancers

Typing a PAN sets the business type from its fourth letter, and the rail changes with it:
a C PAN adds the directors screen and makes the journey 13 steps instead of 12.

### Verified in the browser
Clicked through screens 1 to 6 on the built bundle, not just the dev server: sign up,
the email code with its resend timer, the mobile screen, terms with all eight traffic
options, the PAN screen with both (i) panels, and the freelancer business-details form.
The referral variant shows the referrer's reward line. Escape closes the panels.

The published site itself could not be opened in my browser pane, which blocks
jn-atishay.github.io by site permission. It was checked by fetching it instead: the page
and both assets return 200, and the bundle contains no credentials. Allow that domain in
the pane if you want me to click through the live URL directly.

### Not done yet
Screens 7 to 13. The Aadhaar and DigiLocker sequence, the mobile code popup, the
directors and partners screens, bank, documents, the checks screen and the first home
screen with the test payment are still placeholders.
