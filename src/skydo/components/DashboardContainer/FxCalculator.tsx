import React, { ChangeEvent, useContext, useEffect, useState, forwardRef, useImperativeHandle } from "react";
import Typography, { getTypeMapClassnames } from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import DropdownArrow from "../Common/DropdownArrow";
import FullTick from "../Icons/FullTick";
import AppContext from "../../context/AppContext";
import TextInput from "../AtomicComponents/TextInput";
import UserStateIcon from "../Common/UserStateIcon";
import CrossIconFX from "../Icons/CrossIconFX";
import { flattenArray, isRegionalFeeCurrency, roundTo } from "../../util/functions";
import {
  GST_PERCENT,
  SKYDO_CUTOFF_SLAB,
  SKYDO_FEE_OVER_SLAB,
  SKYDO_FEE_UNDER_SLAB,
  SKYDO_HIGH_VALUE_PERCENTAGE,
  SKYDO_HIGH_VALUE_THRESHOLD,
} from "../../constants/hardCodedValues";
import EqualIcon from "../Icons/EqualIcon";
import SubtractIcon from "../Icons/SubtractIcon";
import classnames from "classnames";
import classNames from "classnames";
import { formatINDNumber, formatINRNumber } from "../../util/formatters";
import useAnalytics, { Analytics } from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { ResponseWrapper } from "../../authentication/api/AuthApiDto";
import {
  CALCULATOR_ALLOWED_CURRENCIES,
  CURRENCY_VS_LOCATION_MAP,
  LOCATION_CODE,
  LOCATION_CURRENCY_DETAILS_MAP,
  LOCATION_CURRENCY_MAP,
} from "../../constants/dashboardConstants";
import { FXRateResponse } from "../../types";
import Tooltip from "../AtomicComponents/Tooltip";
import InfoIcon from "../Icons/InfoIcon";
import CurrencyToINRRateTooltip from "../Common/CurrencyToINRRateTooltip";
import AEDTransactionFeeTooltip from "../Common/AEDTransactionFeeTooltip";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS, SERVICES } from "../../constants/apiConstants";
import CurrencySelector from "../Common/CurrencySelector";
import TagIcon from "../Icons/TagIcon";
import useInternationalAccountsEventsInfo from "../../util/customHooks/useInternationalAccountsEventsInfo";

type CProps = {
  isEditable: boolean;
  onChange?: (val: any, event: ChangeEvent<HTMLInputElement>) => void;
  inputVal: string;
  showFooter?: boolean;
  error?: string;
  inputCurrency: string;
  setSelectedCurrency?: (val: string) => void;
};

const USA_CURRENCY_PAIR_LIST = [
  {
    base: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
    target: LOCATION_CURRENCY_MAP[LOCATION_CODE.IND],
  },
];

const currencyMap = (inputCurrency: string) => [
  {
    base: inputCurrency,
    target: LOCATION_CURRENCY_MAP[LOCATION_CODE.IND],
  },
  {
    base: inputCurrency,
    target: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
  },
];

const getFXCurrencyPairList = () => [
  ...flattenArray(
    CALCULATOR_ALLOWED_CURRENCIES.filter(
      (currency: string) => currency !== LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]
    ).map((currency: string) => currencyMap(currency))
  ),
  {
    base: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
    target: LOCATION_CURRENCY_MAP[LOCATION_CODE.IND],
  },
];

type FXRates = {
  usdToInr: number;
  baseToInr: number;
  baseToUsd: number;
  usdToInrTimestamp: string;
};

const MIN_DOLLAR_AMOUNT = 22.42;
const MAX_AMOUNT = 1000000;
const REGIONAL_FEE_PERCENTAGE = 0.01; // 1% Regional Currency Fee, charged on UAE + niche currencies

