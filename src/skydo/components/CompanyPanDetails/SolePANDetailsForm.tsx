import { checkHasAmazonStore, checkHasPharmaceuticalExport, getFirstWord, getGstDetails } from "../../util/functions";
import React, { useContext, useEffect, useRef, useState } from "react";
import AppContext from "../../context/AppContext";
import useToastMessages from "../../store/toastMessages";
import useMobileDetect from "../../util/customHooks/useMobileDetect";
import {
  AVG_TRANSACTION_OPTIONS,
  BUSSINESS_TYPES,
  EcommerceOptions,
  INDIVIDUAL_BUSINESSES,
  INDUSTRY_CATEGORY,
  INDUSTRY_TYPES,
  MIN_BUSINESS_ACTIVITY_DESC_LEN,
  MIN_OTHER_INDUSTRY_DETAILS_LENGTH,
} from "../../constants/onboarding";
import Locale from "../../util/locale/en";
import useAnalytics from "../../analytics/useAnalytics";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { Events } from "../../analytics/EventConstants";
import { TOAST_TYPES, TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import Button from "../AtomicComponents/Button";
import CurrStateTitle from "../Common/CurrStateTitle";
import { Field, Form, FormSpy } from "react-final-form";
import TextInput from "../AtomicComponents/TextInput";
import Dropdown from "../AtomicComponents/Dropdown";
import classNames from "classnames";
import arrayMutators from "final-form-arrays";
import IndustryMediumQuestions from "./IndustryMediumQuestions";
import * as Sentry from "@sentry/nextjs";
import SearchDropdown from "../AtomicComponents/Dropdown/SearchDropdown";
import { Option, SearchDropdownMetaInfo } from "../../types/atomicComponentTypes";
import AlertPopup from "../AtomicComponents/Popup/AlertPopup";
import { TrustMarkerMobile } from "../TrustMarker";
import GlobeIcon from "../Icons/GlobeIcon";
import DownArrowIcon from "../Icons/DownArrowIcon";
import useArchiveOrBlacklistStore from "../../store/useArchiveOrBlacklistStore";
import useIndustryFetch from "../../util/customHooks/useIndustryFetch";
import { SystemIndustryMediumQuestions } from "./SystemIndustryMediumQuestions";
import useUserData from "../../store/useUserData";
import useOnboardingStore from "../../store/useOnboardingStore";
import IndustryTooltipInfoText from "./IndustryTooltipInfoText";
import { Exporter } from "../../types/Exporter/ExporterUser";
import { fireCommonCompanyPanDetailsSubmitEvent } from "../../util/marketingEventsUtil";
import EcommerceIndustryOptions from "./EcommerceIndustryOptions";
import WebsiteInputField from "./WebsiteInputField";
import DateSelector from "../AtomicComponents/DateSelector";
import PanVerifiedPill from "./PanVerifiedPill";
import FullTick from "../Icons/FullTick";
import CloseLineIcon from "../Icons/CloseLineIcon";
import IconContainer from "../Common/IconContainer";

interface Props {
  exporterData: { [key: string]: any };
  exporterUserFullName?: string;
  industryList: Option[];
  setPanInput: (data: any) => void;
  refetchCompanyPan: () => void;
  trackIndustrySelect: (optionMeta: SearchDropdownMetaInfo, selected: string) => void;
  onIndustryChange: (value: string, options: Option[]) => void;
}

const SolePANDetailsForm = (props: Props) => {
  const { theme } = useContext(AppContext);
  const {
    exporterData = {},
    exporterUserFullName,
    industryList = [],
    refetchCompanyPan = () => {},
    setPanInput,
    trackIndustrySelect,
    onIndustryChange,
  } = props;
  const {
    businessLegalName,
    businessType,
    correspondentName,
    cin,
    businessPAN,
    businessDescription,
    gstList = [],
    exporterIndustry = {},
    communicationAddress,
  } = exporterData;
  const { loggedInUserEmail, phoneNumber } = useUserData();
  const { primaryGstId: fetchedPrimaryGstId, primaryGstAddress, isPrimaryExist } = getGstDetails(gstList);
  const primaryGstId = fetchedPrimaryGstId ?? (gstList.length === 1 ? gstList[0].id : undefined);
  const { industryId: industryIdPreSelected, industryDescription, industryInfoResponse } = exporterIndustry || {};
  const refetchUserState = useOnboardingStore((state) => state.fetchExporterUserDetails);
  const validateWebUrl = useOnboardingStore((state) => state.validateWebUrl);
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const [isConfirmPopupOpen, openConfirmPopup] = useState(false);
  const analytics = useAnalytics();
  const { isMobile } = useMobileDetect();
  const isIndividualBusiness = INDIVIDUAL_BUSINESSES.includes(businessType);
  const isNameMissing = !businessLegalName;
  const isFullNameMissing = businessType === BUSSINESS_TYPES.PROPRIETORSHIP && !exporterUserFullName;
  const showDateOfIncorporation = businessType === BUSSINESS_TYPES.HUF && !exporterData.dateOfIncorporation;
  const todayDate = new Date().toISOString().split("T")[0];
  const hasFiredDescriptionCompletedRef = useRef(false);

  useEffect(() => {
    analytics.trackAsync(Events.BUSINESS_DETAILS_LOAD, {
      entity_type: businessType,
      has_gstin_prefilled: gstList.length > 0,
      has_cin: !!cin,
    });
  }, []);

  const industryOptions = industryList;
  const getPreSelectedIndustryOption = () => {
    for (let i = 0; i < industryOptions.length; ++i) {
      const option = industryOptions[i];
      if (option.value === industryIdPreSelected) return option;
    }
    return {};
  };

  //states
  const [isWebNotAvailable, setWebUnAvailablity] = useState(businessDescription?.websiteExist === false ? true : false);
  const [isFinalButtonLoading, setFinalButtonLoading] = useState(false);
  const [isUrlValidationError, setUrlValidationError] = useState("");
  const preSelectedIndustryOption: any = getPreSelectedIndustryOption();
  const [selectedIndustryOption, setSelectedIndustryOption] = useState<any>(preSelectedIndustryOption);
  const {
    systemSelectedIndustryOption,
    onBusinessDescriptionChange,
    isLoading: isIndustryApiLoading,
  } = useIndustryFetch({
    industryOptions: industryList,
  });

  const gstOptions = gstList.map((gst: { gstin: any; id: any }) => ({ label: gst.gstin, value: gst.id }));
  const { setArchiveOrBlacklistPopup } = useArchiveOrBlacklistStore();

  const onCheckboxClick = () => {
    setWebUnAvailablity(!isWebNotAvailable);
  };

  const onGstIdSelect = async (gstId: any) => {
    if (gstId !== fetchedPrimaryGstId) {
      try {
        const response = await beCall({
          path: BE_ROUTES.SUBMIT_GSTID,
          method: ALLOWED_METHODS.POST,
          body: {
            gstinId: gstId,
          },
        });
        if (response.success) {
          refetchCompanyPan();
        }
      } catch (e) {
        // todo - error handling
      }
    }
  };

  useEffect(() => {
    if (gstList.length === 1 && !isPrimaryExist) {
      onGstIdSelect(gstList[0].id);
    }
  }, [gstList, isPrimaryExist]);

  const onConfirmClick = async (values: any) => {
    setFinalButtonLoading(true);

    const isDescriptionValid =
      !!values.businessActivityDescription &&
      values.businessActivityDescription.length >= MIN_BUSINESS_ACTIVITY_DESC_LEN;

    // Check if pharmaceutical question is answered with 'yes'
    const hasPharmaceuticalExport = checkHasPharmaceuticalExport(values, selectedIndustryOption);

    // web validation --- get method
    let isWebUrlValid = false;
    if (values.webUrl) {
      const validateUrl = await validateWebUrl(values.webUrl);
      const { isValid, errorMessage, errorDump } = validateUrl || {
        isValid: false,
        errorMessage: "Undefined Response",
        errorDump: "Undefined Response",
      };
      isWebUrlValid = isValid;
      if (!isValid) {
        analytics.trackAsync(Events.URL_VALIDATION_FAILED, { webUrl: values.webUrl, errorMessage, errorDump });
        if (validateUrl === undefined) {
          Sentry.captureMessage("validate_url_undefined_response", {
            level: "error",
            extra: {
              url: values.webUrl,
            },
          });
        }
      }
    }

    // Pharmaceutical exporters must always provide a valid website, regardless of the business description
    if (!isWebUrlValid && (!isDescriptionValid || hasPharmaceuticalExport)) {
      setUrlValidationError(Locale.invalidUrl);
      setFinalButtonLoading(false);
      return;
    }

    // Check if there's an Amazon question with 'yes' answer
    const hasAmazonQuestion = checkHasAmazonStore(values, selectedIndustryOption);

    // If pharmaceutical export is "yes", force website to be required
    if (hasPharmaceuticalExport) {
      setWebUnAvailablity(false);
    }

    // Validate Amazon URL if it exists
    if (hasAmazonQuestion && values.webUrl) {
      const validateAmazonUrl = await validateWebUrl(values.webUrl);
      const { isValid, errorMessage, errorDump } = validateAmazonUrl || {
        isValid: false,
        errorMessage: "Undefined Response",
        errorDump: "Undefined Response",
      };
      if (!isValid) {
        analytics.trackAsync(Events.URL_VALIDATION_FAILED, { webUrl: values.webUrl, errorMessage, errorDump });
        if (validateAmazonUrl === undefined) {
          Sentry.captureMessage("validate_url_undefined_response", {
            level: "error",
            extra: {
              url: values.webUrl,
            },
          });
        }
        setUrlValidationError(Locale.invalidUrl);
        setFinalButtonLoading(false);
        return;
      }
    }

    try {
      const response = await beCall({
        path: BE_ROUTES.SUBMIT_COMPANY_DETAILS,
        body: {
          shortname: values.companyShortName,
          industryId: values.industryId,
          businessLegalName: values.businessLegalName,
          ...(isFullNameMissing ? { fullName: values.fullName } : {}),
          ...(showDateOfIncorporation ? { dateOfIncorporation: values.dateOfIncorporation } : {}),
          ...(selectedIndustryOption.riskCategory === "OTHERS" ? { systemIndustryId: values?.systemIndustryId } : {}),
          ...(isWebUrlValid ? { website: values.webUrl, websiteExist: true } : { websiteExist: false }),
          ...(values.businessActivityDescription
            ? {
                companyDescription: values.businessActivityDescription,
                marketingActivity: values.businessActivityDescription,
              }
            : {}),
          gstinId: values.primaryGstId,
          address: values.companyAddress ?? "",
          ...(selectedIndustryOption.riskCategory === "OTHERS"
            ? { industryDescription: values.industryDescription }
            : {}),
          ...(selectedIndustryOption.riskCategory === "MEDIUM" ||
          selectedIndustryOption.industryType === "E_COMMERCE" ||
          (selectedIndustryOption?.riskCategory === "OTHERS" && values.industryInfoResponses?.length > 0)
            ? {
                industryInfoResponse: values.industryInfoResponses.reduce(
                  (accm: { [x: string]: any }, ques: { response: any }, index: string | number) => {
                    accm[index] = ques.response;
                    return accm;
                  },
                  {}
                ),
              }
            : {}),
          ...(selectedIndustryOption.riskCategory === "OTHERS" &&
          systemSelectedIndustryOption?.riskCategory === "MEDIUM"
            ? {
                systemIndustryInfoResponse: values.systemIndustryInfoResponses?.reduce(
                  (accm: { [x: string]: any }, ques: { response: any }, index: string | number) => {
                    accm[index] = ques.response;
                    return accm;
                  },
                  {}
                ),
              }
            : {}),
          monthlyRevenue: values.monthlyRevenue,
          fromMobile: values.isMobile,
          averageTransaction: values.averageTransaction,
          ...(hasAmazonQuestion
            ? {
                hasAmazonStore: true,
                amazonUrl: values.webUrl,
              }
            : { hasAmazonStore: false }),
        },
        method: ALLOWED_METHODS.POST,
      });
      setFinalButtonLoading(false);
      analytics?.trackAsync(Events.ENTITY_DETAILS_SUBMIT, { success: response.success });
      if (response.success) {
        fireCommonCompanyPanDetailsSubmitEvent(
          exporterData as Exporter,
          values,
          analytics,
          loggedInUserEmail,
          phoneNumber,
          industryOptions
        );
        isIndividualBusiness && refetchCompanyPan();
        refetchUserState();
      } else {
        throw response;
      }
    } catch (e) {
      // @ts-ignore
      const message = e.message;
      if (message === "PAN_BLACKLISTED") {
        console.log("message", message);
        setArchiveOrBlacklistPopup(true);
        return;
      }
      setFinalButtonLoading(false);
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "company_details_error",
        body: Locale.wentWrongMessage,
      });
      // todo - error handling
    }
  };

  const validateForm = (values: any) => {
    type Error = {
      [key: string]: string;
    };
    const errors: Error = {};
    if (!values.businessLegalName) {
      errors.businessLegalName = "Business name is required";
    }
    if (isFullNameMissing && !values.fullName) {
      errors.fullName = "Full name is required";
    }
    if (showDateOfIncorporation) {
      if (!values.dateOfIncorporation) {
        errors.dateOfIncorporation = Locale.dateOfIncorporationRequired;
      } else if (values.dateOfIncorporation > todayDate) {
        errors.dateOfIncorporation = Locale.dateOfIncorporationInFuture;
      }
    }

    if (!values.companyShortName) {
      errors.companyShortName = Locale.shortNameRequiredError;
    }
    if (!values.industryId) {
      errors.industryId = `Primary business activity required`;
    }
    if (!isIndividualBusiness && businessType != BUSSINESS_TYPES.HUF && !values.primaryGstId) {
      errors.primaryGstId = `GSTIN is required`;
    }
    // Check if pharmaceutical question is answered with "yes"
    const hasPharmaceuticalExport = checkHasPharmaceuticalExport(values, selectedIndustryOption);

    const isDescriptionValid =
      !!values.businessActivityDescription &&
      values.businessActivityDescription.length >= MIN_BUSINESS_ACTIVITY_DESC_LEN;

    const isWebUrlInvalid = !values.webUrl || !!isUrlValidationError;

    if (isWebUrlInvalid && !isDescriptionValid) {
      if (isWebNotAvailable) {
        errors.businessActivityDescription = Locale.businessActivityDescMinLengthError.replace(
          "MIN_LENGTH",
          String(MIN_BUSINESS_ACTIVITY_DESC_LEN)
        );
      } else {
        errors.webUrl = Locale.urlErrorText;
      }
    }

    // If pharmaceutical export is "yes", a valid website is mandatory regardless of the business description
    if (hasPharmaceuticalExport && (isWebUrlInvalid || isWebNotAvailable)) {
      errors.webUrl = Locale.pharmaceuticalWebsiteRequiredError;
    }
    if (selectedIndustryOption.riskCategory === INDUSTRY_CATEGORY.OTHERS) {
      if (!values.industryDescription) {
        errors.industryDescription = "Kindly enter your primary business activity";
      } else if (values.industryDescription.length < MIN_OTHER_INDUSTRY_DETAILS_LENGTH) {
        errors.industryDescription = `Please describe your business activity in more detail`;
      }
    }
    if (
      systemSelectedIndustryOption?.riskCategory === INDUSTRY_CATEGORY.MEDIUM &&
      !values.systemIndustryInfoResponses?.every((obj: { response: any }) => obj.response)
    ) {
      errors.systemIndustryInfoResponse =
        values.systemIndustryInfoResponses?.length > 1
          ? "Kindly select Yes / No for the above questions"
          : "Kindly select Yes / No for the above question";
    }
    if (
      (selectedIndustryOption.riskCategory === INDUSTRY_CATEGORY.MEDIUM ||
        (selectedIndustryOption.riskCategory === INDUSTRY_CATEGORY.OTHERS &&
          selectedIndustryOption.metadata?.length > 0)) &&
      !values.industryInfoResponses?.every((obj: { response: any }) => obj.response)
    ) {
      errors.industryInfoResponse =
        values.industryInfoResponses?.length > 1
          ? "Kindly select Yes / No for the above questions"
          : "Kindly select Yes / No for the above question";
    }
    if (
      selectedIndustryOption.industryType === INDUSTRY_TYPES.E_COMMERCE &&
      !values.industryInfoResponses?.every((obj: { response: any }) => obj.response)
    ) {
      errors.industryInfoResponse = "Please select any one of the above options";
    }
    if (gstList.length > 0 && !values.primaryGstId) {
      errors.primaryGstId = "Kindly select your primary gstin";
    }
    if (!values.averageTransaction) {
      errors.averageTransaction = "Kindly select your average transaction value";
    }

    // Check if Amazon question is answered with "yes" but no Amazon URL is provided
    const hasAmazonQuestion = checkHasAmazonStore(values, selectedIndustryOption);

    if (hasAmazonQuestion && !values.webUrl) {
      errors.webUrl = "Please provide your website/Amazon URL";
    }

    return errors;
  };

  return (
    <div className={classNames("flex flex-col flex-1")}>
      <div className={"flex flex-col items-start md:flex-row md:justify-between mb-6 md:mb-0"}>
        <CurrStateTitle
          title={Locale.businessDetails}
          subTitle={Locale.businessDetailsSubtitle}
          subTitleClass={"!text-black-700 md:!text-neutral-500"}
          icon={() => <GlobeIcon width={16} height={16} />}
          containerClass={"flex-1 min-w-0 !mb-4 md:!mb-6"}
        />
        <PanVerifiedPill
          businessPAN={businessPAN}
          onEditClick={() => {
            analytics.trackAsync(Events.PAN_EDIT_CLICKED, { entity_type: businessType });
            openConfirmPopup(true);
          }}
        />
      </div>
      <Form
        onSubmit={(values) => onConfirmClick(values)}
        initialValues={{
          businessPAN: businessPAN,
          businessLegalName,
          cin,
          fullName: exporterUserFullName,
          dateOfIncorporation: exporterData.dateOfIncorporation,
          companyShortName: correspondentName,
          industryId: industryIdPreSelected,
          systemIndustryId: systemSelectedIndustryOption?.industryId,
          primaryGstId,
          companyAddress: communicationAddress,
          industryDescription,
          industryInfoResponse,
          webUrl: businessDescription?.website,
          businessActivityDescription: businessDescription?.businessDescription,
          industryInfoResponses: preSelectedIndustryOption?.metadata,
          monthlyRevenue: "",
          averageTransaction: "",
          isMobile: false,
        }}
        validate={validateForm}
        mutators={{ ...arrayMutators }}
      >
        {({ handleSubmit, errors, values, submitError, form, submitFailed }) => {
          const selectedIndustryInfo = values.industryInfoResponses?.[0]?.response;
          const websiteInputWithIndustry =
            selectedIndustryOption?.industryType === INDUSTRY_TYPES.E_COMMERCE &&
            selectedIndustryInfo !== EcommerceOptions.NONE;

          // Check if there's an Amazon question with 'yes' answer
          const hasAmazonQuestion = checkHasAmazonStore(values, selectedIndustryOption);
          // Check if pharmaceutical question is answered with 'yes'
          const hasPharmaceuticalExport = checkHasPharmaceuticalExport(values, selectedIndustryOption);
          const isDescriptionValid =
            !!values.businessActivityDescription &&
            values.businessActivityDescription.length >= MIN_BUSINESS_ACTIVITY_DESC_LEN;

          return (
            <form onSubmit={handleSubmit} className={"md:overflow-y-visible pb-[120px] md:pb-0"}>
              <FormSpy
                subscription={{ values: true }}
                onChange={(formState) => {
                  const hasPharmaceutical = checkHasPharmaceuticalExport(formState.values, selectedIndustryOption);
                  if (hasPharmaceutical && isWebNotAvailable) {
                    setWebUnAvailablity(false);
                  }
                }}
              />
              {isFullNameMissing ? (
                <div className={"flex-1 flex flex-col md:flex-row mb-6"}>
                  <Field name={"fullName"}>
                    {(props) => (
                      <TextInput
                        label={Locale.fullName}
                        isLabelRequired={true}
                        inputClass={"flex-1 md:mr-2"}
                        value={props.input.value}
                        onChange={props.input.onChange}
                        isError={props.meta.submitFailed && props.meta.error}
                        footerText={(props.meta.submitFailed && errors?.fullName) || Locale.nameAsPerAadhaarPan}
                      />
                    )}
                  </Field>
                </div>
              ) : null}
              <div className={"flex-1 flex flex-col md:flex-row mb-6"}>
                <Field name={"businessLegalName"}>
                  {(props) => (
                    <TextInput
                      isDisabled={
                        isNameMissing ? false : businessType == BUSSINESS_TYPES.PROPRIETORSHIP ? primaryGstId : true
                      }
                      label={Locale.businessNameHeader}
                      inputClass={"flex-1 md:mr-2"}
                      type={"textarea !py-0"}
                      value={props.input.value}
                      onChange={(value) => {
                        props.input.onChange(value);
                        form.change("companyShortName", getFirstWord(value));
                      }}
                      isError={props.meta.submitFailed && props.meta.error}
                      footerText={
                        (props.meta.submitFailed && errors?.businessLegalName) ||
                        (isNameMissing && businessType === BUSSINESS_TYPES.HUF ? Locale.nameAsPerPan : undefined)
                      }
                    />
                  )}
                </Field>
                <Field name={"companyShortName"}>
                  {(props) => (
                    <TextInput
                      isDisabled={false}
                      label={Locale.shortNameForCommunication}
                      isLabelRequired={true}
                      inputClass={"flex-1 md:ml-2 mt-4 md:mt-0"}
                      type={"textarea !py-0"}
                      value={props.input.value}
                      onChange={props.input.onChange}
                      onBlur={() => {
                        if (props.input.value !== correspondentName) {
                          analytics.trackAsync(Events.COMMUNICATION_NAME_EDITED, { entity_type: businessType });
                        }
                        props.input.onBlur();
                      }}
                      isError={props.meta.submitFailed && props.meta.error}
                      footerText={props.meta.submitFailed && errors?.companyShortName}
                    />
                  )}
                </Field>
              </div>
              {!websiteInputWithIndustry && !hasAmazonQuestion ? (
                <>
                  <WebsiteInputField
                    isUrlValidationError={isWebNotAvailable && isDescriptionValid ? "" : isUrlValidationError}
                    errors={errors}
                    isWebNotAvailable={isWebNotAvailable}
                    setUrlValidationError={setUrlValidationError}
                    onFieldClick={() => {
                      analytics.trackAsync(Events.BUSINESS_DESCRIPTION_DISMISSED, {
                        chars_entered: values.businessActivityDescription?.length || 0,
                        dismissed_from: "website_textbox",
                      });
                      onCheckboxClick();
                    }}
                    businessType={businessType}
                    labelAndPlaceholder={{
                      label: isMobile ? Locale.onlinePresenceLabelMobile : Locale.onlinePresenceLabel,
                      placeholder: isMobile ? Locale.onlinePresencePlaceholderMobile : Locale.onlinePresencePlaceholder,
                    }}
                    customClass={"text-parasmall"}
                    inputClass={hasPharmaceuticalExport ? "mb-6" : undefined}
                  />
                  {!hasPharmaceuticalExport && (
                    <div
                      className={classNames("flex flex-row items-center w-fit cursor-pointer mt-2", {
                        "mb-3": isWebNotAvailable,
                        "mb-6": !isWebNotAvailable,
                      })}
                      onClick={() => {
                        if (isWebNotAvailable) {
                          analytics.trackAsync(Events.BUSINESS_DESCRIPTION_DISMISSED, {
                            chars_entered: values.businessActivityDescription?.length || 0,
                            dismissed_from: "provide_website_link",
                          });
                        } else {
                          analytics.trackAsync(Events.NO_ONLINE_PRESENCE_CLICKED, { entity_type: businessType });
                        }
                        onCheckboxClick();
                      }}
                    >
                      <Typography
                        text={
                          isWebNotAvailable
                            ? Locale.provideWebsiteLink
                            : isMobile
                            ? Locale.noOnlinePresenceLinkMobile
                            : Locale.noOnlinePresenceLink
                        }
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.SMALL}
                        textClasses={"!text-black-500 underline cursor-pointer inline-block"}
                      />
                      <DownArrowIcon
                        width={16}
                        height={16}
                        stroke={theme.hexColors.black[500]}
                        className={classNames("ml-1", { "rotate-180": isWebNotAvailable })}
                      />
                    </div>
                  )}
                </>
              ) : null}

              {isWebNotAvailable ? (
                <div className={"relative p-5 bg-black-50 rounded-10px mb-6"}>
                  <IconContainer
                    containerClass={"!h-6 !w-6 !bg-transparent cursor-pointer absolute top-4 right-4"}
                    onClick={() => {
                      analytics.trackAsync(Events.BUSINESS_DESCRIPTION_DISMISSED, {
                        chars_entered: values.businessActivityDescription?.length || 0,
                        dismissed_from: "close_icon",
                      });
                      onCheckboxClick();
                    }}
                  >
                    <CloseLineIcon stroke={theme.hexColors.black[500]} width={16} height={16} />
                  </IconContainer>
                  <Typography
                    text={isMobile ? Locale.businessActivityDescTitleMobile : Locale.businessActivityDescTitle}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    textClasses={"block mb-1 pr-6"}
                  />
                  <Typography
                    text={isMobile ? Locale.businessActivityDescSubtitleMobile : Locale.businessActivityDescSubtitle}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"block !text-black-500 mb-4"}
                  />
                  <Field name={"businessActivityDescription"}>
                    {(props) => (
                      <>
                        <TextInput
                          value={props.input.value}
                          type={"textarea"}
                          onChange={(value: string) => {
                            props.input.onChange(value);
                            if (value.length >= MIN_BUSINESS_ACTIVITY_DESC_LEN && !hasFiredDescriptionCompletedRef.current) {
                              hasFiredDescriptionCompletedRef.current = true;
                              analytics.trackAsync(Events.BUSINESS_DESCRIPTION_COMPLETED, {
                                description_length: value.length,
                              });
                            }
                          }}
                          onBlur={() => {
                            if (
                              props.input.value.length >= MIN_BUSINESS_ACTIVITY_DESC_LEN &&
                              !hasFiredDescriptionCompletedRef.current
                            ) {
                              hasFiredDescriptionCompletedRef.current = true;
                              analytics.trackAsync(Events.BUSINESS_DESCRIPTION_COMPLETED, {
                                description_length: props.input.value.length,
                              });
                            }
                            props.input.onBlur();
                          }}
                          placeholder={
                            isMobile
                              ? Locale.businessActivityDescPlaceholderMobile
                              : Locale.businessActivityDescPlaceholder
                          }
                          inputProps={{ rows: 3 }}
                          isError={props.meta.submitFailed && props.meta.error}
                          footerText={props.meta.submitFailed && errors?.businessActivityDescription}
                        />
                        <div className={"flex flex-row items-center justify-end space-x-1 mt-1.5"}>
                          {props.input.value.length >= MIN_BUSINESS_ACTIVITY_DESC_LEN && (
                            <FullTick bgColor={theme.hexColors.green[400]} tickColor={theme.hexColors.white} isSmall />
                          )}
                          <Typography
                            text={Locale.businessActivityDescCounter
                              .replace("CURRENT_LENGTH", String(props.input.value.length))
                              .replace("MIN_LENGTH", String(MIN_BUSINESS_ACTIVITY_DESC_LEN))}
                            type={TYPOGRAPHY_TYPES.LABEL}
                            size={TYPOGRAPHY_SIZES.X_SMALL}
                            textClasses={classNames({
                              "!text-green-400": props.input.value.length >= MIN_BUSINESS_ACTIVITY_DESC_LEN,
                              "!text-black-500": props.input.value.length < MIN_BUSINESS_ACTIVITY_DESC_LEN,
                            })}
                          />
                        </div>
                      </>
                    )}
                  </Field>
                </div>
              ) : null}

              <div className={"flex-1 flex flex-col md:flex-row mb-6"}>
                <Field name={"industryId"}>
                  {(props) => (
                    <SearchDropdown
                      options={industryOptions}
                      onSelect={(value: any, option: any, metaInfo) => {
                        form.change("industryInfoResponses", option.metadata);
                        setSelectedIndustryOption(option);
                        props.input.onChange(value);
                        trackIndustrySelect(metaInfo, option.label);
                        if (option.industryType === INDUSTRY_TYPES.PHARMA) {
                          setWebUnAvailablity(false);
                        }
                      }}
                      dropdownLabel={Locale.productsOrServicesLabel}
                      isLabelRequired={true}
                      className={"flex-1"}
                      selectedValue={props.input.value}
                      isError={props.meta.submitFailed && props.meta.error}
                      footerText={props.meta.submitFailed && errors?.industryId}
                      placeholder={Locale.industryPlaceholder}
                      onInputTextChange={onIndustryChange}
                      showOptionsOnInputChange={true}
                      inputClass={"parasmall"}
                      mobileSheet={{
                        title: Locale.selectBusinessActivityTitle,
                        searchPlaceholder: Locale.searchBusinessActivityPlaceholder,
                      }}
                    />
                  )}
                </Field>
                <div className={"flex-1 md:ml-4"} />
              </div>

              {selectedIndustryOption.industryType === INDUSTRY_TYPES.E_COMMERCE ? (
                <EcommerceIndustryOptions
                  submitFailed={submitFailed}
                  errors={errors}
                  selectedIndustryOption={selectedIndustryOption}
                  containerClass={"!mt-0 flex flex-1 !items-start"}
                  websiteInputWithIndustry={websiteInputWithIndustry}
                  isUrlValidationError={isUrlValidationError}
                  setUrlValidationError={setUrlValidationError}
                  selectedIndustryInfo={selectedIndustryInfo}
                  businessType={businessType}
                />
              ) : null}
              {selectedIndustryOption.riskCategory === INDUSTRY_CATEGORY.OTHERS ? (
                <Field name={"industryDescription"}>
                  {(props) => (
                    <div className={"flex flex-col mb-6"}>
                      <div
                        className={classNames("p-6 bg-blue-50 rounded-10px", {
                          "border border-solid border-red-400":
                            (props.meta.submitFailed && errors?.industryDescription) ||
                            (errors?.systemIndustryInfoResponse && submitFailed) ||
                            (errors?.industryInfoResponse && submitFailed),
                        })}
                      >
                        {selectedIndustryOption.metadata && selectedIndustryOption.metadata.length > 0 ? (
                          <>
                            <IndustryMediumQuestions
                              submitFailed={submitFailed}
                              errors={errors}
                              selectedIndustryOption={selectedIndustryOption}
                              isUrlValidationError={isUrlValidationError}
                              setUrlValidationError={setUrlValidationError}
                              containerClass={"!p-0 flex flex-1 !items-start"}
                            />
                            <hr className={"border-black-400 my-4"} />
                          </>
                        ) : null}
                        <TextInput
                          value={props.input.value}
                          onChange={async (value: any) => {
                            props.input.onChange(value);
                            onBusinessDescriptionChange(value, (val) => {
                              form.change("systemIndustryInfoResponses", val?.metadata || []);
                              form.change("systemIndustryId", val.value);
                            });
                          }}
                          label={Locale.industryDescription}
                          placeholder={Locale.industryDescPlaceHolder}
                          infoText={<IndustryTooltipInfoText />}
                          tooltipProps={{
                            position: TOOLTIP_POSITION.TOP,
                            tooltipTheme: "dark",
                          }}
                          type={"textarea"}
                          rightLabel={`${props.input.value.length}/${MIN_OTHER_INDUSTRY_DETAILS_LENGTH} min characters`}
                        />
                        {SystemIndustryMediumQuestions({
                          isIndustryApiLoading,
                          submitFailed: submitFailed,
                          errors: errors,
                          selectedIndustryOption: systemSelectedIndustryOption,
                          containerClass: "!mt-0 flex flex-1 !items-start",
                        })}
                      </div>
                      {(props.meta.submitFailed && errors?.industryDescription) ||
                      (errors?.systemIndustryInfoResponse && submitFailed) ||
                      (errors?.industryInfoResponse && submitFailed) ? (
                        <Typography
                          text={
                            errors?.industryDescription ||
                            errors?.systemIndustryInfoResponse ||
                            errors?.industryInfoResponse ||
                            "Something went really wrong"
                          }
                          size={TYPOGRAPHY_SIZES.SMALL}
                          textClasses={"!text-red-400 mt-2"}
                        />
                      ) : null}
                    </div>
                  )}
                </Field>
              ) : null}

              {selectedIndustryOption.riskCategory === INDUSTRY_CATEGORY.MEDIUM
                ? IndustryMediumQuestions({
                    submitFailed,
                    errors,
                    selectedIndustryOption,
                    containerClass: "!mt-0 flex flex-1 !items-start mb-4",
                    isUrlValidationError,
                    setUrlValidationError,
                  })
                : null}

              <div className={"flex flex-col md:flex-row md:space-x-6 z-10"}>
                <div className={"flex-1"}>
                  {showDateOfIncorporation ? (
                    <div className={"flex-1 flex flex-col md:flex-row mb-6"}>
                      <Field name={"dateOfIncorporation"}>
                        {(props) => (
                          <DateSelector
                            label={Locale.dateOfIncorporation}
                            containerClass={"flex-1 md:mr-2"}
                            selectedDate={
                              props.input.value ? props.input.value.split("-").reverse().join("/") : undefined
                            }
                            onDateSelect={props.input.onChange}
                            placeholder={Locale.dateFormat}
                            isDisabled={false}
                            maxDate={new Date()}
                            views={["month", "year", "decade"]}
                            isError={props.meta.submitFailed && props.meta.error}
                            footerText={props.meta.submitFailed && errors?.dateOfIncorporation}
                          />
                        )}
                      </Field>
                      <div className={"flex-1 md:ml-2"} />
                    </div>
                  ) : null}
                  <Field name={"averageTransaction"}>
                    {(props) => (
                      <Dropdown
                        searchable={false}
                        dropdownLabel={Locale.averageTransactionValue}
                        isLabelRequired={true}
                        placeholder={Locale.selectOne}
                        containerClass={"mb-6"}
                        options={AVG_TRANSACTION_OPTIONS}
                        onSelect={(value: any) => {
                          analytics.trackAsync(Events.PER_PAYMENT_AMOUNT_SELECTED, {
                            selected_band: value,
                            entity_type: businessType,
                          });
                          props.input.onChange(value);
                        }}
                        selectedValue={props.input.value}
                        isError={props.meta.submitFailed && props.meta.error}
                        footerText={props.meta.submitFailed && errors?.averageTransaction}
                        inputClassNonSearch={"text-parasmall"}
                        mobileSheet={{
                          title: Locale.selectTransactionalRangeTitle,
                          infoText: Locale.averageTransactionValueSubtext,
                        }}
                      />
                    )}
                  </Field>
                </div>
                <div className={"flex-1"}>
                  {gstOptions.length === 0 ? null : gstOptions.length === 1 ? (
                    <TextInput
                      isDisabled={true}
                      label={Locale.gstinNumber}
                      inputClass={"mb-6"}
                      value={gstOptions[0].label}
                    />
                  ) : (
                    <Field name={"primaryGstId"}>
                      {(props) => (
                        <Dropdown
                          searchable={false}
                          dropdownLabel={Locale.gstinNumber}
                          placeholder={Locale.selectOne}
                          containerClass={"mb-6"}
                          options={gstOptions}
                          onSelect={(gstId) => {
                            analytics.trackAsync(Events.GSTIN_SELECTED, { entity_type: businessType });
                            void onGstIdSelect(gstId);
                            props.input.onChange(gstId);
                          }}
                          selectedValue={props.input.value}
                          isError={props.meta.submitFailed && props.meta.error}
                          footerText={props.meta.submitFailed && errors?.primaryGstId}
                          inputClassNonSearch={"text-parasmall"}
                          mobileSheet={{ title: Locale.gstinNumber }}
                        />
                      )}
                    </Field>
                  )}
                </div>
              </div>
              <div
                className={
                  "hide_for_desktop flex flex-col flex-1 fixed bottom-0 right-0 left-0 p-4 bg-white shadow-elevation1"
                }
              >
                <Field name={"isMobile"}>
                  {(props) => (
                    <Button
                      isLoading={isFinalButtonLoading}
                      title={Locale.confirmAndContinue}
                      buttonClass={"!w-full flex flex-row flex-1 justify-center"}
                      onButtonClick={() => {
                        props.input.onChange(true);
                        handleSubmit();
                      }}
                    />
                  )}
                </Field>
                <TrustMarkerMobile />
              </div>
              <div className={"hide_for_mob flex flex-row w-fit"}>
                <Field name={"isMobile"} className={"mt-4"}>
                  {(props) => (
                    <Button
                      isLoading={isFinalButtonLoading}
                      title={Locale.confirmAndContinue}
                      buttonClass={"flex flex-row flex-1 justify-center mt-2"}
                      onButtonClick={() => {
                        props.input.onChange(false);
                        handleSubmit();
                      }}
                    />
                  )}
                </Field>
              </div>
            </form>
          );
        }}
      </Form>
      <AlertPopup
        title={Locale.changePanTitle}
        text={Locale.panEditConfirm}
        isOpen={isConfirmPopupOpen}
        onCancel={() => {
          analytics.trackAsync(Events.CHANGE_PAN_POPUP_CLOSED, { entity_type: businessType });
          openConfirmPopup(false);
        }}
        onRightCtaClick={() => {
          analytics.trackAsync(Events.CHANGE_PAN_POPUP_CONFIRMED, { entity_type: businessType });
          openConfirmPopup(false);
          setPanInput(true);
        }}
        rightCta={Locale.changePan}
        containerClass={"!w-8/12"}
      />
    </div>
  );
};

export default SolePANDetailsForm;
