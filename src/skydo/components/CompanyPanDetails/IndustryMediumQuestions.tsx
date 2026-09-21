import React from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classNames from "classnames";
import { FieldArray } from "react-final-form-arrays";
import { Field } from "react-final-form";
import RadioButton from "../AtomicComponents/RadioButton";
import InfoIcon from "../Icons/InfoIcon";
import TextInput from "../AtomicComponents/TextInput";

const IndustryMediumQuestions = ({
  submitFailed,
  errors,
  selectedIndustryOption,
  containerClass,
  isUrlValidationError,
  setUrlValidationError,
}: {
  submitFailed?: boolean;
  errors?: any;
  selectedIndustryOption: any;
  containerClass?: string;
  isUrlValidationError?: string;
  setUrlValidationError?: (value: string) => void;
}) => (
  selectedIndustryOption.metadata && selectedIndustryOption.metadata.length > 0 &&
  <div className={"flex flex-col mb-6"}>
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
            const fieldsLength = fields.length as number;
            const indexingActive = fieldsLength > 1;
            // Check if this is an Amazon-related question
            const isAmazonQuestion = quesData.question?.includes('Do you sell your products on Amazon Global');
            
            return (
              // eslint-disable-next-line react/jsx-key
              <Field name={`${field}.response`}>
                {(props) => (
                    <div className={"flex flex-col md:w-full"}>
                  <div
                    className={"flex flex-1 flex-col md:flex-row items-start md:items-center justify-between md:w-full"}
                  >
                    <div className={"flex flex-col"}>
                      <Typography text={`${indexingActive ? (index + 1) + ". " : ""}${quesData.question}`} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"ml-1 mb-2"} fontWeight={700} />
                      {quesData.subQuestion
                        ? <div className={"pl-5 mt-2"}><ul className={"list-disc"}>
                            {quesData.subQuestion.map((question: any, index: number) => (
                                <li key={index} className={"text-black-600"}>
                                  <Typography
                                    key={question}
                                    text={`${question}`}
                                    size={TYPOGRAPHY_SIZES.SMALL}
                                    textClasses={"text-black-600"}
                                  />
                                </li>
                            ))}
                          </ul></div>
                        : null}
                    </div>
                    <div className={"flex w-full md:w-auto flex-row mt-4 space-x-2 md:mt-0 justify-end"}>
                      <RadioButton
                          id={`yes_button_${index}`}
                          label={Locale.yes}
                          checked={props.input.value === "yes"}
                          onChange={(event) => {
                            // event.preventDefault();
                            props.input.onChange("yes");
                          }}
                          className={"flex_row_item_center"}
                      />
                      <RadioButton
                          id={`no_button_${index}`}
                          label={Locale.no}
                          checked={props.input.value === "no"}
                          onChange={(event) => {
                            // event.preventDefault();
                            props.input.onChange("no");
                          }}
                          className={"flex_row_item_center"}
                      />
                    </div>
                  </div>
                  
                  {/* Show Amazon URL input when Yes is selected for Amazon question */}
                  {isAmazonQuestion && props.input.value === "yes" && setUrlValidationError ? (
                    <div className="mt-4 ml-5">
                      <Field name="webUrl">
                        {(fieldProps) => (
                          <TextInput
                            inputClass={"!mt-2.5"}
                            labelTextClass={"!text-black-600 mr-1"}
                            isDisabled={false}
                            label={
                              <div className={"flex_row_item_center"}>
                                <Typography
                                  text={Locale.amazonWebsiteInput}
                                  size={TYPOGRAPHY_SIZES.X_SMALL}
                                  type={TYPOGRAPHY_TYPES.LABEL}
                                />
                                <InfoIcon containerClass={"ml-1"} />
                              </div> as any
                            }
                            placeholder={Locale.amazonWebsiteInputPlaceholder}
                            onChange={(value: any) => {
                              fieldProps.input.onChange(value);
                              setUrlValidationError("");
                            }}
                            value={fieldProps.input.value}
                            isError={isUrlValidationError ? !!isUrlValidationError : fieldProps.meta.submitFailed && fieldProps.meta.error}
                            footerText={isUrlValidationError ? isUrlValidationError : fieldProps.meta.submitFailed && errors?.webUrl}
                          />
                        )}
                      </Field>
                    </div>
                  ) : null}
                  
                  {index+1 < fieldsLength ? <hr className={"border-black-400 my-4"}/> : null}
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
  </div>
);

export default IndustryMediumQuestions;