const getRequiredFxRates = (fxRatesList: FXRateResponse[], inputCurrency: string): FXRates => {
  const fxRates: FXRates = {
    usdToInr: 0,
    baseToInr: 0,
    baseToUsd: 0,
    usdToInrTimestamp: new Date().toDateString(),
  };
  fxRatesList.forEach((fxRate: FXRateResponse) => {
    if (
      fxRate.base === LOCATION_CURRENCY_MAP[LOCATION_CODE.USA] &&
      fxRate.target === LOCATION_CURRENCY_MAP[LOCATION_CODE.IND]
    ) {
      fxRates.usdToInr = roundTo(fxRate.fx_rate || 0, 4);
      fxRates.usdToInrTimestamp = fxRate.api_timestamp;
    }
    if (fxRate.base === inputCurrency && fxRate.target === LOCATION_CURRENCY_MAP[LOCATION_CODE.IND]) {
      fxRates.baseToInr = roundTo(fxRate.fx_rate || 0, 4);
    }
    if (fxRate.base === inputCurrency && fxRate.target === LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]) {
      fxRates.baseToUsd = roundTo(fxRate.fx_rate || 0, 4);
    }
  });
  return fxRates;
};

const CurrencyInputs = ({
  isEditable,
  onChange,
  inputVal,
  showFooter,
  error,
  inputCurrency,
  setSelectedCurrency,
}: CProps) => {
  const isCurrencyDropdownDisabled = !isEditable;

  const onCurrencySelect = (value: string) => {
    setSelectedCurrency && setSelectedCurrency(value);
  };

  return (
    <div>
      <div className={" flex flex-row items-center "}>
        <div
          className={classnames("rounded-l-10px border border-r-0 border-black-400 min-w-[320px]", {
            "bg-black-50": !isEditable,
            "!border-red-400": isEditable && error,
          })}
        >
          <TextInput
            label={isEditable ? Locale.fxInvoiceAmount : Locale.fxget}
            isDisabled={!isEditable}
            labelTextClass={"!text-black-500"}
            inputWrapperClass={"!border-0 !px-0 !h-8"}
            inputClass={classNames(
              "!ml-3 my-2",
              getTypeMapClassnames(TYPOGRAPHY_TYPES.HEADING, TYPOGRAPHY_SIZES.SMALL)
            )}
            customClass={"!py-0"}
            labelWrapperClass={"!mb-0"}
            onChange={onChange}
            value={inputVal}
          />
        </div>
        <CurrencySelector
          inputCurrency={inputCurrency}
          onCurrencySelect={onCurrencySelect}
          isCurrencyDropdownDisabled={isCurrencyDropdownDisabled}
        />
      </div>
      {showFooter ? (
        <div className={"mt-4 max-w-[400px]"}>
          <Typography text={Locale.fxRateVar} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500"} />
        </div>
      ) : null}
    </div>
  );
};

