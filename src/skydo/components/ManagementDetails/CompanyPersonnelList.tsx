import React from "react";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classnames from "classnames";
import TextInput from "../AtomicComponents/TextInput";
import Locale from "../../util/locale/en";
import Dropdown from "../AtomicComponents/Dropdown";
import DeleteIcon from "../Icons/DeleteIcon";
import AddIcon from "../Icons/AddIcon";

type Props = {
  uboList: any[];
  updateUBOList: any;
  onNationalitySelected: any;
  countries: any[];
  askForPan: boolean;
  canAddNew: boolean;
  formError: { [key: string]: any };
  setFormError: any;
};

const CompanyPersonnelList = (props: Props) => {
  const { uboList, updateUBOList, onNationalitySelected, countries, askForPan, canAddNew, formError, setFormError } =
    props;

  const onDirectorNameChange = (value: string, index: number) => {
    const newUbos = [...uboList];

    newUbos[index] = {
      ...newUbos[index],
      fullName: value,
    };
    updateUBOList(newUbos);
    resetNameError(index);
  };

  const onDirectorPanChange = (value: string, index: number) => {
    const newUbos = [...uboList];

    newUbos[index] = {
      ...newUbos[index],
      pan: value,
    };
    updateUBOList(newUbos);
    resetPanError(index);
  };

  const resetNationalityError = (index: number) => {
    const newError = { ...formError };
    newError[`form${index}nationality`] = "";
    setFormError(newError);
  };

  const resetNameError = (index: number) => {
    const newError = { ...formError };
    newError[`form${index}name`] = "";
    setFormError(newError);
  };

  const resetPanError = (index: number) => {
    const newError = { ...formError };
    newError[`form${index}pan`] = "";
    setFormError(newError);
  };

  const onNationalitySelect = (value: any, index: number) => {
    const newUbos = [...uboList];
    newUbos[index] = {
      ...newUbos[index],
      nationality: value,
    };
    updateUBOList(newUbos);
    resetNationalityError(index);
    onNationalitySelected();
  };

  const onDeleteClick = (index: number) => {
    const updatedList = [...uboList];
    updatedList[index] = {
      ...updatedList[index],
      isDeleted: true,
    };
    updateUBOList(updatedList);
    const newError = { ...formError };
    newError[`form${index}nationality`] = "";
    newError[`form${index}name`] = "";
    newError[`form${index}ownershipPercentage`] = "";
    newError[`form${index}pan`] = "";
    setFormError(newError);
  };

  const onAddUboClick = () => {
    //todo - add input for new UBO and validate it
    // @ts-ignore
    updateUBOList([...uboList, {}]);
    //analytics?.trackAsync(Events.UBO_ADD_NEW_CLICK);
  };

  const renderUBOInput = ({ index, details }: { index: number; details: any; isDeleted?: boolean }) => {
    const { fullName, nationality, id, isDeleted, ownershipPercentage, pan } = details; //todo - verify with backend response
    if (isDeleted) return null;
    return (
      <div className={"flex flex-row mb-6"} key={index}>
        <Typography
          text={`${index + 1}.`}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"mt-3.5 mr-4"}
        />
        <div
          className={classnames("flex-1", {
            "flex flex-col md:flex-row md:items-start gap-y-2 md:gap-x-4": true,
          })}
        >
          <TextInput
            isDisabled={!askForPan}
            placeholder={Locale.fullName}
            value={fullName}
            onChange={(value: string) => onDirectorNameChange(value, index)}
            isError={!!formError[`form${index}name`]}
            footerText={formError[`form${index}name`]}
            inputClass={askForPan ? "basis-[41%]" : "basis-[66%]"}
            customClass={"w-1"}
          />
          {askForPan && (
            <TextInput
              placeholder={Locale.panNumberFull}
              value={pan}
              onChange={(value: string) => onDirectorPanChange(value, index)}
              isError={!!formError[`form${index}pan`]}
              footerText={formError[`form${index}pan`]}
              inputClass={"basis-[25%]"}
              customClass={"w-1"}
            />
          )}
          <Dropdown
            searchable={true}
            onSelect={(value: any) => onNationalitySelect(value, index)}
            placeholder={Locale.selecteNationality}
            options={countries}
            selectedValue={nationality}
            isError={!!formError[`form${index}nationality`]}
            footerText={formError[`form${index}nationality`]}
            containerClass={"basis-[33%]"}
            inputTextClass={"w-1"}
          />
        </div>
        <div className={"w-4 ml-4 mt-4"}>
          {!id ? (
            <div onClick={() => onDeleteClick(index)} className={"cursor-pointer"}>
              <DeleteIcon />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  return (
    <>
      {uboList.map((ubo, index) => renderUBOInput({ index: index, details: ubo }))}
      {canAddNew && (
        <div className={"flex flex-row items-center cursor-pointer w-fit"} onClick={onAddUboClick}>
          <AddIcon />
          <Typography
            text={Locale.addNewCta}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"ml-3.5 !text-blue-400"}
          />
        </div>
      )}
    </>
  );
};

export default CompanyPersonnelList;
