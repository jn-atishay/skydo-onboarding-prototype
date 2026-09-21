import useUserData from "../../store/useUserData";
import { USER_STATES } from "../../constants/onboarding";
import Locale from "../locale/en";

const useSkydoDetails = () => {
  const { userState } = useUserData();
  let skydoContact = Locale.supportPhone;
  let skydoEmail = Locale.supportMail;

  if (
    userState &&
    !(
      userState === USER_STATES.BENEFICIARY_ACCOUNT_PENDING ||
      userState === USER_STATES.MANUAL_VERIFICATION ||
      userState === USER_STATES.VIRTUAL_ACCOUNT_CREATE ||
      userState === USER_STATES.BLACK_LISTED ||
      userState === USER_STATES.ARCHIVED ||
      userState === USER_STATES.NO_STATE
    )
  ) {
    skydoContact = Locale.salesPhone;
    skydoEmail = Locale.salesMail;
  }

  return { skydoContact, skydoEmail };
};

export default useSkydoDetails;
