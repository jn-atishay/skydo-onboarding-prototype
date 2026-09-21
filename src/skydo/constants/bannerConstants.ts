// Fixed copy ("upto 10 clients"). The real cap and eligibility are the
// backend's job — it drops the banner once the cap is hit.
export const NEW_IMPORTER_OFFER_CLIENT_CAP = 10;

export const NEW_IMPORTER_OFFER_KEY = "NEW_IMPORTER_OFFER" as const;

// Referral outranks the offer in the carousel. Literal type so it matches
// against bannerList (BANNERS[]).
export const REFERRAL_BANNER_KEY = "REFERRAL" as const;

// Regional-currency discovery strip on the invoices page. Dismissal (and the
// backend's hide/return schedule) is driven by the shared banner list.
export const REGIONAL_CURRENCY_BANNER_KEY = "REGIONAL_CURRENCY" as const;

// analytics banner_position for the home offer: slot 2 behind referral when
// it's present, slot 1 otherwise. No other banner precedes it.
export const NEW_IMPORTER_OFFER_HOME_POSITION = {
  BEHIND_REFERRAL: 2,
  FIRST: 1,
} as const;

export const NEW_IMPORTER_OFFER_SURFACE = {
  HOME: "home",
  INVOICE: "invoices",
} as const;

export const NEW_IMPORTER_OFFER_BANNER_STATE = {
  DEFAULT: "default",
  ENDING_SOON: "ending_soon",
  NEAR_CAP: "near_cap",
  NEAR_CAP_ENDING_SOON: "near_cap_ending_soon",
} as const;

export const NEW_IMPORTER_OFFER_COLLAPSE_TRIGGER = "see_less_clicked";

export const NEW_IMPORTER_OFFER_COUPON_SRC = "/banners/new-importer-offer/coupon.json";

export const NEW_IMPORTER_OFFER_BODY_SRC = "/banners/new-importer-offer/body.webp";
