import { useEffect, useState } from "react";
import { FREELANCER_PLATFORM_CODE, LOCATION_CODE, LOCATION_CURRENCY_MAP } from "../../constants/dashboardConstants";
import Breadcrumb from "../Common/Breadcrumb";
import Locale from "../../util/locale/en";
import FE_ROUTES from "../../util/feRoutes";
import useAnalytics from "../../analytics/useAnalytics";
import Typography from "../AtomicComponents/Typography";
import useFocusedHomeStore from "../../store/useFocusedHomeStore";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import TestTxnFocusedHome from "./TestTxnFocusedHome";
import { getCompState, isCompSelected } from "../../util/focusedHomeUtl";
import { FocusedHomeComponent } from "../../constants/focusedHomeConstants";
import PaymentMethodSelectFocusedHome from "./PaymentMethodSelectFocusedHome";
import PaymentDetailFocusedHome from "./PaymentDetailFocusedHome";
import AccountDetailFocusedHome from "./AccountDetailFocusedHome";
import { Events } from "../../analytics/EventConstants";

const ReceivePaymentPage = () => {
  const { setIsStepsVisible, focusedHomeStates, removeReceivePaymentContinued } = useFocusedHomeStore();
  const [platform, setPlatform] = useState(FREELANCER_PLATFORM_CODE.TOPTAL);
  const analytics = useAnalytics();
  const [selectedCurrencyForAccount, setSelectedCurrencyForAccount] = useState<string>(
    LOCATION_CURRENCY_MAP[LOCATION_CODE.USA]
  );
  const [selectedLocation, setSelectedLocation] = useState<string>(LOCATION_CODE.USA);

  const location =
    selectedCurrencyForAccount === LOCATION_CURRENCY_MAP[selectedLocation] ? selectedLocation : LOCATION_CODE.ROW;

  useEffect(() => {
    analytics.trackAsync(Events.FOCUSED_HOME.FIRST_PAYMENT_VIEWED, {
      project: "fhv2",
      subpage: "fh_receive_first_payment",
    });
  }, []);

  return (
    <div className={"flex flex-col gap-6 max-w-[1000px] w-full"}>
      <Breadcrumb
        text={Locale.homepageTitle}
        subText={Locale.focusedHome.paymentMethodsTitle}
        textRoute={FE_ROUTES.DASHBOARD}
        onTextClick={() => {
          removeReceivePaymentContinued();
          analytics.trackAsync(Events.FOCUSED_HOME.BREADCRUMB_CLICKED, {
            project: "fhv2",
            subpage: "fh_intent",
            destination: "home",
          });
          setIsStepsVisible(false);
        }}
      />
      <Typography
        text={Locale.focusedHome.bapTitle}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.SMALL}
        fontWeight={"bold"}
        textClasses={"flex flex-row"}
      />
      <TestTxnFocusedHome
        isSelected={isCompSelected(focusedHomeStates, FocusedHomeComponent.TEST_TRANSACTION)}
        compState={getCompState(focusedHomeStates, FocusedHomeComponent.TEST_TRANSACTION)}
      />
      <PaymentMethodSelectFocusedHome
        isSelected={isCompSelected(focusedHomeStates, FocusedHomeComponent.PAYMENT_METHOD)}
        compState={getCompState(focusedHomeStates, FocusedHomeComponent.PAYMENT_METHOD)}
        platform={platform}
        setPlatform={setPlatform}
      />
      <PaymentDetailFocusedHome
        isSelected={isCompSelected(focusedHomeStates, FocusedHomeComponent.PAYMENT_DETAIL)}
        compState={getCompState(focusedHomeStates, FocusedHomeComponent.PAYMENT_DETAIL)}
        selectedLocation={selectedLocation}
        selectedCurrency={selectedCurrencyForAccount}
        setSelectedLocation={setSelectedLocation}
        setSelectedCurrency={setSelectedCurrencyForAccount}
      />
      <AccountDetailFocusedHome
        isSelected={isCompSelected(focusedHomeStates, FocusedHomeComponent.PAYMENT_DETAIL)}
        compState={getCompState(focusedHomeStates, FocusedHomeComponent.PAYMENT_DETAIL)}
        location={location}
        currency={selectedCurrencyForAccount}
      />
    </div>
  );
};

export default ReceivePaymentPage;
