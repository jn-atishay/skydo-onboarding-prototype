import React from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import classNames from "classnames";
import { FieldArray } from "react-final-form-arrays";
import { Field } from "react-final-form";
import { INDUSTRY_CATEGORY } from "../../constants/onboarding";
import CircularLoader from "../UBOPanDetails/CircularLoader";
import FullTick from "../Icons/FullTick";
import RadioButton from "../AtomicComponents/RadioButton";

export const SystemIndustryMediumQuestions = ({
  isIndustryApiLoading,
  submitFailed,
  errors,
  selectedIndustryOption,
  containerClass,
}: {
  isIndustryApiLoading: boolean;
  submitFailed?: boolean;
  errors?: any;
  selectedIndustryOption: any;
  containerClass?: string;
}) => {
  if (isIndustryApiLoading)
    return (
      <div className={"flex flex-row gap-1 mt-4"}>
        <CircularLoader isGray={true} />
        <div>Updating business activity</div>
      </div>
    );

  return selectedIndustryOption && selectedIndustryOption?.riskCategory === INDUSTRY_CATEGORY.MEDIUM ? (
    <div className={"flex flex-col md:mb-6"}>
      <div className={"flex flex-row gap-1 mt-4"}>
        <FullTick />
        <div>Business activity updated</div>
      </div>
      <div className={"border-b w-full border-black-500 mt-4 mb-4"} />
      <div className={classNames("bg-blue-50 rounded-10px flex flex-col md:mt-0 mt-4 gap-y-2", containerClass, {})}>
        <FieldArray name={"systemIndustryInfoResponses"}>
          {({ fields }) =>
            fields.map((field, index) => {
              const { metadata } = selectedIndustryOption;
              const quesData = metadata?.[index] || {};
              const fieldsLength = fields.length as number;
              const indexingActive = fieldsLength > 1;
              return (
                <Field key={`system_ind_${index}`} name={`${field}.response`}>
                  {(props) => (
                    <div className={"flex flex-col md:w-full"}>
                      <div
                        className={
                          "flex flex-1 flex-col md:flex-row items-start md:items-center justify-between md:w-full"
                        }
                      >
                        <div className={"flex flex-col"}>
                          <Typography
                            text={`${indexingActive ? index + 1 + ". " : ""}${quesData.question}`}
                            size={TYPOGRAPHY_SIZES.SMALL}
                            textClasses={"ml-1 mb-2"}
                            fontWeight={700}
                          />
                          {quesData.subQuestion ? (
                            <div className={"pl-5 mt-2"}>
                              <ul className={"list-disc"}>
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
                              </ul>
                            </div>
                          ) : null}
                        </div>
                        <div className={"flex w-full md:w-auto flex-row mt-4 space-x-2 md:mt-0 justify-end"}>
                          <RadioButton
                            id={"yes_button"}
                            label={Locale.yes}
                            checked={props.input.value === "yes"}
                            onChange={(event) => {
                              // event.preventDefault();
                              props.input.onChange("yes");
                            }}
                            className={"flex_row_item_center"}
                          />
                          <RadioButton
                            id={"no_button"}
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
                      {index + 1 < fieldsLength ? <hr className={"border-black-400 my-4"} /> : null}
                    </div>
                  )}
                </Field>
              );
            })
          }
        </FieldArray>
      </div>
      {submitFailed && errors?.systemIndustryInfoResponses ? (
        <Typography
          text={errors?.systemIndustryInfoResponses}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-red-400 mt-2"}
        />
      ) : null}
    </div>
  ) : (
    selectedIndustryOption && (
      <div className={"flex flex-row gap-1 mt-4"}>
        <FullTick />
        <div>Business activity updated</div>
      </div>
    )
  );
};
