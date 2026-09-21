import { useEffect } from "react";
import { BUSSINESS_TYPES, INDIVIDUAL_BUSINESSES } from "../../constants/onboarding";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import CompanyPANInput from "./CompanyPANInput";
import CompanyPANDetailsForm from "./CompanyPANDetailsForm";
import SolePANDetailsForm from "./SolePANDetailsForm";
import FreelancerPANDetailsForm from "./FreelancerPANDetailsForm";
import { Option, SearchDropdownMetaInfo } from "../../types/atomicComponentTypes";
import { debounce } from "../../util/functions";
import { Industry } from "../../types/Onboarding";
import useCompanyPanDetailsStore from "../../store/useCompanyPanDetailsStore";

const PanDetails = () => {
  const analytics = useAnalytics();

  const {
    fetchCompanyPanDetails,
    isForcePanInput,
    isPanVerified,
    setPanInput,
    companyPanDetailsData: data,
  } = useCompanyPanDetailsStore();

  // scroll to top on first render
  useEffect(() => {
    window.scrollTo(0, 0);
    fetchCompanyPanDetailsWithAnalytics();
  }, []);

  const trackIndustrySelect = debounce((industrySelectMeta: SearchDropdownMetaInfo, selected: string) => {
    analytics.trackAsync(Events.INDUSTRY_SELECTION, {
      inputValue: industrySelectMeta.inputValue,
      visibleOptions: industrySelectMeta.optionsVisible?.map((option) => option.label)?.toString(),
      selectedOption: selected,
    });
  }, 500);

  const onIndustryChange = debounce((inputVal: string, options: Option[]) => {
    analytics.trackAsync(Events.INDUSTRY_SEARCH_CHANGE, {
      inputValue: inputVal,
      visibleOptions: options?.map((option) => option.label)?.toString(),
    });
  }, 500);

  const fetchCompanyPanDetailsWithAnalytics = (fireMarketingEvents?: boolean) => {
    fetchCompanyPanDetails(analytics, fireMarketingEvents);
  };

  const businessPAN = data?.exporterUser?.exporter?.businessPAN;
  const businessType = data?.exporterUser?.exporter?.businessType;

  const industryList =
    data?.industry?.map((industry: Industry) => ({
      label: industry.name,
      value: industry.id,
      searchTags: industry.config?.searchTags,
      fixedOption: industry.config?.fixedOption,
      ...industry,
    })) || [];

  return (
    <div className={"flex flex-row flex-1 px-6 py-0 md:overflow-y-visible"}>
      {(businessType === BUSSINESS_TYPES.PROPRIETORSHIP || businessType === BUSSINESS_TYPES.HUF) &&
      !isForcePanInput &&
      isPanVerified ? (
        <SolePANDetailsForm
          refetchCompanyPan={fetchCompanyPanDetailsWithAnalytics}
          exporterData={data?.exporterUser?.exporter}
          exporterUserFullName={data?.exporterUser?.fullName}
          industryList={industryList}
          setPanInput={setPanInput}
          trackIndustrySelect={trackIndustrySelect}
          onIndustryChange={onIndustryChange}
        />
      ) : null}
      {businessType === BUSSINESS_TYPES.FREELANCER && !isForcePanInput && isPanVerified ? (
        <FreelancerPANDetailsForm
          refetchCompanyPan={fetchCompanyPanDetailsWithAnalytics}
          exporterData={data?.exporterUser?.exporter}
          exporterUserFullName={data?.exporterUser?.fullName}
          industryList={industryList}
          setPanInput={setPanInput}
          trackIndustrySelect={trackIndustrySelect}
          onIndustryChange={onIndustryChange}
        />
      ) : null}
      {!isForcePanInput &&
      isPanVerified &&
      !INDIVIDUAL_BUSINESSES.includes(businessType) &&
      businessType != BUSSINESS_TYPES.HUF ? (
        <CompanyPANDetailsForm
          refetchCompanyPan={fetchCompanyPanDetailsWithAnalytics}
          exporterData={data?.exporterUser?.exporter}
          industryList={industryList}
          setPanInput={setPanInput}
          onIndustryChange={onIndustryChange}
          trackIndustrySelect={trackIndustrySelect}
        />
      ) : null}
      {isForcePanInput || !isPanVerified ? (
        <CompanyPANInput
          refetch={() => {
            fetchCompanyPanDetailsWithAnalytics(true);
          }}
          isForcePanInput={isForcePanInput}
          businessPAN={businessPAN}
        />
      ) : null}
    </div>
  );
};

export default PanDetails;
