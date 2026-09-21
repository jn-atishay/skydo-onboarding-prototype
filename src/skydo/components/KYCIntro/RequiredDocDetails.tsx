import KYCIcons from "../Icons/KYCIcons";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import InfoIcon from "../Icons/InfoIcon";
import Tooltip from "../AtomicComponents/Tooltip";

const OwnerDetailsTooltip = () => {
  return (
    <div className={"flex flex-col items-start text-start max-w-[234px]"}>
      <Typography text={Locale.privateOwnerHeader} size={TYPOGRAPHY_SIZES.X_SMALL} fontWeight={"700"} />
      <Typography text={Locale.beneOwnerDetails_1} size={TYPOGRAPHY_SIZES.X_SMALL}>
        <Typography
          text={Locale.beneOwnerDetailsHighlight}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          fontWeight={"700"}
          textClasses={"ml-1"}
        />
        <Typography text={Locale.beneOwnerDetails_2} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"ml-1"} />
      </Typography>
      <Typography
        text={Locale.partnershipHeader}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        fontWeight={"700"}
        textClasses={"mt-4"}
      />
      <Typography text={Locale.partnershipDetails_1} size={TYPOGRAPHY_SIZES.X_SMALL}>
        <Typography
          text={Locale.partnershipDetailsHighlight}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          fontWeight={"700"}
          textClasses={"ml-1"}
        />
        <Typography text={Locale.partnershipDetails_2} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"ml-1"} />
      </Typography>
      <Typography
        text={Locale.solePropsHeader}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        fontWeight={"700"}
        textClasses={"mt-4"}
      />
      <Typography text={Locale.solePropsDetails} size={TYPOGRAPHY_SIZES.X_SMALL}>
      </Typography>
    </div>
  );
};

const RequiredDocDetails = () => {
  return (
    <div className={"flex flex-col bg-black-50 rounded-20px flex-1 mr-4 px-13 py-8"}>
      <KYCIcons />
      <Typography
        text={Locale.keepHandy}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={"mt-8 mb-6"}
      />
      <Typography
        text={Locale.companyDetails}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        textClasses={"mb-4 !text-black-500"}
      />
      <Typography text={Locale.companyPanNumber} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM} />
      <Typography text={Locale.companyBankAccount} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM} />
      <Typography text={Locale.latestDeed} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM} />
      <div className={"h-px bg-black-400 my-4"} />
      <div className={"flex items-center mb-4"}>
        <Typography
          text={Locale.beneDetailsHeader}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"mr-1 !text-black-500"}
        />
        <Tooltip tooltipText={<OwnerDetailsTooltip />} position={TOOLTIP_POSITION.RIGHT}>
          <InfoIcon />
        </Tooltip>
      </div>
      <Typography text={Locale.beneNames} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM} />
      <Typography text={Locale.docsRequired} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM} />
      <Typography text={Locale.alternateBeneDetails} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM} />
    </div>
  );
};

export default RequiredDocDetails;
