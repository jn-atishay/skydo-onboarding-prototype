/*
  value
    initial value - break it into strings of length 4 each
    initialise value

  state = array of length 3 of strings of length 4


  3 number input boxes, max chars 4 each
  onInput
    1. if input length < 4 save
    2. if input lenght ==4 focus next
    3. backspace
      1. if input length == 0 - focus prev
      2. if input length >0 remove
 */

import TextInput from "../AtomicComponents/TextInput";
import React, { useRef } from "react";
import { getSplittedAadhaar } from "../../util/functions";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import Locale from "../../util/locale/en";
import classNames from "classnames";
import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import { AadhaarNumberType, TextInputRef } from "../../types/atomicComponentTypes";
import JSHelpers from "../AtomicComponents/JSHelpers";

interface Props {
  aadhaarNumb: AadhaarNumberType;
  onAadhaarChange: (data: AadhaarNumberType) => void;
  isOnlyNumber?: boolean;
  title: string;
  isError?: boolean;
  errorText?: string;
  onAadhaarVerifyClick: () => void;
  containerClass?: string;
  isVerified?: boolean;
  isAadhaarVerifyLoading: boolean;
}

const AadhaarInput = (props: Props) => {
  const BACKSPACE = "Backspace";
  const aadhaarInit = new Array(3).fill("") as AadhaarNumberType;

  const {
    aadhaarNumb = aadhaarInit,
    onAadhaarVerifyClick,
    containerClass,
    isVerified,
    isAadhaarVerifyLoading,
    onAadhaarChange,
    isOnlyNumber = true,
    title,
    errorText,
    isError,
  } = props;

  const inputRefs = useRef<TextInputRef[]>([]);

  const onInputChange = (event: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    const inputBoxValue = aadhaarNumb[index];
    const inputValue = event.key;
    if (event.key === BACKSPACE) {
      if (inputBoxValue?.length === 0 && index > 0) {
        inputRefs?.current[index - 1]?.focus();
      } else if (!inputBoxValue && index > 0) {
        inputRefs?.current[index - 1]?.focus();
        return;
      } else if (!inputBoxValue || inputBoxValue.length === 0) {
        return;
      }
      aadhaarNumb[index] = inputBoxValue.slice(0, -1);
      onAadhaarChange([...aadhaarNumb]);
    }
    if (isOnlyNumber) {
      if (!(inputValue.charCodeAt(0) < 58 && inputValue.charCodeAt(0) > 47)) {
        return;
      }
    }
    const finalValue = inputBoxValue + inputValue;

    if (finalValue.length > 4) {
      inputRefs?.current[index + 1]?.focus();
      return;
    }

    aadhaarNumb[index] = finalValue;
    onAadhaarChange([...aadhaarNumb]);
    if (finalValue.length >= 4) {
      inputRefs?.current[index + 1]?.focus();
    }
  };

  const onValuePaste = (event: React.ClipboardEvent, index: number) => {
    const value = event.clipboardData.getData("text/plain");
    const trimmedVal = value.trim() || value;
    const isNumber = JSHelpers.isOnlyNumberAndSpaces(trimmedVal);
    if (trimmedVal && isNumber) {
      const pastedAadhaarValues = getSplittedAadhaar(trimmedVal);
      pastedAadhaarValues.forEach((val, i) => {
        if (index + i < 3 && val) {
          aadhaarNumb[index + i] = val;
        }
      });
      onAadhaarChange([...aadhaarNumb]);
    }
  };

  const renderAadhaarInputBoxes = () => {
    const inputBoxes = [];

    for (let i = 0; i < 3; ++i) {
      inputBoxes.push(
        <TextInput
          key={`aadhaar-${i}`}
          ref={(val) => {
            if (val) inputRefs.current[i] = val;
          }}
          inputProps={{ maxLength: 4 }}
          value={aadhaarNumb[i]}
          customClass={"text-center w-1"}
          inputWrapperClass={"items-center justify-center !px-2"}
          onKeyDown={(event) => onInputChange(event, i)}
          onPaste={(event: React.ClipboardEvent) => onValuePaste(event, i)}
          isError={isError}
          isDisabled={isVerified}
        />
      );
    }

    return <div className={"flex-1 grid grid-cols-3 gap-x-2"}>{inputBoxes.map((inputBox) => inputBox)}</div>;
  };

  return (
    <div className={classNames("flex flex-col", containerClass)}>
      <Typography
        text={title}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={isError ? "!text-red-400" : ""}
      />
      <CustomisedNavigationForm onSubmit={onAadhaarVerifyClick}>
        <div className={"flex flex-row mt-2"}>
          {renderAadhaarInputBoxes()}
          <Button
            isLoading={isAadhaarVerifyLoading}
            title={isVerified ? Locale.verified : Locale.verify}
            onButtonClick={() => {
              if (isVerified) {
                return;
              }
              onAadhaarVerifyClick();
            }}
            buttonClass={isVerified ? "ml-3 !bg-green-50" : "ml-3"}
            textClasses={isVerified ? "!text-green-400" : ""}
          />
        </div>
      </CustomisedNavigationForm>
      {isError && errorText ? (
        <Typography text={errorText} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-red-400 mt-2"} />
      ) : null}
    </div>
  );
};

export default AadhaarInput;
