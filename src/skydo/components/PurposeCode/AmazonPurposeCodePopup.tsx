import React, { useEffect, useMemo, useState } from "react";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import PopupHeader from "../AtomicComponents/Popup/PopupHeader";
import RadioButton from "../AtomicComponents/RadioButton";
import Typography from "../AtomicComponents/Typography";
import PackageIcon from "../Icons/PackageIcon";
import classNames from "classnames";
import Button from "../AtomicComponents/Button";
import ShipIcon from "../Icons/ShipIcon";
import useToastMessages from "../../store/toastMessages";
import { PurposeCode, PurposeCodeList } from "../../types";
import Notes from "../AtomicComponents/Notes";
import usePurposeCodeList from "../../store/usePurposeCodeList";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import WarningInfoIcon from "../Icons/WarningInfoIcon";

const NOT_SURE = "NOT_SURE";

const CSB4 = "CSB4";
const CSB5 = "CSB5";

/**
 * Aligns GraphQL / dashboard / onboarding strings with UI option values (CSB4, CSB5, NOT_SURE).
 */
function normalizeAmazonShippingMethod(raw: unknown): string | undefined {
  if (raw == null) return undefined;
  let s: string;
  if (typeof raw === "string") {
    s = raw.trim();
  } else if (typeof raw === "object" && raw !== null && "shippingMethod" in raw) {
    const inner = (raw as { shippingMethod?: unknown }).shippingMethod;
    if (inner == null || typeof inner !== "string") return undefined;
    s = inner.trim();
  } else {
    return undefined;
  }
  if (s === "") return undefined;
  const normalizedUnderscore = s.replace(/-/g, "_").toUpperCase();
  if (normalizedUnderscore === "CSB4") return CSB4;
  if (normalizedUnderscore === "CSB5") return CSB5;
  if (s === "I_AM_NOT_SURE") return NOT_SURE;
  return s;
}

