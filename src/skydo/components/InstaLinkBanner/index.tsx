import React, { useEffect } from "react";
import { useRouter } from "next/router";
import SimpleImageBanner from "../Banners/SimpleImageBanner";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import useToastMessages from "../../store/toastMessages";
import useBannersStore from "../../store/useBannersStore";
import { TOAST_TYPES } from "../../constants/atomicConstants";
import FE_ROUTES from "../../util/feRoutes";
import Locale from "../../util/locale/en";

const INSTA_LINK_BANNER_IMAGE = "/homepage-banners/insta-link.webp";

const InstaLinkBanner = () => {
  const router = useRouter();
  const analytics = useAnalytics();
  const { fetchBanners } = useBannersStore();
  const { addToast } = useToastMessages();

  useEffect(() => {
    analytics?.trackAsync(Events.INSTA_LINK.BANNER_VISIBLE);
  }, []);

  const onSkipClick = async () => {
    try {
      const res = await beCall({
        path: BE_ROUTES.SKIP_INSTA_LINK_BANNER,
        method: ALLOWED_METHODS.POST,
      });
      if (!res.success) {
        addToast({
          type: TOAST_TYPES.ERROR,
          body: Locale.wentWrongMessage,
          id: "SET_SKIP_INSTA_LINK_ERROR",
        });
        return;
      }
      analytics?.trackAsync(Events.INSTA_LINK.SKIP_CLICK);
      fetchBanners();
    } catch (e) {
      addToast({
        type: TOAST_TYPES.ERROR,
        body: Locale.wentWrongMessage,
        id: "SET_SKIP_INSTA_LINK_ERROR",
      });
    }
  };

  const onKnowMoreClick = () => {
    analytics?.trackAsync(Events.INSTA_LINK.KNOW_MORE_CLICK);
    router.push(FE_ROUTES.PAYMENT_LINKS);
  };

  return (
    <SimpleImageBanner
      imageSrc={INSTA_LINK_BANNER_IMAGE}
      ctaText={Locale.knowMore}
      onCtaClick={onKnowMoreClick}
      onSkip={onSkipClick}
    />
  );
};

export default InstaLinkBanner;
