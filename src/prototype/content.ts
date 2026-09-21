// The text behind every (i) button.
// "why" is plain language for sales and support: no internal state names, no event names.
// "numbers" must be traceable to the research file (_work/research/flow-facts.md in the
// product-deep-dive-1 folder) or say plainly that there is no figure for that step.
// Period for every production figure: the 90 days to 20 September 2026.

export interface ScreenInfo {
  title: string;
  why: string[];
  numbers: string[] | null; // null renders "No data for this step yet"
  numbersNote?: string;
}

export const PERIOD = "Production, 90 days to 20 September 2026.";

export const SCREEN_INFO: Record<string, ScreenInfo> = {
  login: {
    title: "Sign up",
    why: [
      "This is the only way a Skydo account is ever created: the customer makes it themselves.",
      "Nobody at Skydo can create an account and send an invite. When sales say they sent an invite, they mean a marketing email carrying a sign-in link into an account that already exists.",
      "The email address is the account's main identity, so an email already attached to another user is refused.",
      "A referral or partner link changes this screen: the customer sees who invited them and the reward waiting for them.",
    ],
    numbers: [
      "40,542 sign-ups in the period across all business types.",
      "15,469 of those never got past the PAN screen, so we never learn their business type.",
    ],
    numbersNote: "Sum of the business-type table; recent sign-ups may still be in flight.",
  },
  "email-otp": {
    title: "Email code",
    why: [
      "The six-digit code proves the person owns the email address they typed.",
      "It is the only check at this stage. There is no phone code yet.",
      "The customer can fix a typo without starting again, using the edit link on this screen.",
    ],
    numbers: null,
  },
  mobile: {
    title: "Mobile number",
    why: [
      "The number is collected and saved, but nothing is sent to the phone at this point.",
      "The phone code people expect comes later, at the identity step, after Aadhaar.",
      "The WhatsApp box is ticked by default, and it is how the customer later hears that a payment has settled.",
      "Two accounts are allowed to share one phone number, so this is not an identity check.",
    ],
    numbers: null,
  },
  "kyc-intro": {
    title: "Terms and how you found us",
    why: [
      "Agreeing to the terms is recorded with a timestamp, and later steps refuse to continue without it.",
      "The shield note explains the honest reason for everything that follows: the rules set by RBI and our banking partners.",
      "The question about how they found us has eight answers and is entirely optional, so the button works with nothing selected.",
      "It is skipped when we already know the referrer or the marketing source that brought them in.",
    ],
    numbers: null,
  },
  pan: {
    title: "Business PAN",
    why: [
      "The fourth letter of the PAN tells us what kind of business this is, before anything else happens.",
      "It also pre-fills the legal name, address and registration number, and it is the key the duplicate and blocklist checks run on.",
      "An unsupported PAN is not a dead end: the customer sees a Change PAN button and can carry on.",
      "Changing the PAN later wipes the business details already entered, and the customer is warned first.",
    ],
    numbers: [
      "15,469 sign-ups in the period stopped here without a usable PAN.",
      "That is the single largest loss anywhere in the journey.",
      "23 cases needed a manual PAN review because the government source could not be reached.",
    ],
  },
  "business-details": {
    title: "Business details",
    why: [
      "This form is the evidence an analyst uses to believe the business is real.",
      "The industry sets how closely the case is looked at, and the link is proof the business exists somewhere online.",
      "Freelancers without a GST are asked their monthly income, and only the lower option passes automatically.",
      "A missing website does not block sign-up, but it does stop the first payment clearing later.",
    ],
    numbers: [
      "About 53 of every 100 sign-ups finish this step.",
      "12,444 cases were sent for an industry check, the most common reason for a manual review.",
      "5,002 freelancers were sent for review for declaring the higher income option.",
      "The catalogue holds 24 industries: four high risk, eight medium, eleven low, plus Others.",
    ],
  },
  aadhaar: {
    title: "Aadhaar through DigiLocker",
    why: [
      "Aadhaar is verified through DigiLocker and only through DigiLocker, so the customer leaves Skydo and comes back.",
      "Any code on those screens is handled by DigiLocker, not by us, and we only ever store a masked Aadhaar number.",
      "The name on the Aadhaar must match the name on the PAN, which is one of the most common places a real customer gets stuck.",
      "If DigiLocker is down there is no fallback: the customer has to try again later.",
    ],
    numbers: null,
  },
  "mobile-otp": {
    title: "Confirm the mobile number",
    why: [
      "This is the phone code customers expect at sign-up. It lives here instead, after Aadhaar has passed.",
      "The number confirmed here is the one their international accounts are linked to.",
      "Freelancers and sole proprietors go straight to the bank step after this.",
    ],
    numbers: null,
  },
  management: {
    title: "The people who run the business",
    why: [
      "Directors and partners are pulled from the company registry automatically, so the customer cannot add a name that is not on it.",
      "For the owners they type in, each PAN is checked against the name given.",
      "Companies must also produce a second owner or director whose PAN name matches, which is one of the harder walls for a small company.",
      "Partnerships must add up to exactly 100 percent across at least two partners.",
      "Freelancers and sole proprietors never see this step.",
    ],
    numbers: [
      "527 partnerships were sent for review over how long the firm had existed.",
      "527 cases were sent for review over how much of the business the main owner holds.",
    ],
  },
  bank: {
    title: "Bank account",
    why: [
      "We confirm the account is real, and whose name is on it, by sending a tiny test credit.",
      "The name on the account must match the name on the PAN. For most customers a mismatch is a hard stop, not a review.",
      "A freelancer without a GST is the exception: they can change their registered business name to match and try again.",
      "The question about past international payments decides which document we recommend next.",
    ],
    numbers: null,
  },
  documents: {
    title: "Documents",
    why: [
      "Seven documents are offered to a freelancer and none of them is compulsory on its own.",
      "The recommended path needs only one document: a bank statement if they have been paid from abroad, otherwise a signed contract.",
      "A bank statement on that path is read automatically, so those customers can be live in minutes.",
      "Anything under Choose from other documents is read by a person, so the customer waits before they can be paid.",
    ],
    numbers: [
      "What freelancers actually upload: contract 3,167, bank statement 1,912, platform screenshot 1,117.",
      "Then invoice 663, tax return 209, Udyam 185, certificate of practice 122.",
      "7,439 cases were sent for review for a missing government registration.",
    ],
  },
  verification: {
    title: "Checks, then accounts ready",
    why: [
      "If nothing blocking is open, the international accounts are created automatically with no person involved.",
      "If anything blocking is open, a compliance analyst picks the case up instead.",
      "The on-screen promise of an update within a day is display text only: there is no timer, reminder or escalation behind it.",
      "Accounts ready is the end of the line. A live customer never moves past it, and the first payment does not change their status.",
    ],
    numbers: [
      "Freelancers reach accounts ready 22% of the time, sole proprietors 61%, companies 73%.",
      "LLPs 77%, partnerships 66%, Hindu Undivided Families 54%.",
      "About 54,865 accounts sit at accounts ready in total.",
    ],
  },
  home: {
    title: "The first home screen",
    why: [
      "Brand new customers get a guided home instead of the usual dashboard, and it changes as soon as they have an invoice.",
      "The free test payment sits first on the checklist so they can watch a payment work before a real client sends one.",
      "There are three ways to get paid, and sharing account details needs nothing except finished onboarding.",
      "Customers still in review can look around and even run a test payment, but their account numbers stay hidden until the review clears.",
    ],
    numbers: [
      "The test payment shows as USD 0.10 on screen and Skydo covers it.",
      "It disappears as soon as any invoice exists, which usually comes first.",
    ],
  },
};

/** Extra explanation for the PAN fourth-letter rule, opened from the field itself. */
export const PAN_RULE = {
  title: "How the PAN decides the business type",
  intro:
    "Every Indian PAN has a fourth letter that says what kind of entity it belongs to. We read it before anything else, and it sets the whole path from here on.",
  rows: [
    { letter: "P", meaning: "A person", detail: "Becomes a Freelancer, or a Sole Proprietor if an active GST exists against the PAN. We never ask the customer which they are." },
    { letter: "C", meaning: "A company", detail: "A Private Limited company. The business PAN is used, not a personal one." },
    { letter: "H", meaning: "Hindu Undivided Family", detail: "Treated as its own business type." },
    { letter: "F", meaning: "A firm", detail: "The one case the PAN cannot settle, so we ask: Partnership or LLP." },
    { letter: "Others", meaning: "Not supported", detail: "A, B, G, J, L and T are valid PANs for trusts, societies and similar. The customer sees a Change PAN button and is not blocked for good." },
  ],
  footer:
    "Sole proprietors and freelancers enter their personal PAN. Companies, LLPs and partnerships enter the business PAN.",
};
