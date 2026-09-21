import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import classNames from "classnames";
import Locale from "../../util/locale/en";
import {
  INSTANT_SETTLEMENT_FAQ_ITEMS,
  type InstantSettlementFaqItem,
} from "./instantSettlementFaqItems";
import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, BUTTON_TYPES } from "../../constants/atomicConstants";

export type { InstantSettlementFaqItem };

/** Figma Instant-settlement MF 9854-11913 */
const FIGMA = {
  neutral50: "#F6F9FC",
  neutral400: "#CFD7DF",
} as const;

/** Identical to InstantSettlementPopup hero background (`index.tsx` 269–273) */
const HEADER_BG_STYLE: React.CSSProperties = {
  backgroundImage: "url(/images/instantsettlementpopup.png)",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

/** No hard line — header image eases into list white */
const HEADER_FADE_TO_WHITE =
  "linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 42%, #FFFFFF 88%, #FFFFFF 100%)";

/** Tolerance for sub-pixel scroll metrics (device / zoom) */
const SCROLL_EPS = 2;

export interface InstantSettlementFaqPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onCloseCross: () => void;
  items?: InstantSettlementFaqItem[];
  /** Match InstantSettlementPopupMobile sheet (full width, max-h 90vh, top-rounded) */
  mobileLayout?: boolean;
}

