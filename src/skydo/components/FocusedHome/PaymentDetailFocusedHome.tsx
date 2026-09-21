import {
  BadgeSizes,
  BadgeTypes,
  BUTTON_SIZES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import {
  ExporterUseCase,
  FocusedHomeComponent,
  FocusedHomeCompState,
  PaymentMethod,
} from "../../constants/focusedHomeConstants";
import useFocusedHomeStore from "../../store/useFocusedHomeStore";
import FE_ROUTES from "../../util/feRoutes";
import { getCompState } from "../../util/focusedHomeUtl";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import SelectDropdown from "../AtomicComponents/Dropdown/SelectDropdown";
import Typography from "../AtomicComponents/Typography";
import AmazonIcon from "../Icons/AmazonIcon";
import BankIconWIthEllipse from "../Icons/BankIconWIthEllipse";
import USFlagIcon from "../Icons/CountryFlags/USFlagIcon";
import CreditCardIconWithEllipse from "../Icons/CreditCardIconWithEllipse";
import DeelIcon from "../Icons/DeelIcon";
import MoneyTransferIcon from "../Icons/FocusedHome/MoneyTransferIcon";
import UpworkIcon from "../Icons/UpworkIcon";
import FocusedHomeWrapper from "./FocusedHomeWrapper";
import { useRouter } from "next/router";
import {
  CURRENCY_DETAILS_MAP,
  CURRENCY_VS_LOCATION_MAP,
  LOCATION_CODE,
  LOCATION_CURRENCY_MAP,
  LOCATIONS_DETAILS_MAP,
  OTHER_IMPORTER_LOCATION,
  POPULAR_IMPORTER_LOCATION,
} from "../../constants/dashboardConstants";
import CurrencyTextIcon from "../Icons/CurrencyTextIcon";
import { Option } from "../../types/atomicComponentTypes";
import ImporterLocationVsIconComp from "../Common/ImporterLocationVsIconComp";
import { useContext, useEffect } from "react";
import useAnalytics from "../../analytics/useAnalytics";
import AppContext from "../../context/AppContext";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import { Events } from "../../analytics/EventConstants";
import Badge from "../AtomicComponents/Badge";
import InstaLinksFocusedHomeIcon from "../Icons/FocusedHome/InstaLinksFocusedHomeIcon";
import LinkIcon from "../Icons/LinkIcon";
import VerticalLineIcon from "../Icons/VerticalLineIcon";

const InstaLinksFinalStep = () => {
  const router = useRouter();
  const analytics = useAnalytics();
  const { theme } = useContext(AppContext);

  useEffect(() => {
    analytics.trackAsync(Events.FOCUSED_HOME.RECEIVE_INSTALINKS_FINAL_STEP_SHOWN, {
      project: "fhv2",
      subpage: "fh_receive_first_payment",
    });
  }, []);

  return (
    <div className={"flex flex-col gap-8 w-full"}>
      <div className={"flex flex-col gap-2"}>
        <Typography
          text={"Step 2"}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 !font-semibold"}
        />
        <Typography
          text={Locale.focusedHome.paymentDetail.notStartedTitle3}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.LARGE}
          textClasses={"!font-bold"}
        />
      </div>
      <div
        className={
          "h-[368px] flex items-center justify-center bg-[url('/account-details-bg.webp')] bg-cover bg-center bg-no-repeat"
        }
      >
        <div className={"w-[500px] p-6 bg-white shadow-elevation1 rounded-10px flex flex-col gap-6"}>
          <div className="flex flex-row">
            <div className="w-11 h-11 rounded-full bg-primary-50 flex items-center justify-center mr-4">
              <LinkIcon height={24} width={24} />
            </div>
            <div className={"flex flex-col gap-0.5"}>
              <Typography
                text={Locale.focusedHome.paymentDetail.instaLinksDesc}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses={"!font-bold"}
              />
              <div className="flex flex-row gap-1 items-center">
                <Typography
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  text={"Collect payments seamlessly through payment links"}
                  textClasses={"!text-black-500"}
                />
              </div>
            </div>
          </div>
          <div className={"flex flex-row items-center gap-6"}>
            <div className="flex flex-col">
              <Typography
                text={"Supported payment method"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-neutral-500"}
              />
              <Typography
                text={"Net banking"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"bold"}
                textClasses={"!text-neutral-700"}
              />
            </div>
            <VerticalLineIcon height={30} width={3} stroke={theme.hexColors.black[400]} />
            <div className="flex flex-col">
              <Typography
                text={"Settlement timeline"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-neutral-500"}
              />
              <Typography
                text={"6 business days"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"bold"}
                textClasses={"!text-neutral-700"}
              />
            </div>
            <VerticalLineIcon height={30} width={3} stroke={theme.hexColors.black[400]} />
            <div className="flex flex-col">
              <Typography
                text={"Supported country"}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-neutral-500"}
              />
              <div className="flex flex-row items-center gap-2">
                <Typography
                  text={"USA"}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={"bold"}
                  textClasses={"!text-neutral-700"}
                ></Typography>
                <USFlagIcon isFx={true} width={20} height={20} />
              </div>
            </div>
          </div>
          <Button
            title={Locale.createInstaLinks}
            size={BUTTON_SIZES.SMALL}
            buttonClass={"!w-full"}
            onButtonClick={() => {
              analytics.trackAsync(Events.FOCUSED_HOME.RECEIVE_INSTALINKS_CREATE_LINK_CLICKED, {
                project: "fhv2",
                subpage: "fh_receive_first_payment",
              });
              router.push(FE_ROUTES.PAYMENT_LINKS);
            }}
          />
        </div>
      </div>
      <div className={"flex flex-row items-center gap-6"}>
        <Typography
          text={Locale.pricing}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!font-bold"}
        />
        <div className={"flex flex-row items-center gap-1.5"}>
          <Typography
            text={Locale.focusedHome.paymentDetail.netBankingFees}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!font-semibold"}
          />
          <Typography
            text={Locale.minimumNineUSD}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
      </div>
    </div>
  );
};

const PaymentDetailFocusedHome = ({
  isSelected,
  compState,
  selectedLocation,
  selectedCurrency,
  setSelectedLocation,
  setSelectedCurrency,
}: {
  isSelected: boolean;
  compState: FocusedHomeCompState;
  selectedLocation: string;
  selectedCurrency: string;
  setSelectedLocation: (location: string) => void;
  setSelectedCurrency: (currency: string) => void;
}) => {
  const { paymentMethod, focusedHomeStates, exporterUseCase } = useFocusedHomeStore();
  const { isAedAccountOperationsSuspended } = useInternationalAccountsStore();
  const router = useRouter();
  const analytics = useAnalytics();
  const groupHeaderOption = (label: string, value: string): Option => ({
    label,
    value,
    isDisabled: true,
    customRow: () => (
      <div key={value} className={"px-4 pt-3 pb-2 border-b border-black-300"}>
        <Typography
          text={label}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-500"}
        />
      </div>
    ),
  });

  const locationRowOption = (location: string) => ({
    label: LOCATIONS_DETAILS_MAP[location].header,
    value: location,
    customRow: (
      option: Option,
      index: number,
      onOptionClick: (val: string, isDisabled?: boolean, event?: any) => void
    ) => {
      const isUae = !isAedAccountOperationsSuspended && location === LOCATION_CODE.UAE;
      return (
        <div
          key={location}
          className={"px-4 py-3 flex flex-row gap-2.5 hover:bg-blue-50 cursor-pointer items-center justify-between"}
          onClick={() => {
            onOptionClick(location);
          }}
        >
          <div className={"flex flex-row gap-2.5 items-center"}>
            <ImporterLocationVsIconComp location={location} height={24} width={24} />
            <Typography
              text={LOCATIONS_DETAILS_MAP[location].header}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={selectedLocation === location ? "!text-blue-300" : ""}
            />
          </div>
          {isUae && <Badge type={BadgeTypes.Full} size={BadgeSizes.Small} title={Locale.newNormal} />}
        </div>
      );
    },
  });

  const currencyRowOption = (currency: string) => ({
    label: CURRENCY_DETAILS_MAP[currency].header,
    value: currency,
    customRow: (
      option: Option,
      index: number,
      onOptionClick: (val: string, isDisabled?: boolean, event?: any) => void
    ) => {
      return (
        <div
          key={currency}
          className={"px-4 py-3 flex flex-row gap-2.5 hover:bg-blue-50 cursor-pointer items-center"}
          onClick={() => {
            onOptionClick(currency);
          }}
        >
          <ImporterLocationVsIconComp location={CURRENCY_VS_LOCATION_MAP[currency]} height={24} width={24} />
          <CurrencyTextIcon currency={currency} height={24} width={24} />
          <Typography
            text={CURRENCY_DETAILS_MAP[currency].header}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={selectedCurrency === currency ? "!text-blue-300" : ""}
          />
        </div>
      );
    },
  });

  const countryOptions = [
    groupHeaderOption(Locale.intAccountPage.popularCountries, "__popular_countries"),
    ...POPULAR_IMPORTER_LOCATION.map((location) => locationRowOption(location)),
    groupHeaderOption(Locale.intAccountPage.otherCountriesGroup, "__other_countries"),
    ...OTHER_IMPORTER_LOCATION.map((location) => locationRowOption(location)),
  ];

  const currencyOptions = [
    groupHeaderOption(Locale.intAccountPage.popularCurrencies, "__popular_currencies"),
    ...POPULAR_IMPORTER_LOCATION.map((location) => currencyRowOption(LOCATION_CURRENCY_MAP[location])),
    groupHeaderOption(Locale.intAccountPage.otherCurrenciesGroup, "__other_currencies"),
    ...OTHER_IMPORTER_LOCATION.map((location) => currencyRowOption(LOCATION_CURRENCY_MAP[location])),
  ];

  if (exporterUseCase === ExporterUseCase.FREELANCE_PLATFORMS) {
    return null;
  }

  const renderComponent = () => {
    const isPaymentMethodNotSet =
      getCompState(focusedHomeStates, FocusedHomeComponent.PAYMENT_METHOD) === FocusedHomeCompState.NOT_STARTED;

    const notStartedTitle = isPaymentMethodNotSet
      ? Locale.focusedHome.paymentDetail.notStartedTitle1
      : paymentMethod === PaymentMethod.BANK_TRANSFER
      ? Locale.focusedHome.paymentDetail.notStartedTitle2
      : Locale.focusedHome.paymentDetail.notStartedTitle3;

    switch (compState) {
      case FocusedHomeCompState.NOT_STARTED:
        return (
          <div className={"flex flex-row gap-6 w-full items-center"}>
            <MoneyTransferIcon />
            <div className={"flex flex-col gap-2"}>
              <Typography
                text={"Step 2"}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500 !font-semibold"}
              />
              <Typography
                text={notStartedTitle}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses={"!text-black-500 !font-bold"}
              />
            </div>
          </div>
        );
      default:
        if (paymentMethod === PaymentMethod.BANK_TRANSFER) {
          return (
            <div className={"flex flex-col gap-8 w-full"}>
              <div className={"flex flex-col gap-4"}>
                <div className={"flex flex-col gap-2"}>
                  <Typography
                    text={"Step 2"}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-black-500 !font-semibold"}
                  />
                  <Typography
                    text={Locale.focusedHome.paymentDetail.notStartedTitle2}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.LARGE}
                    textClasses={"!font-bold"}
                  />
                </div>
                <div className={"flex flex-row gap-6"}>
                  <SelectDropdown
                    onOpenDropdown={() => {
                      analytics.trackAsync(Events.FOCUSED_HOME.COUNTRY_DROPDOWN_CLICKED, {
                        project: "fhv2",
                        subpage: "fh_receive_first_payment",
                      });
                    }}
                    onSelect={(value) => {
                      analytics.trackAsync(Events.FOCUSED_HOME.COUNTRY_SELECTED, {
                        project: "fhv2",
                        subpage: "fh_receive_first_payment",
                        country: value as string,
                      });
                      setSelectedLocation(value as string);
                      setSelectedCurrency(LOCATION_CURRENCY_MAP[value as string]);
                    }}
                    selectedValue={selectedLocation}
                    options={countryOptions}
                    className={"flex-1 shrink-0"}
                    leftElement={() => {
                      return (
                        <div className={"mr-2"}>
                          <ImporterLocationVsIconComp location={selectedLocation} height={24} width={24} />
                        </div>
                      );
                    }}
                  />
                  <SelectDropdown
                    onOpenDropdown={() => {
                      analytics.trackAsync(Events.FOCUSED_HOME.CURRENCY_DROPDOWN_CLICKED, {
                        project: "fhv2",
                        subpage: "fh_receive_first_payment",
                      });
                    }}
                    onSelect={(value) => {
                      analytics.trackAsync(Events.FOCUSED_HOME.CURRENCY_SELECTED, {
                        project: "fhv2",
                        subpage: "fh_receive_first_payment",
                        currency: value as string,
                      });
                      setSelectedCurrency(value as string);
                    }}
                    selectedValue={selectedCurrency}
                    options={currencyOptions}
                    className={"flex-1 shrink-0"}
                    isValueOverridingFromParent={true}
                    leftElement={() => {
                      return (
                        <div className={"mr-2"}>
                          <CurrencyTextIcon currency={selectedCurrency} />
                        </div>
                      );
                    }}
                  />
                </div>
              </div>
              <hr className={"!text-black-400"} />
              <div className={"flex flex-row items-center gap-2"}>
                <Typography
                  text={Locale.focusedHome.paymentDetail.receiveFrom}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!font-semibold"}
                />
                <AmazonIcon height={12} width={38} />
                <DeelIcon />
                <UpworkIcon height={14} width={46} />
                <Typography
                  text={Locale.focusedHome.paymentDetail.andOther}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!font-semibold"}
                />
                <a
                  href={FE_ROUTES.PLATFORM_WITHDRAWALS}
                  rel="noopener noreferrer"
                  onClick={(e) => {
                    e.preventDefault();
                    analytics.trackAsync(Events.FOCUSED_HOME.PLATFORM_CLICKED, {
                      project: "fhv2",
                      subpage: "fh_receive_first_payment",
                    });
                    router.push(FE_ROUTES.PLATFORM_WITHDRAWALS);
                  }}
                >
                  <Typography
                    text={Locale.clickHereWithCapital}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-blue-400 !font-semibold"}
                  />
                </a>
              </div>
            </div>
          );
        } else {
          return <InstaLinksFinalStep />;
        }
    }
  };

  return <FocusedHomeWrapper isSelected={isSelected}>{renderComponent()}</FocusedHomeWrapper>;
};

export default PaymentDetailFocusedHome;
