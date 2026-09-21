import Tabs from "../AtomicComponents/Tabs";
import useInternationalAccountsStore, { ACCOUNTS_SHARE_TYPE } from "../../store/useInternationalAccountsStore";
import Locale from "../../util/locale/en";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  INPUT_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import React, { useContext, useEffect, useState } from "react";
import Typography from "../AtomicComponents/Typography";
import { Events } from "../../analytics/EventConstants";
import useToastMessages from "../../store/toastMessages";
import useAnalytics from "../../analytics/useAnalytics";
import Button from "../AtomicComponents/Button";
import EmailForm from "../EmailComponents/EmailForm";
import LocationInput from "../Common/LocationInput";
import {
  BankUsageType,
  LOCATION_CODE,
  LOCATION_CODE_LABEL,
  LOCATION_CURRENCY_MAP,
} from "../../constants/dashboardConstants";
import { SgAccountStatus } from "../../types";
import { SendEmailRequest } from "../../types/PaymentConfirmation";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import TextInput from "../AtomicComponents/TextInput";
import { getLocationWiseAccountDetails } from "../../util/functions";
import { UserDetailsContext } from "../DashboardContainer";
import useInternationalAccountsEventsInfo from "../../util/customHooks/useInternationalAccountsEventsInfo";
import ShareDetailsAccountCard from "./ShareDetailsAccountCard";
import useExporterAndExporterUserStore from "../../store/useExporterAndExporterUserStore";

interface ShareDetailsPopupLeftContentProps {}