const InstantSettlementFaqPopup = (props: InstantSettlementFaqPopupProps) => {
  const {
    isOpen,
    onClose,
    onCloseCross,
    items = INSTANT_SETTLEMENT_FAQ_ITEMS,
    mobileLayout = false,
  } = props;
  const [openByIndex, setOpenByIndex] = useState<Record<number, boolean>>({});
  const [listScrolled, setListScrolled] = useState(false);
  const [footerElevationVisible, setFooterElevationVisible] = useState(false);
  const listScrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) setOpenByIndex({});
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setListScrolled(false);
      setFooterElevationVisible(false);
    }
  }, [isOpen]);

  const syncListScrollMetrics = useCallback(() => {
    const el = listScrollRef.current;
    if (!el) {
      setFooterElevationVisible(false);
      return;
    }
    const { scrollTop, clientHeight, scrollHeight } = el;
    const canScroll = scrollHeight > clientHeight + SCROLL_EPS;
    const hasMoreBelow =
      scrollTop + clientHeight < scrollHeight - SCROLL_EPS;
    setFooterElevationVisible(canScroll && hasMoreBelow);
    setListScrolled(scrollTop > 0);
  }, []);

  const onListScroll = useCallback(() => {
    syncListScrollMetrics();
  }, [syncListScrollMetrics]);

  useLayoutEffect(() => {
    if (!isOpen) return;
    syncListScrollMetrics();
  }, [isOpen, items, openByIndex, syncListScrollMetrics]);

  useEffect(() => {
    if (!isOpen) return;
    const el = listScrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      syncListScrollMetrics();
    });
    ro.observe(el);
    const inner = el.firstElementChild;
    if (inner) ro.observe(inner);
    return () => ro.disconnect();
  }, [isOpen, items, openByIndex, syncListScrollMetrics]);

  const toggle = useCallback((index: number) => {
    setOpenByIndex((prev) => ({ ...prev, [index]: !prev[index] }));
  }, []);

  if (!isOpen) return null;

  const headerIconBtn =
    "flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border-0 bg-transparent p-0 text-[#0A2540] hover:opacity-80 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#5671D2]/40";

  return (
    <div
      className={classNames(
        "fixed inset-0 z-[10050] flex items-center justify-center",
        mobileLayout ? "p-0" : "p-4 sm:p-6"
      )}
      role="dialog"
      aria-modal="true"
      aria-labelledby="instant-settlement-faq-title"
    >
      <div className="absolute inset-0 bg-[#0A2540]/60" aria-hidden />
      <div
        className={classNames(
          "relative z-[10051] flex w-full flex-col bg-white shadow-elevation1 focus:outline-none",
          mobileLayout
            ? "h-[90vh] max-h-[90vh] w-full max-w-none rounded-t-2xl rounded-b-none short:h-[100dvh] short:max-h-[100dvh]"
            : "h-[min(750px,90vh)] w-4/12 max-w-lg min-w-[500px] rounded-2xl short:h-[min(750px,100dvh)]"
        )}
      >
        <header
          className={classNames(
            "relative shrink-0 overflow-hidden rounded-t-2xl px-6 pb-6 pt-6 transition-shadow",
            listScrolled && "z-[2] shadow-elevation1"
          )}
        >
          <div
            className="pointer-events-none absolute inset-0 rounded-t-2xl"
            style={HEADER_BG_STYLE}
            aria-hidden
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[5.5rem] rounded-b-none sm:h-24"
            style={{ background: HEADER_FADE_TO_WHITE }}
          />
          <div className="relative z-[2] flex w-full flex-col gap-4">
            <div className="flex w-full items-start justify-between">
              <Button
                type={BUTTON_TYPES.TERTIARY}
                size={BUTTON_SIZES.X_SMALL}
                title={() => (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                    <path
                      d="M15 6L9 12L15 18"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                onButtonClick={onClose}
                buttonClass={classNames(headerIconBtn, "!h-9 !w-9 !p-0 !min-h-0")}
                nativeType="button"
                buttonProps={{ "aria-label": "Back" }}
              />
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
                buttonClass={classNames(headerIconBtn, "!h-9 !w-9 !p-0 !min-h-0")}
                nativeType="button"
                buttonProps={{ "aria-label": "Close" }}
              />
            </div>
            <h1
              id="instant-settlement-faq-title"
              className="m-0 w-full px-2 text-center font-extrabold text-[32px] leading-normal"
              style={{
                fontFamily: "Lato, sans-serif",
                fontWeight: 800,
                background: "linear-gradient(63.44deg, #334DB3 16.21%, #276EF1 108.98%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                WebkitTextFillColor: "transparent",
                color: "transparent",
              }}
            >
              {Locale.faqsText}
            </h1>
          </div>
        </header>

        {/* Scroll region: fixed flex share so modal height never changes when accordions open */}
        <div className="relative min-h-0 flex-1">
          <div
            ref={listScrollRef}
            className="h-full overflow-y-auto overflow-x-hidden bg-white px-6 overscroll-contain [scrollbar-gutter:stable] pb-2"
            style={{ WebkitOverflowScrolling: "touch" }}
            onScroll={onListScroll}
          >
            <div className="flex flex-col gap-4 py-1">
              {items.map((item, index) => {
                const isOpenRow = !!openByIndex[index];
                return (
                  <div
                    key={`is-faq-${index}`}
                    className="flex flex-col gap-3 rounded-[10px] border border-solid px-4 py-3"
                    style={{
                      backgroundColor: FIGMA.neutral50,
                      borderColor: FIGMA.neutral400,
                    }}
                  >
                    <Button
                      type={BUTTON_TYPES.TERTIARY}
                      size={BUTTON_SIZES.MEDIUM}
                      title={() => (
                        <>
                          <span
                            className="min-w-0 flex-1 font-bold text-base leading-6 text-[#0A2540]"
                            style={{ fontFamily: "Lato, sans-serif" }}
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
                        </>
                      )}
                      onButtonClick={() => toggle(index)}
                      nativeType="button"
                      buttonClass={classNames(
                        "w-full !h-auto min-h-0 !justify-start !px-0 !py-0 rounded-md text-left focus-visible:ring-2 focus-visible:ring-[#5671D2]/35 focus-visible:ring-offset-2"
                      )}
                      textWrapperClass="!flex-1 !flex-row !items-center !gap-6 !w-full !max-w-none !justify-start"
                      buttonProps={{ "aria-expanded": isOpenRow }}
                    />
                    {isOpenRow && (
                      <p
                        className="m-0 text-left text-sm leading-5 text-[#0A2540] whitespace-pre-line pr-2"
                        style={{ fontFamily: "Lato, sans-serif", fontWeight: 400 }}
                      >
                        {item.answer}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
          {/* Fade above footer — only when list overflows and user has not reached bottom (Figma) */}
          {footerElevationVisible ? (
            <div
              className="pointer-events-none absolute bottom-0 left-0 right-0 z-[1] h-14 bg-gradient-to-t from-white from-30% via-white/85 to-transparent"
              aria-hidden
            />
          ) : null}
        </div>

        <div
          className={classNames(
            "relative z-[2] shrink-0 bg-white px-6 pb-6 pt-6 transition-shadow",
            footerElevationVisible && "shadow-elevation1",
            mobileLayout ? "rounded-b-none" : "rounded-b-2xl"
          )}
        >
          <Button
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.MEDIUM}
            title={Locale.goBack}
            onButtonClick={onClose}
            nativeType="button"
            buttonClass="w-full !w-full rounded-[10px]"
            textClasses="font-semibold"
            textProps={{ fontFamily: "Lato, sans-serif" }}
          />
        </div>
      </div>
    </div>
  );
};

export default InstantSettlementFaqPopup;
