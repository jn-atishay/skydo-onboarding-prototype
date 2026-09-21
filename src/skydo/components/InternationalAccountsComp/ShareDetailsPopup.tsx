import React, { FC, useContext, useEffect, useState } from "react";
import { USER_STATES } from "../../constants/onboarding";
import { SHARE_DETAILS_STATE } from "../../constants/publicBankAccountCardConstants";
import Locale from "../../util/locale/en";
import Popup from "../AtomicComponents/Popup";
import { BankUsageType, LocationCodeToPublicAccountPaymentMethod } from "../../constants/dashboardConstants";
import PopupHeader from "../AtomicComponents/Popup/PopupHeader";
import UploadCompanyLogoPopupContent from "./UploadCompanyLogoPopupContent";
import { UserDetailsContext } from "../DashboardContainer";
import useInternationalAccountsStore, { ACCOUNTS_SHARE_TYPE } from "../../store/useInternationalAccountsStore";
import { useRouter } from "next/router";
import TwoPartitionPopup from "../TwoPartitionPopup";
import ShareDetailsPopupLeftContent from "./ShareDetailsPopupLeftContent";
import ShareDetailsPopupRightContent from "./ShareDetailsPopupRightContent";
import ShareDetailsConfirmPopup from "./ShareDetailsConfirmPopup";
import { BUTTON_SIZES, BUTTON_TYPES, TOAST_TYPES } from "../../constants/atomicConstants";
import { Events } from "../../analytics/EventConstants";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import Button from "../AtomicComponents/Button";
import useToastMessages from "../../store/toastMessages";
import useAnalytics from "../../analytics/useAnalytics";
import useInternationalAccountsEventsInfo from "../../util/customHooks/useInternationalAccountsEventsInfo";
import classNames from "classnames";

interface ShareDetailsPopupProps {}

