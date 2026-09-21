import React from "react";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import Popup from "../AtomicComponents/Popup";
import BottomSheet from "../AtomicComponents/BottomSheet";
import FullTick from "../Icons/FullTick";
import Locale from "../../util/locale/en";
import useBankAccountStore from "../../store/useBankAccountStore";

interface ChangeBankAccountConfirmationProps {
  isOpen: boolean;
  onClose: () => void;
  onGoBack: () => void;
  onConfirm: () => void;
}

const BankAccountItem = (props: { title: string; value: string | undefined }) => {
  const { title, value } = props;
  return (
    <div className={"flex flex-col gap-2"}>
      <div className={"flex"}>
        <Typography
          text={title}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          fontWeight={600}
          textClasses={"!text-black-700"}
        />
      </div>
      <Typography
        text={value ?? ""}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        fontWeight={400}
        textClasses={"!text-black-500"}
      />
    </div>
  );
};

const ChangeBankAccountConfirmation = (props: ChangeBankAccountConfirmationProps) => {
  const { isOpen, onClose, onGoBack, onConfirm } = props;
  const { bankDetails } = useBankAccountStore();
  const { ifscCode, bankBranch, accountNumber, accountHolderName } = bankDetails ?? {};

  const renderContent = () => (
    <div className={"flex flex-col gap-6"}>
      <div className={"flex flex-col"}>
        <Typography
          text={Locale.thisWillReplaceYourCurrentlyLinkedBankAccount}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={400}
          textClasses={"!text-black-600"}
        />
        <Typography
          text={Locale.youCanAddTheAccountThatMatchesYourBankStatement}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={400}
          textClasses={"!text-black-600"}
        />
      </div>
      <div className={"flex flex-col bg-black-50 p-4 rounded-10px gap-4"}>
        <div className={"flex gap-4 justify-between"}>
          <Typography
            text={Locale.currentLinkedBankAccount}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={700}
          />
          <div className={"flex gap-1 items-center"}>
            <FullTick height={16} width={16} />
            <Typography
              text={Locale.verified}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              fontWeight={700}
              textClasses={"!text-green-400"}
            />
          </div>
        </div>
        <div className={"border border-black-400 border-dashed w-full"} />
        <div className={"grid grid-cols-2 grid-rows-2 gap-4"}>
          <BankAccountItem title={Locale.bankAccountNumb} value={accountNumber} />
          <BankAccountItem title={Locale.accountHolderName} value={accountHolderName} />
          <BankAccountItem title={Locale.ifscCode} value={ifscCode} />
          <BankAccountItem title={Locale.bankBranch} value={bankBranch} />
        </div>
      </div>
    </div>
  );

  const renderButtons = () => (
    <div className={"flex gap-4 justify-end mt-6 flex-col-reverse md:flex-row"}>
      <Button
        title={Locale.goBack}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.MEDIUM}
        onButtonClick={onGoBack}
        buttonClass={"!w-full md:!w-fit"}
      />
      <Button
        title={Locale.changeLinkedBankAccount}
        type={BUTTON_TYPES.PRIMARY}
        size={BUTTON_SIZES.MEDIUM}
        onButtonClick={onConfirm}
        buttonClass={"!w-full md:!w-fit"}
      />
    </div>
  );

  return (
    <div>
      <div className={"hide_for_mob"}>
        <Popup
          renderContent={renderContent}
          isCommonHeader={true}
          headerContainerClass={"!mb-3"}
          title={Locale.changeBankAccountDetailsQuestionMark}
          open={isOpen}
          closeIconClick={onClose}
          outsideClick={onClose}
          renderCTAs={renderButtons}
        />
      </div>
      <div className={"hide_for_desktop"}>
        <BottomSheet isOpen={isOpen} onClose={onClose} title={Locale.changeBankAccountDetailsQuestionMark}>
          {renderContent()}
          {renderButtons()}
        </BottomSheet>
      </div>
    </div>
  );
};

export default ChangeBankAccountConfirmation;
