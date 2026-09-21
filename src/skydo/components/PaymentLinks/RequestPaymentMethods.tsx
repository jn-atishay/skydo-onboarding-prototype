import React, { useState } from "react";
import Popup from "../AtomicComponents/Popup";
import CheckBox from "../AtomicComponents/CheckBox";
import Button from "../AtomicComponents/Button";
import Typography from "../AtomicComponents/Typography";
import { submitPaymentMethodFeedback } from "../../BFFServices/PaymentMethodFeedbackService";
import useToastMessages from "../../store/toastMessages";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  INPUT_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import TextInput from "../AtomicComponents/TextInput";
import { fetchData } from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import Locale from "../../util/locale/en";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";

interface RequestPaymentMethodsProps {
  show: boolean;
  onClose: () => void;
}

const RequestPaymentMethods: React.FC<RequestPaymentMethodsProps> = ({ show, onClose }) => {
  const [selectedMethods, setSelectedMethods] = useState<{
    [key: string]: boolean;
  }>({
    "Credit / Debit card": false,
    "Apple Pay": false,
    Venmo: false,
    Other: false,
  });
  const [feedback, setFeedback] = useState("");
  const [feedbackError, setFeedbackError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useToastMessages();
  const handleCheckboxChange = (method: string) => {
    setSelectedMethods((prev) => ({
      ...prev,
      [method]: !prev[method],
    }));

    // Clear feedback and error when Other is unchecked
    if (method === "Other" && selectedMethods.Other) {
      setFeedback("");
      setFeedbackError("");
    }
  };

  const handleSubmit = async () => {
    // Validate if Other is selected but feedback is empty
    if (selectedMethods.Other && !feedback.trim()) {
      setFeedbackError("Please provide feedback for other payment methods");
      return;
    }

    const selected = Object.entries(selectedMethods)
      .filter(([_, isSelected]) => isSelected)
      .map(([method]) => (method === "Other" ? "Other: " + feedback : method));

    if (selected.length > 0) {
      setIsSubmitting(true);
      try {
        const response = await fetchData({
          path: BE_ROUTES.PAYMENT_METHOD_FEEDBACK,
          method: ALLOWED_METHODS.POST,
          body: {
            requestedMethods: selected,
          },
        });
        if (response.success) {
          setSelectedMethods({
            "Credit / Debit card": false,
            "Apple Pay": false,
            Venmo: false,
            Other: false,
          });
          setFeedback("");
          onClose();
          addToast({
            id: "request-payment-methods-success",
            type: TOAST_TYPES.SUCCESS,
            body: Locale.feedbackSubmitSuccess,
          });
        } else {
          addToast({
            id: "request-payment-methods-error",
            type: TOAST_TYPES.ERROR,
            body: "Failed to submit feedback. Please try again.",
          });
        }
      } catch (error) {
        console.error("Error submitting payment method feedback:", error);
        addToast({
          id: "request-payment-methods-error",
          type: TOAST_TYPES.ERROR,
          body: "Failed to submit feedback. Please try again.",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCancel = () => {
    // Reset form
    setSelectedMethods({
      "Credit / Debit card": false,
      "Apple Pay": false,
      Venmo: false,
      Other: false,
    });
    setFeedback("");
    setFeedbackError("");
    onClose();
  };

  const renderContent = () => {
    return (
      <div className="">
        <div className="flex flex-col gap-8">
          {/* Header */}
          <div className="flex flex-row justify-between">
            <div className="flex flex-col gap-1">
              <Typography
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                text="Request additional payment methods"
                fontWeight={700}
              />
              <Typography
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses="text-neutral-500 opacity-78"
                text="Your feedback guides future payment offerings"
                fontWeight={400}
              />
            </div>
            <CrossIcon width={24} height={24} onClick={onClose} className="cursor-pointer" />
          </div>

          {/* Payment Methods */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              {Object.keys(selectedMethods).map((method) => (
                <CheckBox
                  key={method}
                  label={method}
                  checked={selectedMethods[method]}
                  onCheckboxClick={() => handleCheckboxChange(method)}
                />
              ))}
            </div>

            {/* Feedback Textarea - Show only when "Other" is selected */}
            {selectedMethods["Other"] && (
              <div className="flex flex-col gap-2">
                <TextInput
                  label="Share your feedback"
                  type="textarea"
                  size={INPUT_TYPES.SMALL}
                  value={feedback}
                  onChange={(val) => {
                    setFeedback(val);
                    // Clear error when user starts typing
                    if (feedbackError) {
                      setFeedbackError("");
                    }
                  }}
                  placeholder="Type here..."
                  isError={!!feedbackError}
                  footerText={feedbackError}
                />
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={handleCancel}
              title="Cancel"
            />
            <Button
              type={BUTTON_TYPES.PRIMARY}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={handleSubmit}
              isDisabled={!Object.values(selectedMethods).some((v) => v) || isSubmitting}
              isLoading={isSubmitting}
              title="Submit"
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popup
      open={show}
      closeIconClick={handleCancel}
      outsideClick={handleCancel}
      isDashboardPopup={true}
      renderContent={renderContent}
    />
  );
};

export default RequestPaymentMethods;
