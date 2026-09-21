import SkydoFullIcon from "../Icons/SkydoFullIcon";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import useReferralStore from "../../store/useReferralStore";
import { getRefereeRewardValue, referralHeadlineCopy } from "../../util/referralUtil";
import SkydoBenefits from "../LoginComponents/SkydoBenefits";
import TrustPartners from "../LoginComponents/TrustPartners";
import ReferralInvitePill from "../LoginComponents/ReferralInvitePill";

const SkydoProductLoginInfo = () => {
  const { referrerDetailsViaCode, hasFetchedReferrerDetailsViaCode } = useReferralStore();
  const { highlight, subheading } = referralHeadlineCopy(
    hasFetchedReferrerDetailsViaCode,
    getRefereeRewardValue(referrerDetailsViaCode)
  );

  return (
    <div className={"flex flex-col min-h-[736px] justify-between"}>
      <div className={"flex flex-col"}>
        <SkydoFullIcon height={32} width={112} />
        <ReferralInvitePill
          exporterName={referrerDetailsViaCode?.exporterName}
          hasFetched={hasFetchedReferrerDetailsViaCode}
          className={"mt-20"}
        />
        <div className={"flex flex-col gap-4 mt-6"}>
          <Typography text={Locale.referralHeadingPrefix} type={TYPOGRAPHY_TYPES.DISPLAY} size={TYPOGRAPHY_SIZES.SMALL}>
            {highlight ? (
              <Typography
                text={highlight}
                type={TYPOGRAPHY_TYPES.DISPLAY}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-green-400"}
              />
            ) : (
              <span className={"inline-block align-middle animate-pulse rounded-10px bg-black-100 h-7 w-24"} />
            )}
            <Typography
              text={subheading}
              type={TYPOGRAPHY_TYPES.DISPLAY}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-600"}
            />
          </Typography>
          <Typography
            text={Locale.referralExportersSavingTextBoldPrefix}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.LARGE}
            fontWeight={700}
            textClasses={"!text-black-600"}
          >
            <Typography
              text={` ${Locale.referralExportersSavingTextMiddle} `}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses={"!text-black-600"}
            />
            <Typography
              text={Locale.referralExportersSavingTextBoldSuffix}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.LARGE}
              fontWeight={700}
              textClasses={"!text-black-600"}
            />
            <Typography
              text={` ${Locale.referralExportersSavingTextSuffix}`}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses={"!text-black-600"}
            />
          </Typography>
        </div>
        <SkydoBenefits />
      </div>
      <TrustPartners />
    </div>
  );
};

export default SkydoProductLoginInfo;
