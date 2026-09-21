import React, { FC, useEffect, useState } from "react";
import ZohoSyncBanner from "../ZohoSyncBanner";
import classNames from "classnames";
import HomepageBanner from "../ReferralCampaigns/surfaces/HomepageBanner";
import HomeImporterBanner from "../NewImporterOffer/surfaces/HomeImporterBanner";
import TestTransactionBanner from "../TestTransactionBanner";
import OnboardingBanner from "../OnboardingBanner";
import ActivationBanner from "../ActivationBanner/ActivationBanner";
import NewActivationBanner from "../ActivationBanner/NewActivationBanner";
import { BANNERS } from "../../types/BannerTypes";
import InstaLinkBanner from "../InstaLinkBanner";
import useInterval from "../../hooks/useInterval";
import useBannersStore from "../../store/useBannersStore";
import { BannerProvider, useBannerContext } from "../../context/BannerContext";
import { BannerPortals } from "./BannerPortals";

interface BannerCarouselProps {}

export enum BANNER_STYLE {
  GRID = "GRID",
  CAROUSEL = "CAROUSEL",
}

/**
 * order of the banners is decided by the backend
 *
 * Partial: the banner list also carries keys that render outside the carousel
 * (page-level strips), which the carousel skips.
 */
const BANNER_MAP: Partial<Record<BANNERS, JSX.Element>> = {
  REFERRAL: <HomepageBanner />,
  NEW_IMPORTER_OFFER: <HomeImporterBanner />,
  ZOHO: <ZohoSyncBanner />,
  ONBOARDING: <OnboardingBanner />,
  TEST_TRANSACTION: <TestTransactionBanner />,
  ACTIVATION_EXPERIMENT: <ActivationBanner />,
  ACTIVATION_EXP: <NewActivationBanner />,
  INSTA_LINK: <InstaLinkBanner />,
};

const BannerCarouselContent: FC<BannerCarouselProps> = (props) => {
  const { bannerList: allBanners, bannerStyle } = useBannersStore();
  const bannerList = allBanners.filter((banner) => !!BANNER_MAP[banner]);
  const { setHasCarouselDots } = useBannerContext();
  const [selected, setSelected] = useState(0);
  const [isPaused, setPaused] = useState(false);

  useEffect(() => {
    setHasCarouselDots(
      bannerList.length > 1 && bannerStyle === BANNER_STYLE.CAROUSEL
    );
  }, [bannerList.length, bannerStyle, setHasCarouselDots]);

  const intervalRef = useInterval(
    () => {
      if (bannerList.length < 1) window.clearInterval(intervalRef.current);
      setSelected((selected + 1) % bannerList.length);
    },
    isPaused ? null : 8000
  );

  if (bannerList.length === 0) {
    return null;
  }

  if (bannerList.length > 0 && selected >= bannerList.length) {
    setSelected(0);
  }

  if (bannerList.length === 1) {
    const singleContainerId = "banner-single-container";
    return (
      <div className={"overflow-hidden"}>
        <div
          id={singleContainerId}
          className={"h-[280px] bg-white mb-[24px] rounded-10px p-6 relative"}
        >
          <BannerPortals containerId={singleContainerId} />
          {BANNER_MAP[bannerList[0]]}
        </div>
      </div>
    );
  }

  if (bannerStyle === BANNER_STYLE.GRID) {
    return (
      <div className={"flex flex-row gap-6 mb-[24px] bg-black-50 h-[280px]"}>
        {bannerList.map((banner, index) => {
          const flexWidth = ["ACTIVATION_EXPERIMENT", "TEST_TRANSACTION", "ACTIVATION_EXP"].includes(banner)
            ? "w-7/12"
            : "w-5/12";
          const containerId = `banner-container-${index}`;

          return (
            <div
              key={index}
              id={containerId}
              className={classNames(flexWidth, "bg-white p-6 rounded-10px flex-grow relative")}
            >
              <BannerPortals containerId={containerId} />
              {BANNER_MAP[banner]}
            </div>
          );
        })}
      </div>
    );
  }

  const carouselContainerId = "banner-carousel-container";

  return (
    <div className={"overflow-hidden"}>
      <div
        id={carouselContainerId}
        className={"h-[280px] bg-white mb-[24px] rounded-10px flex flex-col p-6 pb-10 relative"}
        onClick={() => {
          setPaused(true);
        }}
      >
        <BannerPortals containerId={carouselContainerId} />
        {BANNER_MAP[bannerList[selected]]}
        <div className={"absolute bottom-4 left-0 right-0 flex flex-row justify-center z-10"}>
          <div className="flex flex-row items-center gap-2 px-2 py-1 rounded-full bg-black-700/20">
            {bannerList.map((banner, index) => (
              <button
                key={`bannerSelector${index}`}
                onClick={() => {
                  setSelected(index);
                  setPaused(true);
                }}
                className={classNames("h-2 w-2 rounded-full cursor-pointer bg-white/60", {
                  "!bg-white": selected === index,
                })}
                aria-label={`Go to banner ${index + 1}`}
                type="button"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const BannerCarousel: FC<BannerCarouselProps> = (props) => {
  return (
    <BannerProvider>
      <BannerCarouselContent {...props} />
    </BannerProvider>
  );
};

export default BannerCarousel;
