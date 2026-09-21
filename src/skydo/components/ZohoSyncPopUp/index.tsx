import useZohoSyncStore from "../../store/useZohoSyncStore";
import React, { ReactElement, useEffect, useState } from "react";
import Locale from "../../util/locale/en";
import SkydoFullIcon from "../Icons/SkydoFullIcon";
import ZohoLogoIcon from "../Icons/ZohoLogoIcon";
import ConnectIcon from "../Icons/ConnectIcon";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import XCircleIcon from "../Icons/XCircleIcon";
import ZohoConnectIconHeader from "./ZohoConnectIconHeader";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import RefreshIcon from "../Icons/RefreshIcon";
import PaidIcon from "../Icons/PaidIcon";
import DownloadIcon from "../Icons/DownloadIcon";
import FullTick from "../Icons/FullTick";
import SuccessIcon from "../AtomicComponents/ToastMessages/SuccessIcon";
import Button from "../AtomicComponents/Button";
import {
  ZOHO_BOOKS_CONSTANT,
  ZOHO_SYNC_FREQUENCY_PLACEHOLDER,
  ZohoOrganization,
  ZohoSyncState,
} from "../../types/ZohoSync";
import Dropdown from "../AtomicComponents/Dropdown";
import { getCTATextFromZohoPopUpState, isZohoErrorRedirect, isZohoSuccessRedirect } from "../../util/zohoSyncUtil";
import { useRouter } from "next/router";
import Popup from "../AtomicComponents/Popup";
import classNames from "classnames";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import FE_ROUTES from "../../util/feRoutes";
import useHomeStateStore, { HomeState } from "../../store/useHomeStateStore";
import useCustomerFeedbackStore from "../../store/useCustomerFeedbackStore";
import { CUSTOMER_FEEDBACK_QUESTION_TYPE } from "../../constants/dashboardConstants";