const ShareDetailsPopup: FC<ShareDetailsPopupProps> = ({}) => {
  const { exporterDetails } = useContext(UserDetailsContext);
  const {
    shareDetailsState,
    setShareDetailsState,
    shareAccountLocation,
    onShareButtonClick,
    setImageUrl,
    globalImageUrl,
    fetchExporterDataForLogo,
    shareType,
  } = useInternationalAccountsStore();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [isFileUploadLoading, setIsFileUploadLoading] = useState<boolean>(false);
  const { addToast } = useToastMessages();
  const analytics = useAnalytics();
  const eventProps = useInternationalAccountsEventsInfo();

  const SHARE_ACCOUNTS_QUERY = "share";

  const deletePopupQuery = (query: { [key: string]: any }) => {
    delete query[SHARE_ACCOUNTS_QUERY];
  };

  const shareDetailsParam = router.query[SHARE_ACCOUNTS_QUERY];
  useEffect(() => {
    if (shareDetailsParam === "true") {
      onShareButtonClick();
    } else {
      let routerQuery = { ...router.query };
      deletePopupQuery(routerQuery);
      router.push(
        {
          pathname: router.pathname,
          query: {
            ...routerQuery,
          },
        },
        undefined,
        { shallow: true }
      );
    }
  }, [shareDetailsParam]);

  useEffect(() => {
    if (shareDetailsState === SHARE_DETAILS_STATE.DEFAULT_PREVIEW_PAGE) {
      const { shareType: st, shareBankAccountUsageType: usage, balanceAccountViewSource: src } =
        useInternationalAccountsStore.getState();
      const tab = st === ACCOUNTS_SHARE_TYPE.COPY ? "copy" : st === ACCOUNTS_SHARE_TYPE.EMAIL ? "email" : "link";
      analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.SHARE_POPUP_LOAD, {
        ...eventProps,
        tab,
      });
      if (usage === BankUsageType.BALANCE) {
        analytics.trackAsync(Events.BALANCE_FLOW.ACCOUNT_VIEWED, {
          source: src ?? undefined,
          tab,
        });
      }
    }
  }, [shareDetailsState]);

  const renderCTAs = () => {
    const onFileUploadSuccess = async (response: any) => {
      await fetchExporterDataForLogo();
      setImageUrl(globalImageUrl);
      setIsFileUploadLoading(false);
      setShareDetailsState(SHARE_DETAILS_STATE.DEFAULT_PREVIEW_PAGE);
    };

    const onFileuploadError = () => {
      setImageUrl(globalImageUrl);
      setIsFileUploadLoading(false);
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "error_logo_file",
        body: Locale.wentWrongMessage,
      });
    };

    const onConfirm = () => {
      analytics?.trackAsync(Events.LOGO_UPLOAD_CONFIRM_CLICK, {
        location: "international_accounts_share",
        ...eventProps,
      });
      const formData = new FormData();
      setIsFileUploadLoading(true);
      formData.append("companyLogo", file as File);
      void beCall({
        path: BE_ROUTES.UPDATE_COMPANY_LOGO,
        method: ALLOWED_METHODS.POST,
        body: formData,
        url: "/api/route/file",
        onSuccess: onFileUploadSuccess,
        onError: onFileuploadError,
      });
    };
    const onReuploadClick = () => {
      setShareDetailsState(SHARE_DETAILS_STATE.UPLOAD_PAGE);
      setImageUrl(globalImageUrl);
      analytics?.trackAsync(Events.LOGO_UPLOAD_EDIT_LOGO_CLICK, {
        location: "international_accounts_share",
        ...eventProps,
      });
    };
    return (
      <div className={"flex justify-center mt-6"}>
        <Button
          buttonClass={"mr-2"}
          title={Locale.reUploadLogo}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={onReuploadClick}
        />
        <Button
          title={Locale.confirmButton}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={onConfirm}
          isLoading={isFileUploadLoading}
        />
      </div>
    );
  };

  const onClose = () => {
    setShareDetailsState("");
    setImageUrl(globalImageUrl);
    analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.CLOSE_POPUP, {
      ...eventProps,
    });
  };

  if (exporterDetails.onBoardingState !== USER_STATES.BENEFICIARY_ACCOUNT_PENDING) {
    return null;
  }

  switch (shareDetailsState) {
    case SHARE_DETAILS_STATE.DEFAULT_PREVIEW_PAGE:
      return (
        <TwoPartitionPopup
          isOpen={true}
          onClose={onClose}
          leftContent={() => <ShareDetailsPopupLeftContent />}
          leftTitle={Locale.shareAccountDetailTitleWithPaymentMethod.replace(
            ":paymentMethod",
            LocationCodeToPublicAccountPaymentMethod[shareAccountLocation] || ""
          )}
          rightContent={() => <ShareDetailsPopupRightContent setShareDetailsState={setShareDetailsState} />}
          containerClass={"!h-[80%] !w-11/12 !max-w-[910px] !min-w-[500px] !max-h-[600px]"}
          rightContainerWrapperClass={classNames({
            "h-full": shareType === ACCOUNTS_SHARE_TYPE.COPY,
          })}
          rightContainerClass={classNames({
            "h-full": shareType === ACCOUNTS_SHARE_TYPE.COPY,
          })}
          rightSectionClass={classNames({
            "h-full": shareType === ACCOUNTS_SHARE_TYPE.COPY,
          })}
        />
      );
    case SHARE_DETAILS_STATE.UPLOAD_PAGE:
      return (
        <Popup
          renderContent={() => (
            <div className={"flex flex-col h-full"}>
              <PopupHeader title={Locale.uploadCompanyLogoText} closeIconClick={onClose} />
              <UploadCompanyLogoPopupContent
                location={"international_accounts_share"}
                goToNextScreen={() => {
                  setShareDetailsState(SHARE_DETAILS_STATE.CONFIRM_LOGO_PAGE);
                }}
                setLogoImageUrl={setImageUrl}
                setFile={setFile}
                fileAllowedText={Locale.signatureMaxSizeLimit}
              />
            </div>
          )}
          open={!!shareDetailsState}
          closeIconClick={onClose}
          outsideClick={onClose}
          isLargePopup={true}
          containerClass={"h-[80%]"}
        />
      );
    case SHARE_DETAILS_STATE.CONFIRM_LOGO_PAGE:
      return (
        <ShareDetailsConfirmPopup
          onClose={onClose}
          setShareDetailsState={setShareDetailsState}
          isFileUploadLoading={isFileUploadLoading}
          renderCTAs={renderCTAs}
        />
      );
  }
  return null;
};

export default ShareDetailsPopup;