const Calculator = ({
  setFxRatesList,
  inputCurrency,
  isHorizontalView,
  currencyParList,
  fxRatesList,
}: {
  setFxRatesList: (fxRates: FXRateResponse[]) => void;
  inputCurrency: string;
  currencyParList: any;
  isHorizontalView: boolean;
  fxRatesList: FXRateResponse[];
}) => {
  const { theme } = useContext(AppContext);
  const eventProps = useInternationalAccountsEventsInfo();
  useAnalytics((analytics: Analytics) => {
    analytics.trackAsync(Events.FX_CALCULATOR_OPENED, {
      ...eventProps,
    });
  });
  const [inputVal, setVal] = useState<string>(
    LOCATION_CURRENCY_DETAILS_MAP[CURRENCY_VS_LOCATION_MAP[inputCurrency] as keyof typeof LOCATION_CURRENCY_DETAILS_MAP]
      .defaultValue
  );
  const [currFxRates, setFxRates] = useState<FXRates>(getRequiredFxRates(fxRatesList || [], inputCurrency));
  const [error, setError] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState<string>(inputCurrency);

  const onFetchfxError = () => {};

  const onChangeCurrencyClick = (val: string) => {
    setSelectedCurrency(val);
    const updatedFxRates: FXRates = getRequiredFxRates(fxRatesList || [], val);
    setFxRates(updatedFxRates);
  };

  const onFxSuccess = (response: ResponseWrapper<FXRateResponse[]>) => {
    setFxRatesList(response?.data || []);
  };

  useEffect(() => {
    const requiredFxRates: FXRates = getRequiredFxRates(fxRatesList || [], selectedCurrency);
    setFxRates(requiredFxRates);
  }, [fxRatesList, selectedCurrency]);

  useEffect(() => {
    setSelectedCurrency(inputCurrency);
    setVal(
      LOCATION_CURRENCY_DETAILS_MAP[
        CURRENCY_VS_LOCATION_MAP[inputCurrency] as keyof typeof LOCATION_CURRENCY_DETAILS_MAP
      ].defaultValue
    );
    setError("");
  }, [inputCurrency]);

  const fetchLiveFxRate = () => {
    beCall({
      path: BE_ROUTES.FETCH_FX_RATE_LIST,
      method: ALLOWED_METHODS.POST,
      onError: onFetchfxError,
      onSuccess: onFxSuccess,
      server: SERVICES.FX,
      body: {
        currencyPairList: currencyParList,
      },
    });
  };

  useEffect(() => {
    fetchLiveFxRate();
    const interval = setInterval(() => {
      fetchLiveFxRate();
    }, 1000 * 60);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const setErrorForUsd = () => {
    if (Number(inputVal) > MAX_AMOUNT) {
      setError(Locale.maxSupportedAmount.replace(":amount", MAX_AMOUNT.toString()));
    } else if (Number(inputVal) < MIN_DOLLAR_AMOUNT) {
      setError(Locale.minSupportAmount);
    } else {
      setError("");
    }
  };

  useEffect(() => {
    if (selectedCurrency === LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]) {
      setErrorForUsd();
    } else {
      const usdConvertedValue = Number(currFxRates.baseToUsd) * Number(inputVal);
      if (Number(inputVal) > MAX_AMOUNT) {
        setError(Locale.maxSupportedAmount.replace(":amount", MAX_AMOUNT.toString()));
      } else if (usdConvertedValue < MIN_DOLLAR_AMOUNT) {
        setError(Locale.minSupportAmount);
      } else {
        setError("");
      }
    }
  }, [inputVal, currFxRates, selectedCurrency]);

  const onInputCurrChange = (val: string, event: ChangeEvent<HTMLInputElement>) => {
    if (String(val).length < 8) {
      if (val.charAt(val.length - 1) === "." && inputVal.includes(".") && !(val.length < inputVal.length)) {
        event.preventDefault();
        return;
      }
      const newValue = val.replace(/[^0-9^.]/, "");
      setVal(newValue);
    }
  };

  const calculateSkydoFee = () => {
    let skydoBaseFee;
    let feeCurrency = selectedCurrency;
    const hasRegionalFee = isRegionalFeeCurrency(selectedCurrency);

    // Calculate base Skydo fee
    if (Number(inputVal) > SKYDO_HIGH_VALUE_THRESHOLD) {
      skydoBaseFee = Number(inputVal) * SKYDO_HIGH_VALUE_PERCENTAGE;
    } else if (Number(inputVal) > SKYDO_CUTOFF_SLAB) {
      skydoBaseFee = SKYDO_FEE_OVER_SLAB;
    } else {
      skydoBaseFee = SKYDO_FEE_UNDER_SLAB;
    }

    if (selectedCurrency !== LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]) {
      const usdConvertedValue = Number(currFxRates.baseToUsd) * Number(inputVal);

      if (usdConvertedValue > SKYDO_HIGH_VALUE_THRESHOLD) {
        skydoBaseFee = Number(inputVal) * SKYDO_HIGH_VALUE_PERCENTAGE;
      } else if (usdConvertedValue > SKYDO_CUTOFF_SLAB) {
        skydoBaseFee = SKYDO_FEE_OVER_SLAB;
        feeCurrency = LOCATION_CURRENCY_MAP[LOCATION_CODE.USA];
      } else {
        skydoBaseFee = SKYDO_FEE_UNDER_SLAB;
        feeCurrency = LOCATION_CURRENCY_MAP[LOCATION_CODE.USA];
      }
    }

    // UAE + niche currencies: add the 1% Regional Currency Fee on top of the base fee
    let regionalFee = 0;

    if (hasRegionalFee) {
      regionalFee = Number(inputVal) * REGIONAL_FEE_PERCENTAGE;
    }

    return {
      amount: parseFloat(skydoBaseFee.toFixed(2)),
      currency: feeCurrency,
      baseFee: parseFloat(skydoBaseFee.toFixed(2)),
      baseCurrency: feeCurrency,
      regionalFee: hasRegionalFee ? parseFloat(regionalFee.toFixed(2)) : 0,
      hasRegionalFee,
    };
  };

  const inrConvertedValue = roundTo(Number(currFxRates.baseToInr) * Number(inputVal), 2);
  const skydoFee = calculateSkydoFee();
  var skydoFeeinINR = roundTo(skydoFee.amount * Number(currFxRates.baseToInr), 2);
  var skydoBaseFeeinINR = roundTo(skydoFee.baseFee * Number(currFxRates.baseToInr), 2);
  if (skydoFee.currency == LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]) {
    skydoFeeinINR = roundTo(skydoFee.amount * Number(currFxRates.usdToInr), 2);
    skydoBaseFeeinINR = roundTo(skydoFee.baseFee * Number(currFxRates.usdToInr), 2);
  }
  var skydoRegionalFeeinINR = 0;
  if (skydoFee.hasRegionalFee) {
    skydoRegionalFeeinINR = roundTo(skydoFee.regionalFee * Number(currFxRates.baseToInr), 2);
    // Regional fee stays inside the total so GST and the final payout are charged on base + regional.
    skydoFeeinINR += skydoRegionalFeeinINR;
  }

  // Check if amount is > 10K USD for showing base fee as percentage
  const usdEquivalent =
    selectedCurrency === LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]
      ? Number(inputVal)
      : Number(currFxRates.baseToUsd) * Number(inputVal);
  const showBaseFeeAsPercentage = usdEquivalent > SKYDO_HIGH_VALUE_THRESHOLD;
  const gstCharge = roundTo(skydoFeeinINR * GST_PERCENT, 2);
  const finalInrValue = roundTo(inrConvertedValue - skydoFeeinINR - gstCharge, 2);

  const calculationMap = [
    {
      amount: formatINRNumber({
        value: currFxRates.baseToInr,
        isTrail: true,
        maximumFractionDigits: 4,
        formatOptions: { minimumFractionDigits: 4 },
      }),
      text: Locale.liveFxStar,
      isBottomBorder: true,
      isGreenText: true,
      icon: () => <CrossIconFX />,
      supportError: true,
    },
    {
      amount: formatINRNumber({ value: inrConvertedValue, isTrail: true, formatOptions: { minimumFractionDigits: 2 } }),
      icon: () => <EqualIcon />,
    },
    {
      amount: formatINRNumber({ value: skydoBaseFeeinINR, isTrail: true, formatOptions: { minimumFractionDigits: 2 } }),
      text: Locale.transactionFee
        .replace("{skydoFee}", skydoFee.baseFee.toString())
        .replace("{currency}", skydoFee.baseCurrency),
      icon: () => <SubtractIcon />,
      hoverIcon: true,
    },
    ...(skydoFee.hasRegionalFee
      ? [
          {
            amount: formatINRNumber({
              value: skydoRegionalFeeinINR,
              isTrail: true,
              formatOptions: { minimumFractionDigits: 2 },
            }),
            text: Locale.regionalCurrencyFeeRow,
            icon: () => <SubtractIcon />,
            hoverIcon: true,
            isRegionalFeeRow: true,
          },
        ]
      : []),
    {
      amount: formatINRNumber({ value: gstCharge, isTrail: true, formatOptions: { minimumFractionDigits: 2 } }),
      text: Locale.gstAmount,
      icon: () => <SubtractIcon />,
    },
  ];

  const renderCalcDetails = () => (
    <div
      className={classnames("grid grid-cols-2 gap-x-5", {
        "!flex !flex-col gap-10": isHorizontalView,
        "-mt-4": !isHorizontalView,
      })}
    >
      <div className={"flex flex-row"}>
        <FullTick tickColor={theme.hexColors.green[400]} bgColor={theme.hexColors.green[100]} className={"shrink-0"} />
        <div className={"flex flex-col ml-3"}>
          <Typography text={Locale.weCharge} type={TYPOGRAPHY_TYPES.LABEL} textClasses={"mb-2"} />
          <Typography text={Locale.charges19dollar} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500"} />
          <Typography text={Locale.charges29dollar} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500"} />
          <Typography text={Locale.chargesAbove10K} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500"} />
        </div>
      </div>
      <div className={"flex flex-row"}>
        <FullTick tickColor={theme.hexColors.green[400]} bgColor={theme.hexColors.green[100]} className={"shrink-0"} />
        <div className={"flex flex-col ml-3"}>
          <Typography text={Locale.weChargeRegionalFee} type={TYPOGRAPHY_TYPES.LABEL} textClasses={"mb-2"} />
          <Typography
            text={Locale.regionalFeeBulletSubtitle}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
      </div>
      <div className={"flex flex-row"}>
        <FullTick tickColor={theme.hexColors.green[400]} bgColor={theme.hexColors.green[100]} className={"shrink-0"} />
        <div className={"flex flex-col ml-3"}>
          <Typography text={Locale.weDontCharge} type={TYPOGRAPHY_TYPES.LABEL} textClasses={"mb-2"} />
          <Typography text={Locale.dontChargeSubtitle} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500"} />
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={classnames("flex flex-col p-6", {
        "!flex-row-reverse justify-between gap-6 !pl-[82px] pr-[82px] pt-10": isHorizontalView,
      })}
    >
      {!isHorizontalView ? renderCalcDetails() : null}
      <div className={classnames("flex justify-center flex-col items-center", { "flex-1 mt-10": !isHorizontalView })}>
        <div>
          <CurrencyInputs
            isEditable={true}
            onChange={onInputCurrChange}
            inputVal={inputVal}
            error={error}
            inputCurrency={selectedCurrency}
            setSelectedCurrency={onChangeCurrencyClick}
          />
          <div className={"flex flex-col w-full pl-6"}>
            {calculationMap.map((step, index) => {
              const { amount, text, isBottomBorder, isGreenText, icon, supportError, hoverIcon, isRegionalFeeRow } =
                step;
              return (
                <div key={index}>
                  <div key={amount} className={"border-l border-black-400 flex_row_item_center relative"}>
                    <UserStateIcon
                      containerClass={"!shadow-none !p-0 !top-0 !bottom-0 !my-auto"}
                      styles={{ background: "transparent" }}
                    >
                      <div
                        className={classnames({
                          "mt-8": supportError && error,
                        })}
                      >
                        {icon()}
                      </div>
                    </UserStateIcon>
                    <div className={"flex flex-col"}>
                      {supportError && error ? (
                        <Typography
                          text={error}
                          size={TYPOGRAPHY_SIZES.SMALL}
                          textClasses={"!text-red-400 ml-8.5 mt-2"}
                        />
                      ) : null}
                      <div className={"flex flex-row items-center"}>
                        <div className={"ml-8.5 w-[150px] py-2"}>
                          <Typography text={amount} />
                        </div>
                        {text ? <Typography text={text} textClasses={isGreenText ? "!text-green-400" : ""} /> : null}
                        {hoverIcon ? (
                          <Tooltip
                            tooltipText={
                              isRegionalFeeRow || skydoFee.hasRegionalFee ? (
                                // The fee is split across two rows, so each row shows only its own section.
                                <AEDTransactionFeeTooltip
                                  baseFee={skydoFee.baseFee}
                                  baseCurrency={skydoFee.baseCurrency}
                                  regionalFee={skydoFee.regionalFee}
                                  invoiceAmount={Number(inputVal)}
                                  baseFeeInINR={skydoBaseFeeinINR}
                                  regionalFeeInINR={skydoRegionalFeeinINR}
                                  totalFeeInINR={skydoFeeinINR}
                                  baseToInrRate={
                                    skydoFee.currency === LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]
                                      ? currFxRates.usdToInr
                                      : currFxRates.baseToInr
                                  }
                                  aedToInrRate={currFxRates.baseToInr}
                                  regionalCurrency={selectedCurrency}
                                  regionalFeePercentage={REGIONAL_FEE_PERCENTAGE * 100}
                                  rateTimestamp={currFxRates.usdToInrTimestamp}
                                  showBaseFeeAsPercentage={showBaseFeeAsPercentage}
                                  showHeader={false}
                                  showTotal={false}
                                  showBaseFeeSection={!isRegionalFeeRow}
                                  showRegionalFeeSection={!!isRegionalFeeRow}
                                  containerClass={"para2xsmall py-1"}
                                />
                              ) : (
                                <CurrencyToINRRateTooltip
                                  currencyToInrRate={String(
                                    formatINDNumber({
                                      value: skydoFee.currency == "USD" ? currFxRates.usdToInr : currFxRates.baseToInr,
                                      formatOptions: { minimumFractionDigits: 4 },
                                    })
                                  )}
                                  currency={skydoFee.currency}
                                  interBankRateTimestamp={new Date().toISOString()}
                                  amount={skydoFee.amount}
                                  executedCondition={
                                    skydoFee.currency == "USD" && (skydoFee.amount == 29.0 || skydoFee.amount == 19.0)
                                      ? skydoFee.currency + " " + skydoFee.amount
                                      : "0.3% of amount received"
                                  }
                                  overrideExecutedPricingCondition={false}
                                  showExecutedCondition={true}
                                />
                              )
                            }
                            tooltipTheme={"dark"}
                          >
                            <InfoIcon containerClass={"ml-1"} />
                          </Tooltip>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  {isBottomBorder ? <hr key={`hr-${amount}`} className={"-mb-px ml-8.5 border-black-400"} /> : null}
                </div>
              );
            })}
          </div>
          <CurrencyInputs
            isEditable={false}
            inputVal={
              finalInrValue < 0
                ? "0"
                : String(formatINDNumber({ value: finalInrValue, formatOptions: { minimumFractionDigits: 2 } }))
            }
            showFooter={true}
            inputCurrency={LOCATION_CURRENCY_MAP[LOCATION_CODE.IND]}
          />
        </div>
      </div>
      {isHorizontalView ? renderCalcDetails() : null}
    </div>
  );
};

