import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import { FromAndSubject } from "../TwoPartitionEmailPopup/PreviewEmail";
import Locale from "../../util/locale/en";
import Image from "next/image";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import SkydoFullIcon from "../Icons/SkydoFullIcon";
import {
  DEFAULT_PAYMENT_REMINDER_EMAIL,
  FixedHeaderOverEmailPreview,
} from "../PaymentsReminder/PaymentReminderEmailPreview";
import { SHARE_DETAILS_STATE } from "../../constants/publicBankAccountCardConstants";
import { FixedFooter } from "../PaymentsReminder/EmailPreviewRightSection";
import { JSX } from "@babel/types";
import classNames from "classnames";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import useExporterAndExporterUserStore from "../../store/useExporterAndExporterUserStore";
import {
  AccountProviderAndCurrencyToPaymentMethod,
  AccountProviderToBank,
  LOCATION_CODE,
  LOCATION_CODE_LABEL,
  LOCATION_CURRENCY_MAP,
  VIRTUAL_ACCOUNT_VENDOR,
} from "../../constants/dashboardConstants";
import { getCompanyName, getLocationWiseAccountDetails } from "../../util/functions";
import ImporterLocationVsIconComp from "../Common/ImporterLocationVsIconComp";
import SkydoSecIcon from "../Icons/SkydoSecIcon";
import { LocationVsAccountDetailCardFieldsMapForEmail } from "../../constants/locationVsAccountDetailCardFieldsMap";
import { UserDetailsContext } from "../DashboardContainer";
import useInternationalAccountsEventsInfo from "../../util/customHooks/useInternationalAccountsEventsInfo";
import PublicRestOfWorldRemarkBanner from "../PublicAccounts/PublicRestOfWorldRemarkBanner";

interface ShareDetailsEmailPreviewProps {
  setShareDetailsState: (state: string) => void;
  isConfirming?: boolean;
  logo: string;
  renderCTAs?: () => JSX.Element;
}

