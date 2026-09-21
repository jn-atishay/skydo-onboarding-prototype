# Skydo onboarding prototype

An interactive walkthrough of the Skydo onboarding journey, from sign up to the first
payment, for sales and support staff. Click through it to learn what a customer sees at
each step, what usually goes wrong, and why each screen exists.

**Published at** https://jn-atishay.github.io/skydo-onboarding-prototype/

> This is a training tool, not the product. Nothing here connects to Skydo. There is no
> login, no backend and no real data: every name, number, PAN and bank account on screen
> is invented sample data for a fictional customer.

## How to use it

| Control | What it does |
|---|---|
| Left rail | Every screen in journey order. Click any step to jump to it. |
| Business type bar | Freelancer, Sole Proprietor, Private Limited, LLP, Partnership, HUF. The screen re-renders for that type and the choice sticks as you move. |
| (i) top right | Why this screen exists, and what the numbers say for that step. Closes with X or Escape. |
| (i) beside a field | Extra explanation for that field, such as what the fourth letter of a PAN decides. |
| Back / Next | Move through the journey. Browser back and forward work too. |
| Reset | Clears everything and returns to the start. |
| P | Presenter mode: hides the rail and bars so only the product shows. The (i) buttons stay. |

The URL carries the step, business type and variant, so any screen can be linked to
directly: `#/business-details/FREELANCER`, or `#/documents/FREELANCER/no` for the
documents screen after answering No on the bank card.

## Where the screens come from

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

## Fidelity, and where it stops

Everything on screen is the real component except:

- The DigiLocker screens, which belong to the government and cannot be imported. They are
  static replicas, labelled as such in the prototype.
- Uploading a document attaches a sample file rather than sending anything.
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
