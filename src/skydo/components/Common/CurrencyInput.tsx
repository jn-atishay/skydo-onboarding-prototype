//Jun 2023

import Dropdown from "../AtomicComponents/Dropdown";
import Locale from "../../util/locale/en";
import ImporterLocationVsIconComp from "./ImporterLocationVsIconComp";
import { CURRENCY_META_DATA, CURRENCY_VS_LOCATION_MAP, INVOICE_CURRENCIES } from "../../constants/dashboardConstants";
import { INPUT_TYPES } from "../../constants/atomicConstants";
import React from "react";
import { Option, Options } from "../../types/atomicComponentTypes";
import { CurrencyOption } from "./CurrencySelector";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  selectedCurrency: string;
  onCurrencySelect: (currency: string) => void;
  className?: string;
  textInputSize?: string;
  currencyList?: string[];
  hideLabel?: boolean;
  isError?: boolean;
  errorMessage?: string;
  renderOption?: (currencyOption: Option, onOptionClick: (val: any, isDisabled: any) => void) => JSX.Element;
  searchable?: boolean;
  customLabel?: (currency: string) => string;
  dropdownLabel?: string;
  /** When true, opening dropdown shows full list (used by ClientBankCountryInput) */
  resetFilterOnOpen?: boolean;
}

const CurrencyInput = (props: Props) => {
  const {
    selectedCurrency,
    onCurrencySelect,
    isError,
    errorMessage,
    renderOption,
    searchable = true,
    customLabel,
    dropdownLabel,
    resetFilterOnOpen,
  } = props;
  const analytics = useAnalytics();

  const renderCurrencyOption = (currencyOption: Option, onOptionClick: (val: any, isDisabled: any) => void) => (
    <CurrencyOption
      currencyOption={currencyOption}
      inputCurrency={selectedCurrency}
      onCurrencySelect={(value) => onOptionClick(value, false)}
    />
  );

  const currencyOptions: Options = (props.currencyList || INVOICE_CURRENCIES).map((currency: string) => ({
    value: currency,
    metaData: CURRENCY_META_DATA[currency],
    label: customLabel ? customLabel(currency) : currency == "ROW" ? "Others" : currency,
    customRowRenderer: renderOption ? renderOption : renderCurrencyOption,
  }));

  return (
    <Dropdown
      resetFilterOnOpen={resetFilterOnOpen}
      searchable={searchable}
      dropdownLabel={props.hideLabel ? undefined : dropdownLabel ? dropdownLabel : Locale.currency}
      showSearchIcon={true}
      leftElement={() => (
        <ImporterLocationVsIconComp
          width={24}
          height={24}
          location={CURRENCY_VS_LOCATION_MAP[selectedCurrency]?.toUpperCase()}
        />
      )}
      options={currencyOptions}
      selectedValue={selectedCurrency}
      isError={isError}
      footerText={errorMessage}
      inputTextClass={"w-0"}
      containerClass={`w-[34%] max-w-[250px] mr-6 ${props.className}`}
      onSelect={(value) => {
        analytics?.trackAsync(Events.ANALYTICS.CURRENCY_DROP_DOWN_CLICK, { currency: value });
        onCurrencySelect(value);
      }}
      placeholder={Locale.selectCurrency}
      textInputSize={props.textInputSize || INPUT_TYPES.SMALL}
    />
  );
};

export default CurrencyInput;
