import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import {
  BankUsageType,
  LOCATION_CODE,
  LOCATION_CURRENCY_MAP,
  PAYMENT_METHOD,
  paymentMethodDetails,
  USD_PAYMENT_METHODS,
} from "../../constants/dashboardConstants";
import { getLocationWiseAccountDetails } from "../../util/functions";
import { useContext, useState } from "react";
import { UserDetailsContext } from "../DashboardContainer";
import {
  getAccountDetailHeaderByLocation,
  LocationVsAccountDetailCardFieldsMapForSimpleCard,
} from "../../constants/locationVsAccountDetailCardFieldsMap";
import Button from "../AtomicComponents/Button";
import Locale from "../../util/locale/en";
import useToastMessages from "../../store/toastMessages";
import { TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import SkydoIcon from "../Icons/SkydoIcon";
import Typography from "../AtomicComponents/Typography";
import ImporterLocationVsIconComp from "../Common/ImporterLocationVsIconComp";
import DropdownArrow from "../Common/DropdownArrow";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import useExporterAndExporterUserStore from "../../store/useExporterAndExporterUserStore";

const ShareDetailsAccountCard = ({ location }: { location: string }) => {
  const { virtualAccounts, isBCVariantEnabled, shareBankAccountUsageType } = useInternationalAccountsStore();
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHOD.ACH);
  const { addToast } = useToastMessages();
  const [showDropDown, setShowDropDown] = useState(false);
  const analytics = useAnalytics();
  const userId = useExporterAndExporterUserStore((s) => s.exporterUser?.userId);
  const skydoBalanceVendor = useExporterAndExporterUserStore((s) => s.exporter?.skydoBalanceVendor);

  const { exporterDetails } = useContext(UserDetailsContext);

  const isBankingCircle = isBCVariantEnabled && (location === LOCATION_CODE.UK || location === LOCATION_CODE.EUROPE);

  const completeAccountDetails = getLocationWiseAccountDetails(
    virtualAccounts,
    exporterDetails.virtualAccountName,
    isBankingCircle,
    false,
    skydoBalanceVendor
  )[location];

  const accountDetails =
    completeAccountDetails?.accountsByUsageType?.[shareBankAccountUsageType] ?? completeAccountDetails;

  const { fields: allFields } = LocationVsAccountDetailCardFieldsMapForSimpleCard[location];

  let fields = allFields;

  if (location === LOCATION_CODE.USA) {
    if (paymentMethod === PAYMENT_METHOD.ACH) {
      fields = fields.filter((v) => v.valueKey !== "fedWireRoutingNumberUS");
    } else if (paymentMethod === PAYMENT_METHOD.FEDWIRE) {
      fields = fields.filter((v) => v.valueKey !== "routingNumber");
    }
  }

  let routingNumber = "";

  if (location === LOCATION_CODE.USA && paymentMethod === PAYMENT_METHOD.FEDWIRE) {
    routingNumber = accountDetails?.fedWireRoutingNumberUS;
  } else {
    routingNumber = accountDetails?.routingNumber;
  }

  const details = accountDetails || {};
  const isRow = location === LOCATION_CODE.ROW;
  const rowTransferRemark = isRow
    ? Locale.intAccountPage.rowSwiftTransferClipboardRemarkSuffix
    : "";
  const accountDetailsFormattedText =
    `${Locale.accountName}: ${details.accountHolderName}\n` +
    `${Locale.paymentMethod}: ${
      location === LOCATION_CODE.USA ? paymentMethodDetails[paymentMethod].header : details.paymentMethod
    }\n` +
    fields
      .filter((field) => !["accountType", "accountHolderName", "paymentMethod"].includes(field.valueKey))
      .map((field) => `${field.title}: ${details[field.valueKey]}`)
      .join("\n") +
    "\n" +
    (isRow ? "" : `${Locale.accountCurrency}: ${LOCATION_CURRENCY_MAP[location]}`) +
    rowTransferRemark;

  const onCopyAccountDetailsClick = () => {
    analytics.trackAsync(Events.FOCUSED_HOME.COPY_ACCOUNT_DETAILS_CLICKED, {
      project: "fhv2",
      subpage: "fh_intent",
    });
    navigator?.clipboard
      ?.writeText(accountDetailsFormattedText)
      .then(() => {
        if (shareBankAccountUsageType === BankUsageType.BALANCE) {
          void analytics.trackAsync(Events.BALANCE_FLOW.ACCOUNT_DETAILS_COPIED, {
            user_id: userId,
          });
        }
        addToast({
          type: TOAST_TYPES.SUCCESS,
          id: "success_copied",
          body: "Copied successfully!",
          time: 2000,
          customClass: "md:bottom-10 bottom-40 !p-4 !items-center",
        });
      })
      .catch((err) => {
        console.log("error copying bank details", err);
      });
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <div className={"p-6 rounded-10px border border-black-400 relative overflow-hidden flex flex-col gap-6"}>
        <SkydoIcon
          height={256}
          width={256}
          primaryColor={"#CFD7DF"}
          secondaryColor={"#CFD7DF"}
          className={"absolute -right-[90px] -top-[130px] opacity-[0.1]"}
        />
        <div className={"flex flex-row items-center gap-3"}>
          <ImporterLocationVsIconComp location={location} height={52} width={52} />
          <Typography
            text={
              location === LOCATION_CODE.ROW
                ? Locale.internationAccount
                : Locale.intAccountPage.skydoCurrencyAccount.replace("{currency}", LOCATION_CURRENCY_MAP[location])
            }
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!font-bold"}
          />
        </div>
        <div className={"flex flex-col gap-3"}>
          <div className={"flex flex-row items-start gap-3"}>
            <div className={"flex flex-col flex-1 shrink-0"}>
              <Typography
                text={Locale.paymentMethod}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500"}
              />
              {location === LOCATION_CODE.USA ? (
                <div
                  className={"relative flex flex-row items-center gap-1 cursor-pointer"}
                  onClick={() => setShowDropDown(!showDropDown)}
                >
                  <Typography
                    text={paymentMethod === PAYMENT_METHOD.ACH ? Locale.ach : Locale.fedWire}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!font-bold !text-blue-400"}
                  />
                  <DropdownArrow isOpen={showDropDown} width={16} height={16} stroke={"#276EF1"} />
                  {showDropDown ? (
                    <div
                      className={
                        "rounded-10px overflow-hidden shadow-elevation1 absolute flex flex-col w-[200px] left-0 top-[32px]"
                      }
                    >
                      {USD_PAYMENT_METHODS.map((method, index) => (
                        <div
                          key={index}
                          className={"px-4 py-3 bg-white w-full flex flex-col hover:bg-blue-50 cursor-pointer"}
                          onClick={() => {
                            setPaymentMethod(method);
                            setShowDropDown(false);
                          }}
                        >
                          <Typography
                            text={paymentMethodDetails[method].label}
                            type={TYPOGRAPHY_TYPES.PARA}
                            size={TYPOGRAPHY_SIZES.MEDIUM}
                            textClasses={"!font-bold"}
                          />
                          <Typography
                            text={paymentMethodDetails[method].subtext}
                            type={TYPOGRAPHY_TYPES.PARA}
                            size={TYPOGRAPHY_SIZES.X_SMALL}
                            textClasses={"!text-black-600"}
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ) : (
                <Typography
                  text={details.paymentMethod}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!font-bold"}
                />
              )}
            </div>
            <div className={"flex flex-col flex-1 shrink-0"}>
              <Typography
                text={Locale.accountHolderName}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500"}
              />
              <Typography
                text={accountDetails?.accountHolderName}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-bold break-all"}
              />
            </div>
          </div>
          <div className={"flex flex-row items-start gap-3"}>
            <div className={"flex flex-col flex-1 shrink-0"}>
              <Typography
                text={Locale.accountNumber}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500"}
              />
              <Typography
                text={accountDetails?.accountNumber}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-bold break-all"}
              />
            </div>
            <div className={"flex flex-col flex-1 shrink-0"}>
              <Typography
                text={getAccountDetailHeaderByLocation(location, paymentMethod).routingCode}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500"}
              />
              <Typography
                text={routingNumber}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-bold"}
              />
            </div>
          </div>
          <div className={"flex flex-col"}>
            <Typography
              text={Locale.bankName}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={accountDetails?.bankName}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!font-bold"}
            />
          </div>
          <div className={"flex flex-col"}>
            <Typography
              text={Locale.beneAddress}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-500"}
            />
            <Typography
              text={accountDetails?.bankAddress}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!font-bold"}
            />
          </div>
        </div>
      </div>
      <Button title={Locale.copyAccountDetails} buttonClass={"!w-full"} onButtonClick={onCopyAccountDetailsClick} />
    </div>
  );
};

export default ShareDetailsAccountCard;
