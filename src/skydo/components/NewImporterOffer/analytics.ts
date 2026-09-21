import { NewImporterOfferData } from "../../types/BannerTypes";
import { NEW_IMPORTER_OFFER_BANNER_STATE } from "../../constants/bannerConstants";
import { daysUntil } from "../../util/dateHelper";
import { Events } from "../../analytics/EventConstants";
import { Analytics } from "../../analytics/useAnalytics";

// The two backend booleans → one banner_state value (both-true is its own state).
export const getOfferBannerState = ({ isExpiringSoon, isNearCap }: NewImporterOfferData) => {
  if (isNearCap && isExpiringSoon) return NEW_IMPORTER_OFFER_BANNER_STATE.NEAR_CAP_ENDING_SOON;
  if (isNearCap) return NEW_IMPORTER_OFFER_BANNER_STATE.NEAR_CAP;
  if (isExpiringSoon) return NEW_IMPORTER_OFFER_BANNER_STATE.ENDING_SOON;
  return NEW_IMPORTER_OFFER_BANNER_STATE.DEFAULT;
};

// Shared by every offer event so both surfaces send the same shape.
export const offerBaseProps = (offer: NewImporterOfferData, surface: string) => ({
  surface,
  banner_state: getOfferBannerState(offer),
});

export const offerViewedProps = (
  offer: NewImporterOfferData,
  surface: string,
  surfaceProps: { is_expanded?: boolean; banner_position?: number }
) => ({
  ...offerBaseProps(offer, surface),
  days_remaining: daysUntil(offer.expiryDate),
  new_clients_added: offer.redeemCount ?? 0,
  ...surfaceProps,
});

const loggedViewKeys = new Set<string>();

export const trackOfferViewed = (
  analytics: Analytics,
  offer: NewImporterOfferData,
  surface: string,
  surfaceProps: { is_expanded?: boolean; banner_position?: number }
) => {
  const key = `${surface}:${getOfferBannerState(offer)}`;
  if (loggedViewKeys.has(key)) return;
  loggedViewKeys.add(key);
  analytics.trackAsync(
    Events.IMPORTER_OFFER_BANNER_VIEWED,
    offerViewedProps(offer, surface, surfaceProps)
  );
};

export const offerDismissedProps = (
  offer: NewImporterOfferData,
  surface: string,
  wasExpanded: boolean
) => ({
  ...offerBaseProps(offer, surface),
  was_expanded: wasExpanded,
  days_remaining: daysUntil(offer.expiryDate),
});
