import { useState } from "react";
import { Option } from "../../types/atomicComponentTypes";

interface Props {
  selectedValue?: unknown;
  initialValue?: string;
  options: Option[];
}

const useDropdownHook = (props: Props) => {
  const [optionsVisible, toggleOptions] = useState(false);
  const [newOption, setNewOption] = useState<Option>();
  const [inputVal, changeInputVal] = useState(getOption()?.label || "");

  function getOption(value?: unknown): Option {
    const verifyingValue = value !== undefined ? value : props.selectedValue;
    if (newOption && newOption.value === verifyingValue) return { ...newOption };
    for (let i = 0; i < props.options.length; ++i) {
      const option = props.options[i];
      if (option.value === verifyingValue) return option;
    }
    return { label: props.initialValue || "", value: undefined, subText: undefined };
  }

  return { optionsVisible, inputVal, getOption, toggleOptions, changeInputVal, newOption, setNewOption };
};

export default useDropdownHook;
