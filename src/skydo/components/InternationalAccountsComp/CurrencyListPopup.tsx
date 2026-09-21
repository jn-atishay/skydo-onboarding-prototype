import React, { FC, useEffect, useState } from "react";
import TextInput from "../AtomicComponents/TextInput";
import SearchIcon from "../Icons/SearchIcon";
import InformationIcon from "../Icons/InformationIcon";
import Tooltip from "../AtomicComponents/Tooltip";
import Locale from "../../util/locale/en";
import Image from "next/image";
import Typography from "../AtomicComponents/Typography";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { debounce } from "../../util/functions";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import { SHOW_NICHE_CURRENCY_SECTION } from "../../constants/dashboardConstants";

export type Currency = {
  symbol: string;
  name: string;
  icon: string;
};

const CurrencyListPopup: FC = () => {
  const [currency, setCurrency] = useState("");
  const { currencies: allCurrencies } = useInternationalAccountsStore();
  const [options, setOptions] = useState([] as Currency[]);
  const analytics = useAnalytics();

  const topCurrencies = allCurrencies?.topCurrencies || [];
  const allCurrencyList = allCurrencies?.currencies || [];
  // The CMS returns top currencies as a subset of the full list, so they are dropped from the
  // second section to stop every top currency appearing twice.
  const topSymbols = topCurrencies.map((item) => item?.symbol);
  const nicheCurrencies = allCurrencyList.filter((item) => !topSymbols.includes(item?.symbol));

  const secondarySection = SHOW_NICHE_CURRENCY_SECTION
    ? { heading: Locale.nicheCurrency, items: nicheCurrencies, showFeeNote: true }
    : { heading: Locale.allCurrency, items: allCurrencyList, showFeeNote: false };

  // Search always spans the full list, never just the section being displayed.
  const searchCurrency = debounce(() => {
    const inputValL = currency.toLowerCase();
    setOptions(
      allCurrencyList.filter(
        (option) =>
          (option?.symbol || "").toLowerCase().includes(inputValL) ||
          (option?.name || "").toLowerCase().includes(inputValL)
      )
    );
  }, 200);

  useEffect(() => {
    searchCurrency();
  }, [currency, allCurrencyList?.length]);

  const visibleCurrencies = currency ? options : secondarySection.items;

  const renderCurrencyGrid = (items: Currency[]) => (
    <div className={"grid grid-cols-2 md:grid-cols-3 md:gap-y-4"}>
      {items.map((item) => (
        <div className={"flex flex-row items-center h-14"} key={item?.symbol}>
          <div className={"w-[37px] h-[26px] mr-2.5"}>
            <Image alt={item?.symbol} src={item?.icon} width={37} height={26} />
          </div>
          <div className={"flex flex-col md:flex-row gap-0 md:gap-1 md:items-center"}>
            <Typography text={item?.symbol} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
            <Typography
              text={item?.name}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-500"}
            />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSectionHeading = (heading: string, count: number, containerClass: string) => (
    <div className={containerClass}>
      <Typography
        text={heading}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        textClasses={"!font-bold"}
      />
      <Typography
        text={`(${count})`}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"ml-1 !text-black-500"}
      />
    </div>
  );

  return (
    <>
      <TextInput
        leftElement={() => (
          <div className={"mr-1"}>
            <SearchIcon />
          </div>
        )}
        placeholder={Locale.searchCurrency}
        onChange={(v) => {
          setCurrency(v);
        }}
        onFocus={() => {
          analytics.trackAsync(Events.CURRENCY_LIST_FOCUS);
        }}
      />

      <div className={`flex-1 max-h-[540px] overflow-auto mr-0 pr-0 md:-mr-10 md:pr-10 md:mt-4`}>
        {!currency && (
          <>
            {topCurrencies.length ? (
              <>
                {renderSectionHeading(Locale.topCurrency, topCurrencies.length, "mt-2 md:mb-6 mb-2")}
                {renderCurrencyGrid(topCurrencies)}
              </>
            ) : null}
            {renderSectionHeading(
              secondarySection.heading,
              secondarySection.items.length,
              "mt-6 mb-2 md:mb-6"
            )}
          </>
        )}
        {/* Rendered outside the no-search branch: searching for a niche currency must not hide the
            disclosure that it carries the extra 1%. */}
        {secondarySection.showFeeNote && (
          <div className={"flex flex-row items-center gap-2 bg-black-100 rounded-10px p-4 mb-2 md:mb-6"}>
            <Typography
              text={Locale.nicheCurrencyFeeNote}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-600"}
            />
            <Tooltip
              tooltipText={
                <Typography
                  text={Locale.nicheCurrencyFeeTooltip}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-white"}
                />
              }
              tooltipTheme={"dark"}
              position={TOOLTIP_POSITION.TOP}
              className={"shrink-0"}
              // The list scrolls, so popper measures against that container and lets the
              // tooltip run past the screen on narrow viewports. Bound to the viewport instead.
              popperOptions={{
                modifiers: {
                  preventOverflow: { boundariesElement: "viewport" },
                  flip: { boundariesElement: "viewport" },
                },
              }}
            >
              <InformationIcon width={16} height={16} />
            </Tooltip>
          </div>
        )}
        {visibleCurrencies?.length ? (
          renderCurrencyGrid(visibleCurrencies)
        ) : (
          currency && (
            <div className={"justify-center flex mt-4"}>
              <Typography
                text={Locale.currencyNotExist}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-600"}
              />
            </div>
          )
        )}
      </div>
    </>
  );
};

export default CurrencyListPopup;
