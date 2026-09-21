import Typography from "../AtomicComponents/Typography";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Chip from "../Common/Chip";
import useUserData from "../../store/useUserData";
import useVideoKycStore from "../../store/useVideoKycStore";
import { useEffect } from "react";
import { VKYCStatus } from "../../types/vkyc";
import { USER_STATES } from "../../constants/onboarding";
import Locale from "../../util/locale/en";
import Tooltip from "../AtomicComponents/Tooltip";

const HeaderFocusedHome = () => {
  const { userName, userState } = useUserData();
  const { refetch, verifStatus } = useVideoKycStore();

  useEffect(() => {
    void refetch();
  }, []);

  let status = null;
  let toolTipText = "";
  if (verifStatus == VKYCStatus.APPROVED && userState == USER_STATES.MANUAL_VERIFICATION) {
    status = Locale.focusedHome.kycStatus.manualAndVkycApproved.chipText;
    toolTipText = Locale.focusedHome.kycStatus.manualAndVkycApproved.toolTipText;
  }
  if (verifStatus == VKYCStatus.NOT_STARTED && userState == USER_STATES.MANUAL_VERIFICATION) {
    status = Locale.focusedHome.kycStatus.manualAndVkycNotSarted.chipText;
    toolTipText = Locale.focusedHome.kycStatus.manualAndVkycNotSarted.toolTipText;
  }
  if (verifStatus == VKYCStatus.PENDING && userState == USER_STATES.MANUAL_VERIFICATION) {
    status = Locale.focusedHome.kycStatus.manualAndVkycNotApproved.chipText;
    toolTipText = Locale.focusedHome.kycStatus.manualAndVkycNotApproved.toolTipText;
  }
  if (verifStatus == VKYCStatus.PENDING && userState == USER_STATES.BENEFICIARY_ACCOUNT_PENDING) {
    status = Locale.focusedHome.kycStatus.greenChannelAndVkycNotApproved.chipText;
    toolTipText = Locale.focusedHome.kycStatus.greenChannelAndVkycNotApproved.toolTipText;
  }

  /**
   *
   * KYC under review (1/2)
   * KYC under review (2/2)
   * Business KYC is under review
   * Video verification under review
   *
   * */

  return (
    <div className={"flex flex-row justify-between items-center"}>
      <div className={"flex flex-col"}>
        <Typography
          text={`Hi ${userName} 👋`}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={"700"}
        />
        <Typography
          text={Locale.focusedHome.welcomeToSkydoOneStop}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!text-black-500"}
          fontWeight={"400"}
        />
      </div>
      {status ? (
        <Tooltip tooltipText={toolTipText} position={TOOLTIP_POSITION.TOP} tooltipTheme={"dark"}>
          <Chip containerClass={"!bg-orange-50 border border-orange-400 !py-0"}>
            <Typography
              text={status}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-orange-400"}
            />
          </Chip>
        </Tooltip>
      ) : null}
    </div>
  );
};

export default HeaderFocusedHome;