const ZohoSyncPopUp = () => {
  const {
    isPopupVisible,
    closeZohoSyncPopup,
    zohoPopUpState,
    setZohoPopUpState,
    getGrantTokenApi,
    getAccessAndRefreshTokenApi,
    setZohoOrgApi,
    zohoOrgList,
    setSelectedOrg,
    selectedOrgId,
    getZohoSyncStatusApi,
    getZohoSyncFrequencyApi,
    zohoSyncFrequency,
  } = useZohoSyncStore();

  const router = useRouter();
  const analytics = useAnalytics();
  const [feedbackState, setFeedbackState] = useState(0);
  const { homeState } = useHomeStateStore();
  const { addCustomerFeedback, isSubmittingFeedback } = useCustomerFeedbackStore();

  /**
   * Check query params
   *
   *      Case : code and account_server are present
   *      Implies : Zoho Redirect
   *      Send Request to Backend with Code and Auth Domain /authenticate/generate/access/refresh/token
   *      set state => LOADING
   *      Check Result
   *
   *              Success
   *              Check result
   *                       If connected i.e. single org
   *                       set state - CONNECTED
   *
   *                       If multiple orgs
   *                       set state - CONNECTED_ORG_NOT_SELECTED
   *
   *              Fail
   *              set state - Error
   *
   *      Case : error present
   *      Implies : Zoho Error
   *      set state => ERROR
   *
   *  Else
   *
   *      Request to backend
   *      /backend/get/zoho/sync/status
   *      Check result
   *
   *      Connected
   *      Not Connected
   *      Connected but org not selected - Edge Case
   *
   * */

  const initializeState = async () => {
    await getZohoSyncFrequencyApi();
    const isRedirect = isZohoSuccessRedirect(Object.keys(router.query));
    const isError = isZohoErrorRedirect(Object.keys(router.query));
    if (isRedirect) {
      await getAccessAndRefreshTokenApi({
        grantToken: String(router.query[ZOHO_BOOKS_CONSTANT.CODE]),
        authDomain: String(router.query[ZOHO_BOOKS_CONSTANT.ACCOUNT_SERVER]),
      });
      if (useZohoSyncStore.getState().zohoPopUpState === ZohoSyncState.CONNECTED) {
        analytics?.trackAsync(Events.ZOHO.CONNECTION_SUCCESSFUL);
      }
    } else if (isError) {
      setZohoPopUpState(ZohoSyncState.ERROR);
    } else {
      await getZohoSyncStatusApi();
    }
  };

  useEffect(() => {
    initializeState();
  }, []);

  useEffect(() => {
    sendAnalytics();
  }, [zohoPopUpState]);

  const sendAnalytics = () => {
    const pathArray = router.pathname.split("/");
    const lastPathVar = pathArray[pathArray.length - 1];
    const sourceAttr = router.query["source"];
    const errorAttr = router.query["error"] || "";
    if (zohoPopUpState == ZohoSyncState.READY_TO_CONNECT) {
      analytics?.trackAsync(Events.ZOHO.CONNECT_POP_UP_OPEN, {
        source:
          router.pathname === FE_ROUTES.DASHBOARD && homeState === HomeState.FOCUSED
            ? HomeState.FOCUSED
            : sourceAttr || lastPathVar,
      });
    }
    if (zohoPopUpState == ZohoSyncState.CONNECTED_ORG_PENDING) {
      analytics?.trackAsync(Events.ZOHO.SELECT_ORG_POP_UP_OPEN);
    }
    if (zohoPopUpState == ZohoSyncState.ERROR) {
      analytics?.trackAsync(Events.ZOHO.CONNECTION_FAIL, { error: errorAttr });
    }
  };

  const renderBenefit = (icon: () => any, heading: string, para: string) => {
    return (
      <div className={"flex items-start gap-4"}>
        <div className={"flex items-center justify-center shrink-0 w-8 h-8 bg-white border border-black-100 rounded-[6px]"}>
          {icon()}
        </div>
        <div className={"flex flex-col flex-1"}>
          <Typography text={heading} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} fontWeight={"700"} />
          <Typography text={para} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500"} />
        </div>
      </div>
    );
  };

  const renderCloseButton = () => (
    <Button
      type={BUTTON_TYPES.TERTIARY}
      size={BUTTON_SIZES.X_SMALL}
      nativeType={"button"}
      onButtonClick={onClosePopUp}
      title={() => <CrossIcon width={24} height={24} stroke={"#5671D2"} />}
      buttonClass={"!h-auto !w-auto !p-0 !bg-transparent hover:!bg-transparent hover:!shadow-none focus:!shadow-none"}
      buttonProps={{ "aria-label": "Close" }}
    />
  );

  const readyToConnectContent = () => {
    return (
      <div className={"flex flex-col"}>
        <div
          className={"relative px-6 pt-6 pb-8"}
          style={{ background: "linear-gradient(180deg, #6495FF 0%, #B9CFFE 35%, #FFFFFF 100%)" }}
        >
          <div className={"flex justify-end"}>{renderCloseButton()}</div>
          <ZohoConnectIconHeader />
          <div className={"text-center"}>
            <Typography
              text={Locale.zohoSync.connectTitle}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"800"}
              textClasses={"!text-navyblue-300 block leading-tight"}
            />
            <Typography
              text={Locale.zohoSync.connectZohoBooksOrInvoices}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"800"}
              textClasses={"!text-black-700 block leading-tight"}
            />
            <Typography
              text={Locale.zohoSync.connectAccountToSkydo}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"800"}
              textClasses={"!text-navyblue-300 block leading-tight"}
            />
          </div>
        </div>
        <div className={"px-6 pb-6"}>
          <div className={"bg-black-50 rounded-10px p-6 flex flex-col gap-4"}>
            {renderBenefit(
              () => <RefreshIcon stroke={"#5671D2"} />,
              Locale.zohoSync.benefitHeadingOne,
              Locale.zohoSync.benefitParaOne
            )}
            {renderBenefit(
              () => <PaidIcon width={16} height={16} stroke={"#5671D2"} />,
              Locale.zohoSync.benefitHeadingTwo,
              Locale.zohoSync.benefitParaTwo
            )}
            {renderBenefit(
              () => <DownloadIcon stroke={"#5671D2"} />,
              Locale.zohoSync.benefitHeadingThree,
              Locale.zohoSync.benefitParaThree
            )}
          </div>
          <Button
            title={Locale.zohoSync.connectSecurely}
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.MEDIUM}
            buttonClass={"!w-full mt-6 !h-10 !py-2.5"}
            onButtonClick={onConnectZohoClick}
          />
          <div className={"flex items-center justify-center gap-1.5 mt-3"}>
            <FullTick isSmall bgColor={"#1AA06B"} tickColor={"white"} />
            <Typography
              text={Locale.zohoSync.trustLineNew}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-600"}
            />
          </div>
        </div>
      </div>
    );
  };

  const errorContent = () => {
    return (
      <div className={"flex flex-col"}>
        <div
          className={"relative px-6 pt-6 pb-8"}
          style={{ background: "linear-gradient(180deg, #6495FF 0%, #B9CFFE 35%, #FFFFFF 100%)" }}
        >
          <div className={"flex justify-end"}>{renderCloseButton()}</div>
          <ZohoConnectIconHeader variant={"error"} />
          <div className={"text-center"}>
            <Typography
              text={Locale.zohoSync.popUpTitle.errorConnection}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"800"}
              textClasses={"!text-black-700 leading-tight"}
            />
            <Typography
              text={Locale.zohoSync.popUpTitle.errorFailed}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"800"}
              textClasses={"!text-red-400 leading-tight ml-1"}
            />
            <Typography
              text={Locale.zohoSync.errorNotes}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500 mt-2 block"}
            />
          </div>
        </div>
        <div className={"px-6 pb-6"}>
          <Button
            title={Locale.zohoSync.retryConnection}
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.MEDIUM}
            buttonClass={"!w-full !h-10 !py-2.5"}
            onButtonClick={onConnectZohoClick}
          />
          <div className={"flex items-center justify-center gap-1.5 mt-3"}>
            <FullTick isSmall bgColor={"#1AA06B"} tickColor={"white"} />
            <Typography
              text={Locale.zohoSync.benefitTrustMarker}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-600"}
            />
          </div>
        </div>
      </div>
    );
  };

  const selectOrgContent = () => {
    return (
      <div className={"flex flex-col flex-grow"}>
        <div className={"flex flex-row items-center justify-between mb-[24px]"}>
          <SkydoFullIcon />
          <ConnectIcon />
          <ZohoLogoIcon />
        </div>
        <div className={"mb-[24px]"}>
          <Typography text={Locale.zohoSync.selectOrgMessage} />
        </div>
        <div className={""}>
          <Dropdown
            searchable={true}
            placeholder={"Select"}
            textInputSize={TYPOGRAPHY_SIZES.SMALL}
            options={zohoOrgList.map((el: ZohoOrganization) => ({
              label: el.name,
              value: el.id,
              subText: el.country,
            }))}
            onSelect={(value) => {
              setSelectedOrg(value);
            }}
            selectedValue={selectedOrgId}
            subtextClass={"!text-black-500"}
            overridingOptionsTypographyProps={{ type: TYPOGRAPHY_TYPES.PARA, size: TYPOGRAPHY_SIZES.SMALL }}
            optionsContainerClass={"!max-h-[196px]"}
          />
        </div>
      </div>
    );
  };

  const connectedContent = () => {
    return (
      <div className={"flex flex-col"}>
        <div
          className={"relative px-6 pt-6 pb-8"}
          style={{ background: "linear-gradient(180deg, #6495FF 0%, #B9CFFE 35%, #FFFFFF 100%)" }}
        >
          <div className={"flex justify-end"}>{renderCloseButton()}</div>
          <ZohoConnectIconHeader variant={"success"} />
          <div className={"flex flex-col items-center gap-4"}>
            <Typography
              text={Locale.zohoSync.popUpTitle.connected}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"800"}
              textClasses={"!text-black-700 leading-tight"}
            />
          </div>
        </div>
        <div className={"px-6 pb-6"}>
          <div className={"flex flex-col gap-4 p-6 bg-black-50 rounded-10px"}>
            <div className={"flex items-start gap-3"}>
              <div className={"shrink-0 mt-0.5"}>
                <FullTick width={20} height={20} bgColor={"#1AA06B"} tickColor={"white"} />
              </div>
              <div className={"flex flex-col"}>
                <Typography
                  text={Locale.zohoSync.newInvoicesAppear.replace(":frequency", zohoSyncFrequency)}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={"700"}
                />
                <span>
                  <Typography
                    text={Locale.zohoSync.wantINRToo + " "}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500"}
                  />
                  <Typography
                    text={Locale.zohoSync.updateSettings}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-blue-400 cursor-pointer ml-1"}
                    onTextClick={() => {
                      analytics?.trackAsync(Events.ZOHO.UPDATE_SETTINGS_CLICKED, { source: "zoho_pop_up" });
                      router.push(FE_ROUTES.PROFILE + "?zoho_settings=true");
                      closeZohoSyncPopup();
                    }}
                  />
                </span>
              </div>
            </div>
            <div className={"flex items-start gap-3"}>
              <div className={"shrink-0 mt-0.5"}>
                <XCircleIcon />
              </div>
              <div className={"flex flex-col"}>
                <Typography
                  text={Locale.zohoSync.pastInvoicesWontSync}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={"700"}
                />
                <span>
                  <Typography
                    text={Locale.zohoSync.wantPastInvoices + " "}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500"}
                  />
                  {feedbackState === 0 ? (
                    <Typography
                      text={Locale.zohoSync.letUsKnow}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={classNames("!text-blue-400 cursor-pointer ml-1", {
                        "opacity-50 cursor-not-allowed": isSubmittingFeedback,
                      })}
                      onTextClick={() => {
                        if (isSubmittingFeedback) return;
                        analytics?.trackAsync(Events.ZOHO.LET_US_KNOW_CLICKED, { source: "zoho_pop_up" });
                        addCustomerFeedback({
                          questionType: CUSTOMER_FEEDBACK_QUESTION_TYPE.PLATFORM_INTEGRATION_FEEDBACK,
                          answer: "Zoho: user requested past invoices sync",
                          onSuccess: () => setFeedbackState(1),
                        });
                      }}
                    />
                  ) : (
                    <span className={"inline-flex items-center gap-1 ml-1"}>
                      <Typography
                        text={Locale.zohoSync.feedbackReceived}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.SMALL}
                        textClasses={"!text-green-400"}
                      />
                      <SuccessIcon width={16} height={16} />
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
          <Button
            title={getCTATextFromZohoPopUpState(ZohoSyncState.CONNECTED)}
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.MEDIUM}
            buttonClass={"!w-full mt-4 !h-10 !py-2.5"}
            onButtonClick={closeZohoSyncPopup}
          />
        </div>
      </div>
    );
  };

  const onConnectZohoClick = () => {
    if (zohoPopUpState == ZohoSyncState.READY_TO_CONNECT) {
      analytics?.trackAsync(Events.ZOHO.CONNECT_SECURELY_CLICKED, { source: "zoho_pop_up" });
    }
    if (zohoPopUpState == ZohoSyncState.ERROR) {
      analytics?.trackAsync(Events.ZOHO.RETRY_CONNECTION_CLICK);
    }
    getGrantTokenApi();
  };

  const onClickSelectOrg = async () => {
    analytics?.trackAsync(Events.ZOHO.SELECT_ORG_POP_UP_CONFIRM);
    await setZohoOrgApi();
    if (useZohoSyncStore.getState().zohoPopUpState === ZohoSyncState.CONNECTED) {
      analytics?.trackAsync(Events.ZOHO.CONNECTION_SUCCESSFUL);
    }
  };

  const getCtaAction = () => {
    switch (zohoPopUpState) {
      case ZohoSyncState.READY_TO_CONNECT:
        return onConnectZohoClick;
      case ZohoSyncState.ERROR:
        return onConnectZohoClick;
      case ZohoSyncState.CONNECTED_ORG_PENDING:
        return onClickSelectOrg;
      case ZohoSyncState.CONNECTED:
        return closeZohoSyncPopup;
      case ZohoSyncState.LOADING:
        return () => {};
    }
  };

  const renderCta = () => {
    if (
      zohoPopUpState === ZohoSyncState.READY_TO_CONNECT ||
      zohoPopUpState === ZohoSyncState.CONNECTED ||
      zohoPopUpState === ZohoSyncState.ERROR
    ) {
      return <></>;
    }
    const ctaText = getCTATextFromZohoPopUpState(zohoPopUpState);
    return (
      <Button
        buttonClass={"mt-6 w-full"}
        title={ctaText}
        type={BUTTON_TYPES.PRIMARY}
        size={BUTTON_SIZES.SMALL}
        onButtonClick={getCtaAction()}
      />
    );
  };

  const renderContent = () => {
    switch (zohoPopUpState) {
      case ZohoSyncState.READY_TO_CONNECT:
        return readyToConnectContent();
      case ZohoSyncState.CONNECTED_ORG_PENDING:
        return selectOrgContent();
      case ZohoSyncState.CONNECTED:
        return connectedContent();
      case ZohoSyncState.ERROR:
        return errorContent();
      default:
        return readyToConnectContent();
    }
  };

  const getPopUpTitleFromZohoPopUpState = (popUpState: ZohoSyncState): string | ReactElement => {
    switch (popUpState) {
      case ZohoSyncState.READY_TO_CONNECT:
        return "";
      case ZohoSyncState.CONNECTED_ORG_PENDING:
        return Locale.zohoSync.popUpTitle.connectedOrgPending;
      case ZohoSyncState.CONNECTED:
        return Locale.zohoSync.popUpTitle.connected;
      case ZohoSyncState.ERROR:
        return (
          <span>
            <Typography
              text={Locale.zohoSync.popUpTitle.errorConnection}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
            />
            <Typography
              text={Locale.zohoSync.popUpTitle.errorFailed}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-red-400 ml-1"}
            />
          </span>
        );
      case ZohoSyncState.LOADING:
        return "";
    }
  };

  const onClosePopUp = () => {
    if (zohoPopUpState == ZohoSyncState.CONNECTED_ORG_PENDING) {
      analytics?.trackAsync(Events.ZOHO.SELECT_ORG_POP_UP_CANCEL);
    } else {
      analytics?.trackAsync(Events.ZOHO.CROSS_CLICKED, { source: "zoho_pop_up" });
    }
    closeZohoSyncPopup();
  };

  return (
    <>
      {zohoPopUpState != ZohoSyncState.LOADING ? (
        <Popup
          renderContent={renderContent}
          open={isPopupVisible}
          closeIconClick={onClosePopUp}
          outsideClick={onClosePopUp}
          containerClass={classNames("flex flex-col", {
            "!overflow-visible": zohoPopUpState == ZohoSyncState.CONNECTED_ORG_PENDING,
            "!p-0 !overflow-hidden":
              zohoPopUpState === ZohoSyncState.READY_TO_CONNECT ||
              zohoPopUpState === ZohoSyncState.CONNECTED ||
              zohoPopUpState === ZohoSyncState.ERROR,
          })}
          bgWrapperClass={"!bg-black-700/80"}
          isCommonHeader={
            zohoPopUpState !== ZohoSyncState.READY_TO_CONNECT &&
            zohoPopUpState !== ZohoSyncState.CONNECTED &&
            zohoPopUpState !== ZohoSyncState.ERROR
          }
          title={getPopUpTitleFromZohoPopUpState(zohoPopUpState)}
          headerClass={"items-center"}
          renderCTAs={renderCta}
          ctaClass={"justify-self-end"}
          isDashboardPopup={true}
        />
      ) : null}
    </>
  );
};

export default ZohoSyncPopUp;
