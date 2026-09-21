/**
 * @author Raj Sheth
 * created: 12/12/23
 */

import { useRouter } from "next/router";
import {
  ACCOUNTS_TYPE,
  ALLOWED_FREELANCER_PLATFORMS,
  ALLOWED_IMPORTER_LOCATION,
  LOCATION_CODE,
} from "../../constants/dashboardConstants";
import { isNicheLocation } from "../functions";
import useUserData from "../../store/useUserData";
import { INDIVIDUAL_BUSINESSES } from "../../constants/onboarding";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";

interface UseSelectedPlatformReturn {
  selectedPlatform: string;
  selectedMethod: string;
  selectedType: ACCOUNTS_TYPE;
  selectedLocation: string;
  location: string;
  setLocation: (v: string) => void;
}

/**
 * For international accounts page
 * Finds out all selected Properties from url queries
 */
const useSelectedPlatformInfo = (): UseSelectedPlatformReturn => {
  const { location, setLocation } = useInternationalAccountsStore();
  const router = useRouter();
  const { businessType } = useUserData();
  const isIndividualBusiness = INDIVIDUAL_BUSINESSES.includes(businessType);
  const selectedType = router.query.platform
    ? ACCOUNTS_TYPE.PLATFORM
    : router.query.location
    ? ACCOUNTS_TYPE.LOCATION
    : isIndividualBusiness
    ? ACCOUNTS_TYPE.PLATFORM
    : ACCOUNTS_TYPE.LOCATION;
  let selectedLocation: string = ((router.query.location as string) || ALLOWED_IMPORTER_LOCATION[0]).toUpperCase();
  if (isNicheLocation(selectedLocation)) {
    selectedLocation = LOCATION_CODE.ROW;
  } else if (!ALLOWED_IMPORTER_LOCATION.includes(selectedLocation)) {
    selectedLocation = ALLOWED_IMPORTER_LOCATION[0];
  }
  let selectedPlatform: string = ((router.query.platform as string) || ALLOWED_FREELANCER_PLATFORMS[0]).toUpperCase();
  if (!ALLOWED_FREELANCER_PLATFORMS.includes(selectedPlatform)) {
    selectedPlatform = ALLOWED_FREELANCER_PLATFORMS[0];
  }
  let selectedMethod = selectedType === ACCOUNTS_TYPE.LOCATION ? selectedLocation : selectedPlatform;

  return {
    selectedLocation,
    selectedType,
    selectedMethod,
    selectedPlatform,
    location,
    setLocation,
  };
};

export default useSelectedPlatformInfo;
