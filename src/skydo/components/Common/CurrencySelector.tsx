import { Option, Options } from "../../types/atomicComponentTypes";
import { CALCULATOR_ALLOWED_CURRENCIES, CURRENCY_VS_LOCATION_MAP } from "../../constants/dashboardConstants";
import ImporterLocationVsIconComp from "./ImporterLocationVsIconComp";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React, { useContext, useRef, useState } from "react";
import DeprecatedDropdownOptions from "../AtomicComponents/Dropdown/DeprecatedDropdownOptions";
import classnames from "classnames";
import IndiaFlagIcon from "../Icons/CountryFlags/IndiaFlagIcon";
import DropdownArrow from "./DropdownArrow";
import useOutsideClickFinder from "../../hooks/useOutsideClickFinder";
import AppContext from "../../context/AppContext";

interface OptionsProps {
  inputCurrency: string;
  onCurrencySelect: (currency: string) => void;
}

interface Props extends OptionsProps {
  containerClass?: string;
  isCurrencyDropdownDisabled?: boolean;
}

export const CurrencyOption = (props: {
  currencyOption: Option;
  inputCurrency: string;
  onCurrencySelect?: (val: string) => void;
}) => {
  const { value } = props.currencyOption;
  return (
    <div
      key={value}
      className={"flex_row_item_center flex flex-col px-4 py-3 hover:bg-blue-50"}
      onClick={() => {
        props.onCurrencySelect && props.onCurrencySelect(value);
      }}
    >
      <ImporterLocationVsIconComp location={CURRENCY_VS_LOCATION_MAP[value]} width={24} height={24} />
      <Typography
        size={TYPOGRAPHY_SIZES.LARGE}
        textClasses={props.inputCurrency === value ? "!text-blue-400 ml-2.5" : "ml-2.5"}
        text={value == "ROW" ? "Others" : value}
      />
    </div>
  );
};

const CurrencyOptions = (props: OptionsProps) => {
  const { inputCurrency, onCurrencySelect } = props;
  const renderCurrencyOption = (currencyOption: Option) => (
    <CurrencyOption currencyOption={currencyOption} inputCurrency={inputCurrency} onCurrencySelect={onCurrencySelect} />
  );
  const currencyOptions: Options = CALCULATOR_ALLOWED_CURRENCIES.map((currency: string) => ({
    value: currency,
    label: currency,
    customRowRenderer: renderCurrencyOption,
  }));

  return (
    <DeprecatedDropdownOptions
      options={currencyOptions}
      className={"top-full min-w-[320px] right-0"}
      onOptionClick={onCurrencySelect}
      selectedValue={inputCurrency}
    />
  );
};

const CurrencySelector = (props: Props) => {
  const { inputCurrency, onCurrencySelect, containerClass, isCurrencyDropdownDisabled } = props;
  const [isCurrencySelectorOpen, setIsCurrencySelectorOpen] = useState<boolean>(false);
  const { theme } = useContext(AppContext);
  const currencySelectorRef = useRef<HTMLDivElement | null>(null);

  const onOutsideClick = () => setIsCurrencySelectorOpen(false);
  const onCurrencySelectorClick = () => setIsCurrencySelectorOpen(!isCurrencySelectorOpen);

  useOutsideClickFinder(currencySelectorRef, onOutsideClick);

  return (
    <div
      className={classnames(
        "relative bg-navyblue-500 flex items-center justify-center flex-1 h-[66px] px-4 rounded-r-10px min-w-[129px]",
        {
          "cursor-pointer": !isCurrencyDropdownDisabled,
        },
        containerClass
      )}
      ref={currencySelectorRef}
      onClick={onCurrencySelectorClick}
    >
      {!isCurrencyDropdownDisabled ? (
        <ImporterLocationVsIconComp location={CURRENCY_VS_LOCATION_MAP[inputCurrency]} />
      ) : (
        <IndiaFlagIcon />
      )}
      <Typography text={inputCurrency} type={TYPOGRAPHY_TYPES.LABEL} textClasses={"!text-white ml-2"} />
      {!isCurrencyDropdownDisabled ? (
        <DropdownArrow
          width={16}
          height={16}
          isOpen={isCurrencySelectorOpen}
          stroke={theme.hexColors.white}
          containerClass={"ml-2"}
        />
      ) : null}
      {isCurrencySelectorOpen && !isCurrencyDropdownDisabled ? (
        <CurrencyOptions inputCurrency={inputCurrency} onCurrencySelect={onCurrencySelect} />
      ) : null}
    </div>
  );
};

export default CurrencySelector;
