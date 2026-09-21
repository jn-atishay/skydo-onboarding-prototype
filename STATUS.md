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
directors and partners screens, bank, documents, the checks screen and the focused home
screen with the test payment are still placeholders.

## Phase 2 — the sign-up page proper, Aadhaar and the mobile code

### Corrected from Phase 1
The sign-up screens were only rendering the login card, not the page around it. They
now use the product's own `DesktopLoginPage`, so both variants match the real thing:
the plain page has its background, big logo and footer, and the referral page has the
two-column layout with the inviter's name, the discount headline, the feature chips
and the partner strip.

### A bug that would have broken the published site
The product references images by absolute path, for example `/bg-image-login.png`,
because the real app is served from the root of a domain. This site lives under a
sub-path, so every one of those images 404'd. A small build plugin now rewrites such
a path, but only when the file actually exists in `public/`, so a genuine API path is
never touched. Vite already did this for stylesheets.

### Built
- Screens 7 and 8: the Aadhaar prompt, the DigiLocker sequence, the verified state and
  the mobile-code popup with its two-minute resend timer.
- DigiLocker belongs to the government and is not in the Skydo codebase, so those three
  screens are replicas built from the captures. They carry a visible notice saying so,
  their Aadhaar and PIN boxes hold fixed sample digits and are read-only, and they send
  nothing anywhere. They must never be mistakeable for the real service.
- The real "Verify Aadhaar via DigiLocker" button opens the replica instead of leaving
  the page, and a prototype-only Skip button jumps straight to verified.
- Arriving at the Confirm mobile step opens the code popup by itself.

### Verified in the browser
Clicked the whole path: sign-up (both variants), Aadhaar prompt, DigiLocker Aadhaar,
PIN and consent screens, Allow, the verified state with the masked Aadhaar and prefilled
name and number, then the mobile-code popup. Background images now return 200 under the
sub-path.

### Still to do
Screens 9 to 13: directors and partners, bank, documents, the checks screen and the
focused home screen with the test payment.

### Fix: sign-up screen content disappearing after load (reported 21 Sep)
Cause was mine. To make the login background visible I had raised the product's
background image from z-index -1 to 0. A positioned image at 0 paints above the page's
ordinary text, so the screen rendered, then the image finished loading and covered the
logo, headline and chips. The override was never needed: the wrapper's transform already
makes it the stacking context, so -1 sits above its background and below the content,
as in the real app. Removed, and checked with both variants after the background had
fully loaded that the text, chips, card and footer are on top.

I had seen this during Phase 2 and wrongly put it down to a frame caught mid-reload.

## Phase 3: screens 9 to 12, and a match against the captured screens (21 Sep 2026)

### What changed, and why
Checked every screen from Phase 1 and 2 against the captures in
`product-deep-dive-1/assets`. The main mismatch: from the mobile number to the checks
screen the product is **one page**, with the header (Get help, avatar), the progress
tracker ("45% complete") and a column of step cards where the current step is open and
the others are ticked or locked. The prototype had been mounting the single open card
on its own. It now mounts the product's real onboarding page and header, and the step on
show decides which card is open, exactly as the live app decides.

Other fixes found by the comparison:
- The mobile-number screen now uses the full sign-in layout (logo left, card right).
- The KYC intro shows the header and "0% complete" tracker above its two cards.
- Tailwind is pinned to 3.2.4, the version the product locks. 3.4 emitted classes in a
  different order, which turned the current step's dark icon white.
- The bank card shows the entered account, the green "Name matches" line and the
  Yes/No question (ob-15), instead of an empty form.
- The email-code screen is reached by filling the email and pressing Send OTP, as the
  customer does (ob-02 then ob-03).
- The mobile-code popup opens reliably on the Confirm mobile step (ob-14).
- The page scrolls inside the frame with the header and tracker pinned, and opens
  scrolled to the current card.

### Phase 3 screens
- Directors, partners and owners (company types only): directors pre-filled from company
  records for Pvt Ltd and LLP, partners with shares for Partnership, members for HUF.
- Bank account, per type. For Freelancer, Sole Prop, Partnership and HUF, "Submit and
  continue" opens the documents card; for Pvt Ltd and LLP it goes straight to the checks.
