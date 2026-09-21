import React, { useEffect, useState } from "react";
import SimpleImageBanner from "../Banners/SimpleImageBanner";
import useZohoSyncStore from "../../store/useZohoSyncStore";
import Locale from "../../util/locale/en";
import { SKIP_ZOHO_SYNC_OPTIONS } from "../../types/ZohoSync";
import SkipZohoSyncPopUp from "./SkipZohoSyncPopUp";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

const ZOHO_BANNER_IMAGE = "/homepage-banners/zoho.webp";

const ZohoSyncBanner = () => {
  const { getSkipZohoSyncApi, openZohoSyncPopup, setSkipZohoSyncApi, skipZohoSync } = useZohoSyncStore();
  const [showSkipZohoPopUp, setShowSkipZohoPopUp] = useState(false);
  const [skipReasonIndex, setSkipReasonIndex] = useState(-1);
  const [otherReason, setOtherReason] = useState("");
  const analytics = useAnalytics();

  useEffect(() => {
    getSkipZohoSyncApi();
  }, []);

  const skipConfirmClick = async () => {
    const reason =
      skipReasonIndex == 2
        ? otherReason
        : skipReasonIndex == 1
        ? `${SKIP_ZOHO_SYNC_OPTIONS[skipReasonIndex]} - ${otherReason}`
        : SKIP_ZOHO_SYNC_OPTIONS[skipReasonIndex];
    await setSkipZohoSyncApi(reason);
    setShowSkipZohoPopUp(false);
    analytics?.trackAsync(Events.ZOHO.SKIP_POP_UP_CONFIRM, { option: reason, source: "dashboard_banner" });
  };

  const closeSkipClick = () => {
    setSkipReasonIndex(-1);
    setShowSkipZohoPopUp(false);
    setOtherReason("");
    analytics?.trackAsync(Events.ZOHO.SKIP_POP_UP_CANCEL, { source: "dashboard_banner" });
  };

  if (skipZohoSync) {
    return <div className="h-full flex-1" />;
  }

  const onCtaClick = () => {
    analytics?.trackAsync(Events.ZOHO.CONNECT_CLICKED, { source: "dashboard_banner" });
    openZohoSyncPopup();
  };

  const onSkip = () => {
    analytics?.trackAsync(Events.ZOHO.SKIP_POP_UP_OPEN, { source: "dashboard_banner" });
    setShowSkipZohoPopUp(true);
  };

  return (
    <>
      <SimpleImageBanner
        imageSrc={ZOHO_BANNER_IMAGE}
        ctaText={Locale.zohoSync.connectSecurely}
        onCtaClick={onCtaClick}
        onSkip={onSkip}
      />
      <SkipZohoSyncPopUp
        showPopUp={showSkipZohoPopUp}
        closePopUp={closeSkipClick}
        skipReasonIndex={skipReasonIndex}
        setSkipReasonIndex={setSkipReasonIndex}
        otherReason={otherReason}
        setOtherReason={setOtherReason}
        skipConfirmClick={skipConfirmClick}
      />
    </>
  );
};

export default ZohoSyncBanner;
