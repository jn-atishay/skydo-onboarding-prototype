import { useEffect, useRef, useState } from "react";
import { LOCATION_CODE, LOCATION_CURRENCY_MAP } from "../../constants/dashboardConstants";
import useFocusedHomeStore from "../../store/useFocusedHomeStore";
import { formatIncomingCurrencyWithNumber, formatIncomingCurrencyWithSymbol } from "../../util/formatters";
import CongratsBanner from "./CongratsBanner";
import useUserData from "../../store/useUserData";
import { isManualCheckPending } from "../../util/functions";
import JSHelpers from "../AtomicComponents/JSHelpers";
import Testimonials from "./Testimonials";
import FAQ from "./FAQ";
import NextPaymentDetailPopup from "./NextPaymentDetailPopup";
import dynamic from "next/dynamic";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS, SERVICES } from "../../constants/apiConstants";
import { ResponseWrapper } from "../../authentication/api/AuthApiDto";
import { FXRateResponse } from "../../types";
import useComparison from "../../hooks/fxcalc/useComparison";
import { AVG_TRANSACTION_VALUE, FREELANCER_MONTHLY_INCOME_RANGE, MONTHLY_REVENUE_OPTIONS } from "../../constants/onboarding";
import useDebounce from "../../util/customHooks/useDebounce";

const AnimationLoader = dynamic(() => import("../../components/Common/AnimationLoader"), { ssr: false });

const Confetti = () => {
  const { markConfettiShown } = useFocusedHomeStore();

  useEffect(() => {
    markConfettiShown();
  }, []);

  return (
    <AnimationLoader
      src={"/confetti.json"}
      loop={1}
      animation={true}
      className={"!w-screen !h-screen absolute top-0 left-0"}
    />
  );
};

