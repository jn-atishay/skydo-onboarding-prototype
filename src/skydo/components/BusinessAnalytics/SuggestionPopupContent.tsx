import TextInput from "../AtomicComponents/TextInput";
import { useState } from "react";
import Button from "../AtomicComponents/Button";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import useToastMessages from "../../store/toastMessages";
import { SUGGESTION_POPUP_TYPES } from "./constants";
import { CUSTOMER_FEEDBACK_QUESTION_TYPE } from "../../constants/dashboardConstants";
import useSelectedPlatformInfo from "../../util/customHooks/useSelectedPlatformInfo";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import CheckBox from "../AtomicComponents/CheckBox";
import FullTickIconWithCircles from "../Icons/FullTickIconWithCircles";
import Typography from "../AtomicComponents/Typography";

const MESSAGE_CONTENT: string = "<@U08T1AXT9M2> <@U06CKPU6SHM> customer needs help linking skydo account on Platforms. SelectedPlatform: ";

const SuggestionPopupContent = ({
  closePopup,
  popupType,
  setSubmitSuccess,
  submitSuccess,
}: {
  closePopup: () => void;
  popupType: string;
  setSubmitSuccess?: (value: boolean) => void;
  submitSuccess?: boolean;
}) => {
  const [suggestionText, setSuggestionText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [requestCallback, setRequestCallback] = useState<boolean>(false);
  const { addToast } = useToastMessages();
  const { selectedPlatform } = useSelectedPlatformInfo();
  const { sendFeedback } = useInternationalAccountsStore();
  const analytics = useAnalytics();

  const getLabel = () => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.NAV_BAR_ANALYTICS:
        return Locale.otherSectionLabel;
      case SUGGESTION_POPUP_TYPES.METRICS:
        return Locale.describeBusinessFeedback;
      case SUGGESTION_POPUP_TYPES.CLIENT_METRICS:
        return Locale.describeClientFeedback;
      case SUGGESTION_POPUP_TYPES.NEED_HELP_OTHER_PLATFORMS:
        return Locale.shareWithUs;
      case SUGGESTION_POPUP_TYPES.CLIENTS_DETAIL_PAGE:
        return Locale.describeYourFeedback;
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        return Locale.focusedHome.moreQuesPopup.label;
      default:
        return "";
    }
  };

  const getQuestionType = () => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.NAV_BAR_ANALYTICS:
        return CUSTOMER_FEEDBACK_QUESTION_TYPE.ANALYTICS_CATEGORY_FEEDBACK;
      case SUGGESTION_POPUP_TYPES.METRICS:
        return CUSTOMER_FEEDBACK_QUESTION_TYPE.ANALYTICS_PAGE_DETAILS_FEEDBACK;
      case SUGGESTION_POPUP_TYPES.CLIENT_METRICS:
        return CUSTOMER_FEEDBACK_QUESTION_TYPE.ANALYTICS_CLIENT_FEEDBACK;
      case SUGGESTION_POPUP_TYPES.NAV_BAR_INT_ACC_PLATFORM:
        return CUSTOMER_FEEDBACK_QUESTION_TYPE.PLATFORM_INTEGRATION_FEEDBACK;
      case SUGGESTION_POPUP_TYPES.NEED_HELP_OTHER_PLATFORMS:
        return CUSTOMER_FEEDBACK_QUESTION_TYPE.PLATFORM_INTEGRATION_HELP;
      case SUGGESTION_POPUP_TYPES.CLIENTS_DETAIL_PAGE:
        return CUSTOMER_FEEDBACK_QUESTION_TYPE.CLIENT_DETAILS_FEEDBACK;
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        return CUSTOMER_FEEDBACK_QUESTION_TYPE.HAVE_MORE_QUESTIONS;
      default:
        return CUSTOMER_FEEDBACK_QUESTION_TYPE.INTERNATIONAL_ACCOUNTS_FEEDBACK;
    }
  };

  const showSubmitSuccessScreen = () => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        return true;
      default:
        return false;
    }
  };

  const showRequestCallback = () => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        return true;
      default:
        return false;
    }
  };

  const getPlaceholder = () => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.CLIENTS_DETAIL_PAGE:
        return Locale.clientListSuggestionPlaceholder;
      default:
        return Locale.typeHere;
    }
  };

  const getAnswer = () => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.NEED_HELP_OTHER_PLATFORMS:
        return "UserInput: `" + suggestionText + "`" + MESSAGE_CONTENT + selectedPlatform;
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        return "Query: `" + suggestionText + "`" + " Callback requested: " + (requestCallback ? "Yes" : "No");
      default:
        return suggestionText;
    }
  };

  const getFeedbackSubmitSuccessMessage = () => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.NEED_HELP_OTHER_PLATFORMS:
        return Locale.needHelpToastFeedback;
      default:
        return Locale.feedbackSubmitSuccess;
    }
  };

  const onFeedbackSubmitSuccess = (data: GraphqlMutationResponse) => {
    if (data.data.addCustomerFeedback) {
      setIsLoading(false);
      if (showSubmitSuccessScreen()) {
        setSubmitSuccess?.(true);
        return;
      }
      closePopup();
      addToast({
        id: "feedback_submit_success",
        type: TOAST_TYPES.SUCCESS,
        body: getFeedbackSubmitSuccessMessage(),
      });
    } else onFeedbackSubmitError(data);
  };

  const onFeedbackSubmitError = (error: any) => {
    closePopup();
    setIsLoading(false);
  };

  const onSubmitClick = () => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        analytics.trackAsync(Events.HAVE_MORE_QUESTIONS_SUBMIT)
        break;
      case SUGGESTION_POPUP_TYPES.NAV_BAR_ANALYTICS:
        analytics.trackAsync(Events.ANALYTICS_CATEGORY_FEEDBACK_SUBMIT);
        break;
      case SUGGESTION_POPUP_TYPES.METRICS:
        analytics.trackAsync(Events.ANALYTICS_PAGE_DETAILS_FEEDBACK_SUBMIT);
        break;
      case SUGGESTION_POPUP_TYPES.CLIENT_METRICS:
        analytics.trackAsync(Events.ANALYTICS_CLIENT_FEEDBACK_SUBMIT);
        break;
      case SUGGESTION_POPUP_TYPES.NAV_BAR_INT_ACC_PLATFORM:
        analytics.trackAsync(Events.PLATFORM_INTEGRATION_FEEDBACK_SUBMIT);
        break;
      case SUGGESTION_POPUP_TYPES.NEED_HELP_OTHER_PLATFORMS:
        analytics.trackAsync(Events.PLATFORM_INTEGRATION_HELP_SUBMIT);
        break;
      case SUGGESTION_POPUP_TYPES.CLIENTS_DETAIL_PAGE:
        analytics.trackAsync(Events.CLIENT_DETAILS_FEEDBACK_SUBMIT);
        break;
      default:
        analytics.trackAsync(Events.INTL_ACCOUNTS_FEEDBACK_SUBMIT, {
          platform: selectedPlatform,
        });
        break;
    }
    if (!suggestionText) {
      setErrorText(Locale.pleaseAddSomeFeedback);
      return;
    }
    setIsLoading(true);
    sendFeedback({
      onSuccess: onFeedbackSubmitSuccess,
      onError: onFeedbackSubmitError,
      questionType: getQuestionType(),
      answer: getAnswer(),
    });
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        analytics.trackAsync(Events.FOCUSED_HOME.MORE_Q_FORM_SUBMIT_CLICKED, {
          project: "fhv2",
          subpage: "fh_intent",
          had_callback_request: requestCallback,
          text_length: suggestionText.length,
        });
        break;
      default:
        break;
    }
  };

  if (submitSuccess) {
    return (
      <div className={"flex flex-col gap-4 items-center -mt-6"}>
        <FullTickIconWithCircles />
        <div className={"flex flex-col gap-2 items-center"}>
          <Typography text={Locale.responseWasSubmitted} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} />
          <Typography
            text={requestCallback ? Locale.youWillReceiveCallback : Locale.weWillGetBack}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-600 !font-normal"}
          />
        </div>
      </div>
    );
  }

  const onFocusFunction = () => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        analytics.trackAsync(Events.FOCUSED_HOME.MORE_Q_FORM_TEXT_INPUT_FOCUSED, {
          project: "fhv2",
          subpage: "fh_intent",
        });
        return;
    }
  };

  const onCheckboxClickFunction = (value: boolean) => {
    switch (popupType) {
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        analytics.trackAsync(Events.FOCUSED_HOME.MORE_Q_FORM_CALLBACK_REQUESTED, {
          project: "fhv2",
          subpage: "fh_intent",
          checked: value,
        });
        return;
    }
  };

  return (
    <div className={"flex flex-col items-end"}>
      <TextInput
        label={getLabel()}
        type={"textarea"}
        inputClass={"flex-1 w-full"}
        inputProps={{ rows: 5 }}
        value={suggestionText}
        onChange={(value) => {
          setSuggestionText(value);
          setErrorText("");
        }}
        placeholder={getPlaceholder()}
        isError={!!errorText}
        footerText={errorText}
        onFocus={onFocusFunction}
      />
      {showRequestCallback() ? (
        <CheckBox
          label={Locale.requestCallback}
          onCheckboxClick={(value) => {
            setRequestCallback(value.target.checked);
            onCheckboxClickFunction(value.target.checked);
          }}
          checked={requestCallback}
          containerClass={"mt-4 self-start"}
        />
      ) : null}
      <Button
        title={Locale.submit}
        onButtonClick={onSubmitClick}
        size={BUTTON_SIZES.SMALL}
        buttonClass={"!mt-6"}
        isLoading={isLoading}
      />
    </div>
  );
};

export default SuggestionPopupContent;

type GraphqlMutationResponse = {
  data: {
    addCustomerFeedback: boolean;
  };
};