const ShareDetailsPopupLeftContent = (props: ShareDetailsPopupLeftContentProps) => {
  const {
    shareType,
    setShareType,
    setShareAccountLocation,
    shareAccountLocation,
    publicLink,
    sgAccountStatus,
    shareAccountClientName,
    setShareAccountClientName,
    virtualAccounts,
    isBCVariantEnabled,
    getAccountProvider,
    showAccountDetailsOnSharePopup,
    excludeShareType,
    shareBankAccountUsageType,
  } = useInternationalAccountsStore();
  const userId = useExporterAndExporterUserStore((s) => s.exporterUser?.userId);
  const [selectedOption, setSelectedOption] = useState(0);
  const { addToast } = useToastMessages();
  const analytics = useAnalytics();
  const link = publicLink + (shareAccountLocation ? `?location=${shareAccountLocation.toLowerCase()}` : "");
  const { exporterDetails } = useContext(UserDetailsContext);
  const locationWiseAccountDetails = getLocationWiseAccountDetails(
    virtualAccounts,
    exporterDetails.businessLegalName,
    isBCVariantEnabled
  );
  const audAccountDetails = locationWiseAccountDetails[LOCATION_CODE.AUS];
  const eventProps = useInternationalAccountsEventsInfo();

  const options = [
    {
      heading: Locale.shareViaLink,
      shareType: ACCOUNTS_SHARE_TYPE.LINK,
    },
    {
      heading: Locale.shareViaEmail,
      shareType: ACCOUNTS_SHARE_TYPE.EMAIL,
    },
  ].filter((option) => !excludeShareType?.includes(option.shareType));
  if (showAccountDetailsOnSharePopup && !excludeShareType?.includes(ACCOUNTS_SHARE_TYPE.COPY)) {
    options.unshift({
      heading: Locale.copyAccDetails,
      shareType: ACCOUNTS_SHARE_TYPE.COPY,
    });
  }

  useEffect(() => {
    setShareType(options[selectedOption].shareType);
  }, [selectedOption]);

  const locationOptions = [
    {
      value: LOCATION_CODE.USA,
      label: LOCATION_CODE_LABEL[LOCATION_CODE.USA],
    },
  ];

  if (!!locationWiseAccountDetails[LOCATION_CODE.UK]?.accountNumber) {
    locationOptions.push({
      value: LOCATION_CODE.UK,
      label: LOCATION_CODE_LABEL[LOCATION_CODE.UK],
    });
  }
  if (!!locationWiseAccountDetails[LOCATION_CODE.EUROPE]?.accountNumber) {
    locationOptions.push({
      value: LOCATION_CODE.EUROPE,
      label: LOCATION_CODE_LABEL[LOCATION_CODE.EUROPE],
    });
  }

  locationOptions.push({
    value: LOCATION_CODE.CA,
    label: LOCATION_CODE_LABEL[LOCATION_CODE.CA],
  });

  if (sgAccountStatus === SgAccountStatus.ACTIVE) {
    locationOptions.push({
      value: LOCATION_CODE.SG,
      label: LOCATION_CODE_LABEL[LOCATION_CODE.SG],
    });
  }
  if (!!audAccountDetails.accountNumber) {
    locationOptions.push({
      value: LOCATION_CODE.AUS,
      label: LOCATION_CODE_LABEL[LOCATION_CODE.AUS],
    });
  }

  if (!!locationWiseAccountDetails[LOCATION_CODE.UAE]?.accountNumber) {
    locationOptions.push({
      value: LOCATION_CODE.UAE,
      label: LOCATION_CODE_LABEL[LOCATION_CODE.UAE],
    });
  }

  locationOptions.push({
    value: LOCATION_CODE.ROW,
    label: LOCATION_CODE_LABEL[LOCATION_CODE.ROW],
  });

  const copyLinkToClipboard = () => {
    navigator?.clipboard
      ?.writeText(link)
      .then(() => {
        addToast({
          type: TOAST_TYPES.SUCCESS,
          id: "success_copied",
          body: Locale.copied,
          time: 2000,
        });
      })
      .catch((err) => {
        console.log("error copying bank details", err);
      });
    analytics?.trackAsync(Events.INTERNATIONAL_ACCOUNTS_SHARE_COPY_LINK_CLICK, { ...eventProps });
  };

  const sendEmail = async (req: SendEmailRequest) => {
    const provider = getAccountProvider(LOCATION_CURRENCY_MAP[shareAccountLocation]);
    await beCall({
      path: BE_ROUTES.SEND_INTERNATIONAL_ACCOUNTS_EMAIL,
      method: ALLOWED_METHODS.POST,
      body: {
        ...req,
        location: shareAccountLocation,
        clientName: shareAccountClientName || "",
        accountProvider: provider,
        bankUsageType: shareBankAccountUsageType,
      },
    });
  };

  return (
    <div className={"w-full mt-4 flex flex-col h-full gap-6"}>
      <Tabs
        options={options}
        selected={selectedOption}
        setSelected={setSelectedOption}
        containerClass={"!flex-row-reverse"}
      />
      {shareType === ACCOUNTS_SHARE_TYPE.COPY ? (
        <ShareDetailsAccountCard location={shareAccountLocation} />
      ) : (
        <>
          <div className={"flex flex-row gap-6"}>
            {shareType === ACCOUNTS_SHARE_TYPE.EMAIL ? (
              <TextInput
                label={Locale.clientName}
                size={INPUT_TYPES.SMALL}
                value={shareAccountClientName}
                onChange={(val) => {
                  setShareAccountClientName(val);
                }}
              />
            ) : null}
            <LocationInput
              onSelect={(value: string) => {
                setShareAccountLocation(value);
                analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.LOCATION_SELECT, { location: value, ...eventProps });
              }}
              value={shareAccountLocation}
              options={locationOptions}
              disableLocationDropDown={true}
            />
          </div>
          {shareType === ACCOUNTS_SHARE_TYPE.LINK ? (
            <div className={"flex flex-col gap-6"}>
              <div
                className={"rounded-10px border border-black-400 overflow-hidden flex flex-row justify-between gap-3"}
              >
                <Typography
                  text={link}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"pl-4 py-3.5 truncate"}
                />
                <Typography
                  text={Locale.copyLinkText}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  onTextClick={copyLinkToClipboard}
                  textClasses={"pr-4 py-3.5 cursor-pointer !text-blue-400 shrink-0"}
                />
              </div>
              <Button
                title={Locale.previewFullPageText}
                type={BUTTON_TYPES.SECONDARY}
                size={BUTTON_SIZES.SMALL}
                onButtonClick={() => {
                  analytics?.trackAsync(Events.INTERNATIONAL_ACCOUNTS_SHARE_PREVIEW_CLICK, { ...eventProps });
                  window.open(link, "_blank", "noopener noreferrer");
                }}
              />
            </div>
          ) : (
            <EmailForm
              onClose={() => {}}
              isDataFetched={true}
              onSendEmail={sendEmail}
              containerClass={"!px-0"}
              accordionClass={"!bg-white !px-0 border-t border-black-400"}
              hideHeader={true}
              onTestEmailSectionClickEvent={() => {
                analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.TEST_EMAIL_SECTION_CLICK, { ...eventProps });
              }}
              onTestToFocusEvent={() => {
                analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.TEST_TO_FOCUS, { ...eventProps });
              }}
              onTestSendClickEvent={() => {
                analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.TEST_SEND_CLICK, { ...eventProps });
              }}
              onToFocusEvent={() => {
                analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.TO_FOCUS, { ...eventProps });
              }}
              onCcFocusEvent={() => {
                analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.CC_FOCUS, { ...eventProps });
              }}
              onBccFocusEvent={() => {
                analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.BCC_FOCUS, { ...eventProps });
              }}
              onSendClickEvent={() => {
                analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.SEND_CLICK, { ...eventProps });
                if (shareBankAccountUsageType === BankUsageType.BALANCE) {
                  void analytics.trackAsync(Events.BALANCE_FLOW.ACCOUNT_DETAILS_SHARED_EMAIL, {
                    user_id: userId,
                  });
                }
              }}
              onSendEmailFailedEvent={(error) => {
                analytics.trackAsync(Events.INTERNATIONAL_ACCOUNTS.SHARE_VIA_EMAIL_FAILED, {
                  ...eventProps,
                  error: error.message,
                });
              }}
            />
          )}
        </>
      )}
    </div>
  );
};

export default ShareDetailsPopupLeftContent;
