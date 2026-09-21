import React, { useCallback, useEffect, useState, type UIEvent } from "react";
import classNames from "classnames";
import Locale from "../../util/locale/en";
import {
  INSTANT_SETTLEMENT_FAQ_ITEMS,
  type InstantSettlementFaqItem,
} from "../InstantSettlementPopup/instantSettlementFaqItems";
import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, BUTTON_TYPES } from "../../constants/atomicConstants";

/** Figma 9854-3217: body grey, accordion white */
const BODY_BG = "#F0F3F7";
const ACCORDION_BORDER = "#CFD7DF";

export interface InstantSettlementFaqPageProps {
  onBack: () => void;
  onCloseCross: () => void;
  items?: InstantSettlementFaqItem[];
}

/**
 * Mobile-only: FAQ as a full-page view inside the Instant Settlement sheet.
 * Figma 9854-3217: title next to back arrow, grey body, white accordions.
 */
const InstantSettlementFaqPage = (props: InstantSettlementFaqPageProps) => {
  const {
    onBack,
    onCloseCross,
    items = INSTANT_SETTLEMENT_FAQ_ITEMS,
  } = props;
  const [openByIndex, setOpenByIndex] = useState<Record<number, boolean>>({});
  const [headerElevated, setHeaderElevated] = useState(false);

  useEffect(() => {
    setOpenByIndex({});
    setHeaderElevated(false);
  }, []);

  const onBodyScroll = useCallback((e: UIEvent<HTMLDivElement>) => {
    setHeaderElevated(e.currentTarget.scrollTop > 0);
  }, []);

  const toggle = useCallback((index: number) => {
    setOpenByIndex((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  const navBtn =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-0 bg-transparent p-0 text-[#0A2540] hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5671D2]/40";

  return (
    <div className="flex h-full min-h-[100dvh] flex-col bg-white">
      {/* Figma 9854-3217: back + FAQs (left), close (right) — title not centered */}
      <header
        className={classNames(
          "flex shrink-0 items-center justify-between border-b border-solid border-[#CFD7DF] bg-white px-4 pt-3 pb-2 transition-shadow",
          headerElevated && "shadow-elevation2"
        )}
      >
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.X_SMALL}
            title={() => (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M14 6L8 12L14 18M8 12H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            onButtonClick={onBack}
            buttonClass={classNames(navBtn, "!h-10 !w-10 !p-0 !min-h-0")}
            nativeType="button"
            buttonProps={{ "aria-label": "Back" }}
          />
          <h1
            id="instant-settlement-faq-page-title"
            className="truncate font-bold text-[16px] text-[#0A2540]"
            style={{ fontFamily: "Lato, sans-serif", lineHeight: "20px" }}
          >
            {Locale.faqsText}
          </h1>
        </div>
        <Button
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.X_SMALL}
          title={() => (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
          onButtonClick={onCloseCross}
          buttonClass={classNames(navBtn, "shrink-0 !h-10 !w-10 !p-0 !min-h-0")}
          nativeType="button"
          buttonProps={{ "aria-label": "Close" }}
        />
      </header>

      {/* Body: grey background (Figma 9854-3217) */}
      <div
        className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pt-4 pb-4"
        style={{ WebkitOverflowScrolling: "touch", backgroundColor: BODY_BG }}
        onScroll={onBodyScroll}
      >
        <div className="flex flex-col gap-3">
          {items.map((item, index) => {
            const isOpenRow = !!openByIndex[index];
            return (
              <div
                key={`faq-page-${index}`}
                className="flex flex-col gap-3 rounded-[10px] border border-solid bg-white px-4 py-3"
                style={{ borderColor: ACCORDION_BORDER }}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center gap-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5671D2]/35 focus-visible:ring-offset-2 rounded-md"
                  aria-expanded={isOpenRow}
                >
                  <span
                    className="min-w-0 flex-1 font-bold text-[14px] text-[#0A2540]"
                    style={{ fontFamily: "Lato, sans-serif", lineHeight: "20px" }}
                  >
                    {item.question}
                  </span>
                  <span
                    className={classNames(
                      "inline-flex shrink-0 text-[#0A2540] transition-transform duration-200 ease-out",
                      isOpenRow && "rotate-180"
                    )}
                    aria-hidden
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M6 9L12 15L18 9"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                </button>
                {isOpenRow && (
                  <p
                    className="m-0 text-left text-[12px] text-[#0A2540] whitespace-pre-line pr-1"
                    style={{
                      fontFamily: "Lato, sans-serif",
                      fontWeight: 400,
                      lineHeight: "18px",
                    }}
                  >
                    {item.answer}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InstantSettlementFaqPage;
