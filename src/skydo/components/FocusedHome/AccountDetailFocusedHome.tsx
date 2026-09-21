import {
  ExporterUseCase,
  FocusedHomeComponent,
  FocusedHomeCompState,
  PaymentMethod,
} from "../../constants/focusedHomeConstants";
import useFocusedHomeStore from "../../store/useFocusedHomeStore";
import FocusedHomeWrapper from "./FocusedHomeWrapper";
import { getCompState } from "../../util/focusedHomeUtl";
import MoneyTransferIcon from "../Icons/FocusedHome/MoneyTransferIcon";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_TYPES, TYPOGRAPHY_SIZES, BUTTON_SIZES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import ShareButton from "../Icons/ShareButton";
import useInternationalAccountsStore, { ACCOUNTS_SHARE_TYPE } from "../../store/useInternationalAccountsStore";
import React, { useContext, useEffect } from "react";
import { UserDetailsContext } from "../DashboardContainer";
import {
  getLocationWiseAccountDetails,
  isAedActivationSuspendedForUser,
  isManualCheckPending,
  isNicheLocation,
  showsRegionalFee,
} from "../../util/functions";
import useExporterAndExporterUserStore from "../../store/useExporterAndExporterUserStore";
import WaitingSandLoader from "../InvoiceDetails/WaitingSandLoader";
import ImporterLocationVsIconComp from "../Common/ImporterLocationVsIconComp";
import { CURRENCY_CODE, LOCATION_CODE, LOCATION_CURRENCY_MAP } from "../../constants/dashboardConstants";
import classNames from "classnames";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import UaeAedPricingPopup from "../InternationalAccountsComp/UaeAedPricingPopup";
import { useUaeAedPricingPopup } from "../../hooks/useUaeAedPricingPopup";
import FE_ROUTES from "../../util/feRoutes";
import { useRouter } from "next/router";
import InformationIcon from "../Icons/InformationIcon";
import Notes from "../AtomicComponents/Notes";

