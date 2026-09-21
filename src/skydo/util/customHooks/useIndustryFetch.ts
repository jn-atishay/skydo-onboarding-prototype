/**
 * @author Raj Sheth
 * created: 21/05/24
 */

import { Option } from "../../types/atomicComponentTypes";
import useOnboardingStore from "../../store/useOnboardingStore";

type IndustryOption = any;

interface IndustryFetchReturn {
  systemSelectedIndustryOption: IndustryOption;
  onBusinessDescriptionChange: (
    businessDescription: IndustryOption,
    successCallback: (industry: IndustryOption) => void
  ) => void;
  isLoading: boolean;
}

interface Props {
  industryOptions: Option[];
}

const useIndustryFetch = (props: Props): IndustryFetchReturn => {
  const { selectedIndustryOption, isIndustryLoading, fetchIndustryOptions } = useOnboardingStore();
  const { industryOptions } = props;

  const fetchIndustry = async (businessDescription: any, successCallback: (industry: IndustryOption) => void) => {
    await fetchIndustryOptions(businessDescription, successCallback, industryOptions);
  };

  const onBusinessDescriptionChange = async (
    businessDescription: any,
    successCallback: (industry: IndustryOption) => void
  ) => {
    await fetchIndustry(businessDescription, successCallback);
  };

  return {
    systemSelectedIndustryOption: selectedIndustryOption,
    onBusinessDescriptionChange,
    isLoading: isIndustryLoading,
  };
};

export default useIndustryFetch;
