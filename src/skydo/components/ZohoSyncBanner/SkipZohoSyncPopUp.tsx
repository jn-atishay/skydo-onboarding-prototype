import Popup from "../AtomicComponents/Popup";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React, { useEffect } from "react";
import RadioButton from "../AtomicComponents/RadioButton";
import Typography from "../AtomicComponents/Typography";
import TextInput from "../AtomicComponents/TextInput";
import { SKIP_ZOHO_SYNC_OPTIONS } from "../../types/ZohoSync";

interface Props {
  showPopUp: boolean;
  closePopUp: () => void;
  skipReasonIndex: number;
  setSkipReasonIndex: (idx: number) => void;
  otherReason: string;
  setOtherReason: (reason: string) => void;
  skipConfirmClick: () => void;
}

const SkipZohoSyncPopUp = (props: Props) => {
  const { showPopUp, closePopUp, skipReasonIndex, setSkipReasonIndex, otherReason, setOtherReason, skipConfirmClick } =
    props;

  useEffect(() => {
    if (showPopUp && skipReasonIndex === -1) {
      setSkipReasonIndex(0);
    }
  }, [showPopUp]);

  const renderContent = () => {
    return (
      <div className={"flex flex-col"}>
        {SKIP_ZOHO_SYNC_OPTIONS.map((item, index) => {
          return (
            <div className={index === 0 ? "" : "mt-[16px]"} key={index}>
              <RadioButton
                label={() => (
                  <span
                    className={"pl-2.5 cursor-pointer"}
                    onClick={() => {
                      setSkipReasonIndex(index);
                    }}
                  >
                    <Typography text={item} size={TYPOGRAPHY_SIZES.SMALL} type={TYPOGRAPHY_TYPES.PARA} />
                  </span>
                )}
                checked={index == skipReasonIndex}
                onChange={(e) => {
                  setSkipReasonIndex(index);
                }}
                id={index.toString()}
              />
              {skipReasonIndex != 0 && index == skipReasonIndex ? (
                <div className={"ml-[26px] mt-2"}>
                  <TextInput
                    placeholder={
                      skipReasonIndex === 2
                        ? Locale.zohoSync.skipPopUp.otherReasonLabel
                        : Locale.zohoSync.skipPopUp.optionTwoLabel
                    }
                    onChange={setOtherReason}
                    value={otherReason}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    );
  };

  const renderCta = () => {
    return (
      <div className={"flex flex-row space-x-2"}>
        <Button
          buttonClass={"mt-6"}
          title={Locale.cancel}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={closePopUp}
        />
        <Button
          buttonClass={"mt-6"}
          title={Locale.confirm}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          isDisabled={skipReasonIndex == -1}
          onButtonClick={skipConfirmClick}
        />
      </div>
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      isDashboardPopup={true}
      title={
        <div className={"flex flex-col gap-1"}>
          <Typography
            text={Locale.zohoSync.skipPopUp.title}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
          />
          <Typography
            text={Locale.zohoSync.skipPopUp.subText}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
      }
      headerClass={"items-start"}
      isCommonHeader={true}
      open={showPopUp}
      outsideClick={closePopUp}
      closeIconClick={closePopUp}
      renderCTAs={renderCta}
    />
  );
};

export default SkipZohoSyncPopUp;
