import TextInput from "../AtomicComponents/TextInput";

interface Props {
  label?: string;
  value?: any;
  placeholder?: string;
  onChange: (value: string) => void;
  isError?: boolean;
  errorText?: string;
  isDisabled?: boolean;
  inputClass?: string;
  customClass?: string;
  disabledClass?: string;
}

const AlphaNumericInput = (props: Props) => {
  const {
    label,
    value,
    placeholder,
    onChange,
    isError,
    errorText,
    isDisabled,
    inputClass,
    customClass,
    disabledClass,
  } = props;

  const onPanChange = (value: any) => {
    const alphaNumericVal = value ? value.replace(/[^0-9a-zA-Z]+/gi, "") : "";
    onChange(alphaNumericVal.toUpperCase());
  };
  return (
    <TextInput
      inputClass={inputClass}
      isDisabled={isDisabled}
      label={label}
      value={value}
      placeholder={placeholder}
      onChange={onPanChange}
      isError={isError}
      footerText={errorText}
      customClass={customClass}
      disabledClass={disabledClass}
    />
  );
};

export default AlphaNumericInput;
