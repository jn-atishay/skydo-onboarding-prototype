import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { useBannerConfig } from "../../../hooks/useBannerConfig";
import useBannersStore from "../../../store/useBannersStore";
import useAnalytics from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";
import {
  NEW_IMPORTER_OFFER_HOME_POSITION,
  NEW_IMPORTER_OFFER_KEY,
  NEW_IMPORTER_OFFER_SURFACE,
  REFERRAL_BANNER_KEY,
} from "../../../constants/bannerConstants";
import FE_ROUTES from "../../../util/feRoutes";
import ImporterExpandedBody from "../ImporterExpandedBody";
import { offerBaseProps, offerDismissedProps, trackOfferViewed } from "../analytics";

const BG_OVERRIDE = "!bg-transparent !p-0 !h-auto !min-h-0 !overflow-hidden";

const HomeImporterBanner = () => {
  const router = useRouter();
  const offer = useBannersStore((s) => s.bannerData?.[NEW_IMPORTER_OFFER_KEY]);
  const bannerList = useBannersStore((s) => s.bannerList);
  const dismissBanner = useBannersStore((s) => s.dismissBanner);
  const analytics = useAnalytics();

  useBannerConfig({ backgroundConfig: offer ? { className: BG_OVERRIDE } : null });

  const bannerPosition = bannerList.includes(REFERRAL_BANNER_KEY)
    ? NEW_IMPORTER_OFFER_HOME_POSITION.BEHIND_REFERRAL
    : NEW_IMPORTER_OFFER_HOME_POSITION.FIRST;

  useEffect(() => {
    if (!offer) return;
    trackOfferViewed(analytics, offer, NEW_IMPORTER_OFFER_SURFACE.HOME, {
      banner_position: bannerPosition,
    });
  }, [offer?.isExpiringSoon, offer?.isNearCap]);

  if (!offer) return null;

  const onSkip = () => {
    analytics.trackAsync(
      Events.IMPORTER_OFFER_BANNER_DISMISSED,
      offerDismissedProps(offer, NEW_IMPORTER_OFFER_SURFACE.HOME, true)
    );
    void dismissBanner(NEW_IMPORTER_OFFER_KEY);
  };

  const onShare = () => {
    analytics.trackAsync(
      Events.SHARE_ACCOUNT_CTA_CLICKED,
      offerBaseProps(offer, NEW_IMPORTER_OFFER_SURFACE.HOME)
    );
    void router.push(FE_ROUTES.INTERNATIONAL_ACCOUNTS);
  };

  return <ImporterExpandedBody offer={offer} onShare={onShare} onSkip={onSkip} priority />;
};

export default HomeImporterBanner;
