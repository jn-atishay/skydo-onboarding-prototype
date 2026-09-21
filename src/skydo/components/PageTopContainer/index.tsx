import React, { useContext, useEffect, useMemo, useState } from "react";
import { UserDetailsContext } from "../DashboardContainer";
import { useRouter } from "next/router";
import FE_ROUTES from "../../util/feRoutes";
import WarningInfoIcon from "../Icons/WarningInfoIcon";
import InfoIcon from "../Icons/InfoIcon";
import InfoIcon1 from "../AtomicComponents/ToastMessages/InfoIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import useCashbackStore from "../../store/useCashbackStore";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import AppContext from "../../context/AppContext";
import USdImageLoader from "../InvoiceDetails/UsdImageLoader";
import classnames from "classnames";
import useReferralStore from "../../store/useReferralStore";
import { CashbackReasonType } from "../../types";
import { isUserKYCed } from "../../util/functions";
import PreKycHeader from "./PreKycHeader";
import { INT_ACCOUNT_CREATED_STATE, USER_STATES } from "../../constants/onboarding";
import OfflineVerificationIcon from "../Icons/OfflineVerificationIcon";
import useVideoKycStore from "../../store/useVideoKycStore";
import { VKYCStatus } from "../../types/vkyc";
import VideoVerificationIcon from "../Icons/VideoVerificationIcon";
import { isOldUser } from "../../util/vkycUtils";
import { formatDate } from "../../util/formatters";
import useHomeStateStore, { HomeState } from "../../store/useHomeStateStore";
import useFocusedHomeStore from "../../store/useFocusedHomeStore";
import { RewardStatus } from "../../types/BannerTypes";
import useProfileStore from "../../store/useProfileStore";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import useFundingStore from "../../store/useFundingStore";
import usePurposeCodeList from "../../store/usePurposeCodeList";
import useUaeBannerStore from "../../store/useUaeBannerStore";
import UaeFlagIcon from "../Icons/UaeFlagIcon";
import { LOCATION_CODE } from "../../constants/dashboardConstants";
import { formatIncomingCurrency } from "../../util/formatters";
import useDashboardContainerStore from "../../store/useDashboardContainerStore";
import PhoneSkydoIcon from "../Icons/PhoneSkydoIcon";
import { isMasterFunding } from "../../types/Funding";
import { PURPOSE_CODE_ICON_COLORS } from "../../constants/purposeCodeConstants";

