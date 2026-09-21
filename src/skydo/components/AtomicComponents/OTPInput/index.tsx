//Jul 2024

import TextInput from "../TextInput";
import React, { ForwardedRef, Ref, useImperativeHandle } from "react";
import { OtpInputRef, TextInputRef } from "../../../types/atomicComponentTypes";
import Typography from "../Typography";
import { DEFAULT_OTP_LENGTH, TYPOGRAPHY_SIZES } from "../../../constants/atomicConstants";
import classNames from "classnames";
import RawOtpInput, { InputProps } from "./RawOtpinput";
import { detectBrowser } from "../../../utils/browserDetection";

interface Props {
  otp: string;
  onChange: (otp: string) => void;
  otpLength?: number;
  error?: string;
  containerClass?: string;
  showFieldError?: boolean;
  onFocus?: () => void;
}

/**
 * The column count has to follow otpLength, and Tailwind cannot take it interpolated - an unseen
 * class name is purged from the build. Callers already ask for 4 (the UBO forms' phone OTP) and 6.
 */
const OTP_GRID_COLUMNS: { [key: number]: string } = {
  4: "grid-cols-4",
  6: "grid-cols-6",
};

const OtpInput = React.forwardRef<OtpInputRef, Props>((props: Props, ref: ForwardedRef<OtpInputRef>) => {
  const { error, containerClass, otpLength = DEFAULT_OTP_LENGTH, showFieldError, onFocus } = props;
  const rawOtpInputRef = React.useRef<OtpInputRef>(null);
  const onChange = (otp: string) => {
    props.onChange(otp);
  };
  const { isFirefox } = detectBrowser();
  useImperativeHandle(ref, () => ({
    focus: (number) => {
      rawOtpInputRef.current?.focus(number || 0);
    },
  }));
  const renderInput = (inputProps: InputProps, index: number) => {
    return (
      <TextInput
        value={inputProps.value as string | number | undefined}
        placeholder={inputProps.placeholder}
        ref={inputProps.ref as Ref<TextInputRef> | undefined}
        customClass={"text-center !w-5"}
        inputWrapperClass={"items-center justify-center !px-2"}
        isError={showFieldError && !!error}
        onChange={(value, event) => {
          inputProps.onChange(event);
        }}
        onBlur={inputProps.onBlur as () => void}
        onKeyDown={inputProps.onKeyDown}
        onPaste={inputProps.onPaste as (event: React.ClipboardEvent) => void}
        type={isFirefox ? "text" : "number"}
        inputProps={{
          autoComplete: inputProps.autoComplete,
          maxLength: 1,
          "aria-label": inputProps["aria-label"],
          style: inputProps.style,
          inputMode: inputProps.inputMode,
          onInput: inputProps.onInput,
        }}
        onFocus={(event) => {
          (inputProps.onFocus as (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void)?.(event);
          if (index === 0) onFocus?.();
        }}
      />
    );
  };
  return (
    <div className={classNames("flex flex-col", containerClass)}>
      <RawOtpInput
        value={props.otp}
        onChange={onChange}
        renderInput={renderInput}
        numInputs={otpLength}
        containerStyle={classNames("grid gap-x-2", OTP_GRID_COLUMNS[otpLength] ?? OTP_GRID_COLUMNS[DEFAULT_OTP_LENGTH])}
        shouldAutoFocus={true}
        ref={rawOtpInputRef}
        inputType={isFirefox ? "text" : "number"}
      />
      {!!error ? <Typography text={error} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-red-400 mt-2"} /> : null}
    </div>
  );
});

OtpInput.displayName = "OtpInput";

export default OtpInput;