const IntentPage = () => {
  const {
    isPaymentTimelineExpired,
    setIsStepsVisible,
    averageTransaction,
    monthlyRevenue,
    confettiShown,
    markReceivePaymentContinued,
  } = useFocusedHomeStore();
  const [nextPaymentDetailPopupVisible, setNextPaymentDetailPopupVisible] = useState(false);
  const [hideAnimation, setHideAnimation] = useState(false);
  const { userState } = useUserData();
  const isManualVerificationPending = isManualCheckPending(userState);

  const getInitialAmountValue = (revenueValue?: string, avgTxnValue?: string): number => {
    if (!!revenueValue) {
      switch (revenueValue) {
        case MONTHLY_REVENUE_OPTIONS[0]:
          return 5000;
        case MONTHLY_REVENUE_OPTIONS[1]:
          return 15000;
        case MONTHLY_REVENUE_OPTIONS[2]:
          return 35000;
        case MONTHLY_REVENUE_OPTIONS[3]:
          return 75000;
        case MONTHLY_REVENUE_OPTIONS[4]:
          return 200000;
        case FREELANCER_MONTHLY_INCOME_RANGE.UNDER_10L:
          return 6000;
        case FREELANCER_MONTHLY_INCOME_RANGE.OVER_10L:
          return 25000;
      }
    }

    if (!!avgTxnValue) {
      switch (avgTxnValue) {
        case AVG_TRANSACTION_VALUE[0]:
          return 1000;
        case AVG_TRANSACTION_VALUE[1]:
          return 2000;
        case AVG_TRANSACTION_VALUE[2]:
          return 10000;
        case AVG_TRANSACTION_VALUE[3]:
          return 20000;
        case AVG_TRANSACTION_VALUE[4]:
          return 40000;
      }
    }

    return 20000;
  };

  const [amount, setAmount] = useState(getInitialAmountValue(monthlyRevenue, averageTransaction));
  const [currency, setCurrency] = useState("USD");
  const [fxRateList, setFxRateList] = useState<FXRateResponse[]>([
    {
      base: "USD",
      target: "INR",
      fx_rate: 82.99,
      api_timestamp: "1629782400",
    },
  ]);

  const baseToInr =
    fxRateList.filter((fx) => {
      return fx.target === "INR" && fx.base === currency;
    })?.[0]?.fx_rate || 82.99;

  const { competitorCost, skydoCost, savings } = useComparison({
    amount,
    currency,
    fxRates: fxRateList,
  });

  const hideConfettiAnimation = async () => {
    await JSHelpers.sleep(2000);
    setHideAnimation(true);
  };
  const analytics = useAnalytics();

  const annualSavings = savings === 0 ? 0 : savings ? savings * 12 : 96000;

  let savingsStringValue: number | string = annualSavings / 1000;
  if (savingsStringValue > 10000) {
    savingsStringValue = savingsStringValue / 10000;
    savingsStringValue = `${formatIncomingCurrencyWithSymbol({
      value: savingsStringValue,
      currency: "INR",
      formatOptions: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
    })}Cr`;
  } else if (savingsStringValue > 100) {
    savingsStringValue = savingsStringValue / 100;
    savingsStringValue = `${formatIncomingCurrencyWithSymbol({
      value: savingsStringValue,
      currency: "INR",
      formatOptions: {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      },
    })}L`;
  } else {
    savingsStringValue = `${formatIncomingCurrencyWithSymbol({
      value: savingsStringValue,
      currency: "INR",
      formatOptions: {
        maximumFractionDigits: 0,
        minimumFractionDigits: 0,
      },
    })}K`;
  }

  const initialSavings = useRef(savingsStringValue);
  const initialAmount = useRef(getInitialAmountValue(monthlyRevenue, averageTransaction));

  const getFxRateList = async () => {
    try {
      const data = (await beCall({
        path: BE_ROUTES.FETCH_FX_RATE_LIST,
        method: ALLOWED_METHODS.POST,
        server: SERVICES.FX,
        body: {
          currencyPairList: [
            {
              base: "USD",
              target: "INR",
            },
            {
              base: "GBP",
              target: "USD",
            },
            {
              base: "GBP",
              target: "INR",
            },
            {
              base: "EUR",
              target: "USD",
            },
            {
              base: "EUR",
              target: "INR",
            },
            {
              base: "CAD",
              target: "USD",
            },
            {
              base: "CAD",
              target: "INR",
            },
            {
              base: "AUD",
              target: "USD",
            },
            {
              base: "AUD",
              target: "INR",
            },
            {
              base: "SGD",
              target: "USD",
            },
            {
              base: "SGD",
              target: "INR",
            },
            {
              base: "AED",
              target: "USD",
            },
            {
              base: "AED",
              target: "INR",
            },
          ],
        },
      })) as ResponseWrapper<FXRateResponse[]>;
      if (data.data) {
        setFxRateList(data.data);
      }
    } catch (error) {}
  };

  const triggerSavingsValueSetEvent = () => {
    analytics.trackAsync(Events.FOCUSED_HOME.FAQ_SAVINGS_VALUE_SET, {
      project: "fhv2",
      subpage: "fh_intent",
      amount: amount,
      currency: currency,
      savingsStringValue: savingsStringValue,
    });
  };

  const debouncedTriggerSavingsValueSetEvent = useDebounce(triggerSavingsValueSetEvent, 1000);

  useEffect(() => {
    debouncedTriggerSavingsValueSetEvent();
  }, [amount, currency]);

  useEffect(() => {
    void hideConfettiAnimation();
    void getFxRateList();
    analytics.trackAsync(Events.FOCUSED_HOME.INTENT_PAGE_VIEWED, {
      project: "fhv2",
      subpage: "fh_intent",
    });
  }, []);

  return (
    <div className={"w-[1000px] flex flex-col gap-8"}>
      <CongratsBanner
        monthlySavings={initialSavings.current}
        monthlyVolume={formatIncomingCurrencyWithNumber({
          value: initialAmount.current,
          currency: LOCATION_CURRENCY_MAP[LOCATION_CODE.USA],
          maxFractionDigits: 0,
          minFractionDigits: 0,
        })}
        onGetStarted={() => {
          analytics.trackAsync(Events.FOCUSED_HOME.INTENT_CTA_YES_CLICKED, {
            project: "fhv2",
            subpage: "fh_intent",
            cta_label: "Yes, I want to get started",
          });
          if (isPaymentTimelineExpired) {
            setNextPaymentDetailPopupVisible(true);
          } else {
            setIsStepsVisible(true);
            markReceivePaymentContinued();
          }
        }}
      />
      <FAQ
        competitorCost={competitorCost}
        skydoCost={skydoCost}
        savingsStringValue={initialSavings.current}
        currency={currency}
        baseToInr={baseToInr}
        savings={annualSavings}
        amount={amount}
        setAmountInput={(val) => {
          setAmount(val);
        }}
        setCurrency={(val) => {
          setCurrency(val);
        }}
      />
      <Testimonials />
      <NextPaymentDetailPopup
        isVisible={nextPaymentDetailPopupVisible}
        onClose={() => setNextPaymentDetailPopupVisible(false)}
        onContinue={() => {
          setIsStepsVisible(true);
        }}
      />
      {hideAnimation || isManualVerificationPending || confettiShown ? null : <Confetti />}
    </div>
  );
};

export default IntentPage;
