import React, { useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import Locale from "../../util/locale/en";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import {
  CUSTOMER_FEEDBACK_QUESTION_TYPE,
  LOCAL_ACCOUNT_CODE_2_ALPHA,
  LOCATION_CODE,
  NICHE_IMPORTER_CODE_2_ALPHA,
} from "../../constants/dashboardConstants";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import useCountriesStore from "../../store/useCountriesStore";
import useToastMessages from "../../store/toastMessages";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import Button from "../AtomicComponents/Button";
import Typography from "../AtomicComponents/Typography";
import FullTick from "../Icons/FullTick";
import ChevronRightIcon from "../Icons/ChevronRightIcon";
import CountryMultiSelect from "./CountryMultiSelect";
import AppContext from "../../context/AppContext";

// The note names this many countries before collapsing the rest into "+N".
const MAX_NAMED_COUNTRIES = 2;

const CountryRequestFeedbackContent = ({ closePopup }: { closePopup: () => void }) => {
  const { theme } = useContext(AppContext);
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { sendFeedback } = useInternationalAccountsStore();
  const { countryList, isCountryListLoading, hasCountryListFailed, fetchCountryList } = useCountriesStore();
  const { addToast } = useToastMessages();
  const analytics = useAnalytics();
  const router = useRouter();

  useEffect(() => {
    if (!countryList.length) {
      fetchCountryList();
    }
  }, []);

  const nameByCode = useMemo(
    () => new Map(countryList.map((country) => [country.code2Alpha, country.name])),
    [countryList]
  );
  const getCountryName = (code: string) => nameByCode.get(code) ?? code;

  const selectableCountries = useMemo(
    () => countryList.filter((country) => !LOCAL_ACCOUNT_CODE_2_ALPHA.includes(country.code2Alpha)),
    [countryList]
  );

  const swiftSupportedLocations = selectedCodes.filter((code) => NICHE_IMPORTER_CODE_2_ALPHA.includes(code));

  const getSwiftNote = () => {
    const named = swiftSupportedLocations.slice(0, MAX_NAMED_COUNTRIES).map(getCountryName);
    const remainingCount = swiftSupportedLocations.length - named.length;
    const countries = remainingCount > 0 ? [...named, `+${remainingCount}`] : named;
    return Locale.intAccountPage.swiftLocalCurrencyNote.replace("{countries}", countries.join(", "));
  };

  const onSeeDetailsClick = () => {
    analytics.trackAsync(Events.INTL_ACCOUNTS_FEEDBACK_SEE_DETAILS, {
      locations: swiftSupportedLocations.map(getCountryName),
    });
    closePopup();
    void router.push(
      { pathname: router.pathname, query: { ...router.query, location: LOCATION_CODE.ROW.toLowerCase() } },
      undefined,
      { shallow: true }
    );
    window.scrollTo(0, 0);
  };

  const onFeedbackSubmitError = () => {
    setIsLoading(false);
    closePopup();
  };

  // A 200 does not mean the feedback was stored: the mutation resolves to false when the backend
  // rejects it, so a success toast off the HTTP status alone would be a lie.
  const onFeedbackSubmitSuccess = (response: AddCustomerFeedbackResponse) => {
    if (!response?.data?.addCustomerFeedback) {
      onFeedbackSubmitError();
      return;
    }
    setIsLoading(false);
    closePopup();
    addToast({
      id: "feedback_submit_success",
      type: TOAST_TYPES.SUCCESS,
      body: Locale.feedbackSubmitSuccess,
    });
  };

  const onSubmitClick = () => {
    // Country names, not ISO codes, so the event matches the feedback record sent as `answer`.
    analytics.trackAsync(Events.INTL_ACCOUNTS_FEEDBACK_SUBMIT, { locations: selectedCodes.map(getCountryName) });
    setIsLoading(true);
    sendFeedback({
      onSuccess: onFeedbackSubmitSuccess,
      onError: onFeedbackSubmitError,
      questionType: CUSTOMER_FEEDBACK_QUESTION_TYPE.INTERNATIONAL_ACCOUNTS_FEEDBACK,
      answer: selectedCodes.map(getCountryName).join(", "),
    });
  };

  return (
    // Fixed height so opening the dropdown or showing the note never resizes the popup.
    <div className={"flex flex-col h-96 gap-4"}>
      <CountryMultiSelect
        countries={selectableCountries}
        isLoading={isCountryListLoading}
        hasFailed={hasCountryListFailed}
        onRetry={fetchCountryList}
        selectedCodes={selectedCodes}
        onChange={setSelectedCodes}
        label={Locale.intAccountPage.clientsLocation}
      />
      <div className={"mt-auto shrink-0 flex flex-col gap-3"}>
        <Button
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.MEDIUM}
          title={Locale.submit}
          onButtonClick={onSubmitClick}
          isLoading={isLoading}
          isDisabled={!selectedCodes.length || isLoading}
          buttonClass={"!w-full justify-center"}
        />
        {swiftSupportedLocations.length ? (
          <div className={"flex flex-row items-center gap-6 px-4 py-2 bg-green-50 rounded-10px"}>
            <FullTick bgColor={theme.hexColors.green[500]} className={"shrink-0"} />
            <Typography
              text={getSwiftNote()}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"flex-1 !text-green-500 !font-semibold"}
            />
            <div className={"flex flex-row items-center gap-1 cursor-pointer shrink-0"} onClick={onSeeDetailsClick}>
              <Typography
                text={Locale.intAccountPage.seeDetails}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-700 !font-semibold"}
              />
              <ChevronRightIcon />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CountryRequestFeedbackContent;

type AddCustomerFeedbackResponse = {
  data?: {
    addCustomerFeedback?: boolean;
  };
};
