import React from "react";
import classNames from "classnames";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { PurposeCode } from "../../types";
import Locale from "../../util/locale/en";
import Notes from "../AtomicComponents/Notes";
import RadioButton from "../AtomicComponents/RadioButton";
import TextInput from "../AtomicComponents/TextInput";
import Typography from "../AtomicComponents/Typography";
import PurposeCodeSelectorTrigger from "./PurposeCodeSelectorTrigger";

type Props = {
  purposeCode: PurposeCode;
  fileForSoftex: boolean | null;
  isError: boolean;
  showFollowUp?: boolean;
  warningText?: string;
  showIecInput?: boolean;
  iec?: string;
  iecError?: string;
  onChangePurposeCode: () => void;
  onFileForSoftexChange: (value: boolean) => void;
  onIecChange?: (value: string) => void;
};

const SoftexRadioButton = ({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: () => void;
}) => (
  <RadioButton
    id={id}
    name={"default-purpose-code-softex"}
    checked={checked}
    onChange={onChange}
    className={"gap-4"}
    inputClassName={"!h-6 !w-6"}
    label={() => (
      <label htmlFor={id} className={"cursor-pointer"}>
        <Typography text={label} size={TYPOGRAPHY_SIZES.MEDIUM} />
      </label>
    )}
  />
);

const DefaultPurposeCodeSoftex = ({
  purposeCode,
  fileForSoftex,
  isError,
  showFollowUp = true,
  warningText,
  showIecInput = false,
  iec = "",
  iecError = "",
  onChangePurposeCode,
  onFileForSoftexChange,
  onIecChange,
}: Props) => {
  return (
    <div className={"flex flex-col gap-2"}>
      <PurposeCodeSelectorTrigger purposeCode={purposeCode} isError={isError} onClick={onChangePurposeCode} />

      {showFollowUp ? (
        <div className={"rounded-10px bg-white p-4"}>
          <div className={"flex flex-col gap-6"}>
            <div className={"flex flex-col gap-2.5"}>
              <Typography
                text={Locale.softexQuestionTitle}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!font-bold"}
              />
              <div className={"flex flex-col gap-5"}>
                <div>
                  <Typography
                    text={`${Locale.softexFilingDescription} `}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-neutral-500"}
                  />
                  <a
                    href={"https://www.rbi.org.in/scripts/BS_FemaNotifications.aspx?Id=177"}
                    target={"_blank"}
                    rel={"noreferrer"}
                  >
                    <Typography
                      text={`${Locale.knowMore}.`}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={"!text-primary-300"}
                    />
                  </a>
                </div>
                <Typography
                  text={Locale.softexFilingHelper}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-neutral-500"}
                />
              </div>
            </div>

            <div className={"flex flex-col gap-4"}>
              <SoftexRadioButton
                id={"default-purpose-code-softex-yes"}
                label={Locale.softexFilingYes}
                checked={fileForSoftex === true}
                onChange={() => onFileForSoftexChange(true)}
              />
              <SoftexRadioButton
                id={"default-purpose-code-softex-no"}
                label={Locale.softexFilingNo}
                checked={fileForSoftex === false}
                onChange={() => onFileForSoftexChange(false)}
              />
            </div>

            {showIecInput ? (
              <div className={"-mt-2 flex flex-col gap-2"}>
                <div className={"flex"}>
                  <Typography
                    text={Locale.purposeCodeIecLabel}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={classNames({ "!text-warning-400": !!iecError })}
                  />
                  <Typography
                    text={"*"}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={"!text-warning-400"}
                  />
                </div>
                <TextInput
                  value={iec}
                  onChange={(value) => onIecChange?.(value)}
                  isError={!!iecError}
                  footerText={iecError}
                  inputProps={{ "aria-label": Locale.iecInputLabel }}
                />
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      {showFollowUp && warningText ? (
        <Notes text={warningText} iconHeight={24} iconWidth={24} className={"border border-alert-200 bg-alert-50"} />
      ) : null}
    </div>
  );
};

export default DefaultPurposeCodeSoftex;
