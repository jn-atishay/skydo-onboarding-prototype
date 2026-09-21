import React, { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames";
import Button from "../AtomicComponents/Button";
import TextInput from "../AtomicComponents/TextInput";
import Tooltip from "../AtomicComponents/Tooltip";
import Typography from "../AtomicComponents/Typography";
import LoadingChip from "../Common/Loaders/LoadingChip";
import CheckIcon from "../Icons/CheckIcon";
import DownArrowIcon from "../Icons/DownArrowIcon";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  INPUT_TYPES,
  TOOLTIP_POSITION,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import {
  PURPOSE_CODE_ICON_COLORS,
  PURPOSE_CODE_INDUSTRY_CODES,
  PURPOSE_CODE_TAGS,
} from "../../constants/purposeCodeConstants";
import { PurposeCode, PurposeCodeList } from "../../types";
import { TextInputRef } from "../../types/atomicComponentTypes";
import Locale from "../../util/locale/en";

type Props = {
  currentIndustryId?: number;
  purposeCodeOption?: PurposeCodeList;
  selectedPC?: string;
  onPCSelect: (value: string) => void;
  onClose: () => void;
  isError?: boolean;
  isLoading?: boolean;
  hasLoadError?: boolean;
  onRetryLoad?: () => void;
};

type IndustryCopy = {
  shortName: string;
  fullName: string;
  sourceName: string;
};

const industryCopies = Locale.purposeCodeIndustries as Record<number, IndustryCopy>;

const PurposeCodeTag = ({ code }: { code: string }) => {
  const tag = PURPOSE_CODE_TAGS[code];
  if (!tag) return null;

  return (
    <div className={"flex items-center rounded-40px bg-alert-50 px-2 py-0.5"}>
      <Typography
        text={tag === "advance" ? Locale.advancePaymentsOnly : Locale.softexFilersOnly}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.X_X_SMALL}
        textClasses={"!font-bold !text-alert-600"}
      />
    </div>
  );
};

const PurposeCodeRow = ({
  option,
  isSelected,
  onSelect,
}: {
  option: PurposeCode;
  isSelected: boolean;
  onSelect: (value: string) => void;
}) => {
  const selectOption = () => onSelect(option.code);
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      selectOption();
    }
  };

  return (
    <div className={"mb-1 px-3"}>
      <div
        role={"option"}
        aria-selected={isSelected}
        tabIndex={0}
        className={classNames(
          "flex cursor-pointer items-center justify-between gap-2 rounded-8px px-4 py-2 hover:bg-primary-100 focus:bg-primary-100 focus:outline-none",
          { "bg-primary-100": isSelected }
        )}
        onClick={selectOption}
        onKeyDown={onKeyDown}
      >
        <div className={"flex min-w-0 flex-col gap-1"}>
          <div className={"flex items-center gap-2"}>
            <Typography
              text={option.code}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={classNames("!font-bold", { "!text-navyblue-500": isSelected })}
            />
            <PurposeCodeTag code={option.code} />
          </div>
          <Typography
            text={option.description}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={classNames("truncate", isSelected ? "!text-navyblue-500" : "!text-neutral-500")}
          />
        </div>
        {isSelected ? <CheckIcon stroke={PURPOSE_CODE_ICON_COLORS.SELECTED} className={"shrink-0"} /> : null}
      </div>
    </div>
  );
};

const PurposeCodeListLoader = () => (
  <div className={"animate-pulse"} aria-label={Locale.loading}>
    <div className={"flex h-72 flex-col gap-4 px-4 py-4"}>
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className={"flex flex-col gap-2"}>
          <LoadingChip containerClass={"h-4 w-1/4"} />
          <LoadingChip containerClass={"h-3 w-2/3 !bg-black-100"} />
        </div>
      ))}
    </div>
    <div className={"border-t border-neutral-100 px-4 py-2.5"}>
      <LoadingChip containerClass={"h-6 w-1/3"} />
    </div>
  </div>
);

