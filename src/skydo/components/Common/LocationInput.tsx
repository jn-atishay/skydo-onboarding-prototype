import { Option } from "../../types/atomicComponentTypes";
import ImporterLocationVsIconComp from "./ImporterLocationVsIconComp";
import { DropdownSizes } from "../../constants/atomicConstants";
import React from "react";
import SelectDropdown from "../AtomicComponents/Dropdown/SelectDropdown";
import Locale from "../../util/locale/en";

interface LocationInputProps {
  onSelect: (value: string, option: Option) => void;
  value: string;
  options: Option[];
  disableLocationDropDown?: boolean;
}

const LocationInput = ({ onSelect, value, options, disableLocationDropDown = false }: LocationInputProps) => {
  return (
    <SelectDropdown
      onSelect={(val, option) => {
        onSelect(val as string, option);
      }}
      selectedValue={value}
      leftElement={() => <ImporterLocationVsIconComp location={value} width={24} height={24} />}
      renderLeftIcon={(option) => <ImporterLocationVsIconComp location={option.value} width={24} height={24} />}
      leftIcon={true}
      options={options}
      dropdownLabel={Locale.clientLocation}
      isDisabled={disableLocationDropDown}
      className={"min-w-0 w-[200px]"}
      inputClass={"min-w-0"}
      size={DropdownSizes.Small}
      staticDropdown={disableLocationDropDown}
    />
  );
};

export default LocationInput;
