//Jan 2025

import classNames from "classnames";
import { FieldArray } from "react-final-form-arrays";
import { Field } from "react-final-form";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import RadioButton from "../AtomicComponents/RadioButton";
import React, { useState } from "react";
import WebsiteInputField from "./WebsiteInputField";
import { EcommerceOptions } from "../../constants/onboarding";
import Locale from "../../util/locale/en";
import InfoIcon from "../Icons/InfoIcon";
import Popup from "../AtomicComponents/Popup";
import Image from "next/image";
import BottomSheet from "../AtomicComponents/BottomSheet";
import PopupHeader from "../AtomicComponents/Popup/PopupHeader";

interface Props {
  submitFailed?: boolean;
  errors?: any;
  selectedIndustryOption: any;
  containerClass?: string;
  websiteInputWithIndustry?: boolean;
  isUrlValidationError: string;
  setUrlValidationError: (value: string) => void;
  selectedIndustryInfo?: string;
  businessType?: string;
}

const EcommerceIndustryOptions = (props: Props) => {
  const {
    submitFailed,
    errors,
    selectedIndustryOption,
    containerClass,
    websiteInputWithIndustry,
    isUrlValidationError,
    setUrlValidationError,
    selectedIndustryInfo,
    businessType,
  } = props;

  const [isPopupVisible, setPopupVisible] = useState(false);

  const getWebsiteInputLabel = (selectedEcommerce: string) => {
    let label: JSX.Element | string = Locale.webUrl;
    let placeholder = Locale.urlEx;
    switch (selectedEcommerce) {
      case EcommerceOptions.AMAZON:
        label = (
          <div className={"flex_row_item_center"}>
            <Typography
              text={Locale.amazonWebsiteInput}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              type={TYPOGRAPHY_TYPES.LABEL}
            />
            <InfoIcon containerClass={"ml-1"} onClick={() => setPopupVisible(true)} />
          </div>
        );
        placeholder = Locale.amazonWebsiteInputPlaceholder;
        break;
      case EcommerceOptions.GLOBAL_MARKETPLACE:
        label = Locale.marketPlaceUrl;
        placeholder = Locale.marketPlaceUrlPlaceholder;
        break;
      case EcommerceOptions.WEBSITE:
        label = Locale.ecomWebsiteUrl;
        placeholder = Locale.ecomWebsiteUrlPlaceholder;
        break;
      case EcommerceOptions.SOCIAL_MEDIA:
        label = Locale.socialMediaProfile;
        placeholder = Locale.socialMediaProfilePlaceholder;
        break;
    }
    return { label, placeholder };
  };

  const renderAmazonPopupContent = () => {
    return (
      <div className={"flex flex-col"}>
        <PopupHeader title={Locale.samplePreview} closeIconClick={() => setPopupVisible(false)} />
        <Typography
          text={Locale.amazonStoreWebsite}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={700}
        />
        <div className={"relative w-full overflow-hidden h-[162px] md:h-[260px] mt-2"}>
          <Image
            src={"/amazon_store_url.webp"}
            className={"bg-black-100 rounded-10px"}
            sizes="1000px"
            layout={"fill"}
            objectFit={"contain"}
          />
        </div>
        <hr className={"w-full my-4 border-black-400"} />
        <Typography
          text={Locale.amazonProductPage}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={700}
        />

        <div className={"relative w-full overflow-hidden h-[162px] md:h-[260px] mt-2"}>
          <Image
            src={"/amazon_product_page_url.webp"}
            className={"bg-black-100 rounded-10px"}
            sizes="1000px"
            layout={"fill"}
            objectFit={"contain"}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={"flex flex-col md:mb-6"}>
      <div
        className={classNames("p-6 bg-blue-50 rounded-10px flex flex-col md:mt-0 mt-4 gap-y-2", containerClass, {
          "border border-solid border-red-400": errors?.industryInfoResponse && submitFailed,
        })}
      >
        <FieldArray name={"industryInfoResponses"}>
          {({ fields }) =>
            fields.map((field, index) => {
              const { metadata } = selectedIndustryOption;
              const quesData = metadata?.[index] || {};
              return (
                <Field key={`${field}.response_${index}`} name={`${field}.response`}>
                  {(props) => (
                    <div className={"flex flex-col w-full"}>
                      <div
                        className={
                          "flex flex-1 flex-col md:flex-row items-start md:items-center justify-between md:w-full"
                        }
                      >
                        <div className={"flex flex-col w-full"}>
                          <Typography
                            text={quesData.question}
                            size={TYPOGRAPHY_SIZES.SMALL}
                            textClasses={"ml-1 mb-2"}
                            fontWeight={700}
                          >
                            {quesData.questionSubLabel ? (
                              <Typography
                                text={quesData.questionSubLabel}
                                size={TYPOGRAPHY_SIZES.SMALL}
                                textClasses={"!text-black-500 ml-1"}
                              />
                            ) : null}
                          </Typography>
                          {quesData.scqOptions ? (
                            <div className={"flex flex-col gap-y-3 pl-5 mt-2"}>
                              {quesData.scqOptions.map((question: { label: string; value: string }, index: number) => (
                                <div key={`${question} ${index}`} className={"flex flex-col w-full"}>
                                  <div className={"flex flex-row items-center justify-between gap-4 w-full"}>
                                    <Typography
                                      text={`${index + 1}. ${question.label}`}
                                      size={TYPOGRAPHY_SIZES.SMALL}
                                      textClasses={"text-black-600"}
                                    />
                                    <RadioButton
                                      label={""}
                                      checked={props.input.value === question.value}
                                      onChange={() => props.input.onChange(question.value)}
                                      id={`${question}_radio_button`}
                                    />
                                  </div>
                                  {websiteInputWithIndustry && props.input.value === question.value ? (
                                    <WebsiteInputField
                                      isUrlValidationError={isUrlValidationError}
                                      errors={errors}
                                      isWebNotAvailable={false}
                                      setUrlValidationError={setUrlValidationError}
                                      labelAndPlaceholder={getWebsiteInputLabel(props.input.value)}
                                      labelTextClass={"!text-black-600 mr-1"}
                                      inputClass={"!mt-2.5"}
                                      businessType={businessType}
                                    />
                                  ) : null}
                                </div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  )}
                </Field>
              );
            })
          }
        </FieldArray>
      </div>
      {submitFailed && errors?.industryInfoResponse ? (
        <Typography
          text={errors?.industryInfoResponse}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-red-400 mt-2"}
        />
      ) : null}
      <div className={"hide_for_mob"}>
        <Popup
          renderContent={renderAmazonPopupContent}
          open={isPopupVisible}
          closeIconClick={() => setPopupVisible(false)}
          outsideClick={() => setPopupVisible(false)}
          isDashboardPopup={true}
        />
      </div>
      <div className={"hide_for_desktop"}>
        <BottomSheet isOpen={isPopupVisible} onClose={() => setPopupVisible(false)} withCloseIcon={false}>
          {renderAmazonPopupContent()}
        </BottomSheet>
      </div>
    </div>
  );
};

export default EcommerceIndustryOptions;
