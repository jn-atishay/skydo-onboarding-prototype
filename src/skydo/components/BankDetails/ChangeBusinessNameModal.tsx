import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { getMobileDetect } from "../../util/functions";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import Popup from "../AtomicComponents/Popup";
import BottomSheet from "../AtomicComponents/BottomSheet";
import TextInput from "../AtomicComponents/TextInput";
import Locale from "../../util/locale/en";
import { ChangeBusinessNameFormValues } from "../../types/Onboarding";

interface ChangeBusinessNameModalProps {
  isOpen: boolean;
  currentBusinessName: string;
  isSaving: boolean;
  onClose: () => void;
  onGoBack: () => void;
  onSave: (values: ChangeBusinessNameFormValues) => void;
}

const validateRequired = (errorMessage: string) => (value?: string) =>
  value?.trim() ? undefined : errorMessage;

const ChangeBusinessNameModal = (props: ChangeBusinessNameModalProps) => {
  const { isOpen, currentBusinessName, isSaving, onClose, onGoBack, onSave } = props;
  const [isMobileDevice, setIsMobileDevice] = useState(false);

  useEffect(() => {
    const { isMobile } = getMobileDetect(navigator.userAgent);
    setIsMobileDevice(isMobile());
  }, []);

  const renderContent = () => (
    <Form<ChangeBusinessNameFormValues>
      onSubmit={onSave}
      render={({ handleSubmit }) => (
        <form onSubmit={handleSubmit} className={"flex flex-col"}>
          <Typography
            text={Locale.changeBusinessNameDescription}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
          <div className={"flex flex-col gap-y-6 mt-6"}>
            <Field name={"businessLegalName"} validate={validateRequired(Locale.businessNameRequired)}>
              {({ input, meta }) => (
                <TextInput
                  label={Locale.businessNameLabel}
                  isLabelRequired={true}
                  value={input.value}
                  onChange={(value) => input.onChange(value)}
                  onBlur={input.onBlur}
                  isError={meta.touched && !!meta.error}
                  footerText={
                    meta.touched && meta.error
                      ? meta.error
                      : Locale.currentBusinessName.replace(":name", currentBusinessName)
                  }
                />
              )}
            </Field>
            <Field name={"shortname"} validate={validateRequired(Locale.businessNameForCommunicationRequired)}>
              {({ input, meta }) => (
                <TextInput
                  label={Locale.businessNameForCommunication}
                  isLabelRequired={true}
                  value={input.value}
                  onChange={(value) => input.onChange(value)}
                  onBlur={input.onBlur}
                  isError={meta.touched && !!meta.error}
                  footerText={meta.touched && meta.error ? meta.error : undefined}
                />
              )}
            </Field>
          </div>
          <div className={"flex gap-4 justify-end mt-8 flex-col-reverse md:flex-row"}>
            <Button
              title={Locale.goBack}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.MEDIUM}
              nativeType={"button"}
              onButtonClick={onGoBack}
              buttonClass={"!w-full md:!w-fit"}
            />
            <Button
              title={Locale.saveAndContinue}
              type={BUTTON_TYPES.PRIMARY}
              size={BUTTON_SIZES.MEDIUM}
              isLoading={isSaving}
              onButtonClick={handleSubmit}
              buttonClass={"!w-full md:!w-fit"}
            />
          </div>
        </form>
      )}
    />
  );

  if (isMobileDevice) {
    return (
      <BottomSheet isOpen={isOpen} onClose={onClose} title={Locale.changeBusinessName}>
        {renderContent()}
      </BottomSheet>
    );
  }

  return (
    <Popup
      renderContent={renderContent}
      isCommonHeader={true}
      headerContainerClass={"!mb-3"}
      containerClass={"!w-11/12 md:!w-4/12"}
      title={Locale.changeBusinessName}
      open={isOpen}
      closeIconClick={onClose}
      outsideClick={onClose}
    />
  );
};

export default ChangeBusinessNameModal;
