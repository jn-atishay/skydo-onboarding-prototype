# Skydo onboarding prototype

An interactive walkthrough of the Skydo onboarding journey, from sign up to the first
payment, for sales and support staff. Click through it to learn what a customer sees at
each step, what usually goes wrong, and why each screen exists.

**Published at** https://jn-atishay.github.io/skydo-onboarding-prototype/

> This is a training tool, not the product. Nothing here connects to Skydo. There is no
> login, no backend and no real data. The sample customer is named Atishay Jain; every
> PAN, bank account, account number and document on screen is invented.

## How to use it

| Control | What it does |
|---|---|
| Left rail | Every screen in journey order. Click any step to jump to it. |
| Business type bar | Freelancer, Sole Proprietor, Private Limited, LLP, Partnership, HUF. The screen re-renders for that type and the choice sticks as you move. |
| (i) top right | Why this screen exists, and what the numbers say for that step. Closes with X or Escape. |
| (i) beside a field | Extra explanation for that field, such as what the fourth letter of a PAN decides. |
| Back / Next | Move through the journey. Browser back and forward work too. |
| Reset | Clears everything and returns to the start. |
| Tap a text field | Fills it with a sample value that suits the field. Tap again to clear it. Typing is switched off, so no real details can be entered. Dropdowns still open their list. |
| P | Presenter mode: hides the rail and bars so only the product shows. The (i) buttons stay. |

The home step has its own variants in the top bar: Accounts created, Next payment
question, Receive steps, Test payment, Choose method, Share account and Tracking. The
product's own buttons also move between them, just as a customer would.

The URL carries the step, business type and variant, so any screen can be linked to
directly: `#/business-details/FREELANCER`, or `#/documents/FREELANCER/no` for the
documents screen after answering No on the bank card.

## Where the screens come from

Product pages are laid out at a real desktop window width (1,512px, the width of the
reference captures) and scaled to fit the frame, like a Figma frame, so margins and
padding keep their true proportions. Press P for a larger view.

The screens are the **real product components**, imported from the Skydo frontend
(`swagat-frontend`, `origin/release`, 17 September 2026) and rendered against sample
data. They are not hand-drawn copies, so the layout, copy and behaviour are the real
ones. `src/skydo/` holds that imported code, unmodified apart from the notes below.

The explanations and figures in the (i) panels come from the research file behind the
product deep-dive session, and every figure names its period.

## How it runs without a backend

The product expects a server. This prototype replaces that layer rather than the screens:

- `src/mocks/` answers every network call from fixtures. Nothing leaves the page.
- `src/shims/` stands in for the Next.js runtime, which this app does not use.
- **Analytics and monitoring are disabled outright.** Mixpanel, WebEngage, Segment,
  Sentry, Google Tag Manager and Usersnap are all replaced by no-ops.
- There is no authentication. Any email is accepted and any code works.
- No field takes typing. A tap fills a sample (an example.com email, a sample PAN whose
  fourth letter matches the chosen business type, sample bank details, 4 8 2 1 9 3 for
  codes); a second tap clears it.

## Fidelity, and where it stops

Everything on screen is the real component except:

- The DigiLocker screens, which belong to the government and cannot be imported. They are
  static replicas, labelled as such in the prototype.
- Uploading a document attaches a sample file rather than sending anything.
- The product's guided tour (the speech bubbles that point at parts of the tracking
  page) is not included.
- The home page's chat assistant and the feedback widget load third-party scripts, so
  they are switched off. "No, I have more questions" therefore opens nothing.
- Exchange rates in the savings calculator are fixed sample rates, not live ones.
- The industry dropdown and the "choose from other documents" lists show sample
  options, not the live lists, which are kept out of this public repository.

## Running it locally

```bash
npm install
npm run dev
```

`npm run build` writes the published site into `docs/`, which is what GitHub Pages serves.

## Repository layout

```
src/prototype/   the training wrapper: rail, business-type bar, (i) panels, routing
src/mocks/       fixtures that stand in for the backend
src/shims/       stand-ins for Next.js, analytics and server-only packages
src/skydo/       the product's own components, imported
styles/          the product's global stylesheet
docs/            the built site that GitHub Pages serves
```
