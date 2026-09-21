import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Typography from "../AtomicComponents/Typography";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import { BankUsageType } from "../../constants/dashboardConstants";

const ShareDetailsCopyInstruction = () => {
  const { shareBankAccountUsageType } = useInternationalAccountsStore();
  return (
    <div className={"py-6 px-4 bg-white rounded-10px flex flex-col gap-6 h-full"}>
      <Typography
        text={Locale.stepsToReceivePayment}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"!font-bold"}
      />
      <div className={"flex flex-col justify-between h-full"}>
        <div className={"flex flex-col gap-4"}>
          <Typography
            text={"Step 1"}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!font-bold !text-black-500"}
          />
          <div className={"flex flex-col gap-2"}>
            <Typography
              text={Locale.copyAccDetailsAndShare}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!font-bold"}
            />
            <Typography
              text={Locale.shareAccDetailsInst}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-600"}
            />
          </div>
        </div>
        <hr className={"!text-black-400"} />
        <div className={"flex flex-col gap-4"}>
          <Typography
            text={"Step 2"}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!font-bold !text-black-500"}
          />
          <div className={"flex flex-col gap-2"}>
            <Typography
              text={Locale.shareDetailsWithSkydo}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!font-bold"}
            />
            <Typography
              text={Locale.shareDetailsWithSkydoInst}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-600"}
            />
          </div>
        </div>
        <hr className={"!text-black-400"} />
        <div className={"flex flex-col gap-4"}>
          <Typography
            text={"Step 3"}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!font-bold !text-black-500"}
          />
          <div className={"flex flex-col gap-2"}>
            <Typography
              text={
                shareBankAccountUsageType === BankUsageType.BALANCE
                  ? Locale.fundsWillGetAddedToBalance
                  : Locale.fundsWillGetSettled
              }
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!font-bold"}
            />
            <Typography
              text={
                shareBankAccountUsageType === BankUsageType.BALANCE
                  ? Locale.fundsCanBeUsedToPayOrWithdraw
                  : Locale.fundsWillGetSettledInst
              }
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-600"}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareDetailsCopyInstruction;