- Documents, with a Variant switch in the top bar: Answered Yes (bank statement, ob-16),
  Answered No (signed contract, ob-17), Other documents (ob-18). Picking a card on the
  page updates the switch and the URL. Pvt Ltd and LLP have no documents step, so it is
  not in their rail.
- Checks: the product's "We are verifying your details" screen. The other-documents path
  leads to the manual review state, which the product draws with the same screen.

### Verified in the browser
Clicked through at 1440x900: KYC intro, PAN, business details, Aadhaar prompt and the
DigiLocker replicas, the mobile-code popup (typed 4 digits, Continue moved on to bank),
bank (Yes, Submit moved on to documents with the bank statement), all three document
variants, the checks screen, the Pvt Ltd directors and bank screens, and the
Partnership and HUF owner screens. Both sign-up variants were rechecked.

### Not done, needs a decision
Using the live industry list (the real 24 option names, such as "Software, SaaS & IT
services", with their follow-up questions) and the live document menu. Both come from
the production database, and the check on this machine stopped me writing them into
this public repository. The dropdowns still show the earlier sample lists until that is
decided.

### Still to do
Phase 4: the focused home screen, the next-payment popup, the test payment and tracking.

### Fix: spacing on the referral sign-up screen (reported 21 Sep)
The product's pages are laid out for a full browser window: the referral sign-up page
splits the window in half and gives the invite column up to 650px. Beside the rail the
frame was only about 1,100px wide, so that column was pressed against the edge with no
margin. Product pages are now laid out at the width the captures were taken at
(1,512px) and scaled down to fit the frame, the way a Figma frame is shown, so every
margin and padding keeps its real proportion. Presenter mode (P) shows them larger.
Applies to the sign-up pages and the onboarding page; the DigiLocker replicas are
unchanged.

## Phase 4: the focused home screen, the test payment and tracking (21 Sep 2026)

### Built
- The home step mounts the product's own focused home inside its dashboard layout
  (header with calendar and bell, the left menu), exactly as a customer whose accounts
  were just created sees it. Seven stages, offered in the top bar and reached through
  the product's own buttons:
  Accounts created, Next payment question, Receive steps, Test payment (the start popup,
  then "Receive test payment" plays the USD 0.10 success), Choose method, Share account
  (with pricing), and Tracking (the product's payment page for the test payment).
- "Track" opens the tracking stage in place instead of a new tab.
- The test payment follows the backend's own constants: from Skydo Inc, reference
  Test-SRN-001, fee waived, INR expected the next day.
- The (i) panels were checked on every screen: 2 to 4 plain sentences each, figures with
  their period or "No data for this step yet", closes with X or Escape.
- Presenter mode (P) checked on the tracking page: rail and bars hidden, (i) stays.

### Fixed along the way
- The asset-path rewriter was also rewriting paths inside Tailwind class names such as
  bg-[url('/x.webp')], which broke the home banner's background. It now leaves url()
  alone.
- The product scrolls cards into view; the frame's outer boxes are now "clip" rather
  than "hidden", so only the page scrolls and the frame stays put.
- On steps without the business-type bar, the bottom bar collapsed; each band is now
  pinned to its grid row.

### Not included
The product's guided tour bubbles, the chat assistant and the feedback widget (all
third-party or tour scripts). Exchange rates are fixed samples.

### Verified in the browser
Clicked through at 1440x900: accounts created, the next-payment popup (picked "In the
next 30 days", Continue moved to the receive steps), "Try test payment", "Receive test
payment", "Proceed to next steps" (moved to Choose method), Continue (moved to Share
account), "Track" (opened Tracking), the (i) panel and Escape, and presenter mode.
Each stage was compared with its capture in product-deep-dive-1/assets.

### Still open
The live industry list and document menu, pending a decision (see Phase 3).

## Tap to fill (21 Sep 2026)
Every text field in the product screens now works by tapping: an empty field fills with a
sample that suits it, a filled field clears. Typing, pasting and dropping are switched
off. Samples: the example.com email, 9876543210, a PAN whose fourth letter matches the
business type in the top bar (P, C, H or F), the sample website, account number and IFSC,
"Priya" for the name, "ARJUN MEHTA" and a personal PAN on the owners list, and
4 8 2 1 9 3 for code boxes (the whole row fills from any box). Dropdowns (search or
select, nationality, country, currency), read-only and disabled fields are left alone so
they still open their list.

Verified: sign-up email (fill, clear, refill), the six-box email code (fill, clear,
refill), mobile number, PAN for Freelancer and Pvt Ltd, the website field with the two
dropdowns untouched, the four-box phone code, and the HUF members row.

## Sample customer renamed (21 Sep 2026)
The sample customer is now Atishay Jain everywhere: name, first-name greeting, the
account holder on the bank and USD account cards, the first director or partner, and
the email atishay@example.com. The sample PAN became ABCPJ1234K so its fifth letter
matches the surname, as a real PAN's does; the sample GST follows it. All numbers
remain invented.

## Fix: sample website shown as invalid (21 Sep 2026)
The website check imported the network helper by a same-folder path ("./beCall"), which
the fixture rule did not match, so that one call went to the real network code, failed
and marked the URL invalid. It was also the one request that could leave the page. The
rules for the network helper, sign-in, analytics and the PDF viewer now match on the
file name alone, so no import form can bypass them. Verified: the sample website now
gets the green tick, and a pass over sign-up, mobile, KYC intro, Aadhaar, documents,
home, share account and tracking made no request to any host but the prototype's own. The website field's favicon lookup (Google's favicon service) is skipped too; the product's globe icon shows instead.
The home page's customer-video embeds (YouTube) now point at a local placeholder that
says the video plays on the live site, since an embed loads from YouTube as soon as the
page opens. Plain links to videos are unchanged.

## Fix: rail and business-type buttons now change the page (21 Sep 2026)
Choosing Business details from the rail, or switching the business type while on it,
changed the address but left the old screen up until a hard refresh. Two causes: the
product's PAN card reads the customer's details only when it first opens, and it keeps
a "PAN verified" flag that it never turns off by itself. Moves made with the
prototype's own controls (rail, business type, variant buttons, Back/Next, browser back
and forward, Reset) now open the product page afresh, and the PAN flag follows the step.
Moves made with the product's own buttons still play as live, without a reload.
The sample PAN now matches the chosen type (C for Pvt Ltd, F for Partnership and LLP,
H for HUF, P for Freelancer and Sole Prop), and switching type drops a PAN entered for
the old one.

Verified: PAN to Business details by the rail; Pvt Ltd, HUF, Partnership and Freelancer
switched on Business details, each showing its own form and PAN; Back to the empty PAN
box; Next and browser back; Verify PAN still moving on to Business details by itself.

## Wording: "focused home" (21 Sep 2026)
The home step is now called "Focused home and test payment" in the rail, and "The focused
home screen" in its (i) popup, matching the product's own name for it. Notes and code
comments use the same name.

## Copy: Sign up popup (21 Sep 2026)
Removed the two points about accounts only being created by the customer and about
"invites" being marketing emails. The Sign up popup now opens on the email address point.

## Popup numbers: August 2026 funnel (21 Sep 2026)
Every (i) popup now shows the same five figures for its screen, for August 2026: people
who landed on it, moved ahead, dropped off, and the forward and drop-off rates, followed
by one or two broad reasons people drop off. The older mixed figures are gone.

How they were counted: everyone who signed up between 1 and 31 August 2026, followed
through the steps to 21 September, rounded to the nearest 10. Sign up and email code
cover the skydo.com sign-up form only (website analytics, about four in five new
accounts). The mobile number screen is an estimate combining analytics and the
database. Every later screen is from the production database. Directors and partners
count company types only; documents count Freelancer, Sole Proprietor and HUF only.
Checks will still rise a little, as 430 August sign-ups were still in manual review.
"Moved ahead" on the focused home screen means receiving a payment, test or real.

Verified: all 12 Freelancer screens and the Pvt Ltd directors screen show their figures;
the tiles wrap two to a row at phone width.

## Keyboard: arrows and space (21 Sep 2026)
Right arrow is Next, left arrow is Back, and space is Reset, so a presenter can drive the
demo without the mouse, including in presenter mode where the buttons are hidden. The
keys do nothing while an (i) popup is open or a field has focus. Space no longer also
presses whichever button was clicked last.
Verified: arrows moved PAN → Business details → Terms; arrows ignored with a popup open;
space from Documents (with Next focused) returned to Sign up without also pressing Next.
