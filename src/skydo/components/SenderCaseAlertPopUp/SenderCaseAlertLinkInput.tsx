import TextInput from "../AtomicComponents/TextInput";
import React, { useEffect, useState } from "react";
import Button from "../AtomicComponents/Button";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, INPUT_TYPES } from "../../constants/atomicConstants";
import { useSenderCaseAlertStore } from "../../store/senderCaseAlertStore";
import classNames from "classnames";

interface Props {
  onSubmitDocs: (files?: File[], link?: string) => void;
  hideSubmit?: boolean;
}

const SenderCaseAlertLinkInput = (props: Props) => {
  const {
    proofLink,
    showSubmitButton,
    setProofLink,
    setShowSubmitButton,
  } = useSenderCaseAlertStore();

  const onTextChange = (value: string) => {
    setShowSubmitButton(value.length > 0);
    setProofLink(value);
  };
  return (
    <div className={classNames("flex flex-col flex-grow justify-start w-full px-4 items-center relative", !props.hideSubmit ? "mt-10" : "mt-0")}>
      <TextInput
        value={proofLink}
        placeholder={"Enter URL"}
        inputClass={"w-[100%]"}
        size={INPUT_TYPES.MEDIUM}
        onChange={onTextChange}
      />
      {!props.hideSubmit && showSubmitButton ? (
        <Button
          title={Locale.submit}
          buttonClass={"absolute bottom-0 right-0"}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={() => props.onSubmitDocs(undefined, proofLink)}
        />
      ) : null}
    </div>
  );
};

export default SenderCaseAlertLinkInput;
