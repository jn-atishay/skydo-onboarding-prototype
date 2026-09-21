import React from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { BankAccountField } from "../../types";
import Button from "../AtomicComponents/Button";

export interface AccountDetailCoreProps {
  correspondentName: string;
  bankAccountFieldList: BankAccountField[] | null;
}

//todo - @Raj - handle fedWireRoutingNumberUS
const AccountDetailLine: React.FC<{ label: string; value: string; classes: string }> = (props) => {
  return (
    <div className={`flex flex-row w-full ${props.classes} wrap max-w-[300px]`}>
      <Typography
        text={`${props.label}:`}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"!text-black-500 mr-1"}
      >
        <Typography text={` ${props.value}`} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </Typography>
    </div>
  );
};

const getShowAccountButton = () => (
  <Button
    title={Locale.viewAccountDetails}
    type={BUTTON_TYPES.PRIMARY}
    size={BUTTON_SIZES.SMALL}
    onButtonClick={() => {}}
    buttonClass={"!py-[10px] !px-4 !cursor-not-allowed "}
  />
);

const AccountDetailCore: React.FC<AccountDetailCoreProps> = (props) => {
  const { bankAccountFieldList } = props;

  if (!bankAccountFieldList || bankAccountFieldList.length == 0) {
    return getShowAccountButton();
  }

  const renderFields = () => {
    return bankAccountFieldList.map(({ label, value }) => {
      return <AccountDetailLine label={label} value={value} classes={"mb-1"} key={label} />;
    });
  };

  return (
    <div className={"flex flex-col bg-blue-50 p-6 rounded-10px w-full"}>
      <div className={"flex flex-col w-full"}>
        <Typography
          text={Locale.exportersAccountDetails.replace(":company", props.correspondentName)}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
        />
      </div>
      <div className={"flex flex-col w-full mt-4"}>{renderFields()}</div>
    </div>
  );
};

interface AccountInfoProps extends AccountDetailCoreProps {}

const PreferredAccountInfo: React.FC<AccountInfoProps> = (props) => {
  return (
    <AccountDetailCore correspondentName={props.correspondentName} bankAccountFieldList={props.bankAccountFieldList} />
  );
};

export default PreferredAccountInfo;
