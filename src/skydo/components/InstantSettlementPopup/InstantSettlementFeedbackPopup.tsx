import React, { useEffect, useMemo, useState } from "react";
import Popup from "../AtomicComponents/Popup";
import BottomSheet from "../AtomicComponents/BottomSheet";
import Button from "../AtomicComponents/Button";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  INPUT_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import RadioButton from "../AtomicComponents/RadioButton";
import TextInput from "../AtomicComponents/TextInput";
import { CUSTOMER_FEEDBACK_QUESTION_TYPE } from "../../constants/dashboardConstants";
import useToastMessages from "../../store/toastMessages";
import Locale from "../../util/locale/en";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import { fetchData } from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { AddCustomerFeedbackMutation } from "../../util/queries";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

// Feedback options list (excluding "Other")

const InstantSettlementFeedbackPopup = (props: Props) => {
  const { isOpen, onClose } = props;
  const [otherText, setOtherText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [otherTextError, setOtherTextError] = useState<string>("");
  const { addToast } = useToastMessages();
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const OtherOptionIndex = Locale.INSTANT_SETTLEMENT.feedbackOptions.length;
  const analytics = useAnalytics();
  let feedbackReasonOptions = useMemo(() => [...Locale.INSTANT_SETTLEMENT.feedbackOptions].sort(() => Math.random() - 0.5), []);


  // Reset states when popup closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedOptionIndex(null);
      setOtherText("");
      setIsLoading(false);
      setOtherTextError("");
    }
  }, [isOpen]);

  const handleOptionChange = (option: string, index: number) => {
    setSelectedOptionIndex(index);
    setOtherTextError(""); // Clear error when switching options
    if (index !== OtherOptionIndex) {
      setOtherText("");
    }
  };

  const handleOtherTextChange = (value: string) => {
    setOtherText(value);
    setOtherTextError(""); // Clear error when user starts typing
  };

  const handleCancel = () => {
    analytics.trackAsync(
      Events.INSTANT_SETTLEMENT.FEEDBACK.CLICK_CLOSE_FEEDBACK_POPUP
    );
    onClose();
  };

  const onFeedbackSubmitError = (error: any) => {
    setIsLoading(false);
    analytics.trackAsync(
      Events.INSTANT_SETTLEMENT.FEEDBACK.FEEDBACK_SUBMISSION_FAILED
    );
    addToast({
      id: "feedback_submit_error",
      type: TOAST_TYPES.ERROR,
      body: "Failed to submit feedback. Please try again.",
    });
  };

  const handleSubmit = () => {
    // Validate that an option is selected
    if (selectedOptionIndex === null) {
      analytics.trackAsync(
        Events.INSTANT_SETTLEMENT.FEEDBACK.FEEDBACK_SUBMIT_CLICKED,
        {
          optionChosen : selectedOptionIndex
        }
      );
      addToast({
        id: "feedback_validation_error",
        type: TOAST_TYPES.ERROR,
        body: Locale.INSTANT_SETTLEMENT.pleaseSelectAnOption,
      });
      return;
    }

    // Validate that if "Other" is selected, text is provided
    if (selectedOptionIndex === OtherOptionIndex && !otherText.trim()) {
      setOtherTextError(Locale.INSTANT_SETTLEMENT.pleaseProvideYourFeedback);
      return;
    }

    setIsLoading(true);

    // Build the answer string
    let answer = "";
    
    if (selectedOptionIndex === OtherOptionIndex) {
      answer = Locale.INSTANT_SETTLEMENT.otherOptionLabel + ": " + otherText.trim();
    } else {
      answer = feedbackReasonOptions[selectedOptionIndex];
    }

    analytics.trackAsync(
      Events.INSTANT_SETTLEMENT.FEEDBACK.FEEDBACK_SUBMIT_CLICKED,
      {
        optionChosen : selectedOptionIndex,
        optionValue : answer
      }
    );

    void fetchData({
      path: BE_ROUTES.GRAPH_QL_DASHBOARD,
      method: ALLOWED_METHODS.POST,
      body: {
        query: AddCustomerFeedbackMutation,
        operationName: "addCustomerFeedback",
        variables: {
          questionType: CUSTOMER_FEEDBACK_QUESTION_TYPE.INSTANT_SETTLEMENT_OPTOUT_FEEDBACK,
          answer: answer,
        },
      },
      onSuccess: (data: GraphqlMutationResponse) => {
        setIsLoading(false);
        if (data?.data?.addCustomerFeedback) {
          addToast({
            id: "feedback_submit_success",
            type: TOAST_TYPES.SUCCESS,
            body: Locale.feedbackSubmitSuccess,
          });
          analytics.trackAsync(
            Events.INSTANT_SETTLEMENT.FEEDBACK.FEEDBACK_SUBMITTED_SUCCESSFULLY
          );
          onClose();
        } else {
          onFeedbackSubmitError(data);
        }
      },
      onError: onFeedbackSubmitError,
    });
  };

  const renderContent = (isMobile: boolean = false) => {
    return (
      <div className="flex flex-col">
        {/* Title - Only show on desktop, mobile uses BottomSheet title */}
        {!isMobile && (
          <div className="flex flex-row justify-between items-center mb-1">
            <Typography
              text={Locale.INSTANT_SETTLEMENT.tellUsWhyYouDidntUseInstantSettlement}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses="!text-black-700 font-bold"
            />
            <div className="cursor-pointer" onClick={() => onClose()}>
              <CrossIcon height={24} width={24} />
            </div>
          </div>
        )}

        {/* Subtitle */}
        <Typography
          text={Locale.INSTANT_SETTLEMENT.yourFeedbackWillHelpUsImproveThisFeature}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={`${isMobile ? 'mb-4' : 'mb-6'} !text-black-500`}
        />

        {/* Feedback Options List */}
        <div className="flex flex-col gap-4 mb-4">
          {feedbackReasonOptions.map((option,index) => {
            return (
            <RadioButton
              key={option}
              id={`feedback_option_${index}`}
              label={option}
              checked={selectedOptionIndex === index}
              onBodyClick={() => {
                if(selectedOptionIndex !== index) {
                  handleOptionChange(option, index)
                }
              }}
              onChange={() => {
                  handleOptionChange(option, index)
              }}
              className="items-start"
            />)
          })}
        </div>

        {/* Other Option (hardcoded at the end) */}
        <div className="mb-4">
          <RadioButton
            id="feedback_option_other"
            label={Locale.INSTANT_SETTLEMENT.otherOptionLabel}  
            checked={selectedOptionIndex === OtherOptionIndex}
            onBodyClick={() => handleOptionChange(Locale.INSTANT_SETTLEMENT.otherOptionLabel, OtherOptionIndex)}
            onChange={() => handleOptionChange(Locale.INSTANT_SETTLEMENT.otherOptionLabel, OtherOptionIndex)}
            className="items-start"
          />
        </div>

        {/* Text Input for Other */}
        {selectedOptionIndex === OtherOptionIndex && (
          <div className="mb-4">
            <TextInput
              label={Locale.INSTANT_SETTLEMENT.shareYourFeedback}
              type="textarea"
              size={INPUT_TYPES.SMALL}
              inputClass="flex-1 w-full"
              inputProps={{ rows: 4 }}
              value={otherText}
              onChange={handleOtherTextChange}
              placeholder={Locale.typeHere}
              isError={!!otherTextError}
              footerText={otherTextError}
            />
          </div>
        )}
      </div>
    );
  };

  const renderMobileCTAs = () => {
    return (
      <div className="flex flex-col gap-3 w-full">
        <Button
          title={Locale.submit}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.MEDIUM}
          onButtonClick={handleSubmit}
          isDisabled={isLoading}
          isLoading={isLoading}
          buttonClass={"!w-full justify-center"}
        />
        <Button
          title={Locale.cancel}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.MEDIUM}
          onButtonClick={handleCancel}
          isDisabled={isLoading}
          buttonClass={"!w-full justify-center"}
        />
      </div>
    );
  };

  const renderDesktopCTAs = () => {
    return (
      <div className="flex flex-row gap-3 w-full justify-end">
        <Button
          title={Locale.cancel}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.MEDIUM}
          onButtonClick={handleCancel}
          isDisabled={isLoading}
          buttonClass="!min-w-[100px]"
          nativeType="button"
        />
        <Button
          title={Locale.submit}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.MEDIUM}
          onButtonClick={handleSubmit}
          isDisabled={isLoading}
          isLoading={isLoading}
          buttonClass="!min-w-[100px]"
        />
      </div>
    );
  };

  return (
    <>
      {/* Desktop View - Modal Popup */}
      <div className="hide_for_mob">
        <Popup
          open={isOpen}
          renderContent={() => renderContent(false)}
          renderCTAs={renderDesktopCTAs}
          outsideClick={isLoading ? undefined : onClose}
          isDashboardPopup={true}
          isCommonHeader={false}
          containerClass="!max-w-lg"
        />
      </div>
      
      {/* Mobile View - Bottom Sheet */}
      <div className="hide_for_desktop">
        <BottomSheet
          isOpen={isOpen}
          onClose={onClose}
          title={Locale.INSTANT_SETTLEMENT.tellUsWhyYouDidntUseInstantSettlement}
          withCloseIcon={true}
          bottomContent={renderMobileCTAs}
        >
          {renderContent(true)}
        </BottomSheet>
      </div>
    </>
  );
};

export default InstantSettlementFeedbackPopup;

type GraphqlMutationResponse = {
  data: {
    addCustomerFeedback: boolean;
  };
};