const AmazonPurposeCodePopup = ({
                                  onClosePopup,
                                  onSubmitClick,
                                  onPCSelect,
                                  isButtonLoading,
                                  selectedPurposeCode,
                                  purposeCodeOption = [],
                                  isFromProfile = false,
                                  defaultShippingMethod,
                                }: {
  onClosePopup: () => void;
  onSubmitClick: (shippingMethod: string, applyToAllFuture?: boolean) => void;
  onPCSelect: (purposeCode: string) => void;
  isButtonLoading: boolean;
  selectedPurposeCode: string;
  purposeCodeOption?: PurposeCodeList;
  isFromProfile?: boolean;
  /** GraphQL / dashboard: string or nested `{ shippingMethod }` from exporter KYC */
  defaultShippingMethod?: string | { shippingMethod?: string };
}) => {
  const OPTIONS = { CSB4, CSB5, NOT_SURE };
  const [selectedOption, setSelectedOption] = useState(CSB5);
  const [error, setError] = useState(false);
  const { addToast } = useToastMessages();
  /** Set in useDashboardContainerStore after GET /api/dashboard-data (exporter.exporterKyc.shippingMethod) */
  const { hdfcBankAccount: isHDFC, shippingMethod: shippingMethodFromStore } = usePurposeCodeList();
  const analytics = useAnalytics();

  /** Prefer Zustand (same source as parent prop); may be undefined on first paint until dashboard / GraphQL completes */
  const rawShipping = shippingMethodFromStore ?? defaultShippingMethod;

  const normalizedShipping = useMemo(
    () => normalizeAmazonShippingMethod(rawShipping),
    [shippingMethodFromStore, defaultShippingMethod]
  );

  /**
   * Shipping tiles only when the user has no saved method from GraphQL (null/empty).
   * Saved CSB4 / CSB5 / NOT_SURE (incl. CSB_4, CSB_5, I_AM_NOT_SURE from API) → hide tiles; user picks purpose code only.
   */
  const hasSavedShippingMethod =
    normalizedShipping != null &&
    normalizedShipping !== "" &&
    (normalizedShipping === OPTIONS.CSB4 ||
      normalizedShipping === OPTIONS.CSB5);

  // Add state for the checkbox
  const [applyToAllFuture, setApplyToAllFuture] = useState<boolean>(false);
  const [showApplyError, setShowApplyError] = useState<boolean>(false);

  const AMAZON_PURPOSE_CODE_LIST = ["P0102", "P0103", "P1007"];

  /**
   * HDFC + CSB4 → P1007 + CSB4 note.
   * HDFC + CSB5 / NOT_SURE → P0102 + P0103.
   * Non-HDFC → P0102 + P0103 for CSB4 / CSB5 / NOT_SURE.
   */
  const showHdfcCsb4P1007 = isHDFC && selectedOption === OPTIONS.CSB4;
  const showP0102P0103 =
    !showHdfcCsb4P1007 &&
    (!isHDFC || selectedOption === OPTIONS.CSB5 || selectedOption === NOT_SURE);

  // Fallback descriptions for Amazon purpose codes
  const AMAZON_PURPOSE_CODE_FALLBACKS = {
    P0102: {
      code: "P0102",
      description: "Realisation of export bills sent on collection"
    },
    P0103: {
      code: "P0103",
      description: "Advance payments against goods export"
    },
    P1007: {
      code: "P1007",
      description: "Advertising, trade fair, market research and public opinion polling services."
    }
  };

  const amazonPurposeCodeDetails = purposeCodeOption.reduce(
    (
      acc: {
        [key: string]: PurposeCode;
      },
      pc
    ) => {
      if (AMAZON_PURPOSE_CODE_LIST.includes(pc.code)) {
        acc[pc.code] = { ...pc };
      }
      return acc;
    },
    {}
  );

  // Add fallback descriptions for any missing purpose codes
  AMAZON_PURPOSE_CODE_LIST.forEach(code => {
    if (!amazonPurposeCodeDetails[code]) {
      amazonPurposeCodeDetails[code] = AMAZON_PURPOSE_CODE_FALLBACKS[code as keyof typeof AMAZON_PURPOSE_CODE_FALLBACKS];
    } else if (!amazonPurposeCodeDetails[code].description) {
      amazonPurposeCodeDetails[code].description = AMAZON_PURPOSE_CODE_FALLBACKS[code as keyof typeof AMAZON_PURPOSE_CODE_FALLBACKS].description;
    }
  });

  const AMAZON_PURPOSE_CODES = {
    P0102: "P0102",
    P0103: "P0103",
    P1007: "P1007",
  };

  /** When GraphQL / dashboard hydration finishes, align selected shipping (CSB4 / CSB5 / NOT_SURE) with backend */
  useEffect(() => {
    const sm = normalizedShipping;
    if (sm === OPTIONS.CSB4) {
      setSelectedOption(OPTIONS.CSB4);
      if (isHDFC) {
        onPCSelect(AMAZON_PURPOSE_CODES.P1007);
      }
    } else if (sm === OPTIONS.CSB5) {
      setSelectedOption(OPTIONS.CSB5);
    } else if (sm === NOT_SURE) {
      setSelectedOption(NOT_SURE);
    }
  }, [normalizedShipping, isHDFC, onPCSelect]);

  const onSubmit = () => {
    if (!selectedOption) {
      setError(true);
      analytics.trackAsync(Events.PURPOSE_CODE_ERROR, {
        error: "shipping_method_not_selected",
      });
      return;
    }

    if (!selectedPurposeCode) {
      analytics.trackAsync(Events.PURPOSE_CODE_ERROR, {
        error: "purpose_code_not_selected",
      });
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "pc_change_error",
        body: Locale.pleaseChooseAPurposeCode,
      });
      return;
    }

    // Check if user wants to apply to all future but hasn't selected a purpose code
    if (applyToAllFuture && !selectedPurposeCode) {
      setShowApplyError(true);
      return;
    }

    // Pass the applyToAllFuture flag to the parent component
    onSubmitClick(selectedOption, applyToAllFuture);
  };

  const selectOption = (option: string) => {
    analytics.trackAsync(Events.AMAZON_SHIPPING_METHOD_SELECTED, {
      shippingMethod: option,
    });
    setSelectedOption(option);
    if (option === OPTIONS.CSB4 && isHDFC) {
      onPCSelect(AMAZON_PURPOSE_CODES.P1007);
    } else {
      onPCSelect("");
    }
    // Clear checkbox when switching shipping methods
    setApplyToAllFuture(false);
    setError(false);
    setShowApplyError(false);
  };

  // Add a new function to handle purpose code selection
  const handlePurposeCodeSelect = (purposeCode: string) => {
    onPCSelect(purposeCode);
    // Only auto-check the checkbox when a purpose code is actually selected
    setApplyToAllFuture(true);
    setShowApplyError(false);
  };

  // Handle checkbox change
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    
    if (isChecked && !selectedPurposeCode) {
      // Show error if trying to check without selecting a purpose code
      setShowApplyError(true);
      setApplyToAllFuture(false); // Don't actually check it
    } else {
      setApplyToAllFuture(isChecked);
      setShowApplyError(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg w-[600px] overflow-hidden !p-0">
      {/* Yellow Banner */}
      <div className="relative bg-yellow-50 px-6 py-6 flex flex-col items-center text-center">
        {/* Close button at top-right */}
        <div className="flex justify-end w-full px-4">
          <PopupHeader closeIconClick={() => onClosePopup()} disableCrossIcon={false} className="!mb-0" />
        </div>

        {/* Centered icon + texts */}
        <div className="flex flex-col items-center pt-[8px]">
          {/* Warning Icon with bottom padding */}
          <div className="pb-4">
            <WarningInfoIcon isLarge={true} fillColor={"#FFC043"} />
          </div>

          {/* Heading Typography */}
          <div className="pb-2">
            <Typography
              text={isFromProfile ? Locale.changePurposeCode : Locale.setPurposeCodeToSettle}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses="!font-semibold !text-black"
            />
          </div>

          {/* Paragraph Typography */}
          <div>
            <Typography
              text={Locale.RBIrequires}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses="!text-black-500 !text-center !font-normal !text-lg !leading-[28px]"
            />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col gap-6">
        {!hasSavedShippingMethod && (
          <>
            <Typography
              text={Locale.selectShippingMethod}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses="!text-black !text-center !font-semibold !text-lg !leading-6"
            />

            {/* Shipping method buttons */}
            <div className="grid grid-cols-2 gap-4">
          <div
            className={classNames(
              "cursor-pointer p-4 flex flex-col items-center gap-3 rounded-[10px] border",
              selectedOption === OPTIONS.CSB5 ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
            )}
            onClick={() => selectOption(OPTIONS.CSB5)}
          >
            <ShipIcon isSelected={selectedOption === OPTIONS.CSB5} />
            <Typography
              text={Locale.csb5Title}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={
                selectedOption === OPTIONS.CSB5
                  ? "!text-blue-400 !text-center !font-bold !text-base !leading-6 font-lato"
                  : "!text-black-700 !text-center !font-bold !text-base !leading-6 font-lato"
              }
            />
          </div>

          <div
            className={classNames(
              "cursor-pointer p-4 flex flex-col items-center gap-3 rounded-[10px] border",
              selectedOption === OPTIONS.CSB4 ? "border-blue-400 bg-blue-50" : "border-gray-300 bg-white"
            )}
            onClick={() => selectOption(OPTIONS.CSB4)}
          >
            <PackageIcon isSelected={selectedOption === OPTIONS.CSB4} />
            <Typography
              text={Locale.csb4Title}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={
                selectedOption === OPTIONS.CSB4
                  ? "!text-blue-400 !text-center !font-bold !text-base !leading-6 font-lato"
                  : "!text-black-700 !text-center !font-bold !text-base !leading-6 font-lato"
              }
            />
          </div>
            </div>
          </>
        )}

        {/* Purpose code options */}
        {!!selectedOption && (
          <div className="flex flex-col gap-2 border border-black-100 rounded-lg">
            {/*<hr className="border-gray-300" />*/}

            <div className=" p-4 flex flex-col gap-6 bg-black-50">
              <Typography
                text={Locale.selectPurposeCode}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses="!text-black-500 !font-bold !text-base !leading-6 !self-stretch"
              />

              <div className="">
                {showHdfcCsb4P1007 && (
                  <div className="flex flex-col space-y-4">
                    <RadioButton
                      key="P1007"
                      checked={selectedPurposeCode === AMAZON_PURPOSE_CODES.P1007}
                      onBodyClick={() => handlePurposeCodeSelect(AMAZON_PURPOSE_CODES.P1007)}
                      className="!items-start"
                      inputClassName="shrink-0"
                      id="P1007"
                      label={() => (
                        <div className="flex flex-row gap-2 ml-2">
                          <Typography
                            text={`${AMAZON_PURPOSE_CODES.P1007}:`}
                            type={TYPOGRAPHY_TYPES.PARA}
                            size={TYPOGRAPHY_SIZES.MEDIUM}
                            textClasses="!text-black-700 !font-bold !text-base !leading-6"
                          />
                          <Typography
                            text={amazonPurposeCodeDetails.P1007.description}
                            type={TYPOGRAPHY_TYPES.PARA}
                            size={TYPOGRAPHY_SIZES.MEDIUM}
                            textClasses="!text-black-700 !font-normal !text-base !leading-6"
                          />
                        </div>
                      )}
                    />
                    <Notes
                      text={Locale.csb4Note}
                      iconHeight={24}
                      iconWidth={24}
                      iconColor={"#276EF1"}
                      className="!rounded-[5px] !border !border-[#A0BFF8] !bg-blue-50"
                    />
                  </div>
                )}

                {showP0102P0103 && (
                  <div className="flex flex-col space-y-4">
                    {["P0102", "P0103"].map((code) => (
                      <RadioButton
                        key={code}
                        checked={
                          selectedPurposeCode === AMAZON_PURPOSE_CODES[code as keyof typeof AMAZON_PURPOSE_CODES]
                        }
                        onBodyClick={() =>
                          handlePurposeCodeSelect(AMAZON_PURPOSE_CODES[code as keyof typeof AMAZON_PURPOSE_CODES])
                        }
                        className="!items-start"
                        inputClassName="shrink-0"
                        id={code}
                        label={() => (
                          <div className="flex flex-row gap-2 ml-2">
                            <Typography
                              text={`${code}:`}
                              type={TYPOGRAPHY_TYPES.PARA}
                              size={TYPOGRAPHY_SIZES.MEDIUM}
                              textClasses="!text-black-700 !font-bold !text-base !leading-6"
                            />
                            <Typography
                              text={amazonPurposeCodeDetails[code].description}
                              type={TYPOGRAPHY_TYPES.PARA}
                              size={TYPOGRAPHY_SIZES.MEDIUM}
                              textClasses="!text-black-700 !font-normal !text-base !leading-6"
                            />
                          </div>
                        )}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="px-4 pb-4">
              {!!selectedOption && (
                <div className="flex flex-col gap-2">
                  <div className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      id="applyToAllFuture"
                      checked={applyToAllFuture}
                      onChange={handleCheckboxChange}
                      className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor="applyToAllFuture" className="cursor-pointer">
                      <Typography
                        text={Locale.applyInvoicePCtoDefault}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.SMALL}
                        textClasses="!text-black-700 !font-normal !text-base !leading-6"
                      />
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!!selectedOption && (
          <div className="flex flex-col mt-[-16px]">
            {showApplyError && (
              <Typography
                text={Locale.selectPurposeCodeToApplyAllFutureInvoices}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses="!text-red-500 !font-normal !text-sm !leading-5 "
              />
            )}
          </div>
        )}

        {/* Error */}
        {error && (
          <Typography
            text={Locale.selectOption}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses="!text-red-500"
          />
        )}

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3">
          <Button
            title={Locale.cancel}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            onButtonClick={onClosePopup}
          />
          <Button
            title={Locale.setPc}
            size={BUTTON_SIZES.SMALL}
            onButtonClick={onSubmit}
            isLoading={isButtonLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default AmazonPurposeCodePopup;