const AccountDetailStep = ({ location, currency }: { location: string; currency: string }) => {
  const analytics = useAnalytics();
  const router = useRouter();
  const { onShareButtonClick, virtualAccounts, isBCVariantEnabled, isAedAccountOperationsSuspended } =
    useInternationalAccountsStore();
  const { exporterDetails } = useContext(UserDetailsContext);
  const { exporter } = useExporterAndExporterUserStore();
  const isManualVerification = isManualCheckPending(exporterDetails.onBoardingState);

  const isBankingCircle = isBCVariantEnabled && (location === LOCATION_CODE.UK || location === LOCATION_CODE.EUROPE);

  // Niche currencies share the SWIFT/ROW account, so resolve their details from ROW.
  const accountLocation = isNicheLocation(location) ? LOCATION_CODE.ROW : location;

  const accountDetails = getLocationWiseAccountDetails(
    virtualAccounts,
    exporterDetails.virtualAccountName,
    isBankingCircle,
    false
  )[accountLocation];
  const isActivationCard =
    (location === LOCATION_CODE.UAE || location === LOCATION_CODE.SG) && !accountDetails?.accountNumber;
  const hasUaeAccount = !!accountDetails?.accountNumber;
  const showAedUnavailableBanner =
    isAedActivationSuspendedForUser(isAedAccountOperationsSuspended, location, exporter?.isUaeActivationAllowed) &&
    !hasUaeAccount;
  const activationSubtitle = Locale.activateAccountSubtitle
    .replace("{currency}", LOCATION_CURRENCY_MAP[location])
    .replace("{country}", location === LOCATION_CODE.UAE ? "UAE" : "Singapore");

  // Niche currencies present the shared USD SWIFT account.
  const isNiche = isNicheLocation(location);
  const accountCardTitle =
    location === LOCATION_CODE.ROW
      ? Locale.internationAccount
      : Locale.intAccountPage.skydoCurrencyAccount.replace(
          "{currency}",
          isNiche ? CURRENCY_CODE.USD : LOCATION_CURRENCY_MAP[location]
        );

  const pd = Locale.focusedHome.paymentDetail;
  const hasRegionalFee = showsRegionalFee(currency, location);
  const slabFeeText = (baseFee: string) => (hasRegionalFee ? `${baseFee}${pd.regionalFeeSuffix}` : baseFee);

  useEffect(() => {
    analytics.trackAsync(Events.FOCUSED_HOME.IA_FINAL_STEP_SHOWN, {
      project: "fhv2",
      subpage: "fh_receive_first_payment",
    });
  }, []);

  return (
    <div className={"flex flex-col gap-8 w-full"}>
      <div className={"flex flex-col gap-2"}>
        <Typography
          text={"Step 3"}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 !font-semibold"}
        />
        <Typography
          text={Locale.focusedHome.paymentDetail.shareFollowingAccountDetails}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.LARGE}
          textClasses={"!font-bold"}
        />
      </div>
      {showAedUnavailableBanner ? (
        <Notes
          text={Locale.intAccountPage.uaeAccountCreationTemporarilyDisabled}
          className={"border border-yellow-200 rounded-10px -mb-4"}
          iconWidth={20}
          iconHeight={20}
        />
      ) : null}
      <div
        className={
          "h-[368px] flex items-center justify-center bg-[url('/account-details-bg.webp')] bg-cover bg-center bg-no-repeat"
        }
      >
        <div className={"w-[450px] p-6 bg-white shadow-elevation1 rounded-10px flex flex-col gap-3"}>
          <div className={"flex flex-row items-center gap-3"}>
            <ImporterLocationVsIconComp location={accountLocation} height={40} width={40} />
            <Typography
              text={accountCardTitle}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!font-bold !text-[#0A2540]"}
            />
          </div>
          {isActivationCard ? (
            <>
              <div className={"flex flex-row items-center gap-2 mb-6"}>
                <InformationIcon width={14} height={14} />
                <Typography
                  text={activationSubtitle}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-[#0A2540]"}
                />
              </div>
              <Button
                title={location === LOCATION_CODE.UAE ? Locale.activateUaeAccount : Locale.activateSgdAccount}
                size={BUTTON_SIZES.SMALL}
                buttonClass={"!w-full !justify-center"}
                isDisabled={isAedActivationSuspendedForUser(
                  isAedAccountOperationsSuspended,
                  location,
                  exporter?.isUaeActivationAllowed
                )}
                onButtonClick={() => {
                  const currency = LOCATION_CURRENCY_MAP[location].toLowerCase();
                  router.push(
                    `${FE_ROUTES.INTERNATIONAL_ACCOUNTS}?location=${location.toLowerCase()}&currency=${currency}`
                  );
                }}
              />
              <div className={"flex flex-row items-center justify-between pt-1"}>
                <Typography
                  text={Locale.accountOpeningFee}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-[#0A2540] !font-bold"}
                >
                  <Typography
                    text={Locale.free}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-[#0A2540] !ml-1"}
                  />
                </Typography>
                <Typography
                  text={Locale.activationTime}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-[#0A2540] !font-bold"}
                >
                  <Typography
                    text={
                      location === LOCATION_CODE.UAE ? Locale.activationTimeTextImmediate : Locale.activationTimeText
                    }
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-[#0A2540] !ml-1"}
                  />
                </Typography>
              </div>
            </>
          ) : (
            <>
              <div className={"flex flex-col gap-0"}>
                <Typography
                  text={Locale.accountName}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-black-500"}
                />
                <Typography
                  text={accountDetails?.accountHolderName}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!font-bold"}
                />
              </div>
              <div className={"flex flex-row items-center gap-6"}>
                <div className={"flex flex-col gap-0 flex-1 shrink-0"}>
                  <Typography
                    text={Locale.accountNumber}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={"!text-black-500"}
                  />
                  <Typography
                    text={
                      isManualVerification || !accountDetails?.accountNumber
                        ? "XXXXXXXXXX"
                        : accountDetails?.accountNumber
                    }
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={classNames("!font-bold", {
                      "blur-sm": isManualVerification || !accountDetails?.accountNumber,
                    })}
                  />
                </div>
                <div className={"flex flex-col gap-0 flex-1 shrink-0"}>
                  <Typography
                    text={Locale.paymentMethod}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={"!text-black-500"}
                  />
                  <Typography
                    text={accountDetails?.paymentMethod}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!font-bold"}
                  />
                </div>
              </div>
              <Button
                title={Locale.focusedHome.paymentDetail.shareAccountDetailTitle}
                size={BUTTON_SIZES.SMALL}
                buttonClass={"!w-full !justify-center"}
                textWrapperClass={"!flex-none"}
                rightIcon={() => <ShareButton stroke={"white"} />}
                isDisabled={isManualVerification || (location === LOCATION_CODE.AUS && !accountDetails?.accountNumber)}
                onButtonClick={() => {
                  analytics.trackAsync(Events.FOCUSED_HOME.SHARE_ACCOUNT_DETAILS_CLICKED, {
                    project: "fhv2",
                    subpage: "fh_receive_first_payment",
                  });
                  onShareButtonClick(location, ACCOUNTS_SHARE_TYPE.COPY, true);
                }}
              />
              {isManualVerification ? (
                <div className={"flex flex-row items-center gap-2"}>
                  <WaitingSandLoader />
                  <Typography
                    text={"Account details will be available post KYC verification"}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!font-semibold !text-black-500"}
                  />
                </div>
              ) : location === LOCATION_CODE.AUS && !accountDetails?.accountNumber ? (
                <div className="flex flex-col items-center gap-1.5">
                  <Typography
                    text={Locale.activatingAudAccountBold.replace("{currency}", LOCATION_CURRENCY_MAP[location])}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500 !font-bold text-center"}
                  />
                  <Typography
                    text={Locale.activatingAudAccountNote}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500 text-center"}
                  />
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>
      <div className={"flex flex-col gap-3"}>
        <Typography
          text={Locale.pricing}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!font-bold"}
        />
        <div className={"flex flex-row items-stretch gap-4"}>
          {[
            { caption: Locale.forPaymentsLessThan2k, fee: slabFeeText(pd.lowerSlabFees) },
            { caption: Locale.forPaymentsInTheMiddle, fee: slabFeeText(pd.midSlabFees) },
            { caption: Locale.forPaymentsMoreThan10k, fee: slabFeeText(pd.upperSlabFees) },
          ].map(({ caption, fee }, index) => (
            <React.Fragment key={caption}>
              {index ? <div className={"w-[1px] bg-black-400"} /> : null}
              <div className={"flex flex-col gap-1"}>
                <Typography
                  text={caption}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-500"}
                />
                <Typography
                  text={fee}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!font-semibold"}
                />
              </div>
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

const AccountDetailFocusedHome = ({
  isSelected,
  compState,
  location,
  currency,
}: {
  isSelected: boolean;
  compState: FocusedHomeCompState;
  location: string;
  currency: string;
}) => {
  const { paymentMethod, focusedHomeStates, exporterUseCase } = useFocusedHomeStore();

  // UAE AED Pricing Popup Hook
  const { showUaeAedPricingPopup, isUaeAedPricingLoading, handleUaeAedPricingAccept, handleUaeAedPricingClose } =
    useUaeAedPricingPopup({
      selectedLocation: location,
      source: "focused_home",
    });

  const isPaymentMethodNotSet =
    getCompState(focusedHomeStates, FocusedHomeComponent.PAYMENT_METHOD) === FocusedHomeCompState.NOT_STARTED;

  if (
    isPaymentMethodNotSet ||
    paymentMethod === PaymentMethod.INSTALINKS ||
    exporterUseCase === ExporterUseCase.FREELANCE_PLATFORMS
  ) {
    return null;
  }

  const renderComponent = () => {
    switch (compState) {
      case FocusedHomeCompState.NOT_STARTED:
        return (
          <div className={"flex flex-row gap-6 w-full items-center"}>
            <MoneyTransferIcon />
            <div className={"flex flex-col gap-2"}>
              <Typography
                text={"Step 3"}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500 !font-semibold"}
              />
              <Typography
                text={Locale.focusedHome.paymentDetail.shareAccountDetails}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses={"!text-black-500 !font-bold"}
              />
            </div>
          </div>
        );
      default:
        return <AccountDetailStep location={location} currency={currency} />;
    }
  };

  return (
    <>
      <FocusedHomeWrapper isSelected={isSelected}>{renderComponent()}</FocusedHomeWrapper>

      {/* UAE AED Pricing Popup */}
      <UaeAedPricingPopup
        isOpen={showUaeAedPricingPopup}
        onClose={handleUaeAedPricingClose}
        onAcceptPricing={handleUaeAedPricingAccept}
        isLoading={isUaeAedPricingLoading}
      />
    </>
  );
};

export default AccountDetailFocusedHome;
