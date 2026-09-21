// The text behind every (i) button.
// "why" is plain language for sales and support: no internal state names, no event names.
// "funnel" is August 2026 from production. Sign up and email code come from website
// analytics (the skydo.com sign-up form); the mobile number screen combines analytics
// and the database; every later screen comes from the database, following everyone who
// signed up in August through the steps.

/**
 * August 2026 on this screen. "Landed" and "moved ahead" count people, from production
 * data for everyone who signed up between 1 and 31 August 2026, followed to 21 September.
 * Drop-off and percentages are worked out from the two counts.
 */
export interface Funnel {
  landed: number;
  moved: number;
  /** What counts as moving ahead from this screen, in plain words. */
  movedMeans: string;
  /** Who is counted, when it is not everyone who reached the screen. */
  scope?: string;
  /** One or two broad reasons people stop here. */
  reasons: string[];  /** Leave out the small note under the numbers. */
  hideNote?: boolean;
}

export interface ScreenInfo {
  title: string;
  why: string[];
  funnel: Funnel;
}

export const PERIOD =
  "People who signed up in August 2026, followed to 21 September.";

export const SCREEN_INFO: Record<string, ScreenInfo> = {
  login: {
    title: "Sign up",
    why: [
      "The email address is the account's main identity, so an email already attached to another user is refused.",
      "A referral or partner link changes this screen: the customer sees who invited them and the reward waiting for them.",
    ],
    funnel: {
      hideNote: true,
      landed: 17147,
      moved: 12008,
      movedMeans: "asked for an email code",
      scope: "People who filled the sign-up form on skydo.com, where about four in five new accounts start.",
      reasons: [
        "They have just given a phone number and are now asked for an email and a code: a second \"who are you\" step they did not expect.",
        "Most are on a phone, often inside the Instagram or Facebook browser, and many were only browsing after an ad.",
      ],
    },
  },
  "email-otp": {
    title: "Email code",
    why: [
      "The six-digit code proves the person owns the email address they typed.",
      "It is the only check at this stage. There is no phone code yet.",
      "The customer can fix a typo without starting again, using the edit link on this screen.",
    ],
    funnel: {
      landed: 12008,
      moved: 9633,
      movedMeans: "entered the code and got into Skydo",
      scope: "People who asked for a code on skydo.com, logged in within a day.",
      reasons: [
        "Getting the code means leaving the page for an inbox, and on a phone that is where people get distracted or the mail lands late.",
        "Some never meant to open an account yet and stop once it asks for effort.",
      ],
    },
  },
  mobile: {
    title: "Mobile number",
    why: [
      "The number is collected and saved, but nothing is sent to the phone at this point.",
      "The phone code people expect comes later, at the identity step, after Aadhaar.",
      "The WhatsApp box is ticked by default, and it is how the customer later hears that a payment has settled.",
      "Two accounts are allowed to share one phone number, so this is not an identity check.",
    ],
    funnel: {
      hideNote: true,
      landed: 2800,
      moved: 2300,
      movedMeans: "saved a mobile number",
      scope: "Only people who signed up on the Skydo login page itself see this screen; website sign-ups gave their number already.",
      reasons: [
        "It is another question straight after signing in, with nothing yet to show for it.",
      ],
    },
  },
  "kyc-intro": {
    title: "Terms and how you found us",
    why: [
      "Agreeing to the terms is recorded with a timestamp, and later steps refuse to continue without it.",
      "The shield note explains the honest reason for everything that follows: the rules set by RBI and our banking partners.",
      "The question about how they found us has eight answers and is entirely optional, so the button works with nothing selected.",
      "It is skipped when we already know the referrer or the marketing source that brought them in.",
    ],
    funnel: {
      hideNote: true,
      landed: 13900,
      moved: 12026,
      movedMeans: "agreed to the terms and started",
      reasons: [
        "The first mention of KYC and a list of documents they may not have to hand, before they see how small the first step is.",
        "Some signed up to look around and are not ready to commit.",
      ],
    },
  },
  pan: {
    title: "Business PAN",
    why: [
      "The fourth letter of the PAN tells us what kind of business this is, before anything else happens.",
      "It also pre-fills the legal name, address and registration number, and it is the key the duplicate and blocklist checks run on.",
      "An unsupported PAN is not a dead end: the customer sees a Change PAN button and can carry on.",
      "Changing the PAN later wipes the business details already entered, and the customer is warned first.",
    ],
    funnel: {
      hideNote: true,
      landed: 12026,
      moved: 9160,
      movedMeans: "entered a business PAN",
      reasons: [
        "The PAN is not to hand, or the business is not one Skydo can serve.",
        "This is the first step that makes the account real, so people who were only exploring stop here.",
      ],
    },
  },
  "business-details": {
    title: "Business details",
    why: [
      "This form is the evidence an analyst uses to believe the business is real.",
      "The industry sets how closely the case is looked at, and the link is proof the business exists somewhere online.",
      "Freelancers without a GST are asked their monthly income, and only the lower option passes automatically.",
      "A missing website does not block sign-up, but it does stop the first payment clearing later.",
    ],
    funnel: {
      hideNote: true,
      landed: 9160,
      moved: 6074,
      movedMeans: "submitted the business details",
      reasons: [
        "It is the longest form, and it asks for proof the business is real (a website, the industry, income) that many small freelancers do not have.",
        "The effort feels high while there is still nothing in return.",
      ],
    },
  },
  aadhaar: {
    title: "Aadhaar through DigiLocker",
    why: [
      "Aadhaar is verified through DigiLocker and only through DigiLocker, so the customer leaves Skydo and comes back.",
      "Any code on those screens is handled by DigiLocker, not by us, and we only ever store a masked Aadhaar number.",
      "The name on the Aadhaar must match the name on the PAN, which is one of the most common places a real customer gets stuck.",
      "If DigiLocker is down there is no fallback: the customer has to try again later.",
    ],
    funnel: {
      hideNote: true,
      landed: 6074,
      moved: 5288,
      movedMeans: "verified Aadhaar through DigiLocker",
      reasons: [
        "They have to leave Skydo for a government site and come back; any hiccup there, a code or an outage, ends the attempt.",
        "Sharing a personal identity document is a big ask for some.",
      ],
    },
  },
  "mobile-otp": {
    title: "Confirm the mobile number",
    why: [
      "This is the phone code customers expect at sign-up. It lives here instead, after Aadhaar has passed.",
      "The number confirmed here is the one their international accounts are linked to.",
      "Freelancers and sole proprietors go straight to the bank step after this.",
    ],
    funnel: {
      hideNote: true,
      landed: 5288,
      moved: 5274,
      movedMeans: "confirmed the phone code",
      reasons: [
        "Almost nobody leaves here. By now people are committed, and a phone code is familiar.",
      ],
    },
  },
  management: {
    title: "The people who run the business",
    why: [
      "Directors and partners are pulled from the company registry automatically, so the customer cannot add a name that is not on it.",
      "For the owners they type in, each PAN is checked against the name given.",
      "Companies must also produce a second owner or director whose PAN name matches, which is one of the harder walls for a small company.",
      "Partnerships must add up to exactly 100 percent across at least two partners.",
    ],
    funnel: {
      landed: 971,
      moved: 945,
      movedMeans: "added the directors or partners",
      scope: "Private Limited, LLP, Partnership and HUF only.",
      reasons: [
        "They need details of other owners or directors that they may not have to hand.",
      ],
    },
  },
  bank: {
    title: "Bank account",
    why: [
      "We confirm the account is real, and whose name is on it, by sending a tiny test credit.",
      "The name on the account must match the name on the PAN. For most customers a mismatch is a hard stop, not a review.",
      "A freelancer without a GST is the exception: they can change their registered business name to match and try again.",
      "The question about past international payments decides which document we recommend next.",
    ],
    funnel: {
      hideNote: true,
      landed: 5248,
      moved: 5106,
      movedMeans: "added a bank account",
      reasons: [
        "The name on the bank account has to match the PAN, and for most a mismatch cannot be fixed on the spot.",
      ],
    },
  },
  documents: {
    title: "Documents",
    why: [
      "Seven documents are offered to a freelancer and none of them is compulsory on its own.",
      "The recommended path needs only one document: a bank statement if they have been paid from abroad, otherwise a signed contract.",
      "A bank statement on that path is read automatically, so those customers can be live in minutes.",
      "Anything under Choose from other documents is read by a person, so the customer waits before they can be paid.",
    ],
    funnel: {
      hideNote: true,
      landed: 4192,
      moved: 3076,
      movedMeans: "shared a document and submitted",
      scope: "Freelancer, Sole Proprietor and HUF only; the other types skip this step.",
      reasons: [
        "They have nothing yet that proves foreign clients: no contract and no payment from abroad.",
        "New freelancers often sign up before their first overseas client.",
      ],
    },
  },
  verification: {
    title: "Checks, then accounts ready",
    why: [
      "If nothing blocking is open, the international accounts are created automatically with no person involved.",
      "If anything blocking is open, a compliance analyst picks the case up instead.",
      "The on-screen promise of an update within a day is display text only: there is no timer, reminder or escalation behind it.",
      "Accounts ready is the end of the line. A live customer never moves past it, and the first payment does not change their status.",
    ],
    funnel: {
      landed: 3958,
      moved: 3395,
      movedMeans: "had their accounts created",
      scope: "Of those who did not: 430 are still waiting in manual review, and 134 were closed (business not supported, or no foreign clients).",
      reasons: [
        "A person has to review the case and asks for more information, which slows or stops it.",
        "Some businesses turn out not to be eligible.",
      ],
    },
  },
  home: {
    title: "The focused home screen",
    why: [
      "Brand new customers get a guided home instead of the usual dashboard, and it changes as soon as they have an invoice.",
      "The free test payment sits first on the checklist so they can watch a payment work before a real client sends one.",
      "There are three ways to get paid, and sharing account details needs nothing except finished onboarding.",
      "Customers still in review can look around and even run a test payment, but their account numbers stay hidden until the review clears.",
    ],
    funnel: {
      landed: 3395,
      moved: 2059,
      movedMeans: "received a payment, the test payment or a real one",
      reasons: [
        "No client payment is due yet, so there is nothing to do today.",
        "The test payment is optional and easy to skip.",
      ],
    },
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