type Props = {
  children: React.ReactNode;
  containerClasses?: string;
  className?: string;
  onLoad?: () => void;
};
const WrapperComp = (props: Props) => {
  useEffect(() => {
    props.onLoad?.();
  }, []);

  return (
    <div
      className={classnames(
        "min-w-[800px] bg-yellow-200 items-center py-2 flex justify-center w-full",
        props.containerClasses
      )}
    >
      <div className={classnames("flex justify-between max-w-[1600px] w-full px-6", props.className)}>
        {props.children}
      </div>
    </div>
  );
};
const PageTopContainer = ({ isLoading, isMobileView = false }: { isLoading: boolean; isMobileView?: boolean }) => {
  const { purposeCodeDetails, exporterDetails } = useContext(UserDetailsContext);
  const analytics = useAnalytics();
  const {
    isRefundablePageTopVisible,
    importerBusinessName,
    setRefundPageTopStatus,
    isRefunded,
    refundReason,
    cashbackReason,
    refundMetadata,
  } = useCashbackStore();
  const { activeKycDocuments, getActiveKYCDocuments, isBusinessDocumentOnboardingAlertApproved, isCaseClosed } =
    useProfileStore();

  const { fetchHomeState, homeState, isLoading: isHomeStoreLoading } = useHomeStateStore();
  const {
    isLoading: isFocusedHomeStoreLoading,
    exporterReward,
    fetchFocusedHomeData,
    isStepsVisible,
  } = useFocusedHomeStore();
  const { userReferralData } = useReferralStore();
  const [isRewardAvailable, setIsRewardAvailable] = useState<boolean>(false);
  const [rewardCount, setRewardCount] = useState<number>(0);
  const { isVideoKycDone, onVideoVerifClick, verifStatus, isLoading: isVkycLoading } = useVideoKycStore();

  const { totalUnsettledFunds: totalUnsettledFunds } = usePurposeCodeList();
  const { hasDismissedMobileMappingBanner, skipMobileMappingBanner } = useDashboardContainerStore();

  const router = useRouter();

  const { unmappedFundings } = useFundingStore();
  const unmappedMasterFundingsPending = useMemo(
    () => unmappedFundings.filter((f) => isMasterFunding(f) && f.amount > f.amountMapped),
    [unmappedFundings]
  );
  const isSkydoBalanceRoute = router.pathname === FE_ROUTES.SKYDO_BALANCE;
  /** Skydo Balance main + sub-routes (UAE launch banner hidden here; see below). */
  const isSkydoBalanceSectionRoute =
    router.pathname === FE_ROUTES.SKYDO_BALANCE ||
    router.pathname === FE_ROUTES.SKYDO_BALANCE_PENDING_TRANSACTIONS ||
    router.pathname === FE_ROUTES.SKYDO_BALANCE_DRAFT_PAYOUT;
  const showSkydoBalanceUnmappedBanner = isSkydoBalanceRoute && unmappedMasterFundingsPending.length > 0;

  useEffect(() => {
    setIsRewardAvailable((userReferralData?.rewardData?.rewardValue || 0) > 0);
    setRewardCount(userReferralData?.rewardData?.rewardValue || 0);
  }, [userReferralData]);
  const { theme } = useContext(AppContext);

  useEffect(() => {
    if (router.pathname === FE_ROUTES.DASHBOARD) {
      void fetchHomeState();
      void fetchFocusedHomeData();
    }
    void getActiveKYCDocuments();
  }, []);

  if (isMobileView) {
    return null;
  }

  /** Desktop only: highest-priority page top on Skydo Balance when master fundings need mapping. */
  if (showSkydoBalanceUnmappedBanner) {
    const pendingCount = unmappedMasterFundingsPending.length;
    const onSkydoBalanceUnmappedCta = () => {
      analytics.trackAsync(Events.MAPPING.UNMAPPED_PAYMENT_CARD_CLICK);
      void router.push(FE_ROUTES.FUNDING);
    };
    const bannerTitle =
      pendingCount === 1
        ? Locale.skydoBalanceUnmappedPaymentsBannerTitleSingular.replace(":count", "1")
        : Locale.skydoBalanceUnmappedPaymentsBannerTitlePlural.replace(":count", String(pendingCount));
    const bannerSubtitle =
      pendingCount === 1
        ? Locale.skydoBalanceUnmappedPaymentsBannerSubtitleSingular
        : Locale.skydoBalanceUnmappedPaymentsBannerSubtitlePlural;
    return (
      <WrapperComp containerClasses={"!bg-alert-200 !py-3"} className={"!items-center"}>
        <div className={"flex min-w-0 flex-1 flex-row items-center gap-4"}>
          <div className={"shrink-0"}>
            <WarningInfoIcon color="#997328" width={24} height={24} />
          </div>
          <div className={"flex min-w-0 flex-col gap-1 pr-4"}>
            <Typography
              text={bannerTitle}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!font-semibold !text-neutral-700 !leading-snug"}
            />
            <Typography
              text={bannerSubtitle}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!leading-5 !text-neutral-600"}
            />
          </div>
        </div>
        <Button
          title={Locale.skydoBalanceGoToUnmappedPayments}
          type={BUTTON_TYPES.PRIMARY}
          isDisabled={false}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={onSkydoBalanceUnmappedCta}
        />
      </WrapperComp>
    );
  }

  const isAddDefaultVisible = () => {
    if (!isLoading && !purposeCodeDetails?.defaultPurposeCode) {
      return ![FE_ROUTES.INVOICE_DETAILS, FE_ROUTES.UNPARSED_INVOICE].includes(router.pathname);
    }
    return false;
  };

  const isManualVerification = () => {
    return exporterDetails.onBoardingState === USER_STATES.MANUAL_VERIFICATION;
  };

  const onAddPCClick = () => {
    router.push(
      {
        pathname: router.pathname,
        query: {
          ...router.query,
          openPurposeCodePopup: true,
          isDefault: true,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  const onRefundCrossClick = () => {
    setRefundPageTopStatus({
      isRefundablePageTopVisible: false,
      isRefunded: false,
      importerBusinessName: "",
      refundReason: "",
      cashbackReason: undefined,
    });
  };

  const getCashbackTitleText = () => {
    if (isRefunded) {
      // If cashback is refunded then the cashback reason will be populated
      if (
        cashbackReason === CashbackReasonType.REFEREE_CASHBACK ||
        cashbackReason === CashbackReasonType.REFERRER_CASHBACK
      ) {
        return Locale.yayRefundedDueReward.replace(":reason", "referral reward");
      } else if (cashbackReason === CashbackReasonType.ACTIVATION_REWARD) {
        return Locale.yayRefundedDueReward.replace(
          ":reason",
          refundMetadata?.applicable ? "first month payments free" : "first invoice free"
        );
      } else {
        return Locale.yayRefunded
          .replace("${importerBusinessName}", importerBusinessName)
          .replace("${refundReason}", refundReason);
      }
    } else if (isRewardAvailable || refundMetadata?.applicable) {
      console.log("isRewardAvailable " + isRewardAvailable);
      console.log("rewardCount " + rewardCount);
      return Locale.yayRefundableDueRewardDefault;
    }
  };

  if (router.pathname === FE_ROUTES.DASHBOARD) {
    if (isHomeStoreLoading || isFocusedHomeStoreLoading) {
      return null;
    } else if (homeState == HomeState.FOCUSED) {
      if (exporterReward?.rewardStatus == RewardStatus.ELIGIBLE) {
        const expiryDate = exporterReward?.expiryDate
          ? formatDate(exporterReward.expiryDate, {
              day: "numeric",
              month: "long",
            })
          : null;
        const expiryCopy = expiryDate ? `(Valid until ${expiryDate})` : "";
        return (
          <WrapperComp className={"!justify-center"} containerClasses={"!bg-limegreen-100"}>
            <Typography
              text={`Special offer: Receive all payments for free for the first month! 🎉 ${expiryCopy}`}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"600"}
            />
          </WrapperComp>
        );
      } else if ((isVideoKycDone != false || !isStepsVisible) && !isAddDefaultVisible()) {
        return null;
      }
    }
  }

  if (!isUserKYCed(exporterDetails.onBoardingState)) {
    return (
      <WrapperComp className={"!justify-center"}>
        <PreKycHeader />
      </WrapperComp>
    );
  }

  if (isVideoKycDone !== undefined && !isVideoKycDone) {
    if ([FE_ROUTES.VKYC].includes(router.pathname) || verifStatus === VKYCStatus.PENDING) {
      return null;
    }
    if (router.pathname === FE_ROUTES.DASHBOARD && !isStepsVisible) {
      return null;
    }
    return (
      <WrapperComp
        onLoad={() => {
          analytics.trackAsync(Events.VIDEO_KYC_BANNER_LOAD);
        }}
      >
        <div className={"flex flex-row items-center gap-6"}>
          {isOldUser(exporterDetails.tag) ? (
            <VideoVerificationIcon width={40} height={40} className={"-mt-2"} />
          ) : (
            <InfoIcon1 stroke={theme.hexColors.black[700]} className={"rotate-180"} />
          )}

          <Typography
            text={
              isOldUser(exporterDetails.tag)
                ? Locale.paymentsReceivedUntilVerification
                : exporterDetails.onBoardingState === USER_STATES.BENEFICIARY_ACCOUNT_PENDING
                ? Locale.skydoAccIsReady
                : Locale.completeVkycToEnsureTimelySettlement
            }
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!font-semibold"}
          />
        </div>
        <Button
          title={Locale.startVideoVerif}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={() => {
            analytics.trackAsync(Events.VIDEO_KYC_INITIATE_CLICK_BANNER);
            onVideoVerifClick();
          }}
          isLoading={isVkycLoading}
        />
      </WrapperComp>
    );
  }

  if (
    !(isCaseClosed || isBusinessDocumentOnboardingAlertApproved) &&
    activeKycDocuments.some((doc) => doc.isDocRequested || !doc.isDocumentFetched)
  ) {
    const DocVerificationBanner = () => {
      useEffect(() => {
        analytics.trackAsync(Events.DOCUMENT_VERIFICATION_SECTION_VIEWED);
      }, []);
      return (
        <WrapperComp>
          <div className={"flex flex-row items-center gap-6"}>
            <InfoIcon isLarge={true} />
            <Typography
              text={Locale.documentsNotVerifiedBannerCopy}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!font-semibold"}
            />
          </div>
          <Button
            title={Locale.reviewDocuments}
            size={BUTTON_SIZES.SMALL}
            onButtonClick={() => {
              analytics.trackAsync(Events.DOCUMENTS_VERIFICATION_BANNER_CLICKED);
              router.push(FE_ROUTES.PROFILE);
            }}
          />
        </WrapperComp>
      );
    };
    return <DocVerificationBanner />;
  }

  if (isRefundablePageTopVisible) {
    console.log("isRefundablePageTopVisible ", isRefundablePageTopVisible);
    return (
      <div className={"min-w-[800px] bg-limegreen-100 items-center py-2.5 flex justify-center w-full"}>
        <div className={"flex justify-between max-w-[1600px] w-full px-6 items-center"}>
          <div className={"flex_row_item_center"}>
            <USdImageLoader width={"48px"} height={"48px"} animation />
            <div className={"flex flex-col"}>
              <Typography
                text={getCashbackTitleText()}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!ml-6"}
              />
              {isRefunded ? null : refundMetadata?.applicable ? (
                <Typography
                  text={
                    refundMetadata?.expiryDate
                      ? Locale.firstMonthFreeSubtextWDate.replace(":date", formatDate(refundMetadata.expiryDate))
                      : Locale.firstMonthFreeSubtext
                  }
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!ml-6 !text-black-500"}
                />
              ) : isRewardAvailable ? (
                <Typography
                  text={`${Locale.unclaimedReferrals}: $${rewardCount}`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!ml-6 !text-black-500"}
                />
              ) : null}
            </div>
          </div>
          <CrossIcon width={24} height={24} stroke={theme.hexColors.black[700]} onClick={onRefundCrossClick} />
        </div>
      </div>
    );
  }

  if (isAddDefaultVisible()) {
    const hasUnsettledFunds = !!totalUnsettledFunds && totalUnsettledFunds > 0;
    const unsettledAmount = `USD ${(totalUnsettledFunds || 0).toLocaleString()}`;

    return (
      <WrapperComp containerClasses={"!bg-alert-200 !py-3.5"} className={"!items-center"}>
        <div className={"flex min-w-0 items-center gap-2"}>
          <WarningInfoIcon
            width={20}
            height={20}
            {...(hasUnsettledFunds
              ? { fillColor: PURPOSE_CODE_ICON_COLORS.URGENT }
              : { color: PURPOSE_CODE_ICON_COLORS.DEFAULT })}
          />
          <div className={"flex min-w-0 items-center gap-1"}>
            {hasUnsettledFunds ? (
              <Typography
                text={Locale.urgent}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!font-bold"}
              />
            ) : null}
            <Typography
              text={
                hasUnsettledFunds
                  ? Locale.urgentPurposeCodeBanner.replace(":amount", unsettledAmount)
                  : Locale.addDefaultPCHeader
              }
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={hasUnsettledFunds ? "!font-semibold" : "!font-normal"}
            />
          </div>
        </div>
        <Button title={Locale.setDefaultPcCta} size={BUTTON_SIZES.SMALL} onButtonClick={onAddPCClick} />
      </WrapperComp>
    );
  }
  if (isManualVerification()) {
    return (
      <WrapperComp className={"flex flex-row !justify-center"}>
        <OfflineVerificationIcon height={25} width={40} />
        <Typography
          text={Locale.reviewingKycDetails}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!ml-6"}
        />
      </WrapperComp>
    );
  }

  if (
    [FE_ROUTES.FUNDING, FE_ROUTES.FUNDING_INVOICE_MAPPER].includes(router.pathname) &&
    !hasDismissedMobileMappingBanner
  ) {
    const onUnmappedMobileBannerClose = () => {
      analytics.trackAsync(Events.MOBILE_MAPPING_BANNER_CLOSE);
      skipMobileMappingBanner();
    };

    return (
      <WrapperComp
        containerClasses={"!bg-blue-100"}
        onLoad={() => {
          analytics.trackAsync(Events.MOBILE_MAPPING_BANNER_LOAD);
        }}
      >
        <div className={"flex flex-row items-center gap-6"}>
          <PhoneSkydoIcon />
          <div className={"flex flex-col gap-1"}>
            <Typography
              text={Locale.mobileMappingBannerTitle}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!font-semibold"}
            />
            <Typography
              text={Locale.mobileMappingBannerSubtitlePart1}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-primary-400"}
            >
              <Typography
                text={Locale.mobileMappingBannerSubtitlePart2}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-primary-400 !font-bold"}
              />
              <Typography
                text={Locale.mobileMappingBannerSubtitlePart3}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-primary-400"}
              />
            </Typography>
          </div>
        </div>
        <CrossIcon
          width={24}
          height={24}
          stroke={theme.hexColors.neutral[500]}
          onClick={onUnmappedMobileBannerClose}
          className={"cursor-pointer"}
        />
      </WrapperComp>
    );
  }
  return null;
};

export default PageTopContainer;
