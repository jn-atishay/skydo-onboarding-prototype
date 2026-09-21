//Jan 2024
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import KYCIcons from "../Icons/KYCIcons";

interface Props {}

const UtmKycDocsHandy = (props: Props) => {
  const { theme } = useContext(AppContext);
  const {} = props;
  return (
    <div className={"flex flex-col bg-black-50 rounded-20px flex-1 md:px-13 md:py-8 p-4"}>
      <div className={"flex !flex-row items-center md:space-x-20 space-x-4"}>
        <div className={"flex flex-col flex-1 gap-y-1"}>
          <Typography
            text={Locale.utmKycHeader}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"flex-1 !labelsmall md:!headingxsmall"}
            fontWeight={700}
          />
        </div>
        <KYCIcons />
      </div>
      <div className={"flex md:flex-row flex-col justify-between md:gap-12 gap-6"}>
        <div className={"flex flex-1 flex-col gap-4 mt-2"}>
          <Typography text={Locale.companyDetails} textClasses={"!text-black-500 labelxsmall md:labelmedium"} />
          <div className={"flex flex-col gap-2 md:gap-0"}>
            <Typography text={Locale.companyPanNumber} textClasses={"paraxsmall md:paramedium"} />
            <Typography text={Locale.companyBankAccount} textClasses={"paraxsmall md:paramedium"} />
            <Typography text={Locale.latestDeed} textClasses={"paraxsmall md:paramedium"} />
          </div>
        </div>
        <hr className={"w-full border-black-400 hide_for_desktop"} />
        <div className={"flex flex-1 flex-col gap-4 md:mt-2"}>
          <Typography text={Locale.utmKycSubHeader} textClasses={"!text-black-500 labelxsmall md:labelmedium"} />
          <div className={"flex flex-col gap-2 md:gap-0"}>
            <Typography text={Locale.namesOfBusinessOwners} textClasses={"paraxsmall md:paramedium"} />
            <Typography text={Locale.aadhaarAndPan} textClasses={"paraxsmall md:paramedium"} />
            <Typography text={Locale.panNumberOfAlternateOwner} textClasses={"paraxsmall md:paramedium"} />
          </div>
        </div>
      </div>
    </div>
  );
};
export default UtmKycDocsHandy;
