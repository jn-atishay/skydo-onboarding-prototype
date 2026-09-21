import classNames from "classnames";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { INPUT_TYPES, TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { Option, TextInputRef } from "../../types/atomicComponentTypes";
import { Country } from "../../types/internationalAccounts";
import { uniqBy } from "remeda";
import { dropdownOptionsFilter } from "../../util/searchHelpers";
import Locale from "../../util/locale/en";
import Typography from "../AtomicComponents/Typography";
import CheckBox from "../AtomicComponents/CheckBox";
import TextInput from "../AtomicComponents/TextInput";
import Tooltip from "../AtomicComponents/Tooltip";
import CountryFlagImage from "../Icons/CountryFlags/CountryFlagImage";
import DownArrowIcon from "../Icons/DownArrowIcon";
import CloseLineIcon from "../Icons/CloseLineIcon";
import SearchIcon from "../Icons/SearchIcon";

// Chips past this count collapse into a "+N" pill so the field stays one row tall.
const MAX_VISIBLE_CHIPS = 3;

interface Props {
  countries: Country[];
  isLoading?: boolean;
  hasFailed?: boolean;
  onRetry?: () => void;
  selectedCodes: string[];
  onChange: (codes: string[]) => void;
  label?: string;
  placeholder?: string;
}

const CountryMultiSelect = (props: Props) => {
  const { countries, selectedCodes, onChange, label, placeholder, isLoading, hasFailed, onRetry } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<TextInputRef>(null);

  useEffect(() => {
    const onScreenClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("click", onScreenClick);
    return () => {
      document.removeEventListener("click", onScreenClick);
    };
  }, []);

  // The country master holds two rows for some codes (VA is both "Vatican City" and "Holy See"),
  // and selection is keyed by code, so duplicates would share a React key and a checkbox.
  const options: Option[] = useMemo(
    () =>
      uniqBy(
        countries.filter((country) => country.code2Alpha),
        (country) => country.code2Alpha
      ).map((country) => ({ label: country.name, value: country.code2Alpha })),
    [countries]
  );

  // Searching the whole list rather than the rendered page keeps every country reachable by name.
  const visibleOptions = useMemo(
    () => (query ? dropdownOptionsFilter(query, options) : options),
    [query, options]
  );

  const nameByCode = useMemo(
    () => new Map(options.map((option) => [String(option.value), String(option.label)])),
    [options]
  );

  const toggleCode = (code: string) => {
    onChange(selectedCodes.includes(code) ? selectedCodes.filter((item) => item !== code) : [...selectedCodes, code]);
    // Selecting resets the search so the next country can be typed without clearing the field first.
    setQuery("");
    inputRef.current?.focus();
  };

  const visibleChips = selectedCodes.slice(0, MAX_VISIBLE_CHIPS);
  const hiddenChipCodes = selectedCodes.slice(MAX_VISIBLE_CHIPS);
  const hiddenChipCount = hiddenChipCodes.length;

  const renderChip = (code: string) => (
    <div
      key={code}
      className={"flex flex-row items-center gap-2 min-w-0 pl-2 pr-1 py-1 border border-black-400 rounded-10px"}
    >
      <CountryFlagImage code2Alpha={code} width={20} height={15} />
      <Typography
        text={nameByCode.get(code) ?? code}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"truncate"}
      />
      <div
        className={"shrink-0 flex items-center justify-center rounded-full bg-black-100 cursor-pointer"}
        onClick={(event) => {
          event.stopPropagation();
          toggleCode(code);
        }}
      >
        <CloseLineIcon stroke={"#425466"} width={16} height={16} />
      </div>
    </div>
  );

  return (
    <div className={"flex flex-col gap-2 flex-1 min-h-0"} ref={containerRef}>
      {label ? <Typography text={label} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} /> : null}
      <div className={"flex flex-col min-h-0 flex-1 gap-2"}>
        <TextInput
          ref={inputRef}
          value={query}
          size={INPUT_TYPES.LARGE}
          placeholder={placeholder ?? Locale.intAccountPage.searchClientCountry}
          leftElement={() => (
            <div className={"mr-2 shrink-0"}>
              <SearchIcon width={20} height={20} />
            </div>
          )}
          rightElement={() => (
            <div
              className={classNames("ease-linear duration-300 shrink-0 cursor-pointer", { "rotate-180": isOpen })}
              onClick={(event) => {
                event.stopPropagation();
                setIsOpen(!isOpen);
              }}
            >
              <DownArrowIcon width={20} height={20} />
            </div>
          )}
          onOnlyInputAreaClick={() => setIsOpen(true)}
          onChange={(value: string) => {
            setQuery(value);
            setIsOpen(true);
          }}
        />
        {/* Chips sit below the field so typing never reflows the input, and hide while the list is
            open so the options read as belonging to the search box directly above them. */}
        {selectedCodes.length && !isOpen ? (
          <div className={"shrink-0 flex flex-row items-center gap-2 min-w-0"}>
            {visibleChips.map(renderChip)}
            {hiddenChipCount > 0 ? (
              <Tooltip
                tooltipText={
                  <div className={"flex flex-col"}>
                    {hiddenChipCodes.map((code) => (
                      <Typography
                        key={code}
                        text={nameByCode.get(code) ?? code}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.SMALL}
                        textClasses={"!text-white"}
                      />
                    ))}
                  </div>
                }
                tooltipTheme={"dark"}
                position={TOOLTIP_POSITION.TOP}
              >
                <div className={"shrink-0 px-3 py-2 border border-black-400 rounded-10px"}>
                  <Typography
                    text={`+${hiddenChipCount}`}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                  />
                </div>
              </Tooltip>
            ) : null}
          </div>
        ) : null}
        {isOpen ? (
          <div className={"flex-1 min-h-0 overflow-y-auto overscroll-contain bg-white rounded-10px shadow-dropdown"}>
            {visibleOptions.length ? (
              visibleOptions.map((option) => {
                const code = String(option.value);
                return (
                  <div
                    key={code}
                    className={"flex flex-row items-center gap-3 px-4 py-3 cursor-pointer hover:bg-blue-50"}
                    onClick={() => toggleCode(code)}
                  >
                    <CountryFlagImage code2Alpha={code} width={20} height={15} />
                    <Typography
                      text={option.label}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.MEDIUM}
                      textClasses={"flex-1"}
                    />
                    <CheckBox checked={selectedCodes.includes(code)} checkboxClass={"w-5 h-5 cursor-pointer"} />
                  </div>
                );
              })
            ) : (
              <div className={"flex flex-row items-center gap-2 px-4 py-3"}>
                <Typography
                  text={hasFailed ? Locale.intAccountPage.countryListLoadFailed : isLoading ? Locale.loading : Locale.noResultsFound}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-500"}
                />
                {hasFailed && onRetry ? (
                  <Typography
                    text={Locale.retry}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-blue-400 cursor-pointer"}
                    onTextClick={onRetry}
                  />
                ) : null}
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CountryMultiSelect;