export interface FxCalculatorRef {
  openCalculator: () => void;
}

const FxCalculator = forwardRef<
  FxCalculatorRef,
  {
    inputCurrency: string;
    containerClass?: string;
    isHorizontalView: boolean;
  }
>(({ inputCurrency, containerClass, isHorizontalView }, ref) => {
  const [isOpen, setCalcOpen] = useState(false);
  const [fxRatesList, setFxRatesList] = useState<FXRateResponse[]>([]);

  const onFetchfxError = () => {};

  const onFxSuccess = (response: ResponseWrapper<FXRateResponse[]>) => {
    setFxRatesList(response?.data || []);
  };

  const currencyParList = getFXCurrencyPairList();

  useEffect(() => {
    beCall({
      path: BE_ROUTES.FETCH_FX_RATE_LIST,
      method: ALLOWED_METHODS.POST,
      onError: onFetchfxError,
      onSuccess: onFxSuccess,
      server: SERVICES.FX,
      body: {
        currencyPairList: currencyParList,
      },
    });
  }, []);

  useImperativeHandle(ref, () => ({
    openCalculator: () => {
      setCalcOpen(true);
    },
  }));

  return (
    <div className={classnames("flex flex-col bg-white rounded-10px mt-4", containerClass)}>
      <div
        className={classNames("flex flex-row justify-between items-center cursor-pointer p-6", {
          "mb-10 border-b border-black-400": isOpen,
        })}
        onClick={() => setCalcOpen(!isOpen)}
      >
        <div className={"flex_row_item_center gap-4"}>
          <TagIcon />
          <Typography text={Locale.fxCalc} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
        </div>
        <DropdownArrow isOpen={isOpen} />
      </div>
      {isOpen ? (
        <Calculator
          isHorizontalView={isHorizontalView}
          setFxRatesList={setFxRatesList}
          fxRatesList={fxRatesList}
          inputCurrency={inputCurrency}
          currencyParList={currencyParList}
        />
      ) : null}
    </div>
  );
});

FxCalculator.defaultProps = {
  isHorizontalView: false,
};

FxCalculator.displayName = "FxCalculator";

export default FxCalculator;