const DefaultPurposeCodeSelector = ({
  currentIndustryId = 17,
  purposeCodeOption = [],
  selectedPC,
  onPCSelect,
  onClose,
  isError,
  isLoading = false,
  hasLoadError = false,
  onRetryLoad,
}: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showOtherCodes, setShowOtherCodes] = useState(false);
  const searchInputRef = useRef<TextInputRef>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const otherCodesHeaderRef = useRef<HTMLDivElement>(null);
  const hasToggledOtherCodes = useRef(false);

  useEffect(() => {
    // The Popup shell focuses its own container on mount; defer so the search field ends up focused.
    const focusTimer = window.setTimeout(() => searchInputRef.current?.focus(), 0);
    return () => window.clearTimeout(focusTimer);
  }, []);

  useEffect(() => {
    if (!hasToggledOtherCodes.current) return;
    const listbox = listboxRef.current;
    if (!listbox) return;
    if (showOtherCodes && otherCodesHeaderRef.current) {
      const offset = otherCodesHeaderRef.current.getBoundingClientRect().top - listbox.getBoundingClientRect().top;
      listbox.scrollTo({ top: listbox.scrollTop + offset, behavior: "smooth" });
    } else {
      listbox.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [showOtherCodes]);
  const normalizedSearch = searchTerm.trim().toLowerCase();
  const currentIndustry = industryCopies[currentIndustryId] ?? industryCopies[17];
  const currentIndustryCodes = PURPOSE_CODE_INDUSTRY_CODES[currentIndustryId] ?? PURPOSE_CODE_INDUSTRY_CODES[17];

  const purposeCodesByCode = useMemo(
    () => new Map(purposeCodeOption.map((option) => [option.code, option])),
    [purposeCodeOption]
  );

  const recommendedOptions = useMemo(
    () =>
      currentIndustryCodes
        .map((code) => purposeCodesByCode.get(code))
        .filter((option): option is PurposeCode => !!option),
    [currentIndustryCodes, purposeCodesByCode]
  );

  const filteredOptions = useMemo(() => {
    if (!normalizedSearch) return purposeCodeOption;

    return purposeCodeOption.filter(
      (option) =>
        option.code.toLowerCase().includes(normalizedSearch) ||
        option.description.toLowerCase().includes(normalizedSearch)
    );
  }, [normalizedSearch, purposeCodeOption]);

  const recommendedCodeSet = useMemo(() => new Set(currentIndustryCodes), [currentIndustryCodes]);
  const matchingRecommendedOptions = recommendedOptions.filter((option) =>
    filteredOptions.some((filteredOption) => filteredOption.code === option.code)
  );
  const otherOptions = filteredOptions.filter((option) => !recommendedCodeSet.has(option.code));
  const visibleRecommendedOptions = normalizedSearch ? matchingRecommendedOptions : recommendedOptions;
  const visibleOtherOptions = normalizedSearch || showOtherCodes ? otherOptions : [];
  const hasResults = visibleRecommendedOptions.length > 0 || visibleOtherOptions.length > 0;

  const renderOptions = (options: PurposeCodeList) =>
    options.map((option) => (
      <PurposeCodeRow key={option.code} option={option} isSelected={selectedPC === option.code} onSelect={onPCSelect} />
    ));

  return (
    <div
      className={classNames(
        "overflow-hidden rounded-10px border-1.5 bg-white",
        isError ? "border-warning-400" : "border-neutral-500"
      )}
    >
      <TextInput
        ref={searchInputRef}
        value={searchTerm}
        onChange={setSearchTerm}
        placeholder={Locale.searchOrSelectPC}
        size={INPUT_TYPES.MEDIUM}
        inputWrapperClass={"!rounded-none !border-x-0 !border-t-0 !border-neutral-100"}
        customClass={"text-paramedium placeholder:!text-black-500"}
        rightElement={() => (
          <div
            role={"button"}
            tabIndex={0}
            aria-label={Locale.closePurposeCodeDropdown}
            className={"cursor-pointer"}
            onClick={onClose}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClose();
              }
            }}
          >
            <DownArrowIcon stroke={PURPOSE_CODE_ICON_COLORS.MUTED} className={"rotate-180"} />
          </div>
        )}
        inputProps={{ "aria-label": Locale.searchOrSelectPC }}
      />

      {isLoading ? <PurposeCodeListLoader /> : null}

      {!isLoading && hasLoadError ? (
        <div className={"flex flex-col items-center gap-2 px-4 py-10"}>
          <Typography text={Locale.purposeCodeListError} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} />
          <Button
            title={Locale.retry}
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
            onButtonClick={() => onRetryLoad?.()}
          />
        </div>
      ) : null}

      <div
        ref={listboxRef}
        className={classNames("max-h-72 overflow-y-auto pb-2", { hidden: isLoading || hasLoadError })}
        role={"listbox"}
      >
        {visibleRecommendedOptions.length > 0 ? (
          <>
            <div className={"flex items-center px-4 py-3"}>
              {currentIndustry.fullName ? (
                <Tooltip
                  tooltipText={currentIndustry.fullName}
                  position={TOOLTIP_POSITION.RIGHT}
                  tooltipTheme={"dark"}
                  popperOptions={{
                    modifiers: {
                      preventOverflow: { boundariesElement: "viewport" },
                      flip: { boundariesElement: "viewport" },
                    },
                  }}
                >
                  <Typography
                    text={`${Locale.industryLabel}: ${currentIndustry.shortName}`.toUpperCase()}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={"!font-bold !tracking-wider !text-neutral-500"}
                  />
                </Tooltip>
              ) : (
                <Typography
                  text={`${Locale.industryLabel}: ${currentIndustry.shortName}`.toUpperCase()}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!font-bold !tracking-wider !text-neutral-500"}
                />
              )}
            </div>
            {renderOptions(visibleRecommendedOptions)}
          </>
        ) : null}

        {visibleOtherOptions.length > 0 ? (
          <>
            <div ref={otherCodesHeaderRef} className={"mb-2 bg-neutral-50 px-4 py-2"}>
              <Typography
                text={Locale.otherPurposeCodes}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-neutral-500"}
              />
            </div>
            {renderOptions(visibleOtherOptions)}
          </>
        ) : null}

        {!hasResults ? (
          <div className={"flex flex-col items-center gap-2 px-4 py-6"}>
            <Typography
              text={Locale.noPurposeCodeResults}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
            <Typography
              text={Locale.tryDifferentPurposeCodeSearch}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-neutral-500"}
            />
            <Button
              title={Locale.showAllPurposeCodes}
              type={BUTTON_TYPES.TERTIARY}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={() => {
                setSearchTerm("");
                setShowOtherCodes(true);
              }}
            />
          </div>
        ) : null}
      </div>

      {!normalizedSearch && !isLoading && !hasLoadError ? (
        <div className={"border-t border-neutral-100 px-4 py-2.5"}>
          <Button
            title={showOtherCodes ? Locale.hideOtherPurposeCodes : Locale.showOtherPurposeCodes}
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.X_SMALL}
            buttonClass={"!-ml-2 !h-auto !px-2 !py-1"}
            textClasses={"!font-normal !text-primary-300"}
            rightIcon={() => (
              <DownArrowIcon
                width={16}
                height={16}
                stroke={PURPOSE_CODE_ICON_COLORS.LINK}
                className={classNames({ "rotate-180": showOtherCodes })}
              />
            )}
            onButtonClick={() => {
              hasToggledOtherCodes.current = true;
              setShowOtherCodes((isVisible) => !isVisible);
            }}
          />
        </div>
      ) : null}
    </div>
  );
};

export default DefaultPurposeCodeSelector;