const ShareDetailsEmailPreview = ({
  setShareDetailsState,
  isConfirming,
  logo,
  renderCTAs,
}: ShareDetailsEmailPreviewProps) => {
  const { theme } = useContext(AppContext);
  const analytics = useAnalytics();
  const {
    shareAccountClientName,
    shareAccountLocation,
    virtualAccounts,
    businessName,
    isBCVariantEnabled,
    getAccountProvider,
    shareBankAccountUsageType,
  } = useInternationalAccountsStore();
  const skydoBalanceVendor = useExporterAndExporterUserStore((s) => s.exporter?.skydoBalanceVendor);
  const accountProvider = getAccountProvider(LOCATION_CURRENCY_MAP[shareAccountLocation]);
  const isBankingCircle = accountProvider === VIRTUAL_ACCOUNT_VENDOR.BANKING_CIRCLE;
  const allAccountDetailsForCountry = getLocationWiseAccountDetails(virtualAccounts, businessName, isBankingCircle, false, skydoBalanceVendor)[
    shareAccountLocation
  ];
  const accountDetails =
    allAccountDetailsForCountry?.accountsByUsageType?.[shareBankAccountUsageType] ?? allAccountDetailsForCountry;
  const fields = LocationVsAccountDetailCardFieldsMapForEmail[shareAccountLocation];
  const { exporterDetails } = useContext(UserDetailsContext);
  const companyName = getCompanyName({ ...exporterDetails, defaultVal: businessName });
  const eventProps = useInternationalAccountsEventsInfo();

  return (
    <>
      <div className={"relative overflow-auto"}>
        <div className={"mr-6 rounded-t-10px overflow-hidden"}>
          {isConfirming ? (
            <div className={"flex justify-center"}>
              <Typography
                text={Locale.previewLogoTextEmailBeforeConfirm}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"py-3 bg-blue-50 w-full text-center"}
              />
            </div>
          ) : (
            <FixedHeaderOverEmailPreview
              logo={logo}
              onEditLogoClick={() => {
                setShareDetailsState(SHARE_DETAILS_STATE.UPLOAD_PAGE);
              }}
            />
          )}
        </div>
        <div className={`flex flex-col rounded-b-10px mr-6 items-center bg-black-400 max-h-[450px] overflow-auto`}>
          <div
            className={classNames(`flex flex-col px-6 bg-white rounded-b-10px max-w-[400px] pb-8`, {
              "!pb-20": !logo,
            })}
          >
            <div className={"my-2"}>
              <FromAndSubject header={Locale.from} body={DEFAULT_PAYMENT_REMINDER_EMAIL} />
            </div>
            <hr className={"border-black-400"} />

            <div className={"my-2"}>
              <FromAndSubject header={Locale.subject} body={Locale.newAccountDetailsForPayment} />
            </div>
            <hr className={"border-black-400"} />

            {logo && logo.length > 0 && (
              <div className={"relative min-h-[48px] mt-6"}>
                <Image src={logo} alt={`logo`} layout={"fill"} objectFit={"contain"} objectPosition={"left"} />
              </div>
            )}

            <div className={"mt-6"}>
              <Typography
                text={Locale.newAccountDetailsForPayment}
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.X_SMALL}
              />
              <div className={"mt-6"}>
                <Typography
                  text={Locale.dearImporterWithoutTeam.replace(":importerName", shareAccountClientName)}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                />
              </div>
              <div className={"mt-2 mb-8"}>
                <Typography
                  text={(shareAccountLocation === LOCATION_CODE.ROW
                    ? Locale.internationalAccountEmail.bodySwift
                    : Locale.internationalAccountEmail.body
                  )
                    .replace("{{Country}}", LOCATION_CODE_LABEL[shareAccountLocation])
                    .replace(
                      "{{Method}}",
                      AccountProviderAndCurrencyToPaymentMethod[
                        accountDetails?.accountProvider || VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD
                      ][LOCATION_CURRENCY_MAP[shareAccountLocation]] || ""
                    )
                    .replace(
                      "{{Bank}}",
                      AccountProviderToBank[accountDetails?.accountProvider || VIRTUAL_ACCOUNT_VENDOR.CURRENCY_CLOUD] ||
                        ""
                    )}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                />
              </div>

              <div
                className={classNames(
                  "p-6 w-full bg-navyblue-500 flex flex-col gap-4",
                  shareAccountLocation === LOCATION_CODE.ROW ? "rounded-t-10px rounded-b-none" : "rounded-10px"
                )}
              >
                <div className={"flex flex-row items-center justify-between"}>
                  <ImporterLocationVsIconComp location={shareAccountLocation} width={24} height={24} />
                  <SkydoSecIcon />
                </div>
                <Typography
                  text={Locale.internationalAccountEmail.accountDetailHeader
                    .replace("{{CompanyName}}", companyName)
                    .replace(
                      "{{Location}}",
                      shareAccountLocation === LOCATION_CODE.ROW
                        ? Locale.swift
                        : LOCATION_CURRENCY_MAP[shareAccountLocation]
                    )}
                  size={TYPOGRAPHY_SIZES.LARGE}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  textClasses={"!text-white"}
                  fontWeight={"bold"}
                />
                <div className={"flex flex-col"}>
                  {fields.map(({ title, valueKey }, index) => (
                    <Typography
                      text={`${title}: `}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={"!text-blue-200"}
                      key={`vaDetailsEmail${index}`}
                    >
                      <Typography
                        text={accountDetails ? accountDetails[valueKey] : ""}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.SMALL}
                        textClasses={"!text-white"}
                      />
                    </Typography>
                  ))}
                </div>
              </div>
              {shareAccountLocation === LOCATION_CODE.ROW ? (
                <PublicRestOfWorldRemarkBanner className="w-full" variant="shareEmailPreview" squareTop />
              ) : null}
              <div className={"mt-6"}>
                <Typography
                  text={Locale.internationalAccountEmail.footerPart1a}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                >
                  <Typography
                    text={Locale.skydo}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    fontWeight={"bold"}
                  />
                  <Typography
                    text={Locale.internationalAccountEmail.footerPart1b}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                  />
                </Typography>
              </div>
              <div className={"mt-5"}>
                <Typography
                  text={Locale.internationalAccountEmail.footerPart2}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                />
              </div>

              <div className={"mt-6 flex flex-col"}>
                <Typography text={Locale.bestRegards} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
                <Typography text={businessName} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
              </div>

              <hr className={"border-black-400 mt-6 mb-4"} />
              <div className={"flex flex-row items-center"}>
                <Typography
                  text={Locale.poweredBySkydo}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                  fontColor={theme.hexColors.black[500]}
                />
                <div className={"ml-1"}>
                  <SkydoFullIcon isSmall={true} />
                </div>
              </div>
              <div className={"-mt-1 "}>
                <Typography
                  text={Locale.exporterUserSkydoTo.replaceAll(":exporter", businessName)}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_X_SMALL}
                  fontColor={theme.hexColors.black[500]}
                  textClasses={"!leading-3"}
                />
              </div>
            </div>
          </div>
        </div>
        {!logo && (
          <div className={"absolute top-[424px]"}>
            <FixedFooter
              addLogo={() => {
                setShareDetailsState(SHARE_DETAILS_STATE.UPLOAD_PAGE);
                analytics?.trackAsync(Events.LOGO_UPLOAD_CLICK, {
                  location: "international_accounts_share",
                  ...eventProps,
                });
              }}
            />
          </div>
        )}
      </div>
      {renderCTAs ? renderCTAs() : null}
    </>
  );
};

export default ShareDetailsEmailPreview;
