import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Typography from "../AtomicComponents/Typography";
import AccordionWithIcon from "../AtomicComponents/Accordion/AccordionWithIcon";
import BankIcon from "../Icons/BankIcon";
import LinkIcon from "../Icons/LinkIcon";
import InternationalAccountsFlags from "../SkydoFeesComp/InternationalAccountsFlags";
import FlagPill from "../SkydoFeesComp/FlagPill";
import Image from "next/image";
import SkydoFullIcon from "../Icons/SkydoFullIcon";
import {  formatIncomingCurrencyWithSymbol, formatIncomingNumber } from "../../util/formatters";
import {
  CALCULATOR_ALLOWED_CURRENCIES,
  CURRENCY_CODE,
  CURRENCY_VS_LOCATION_MAP,
} from "../../constants/dashboardConstants";
import NonLinearSlider from "../AtomicComponents/Slider/NonLinerSlider";
import AppContext from "../../context/AppContext";
import { useContext, useEffect, useRef, useState } from "react";
import NewPageIcon from "../Icons/NewPageIcon";
import ImporterLocationVsIconComp from "../Common/ImporterLocationVsIconComp";
import DropdownArrow from "../Common/DropdownArrow";
import useOutsideClickFinder from "../../hooks/useOutsideClickFinder";
import { CalculateCostForPaymentMethodReturn, CURRENCY_SYMBOL_MAP, SkydoFeesResponse } from "../../hooks/fxcalc/core";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import useDebounce from "../../util/customHooks/useDebounce";
import useDashboardContainerStore from "../../store/useDashboardContainerStore";
import { useRouter } from "next/router";
import FE_ROUTES from "../../util/feRoutes";
import MoneyIcon from "../Icons/MoneyIcon";

const FAQ = ({
  competitorCost,
  skydoCost,
  savingsStringValue,
  currency,
  baseToInr,
  savings,
  amount,
  setAmountInput,
  setCurrency,
}: {
  competitorCost: CalculateCostForPaymentMethodReturn;
  skydoCost: SkydoFeesResponse;
  savingsStringValue: string;
  currency: string;
  baseToInr: number;
  savings: number;
  amount: string | number;
  setAmountInput: (value: number) => void;
  setCurrency: (value: string) => void;
}) => {
  const { isVeemCardsSupportedForExporter } = useDashboardContainerStore();
  const { theme } = useContext(AppContext);
  const router = useRouter();
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const currencyDropdownRef = useRef<HTMLDivElement | null>(null);
  const analytics = useAnalytics();

  useEffect(() => {
    analytics?.trackAsync(Events.FOCUSED_HOME.FAQ_BLOCK_SEEN, {
      project: "fhv2",
      subpage: "fh_intent",
    });
  }, []);

  const numberInputOnWheelPreventChange = (e: any) => {
    // Prevent the input value change
    e.target.blur();

    // Prevent the page/container scrolling
    e.stopPropagation();

    // Refocus immediately, on the next tick (after the current function is done)
    setTimeout(() => {
      e.target.focus();
    }, 0);
  };

  useOutsideClickFinder(currencyDropdownRef, () => {
    setIsCurrencyDropdownOpen(false);
  });

  const sliderInteractEvent = () => {
    analytics.trackAsync(Events.FOCUSED_HOME.FAQ_SAVINGS_INTERACTED, {
      project: "fhv2",
      subpage: "fh_intent",
      interaction_method: "slider",
    });
  };

  const sliderInteractEventDebounced = useDebounce(sliderInteractEvent, 1000);

  return (
    <div className={"flex flex-col gap-6"}>
      <Typography
        text={Locale.freqAskedQue}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.LARGE}
        fontWeight={"bold"}
      />

      {/* charges moved to first — open by default */}
      <AccordionWithIcon
        defaultOpen
        title={Locale.intAccountPage.helpQues1}
        onOpen={() => {
          analytics?.trackAsync(Events.FOCUSED_HOME.FAQ_EXPAND, {
            project: "fhv2",
            subpage: "fh_intent",
            faq_type: "charges",
            faq_text: Locale.intAccountPage.helpQues1,
          });
        }}
        onClose={() => {
          analytics?.trackAsync(Events.FOCUSED_HOME.FAQ_COLLAPSE, {
            project: "fhv2",
            subpage: "fh_intent",
            faq_type: "charges",
            faq_text: Locale.intAccountPage.helpQues1,
          });
        }}
      >
        <>
        <div className={"-mt-6 -mx-6 p-6"}>
        <div className={"flex flex-row gap-6 items-start"}>
          <div className={"flex-1 shrink-0 flex flex-col rounded-10px overflow-hidden border border-solid border-black-300"}>
            <div className={"bg-black-50 px-6 py-4 flex items-center gap-4 border-b border-solid border-black-300"}>
              <div className={"flex items-center justify-center shrink-0 w-12 h-12 bg-white border border-solid border-black-300 rounded-8px text-navyblue-400"}>
                <BankIcon width={20} height={20} />
              </div>
              <div className={"flex flex-col gap-1.5"}>
                <Typography text={Locale.internationalAccountsCardTitle} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} textClasses={"!leading-5"} />
                <div className={"flex items-center gap-1.5"}>
                  <Typography text={Locale.internationalAccountsCardSubtitle} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500"} />
                  <InternationalAccountsFlags />
                </div>
              </div>
            </div>
            <div className={"flex flex-col gap-4 py-4"}>
              <div className={"flex flex-col gap-4 px-6"}>
                <div className={"flex flex-row items-center justify-between gap-6"}>
                  <Typography text={Locale.focusedHome.faq.paymentSize} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} fontWeight={700} />
                  <Typography text={Locale.focusedHome.faq.skydoFees} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} fontWeight={700} />
                </div>
                <div className={"flex flex-row items-center justify-between gap-6"}>
                  <Typography text={Locale.focusedHome.faq.slab1} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
                  <Typography text={Locale.focusedHome.faq.slab1Fees} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"pr-8"} />
                </div>
                <div className={"flex flex-row items-center justify-between gap-6"}>
                  <Typography text={Locale.focusedHome.faq.slab2} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
                  <Typography text={Locale.focusedHome.faq.slab2Fees} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"pr-8"} />
                </div>
                <div className={"flex flex-row items-center justify-between gap-6"}>
                  <Typography text={Locale.focusedHome.faq.slab3} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
                  <Typography text={Locale.focusedHome.faq.slab3Fees} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"pr-7"} />
                </div>
              </div>
              <div className={"flex flex-col gap-4 px-6"}>
                <div className={"border-t border-solid border-black-400"} />
                <Typography text={Locale.uaeAedFeeNote} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-600"} />
              </div>
            </div>
          </div>
          <div className={"flex-1 shrink-0 flex flex-col rounded-10px overflow-hidden border border-solid border-black-300"}>
            <div className={"bg-black-50 px-6 py-4 flex items-center gap-4 border-b border-solid border-black-300"}>
              <div className={"flex items-center justify-center shrink-0 w-12 h-12 bg-white border border-solid border-black-300 rounded-8px text-navyblue-400"}>
                <LinkIcon width={22} height={22} />
              </div>
              <div className={"flex flex-col gap-1.5"}>
                <Typography text={Locale.instaLinksCardTitle} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} textClasses={"!leading-5"} />
                <div className={"flex items-center gap-1.5"}>
                  <Typography text={Locale.instaLinksCardSubtitle} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500"} />
                  <FlagPill flag={"us"} />
                </div>
              </div>
            </div>
            <div className={"flex flex-col gap-4 px-6 py-4"}>
              <div className={"flex flex-row items-center justify-between gap-6"}>
                <Typography text={Locale.paymentMethod} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} fontWeight={700} />
                <Typography text={Locale.focusedHome.faq.skydoFees} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} fontWeight={700} />
              </div>
              {isVeemCardsSupportedForExporter ? (
                <div className={"flex flex-row items-center justify-between gap-6"}>
                  <Typography text={Locale.focusedHome.faq.cardPayment} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
                  <Typography text={Locale.focusedHome.faq.cardFees} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
                </div>
              ) : null}
              <div className={"flex flex-row items-center justify-between gap-6"}>
                <Typography text={Locale.netBanking} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
                <Typography text={Locale.focusedHome.faq.netBankingFees} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
              </div>
            </div>
          </div>
        </div>
        </div>
        <div className={"-mx-6 -mb-6 flex items-center gap-4 px-6 py-4 border-t border-solid border-black-400 rounded-bl-10px rounded-br-10px"}>
          <div className={"w-6 h-6 rounded-full bg-white shadow-dropdown flex items-center justify-center shrink-0"}>
            <MoneyIcon width={12} height={12} />
          </div>
          <div className={"flex items-center gap-0.5"}>
            <Typography text={Locale.toViewStandardSkydoFees} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.MEDIUM} />
            <Typography
              text={Locale.clickHere}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!text-blue-400 cursor-pointer"}
              onTextClick={() => {
                analytics?.trackAsync(Events.FOCUSED_HOME.PRICING_FAQ_CTA_CLICKED, {
                  project: "fhv2",
                  subpage: "fh_intent",
                });
                void router.push(FE_ROUTES.SKYDO_FEES);
              }}
            />
          </div>
        </div>
        </>
      </AccordionWithIcon>

      {/* savings moved to second */}
      <AccordionWithIcon
        onOpen={() => {
          analytics?.trackAsync(Events.FOCUSED_HOME.FAQ_EXPAND, {
            project: "fhv2",
            subpage: "fh_intent",
            faq_type: "savings",
            faq_text: `${Locale.focusedHome.faq.faq1TitlePart1} ${savingsStringValue} ${Locale.focusedHome.faq.faq1TitlePart2}`,
          });
        }}
        onClose={() => {
          analytics?.trackAsync(Events.FOCUSED_HOME.FAQ_COLLAPSE, {
            project: "fhv2",
            subpage: "fh_intent",
            faq_type: "savings",
            faq_text: `${Locale.focusedHome.faq.faq1TitlePart1} ${savingsStringValue} ${Locale.focusedHome.faq.faq1TitlePart2}`,
          });
        }}
        title={
          <Typography
            text={Locale.focusedHome.faq.faq1TitlePart1}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.LARGE}
            fontWeight={"bold"}
          >
            <Typography
              text={savingsStringValue}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses={"!text-green-400 !font-bold"}
            />
            <Typography
              text={Locale.focusedHome.faq.faq1TitlePart2}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.LARGE}
              fontWeight={"bold"}
            />
          </Typography>
        }
      >
        <div className={"flex flex-col gap-6"}>
          <div className={"p-6 rounded-10px bg-[url('/fx-calc-bg.webp')] bg-cover bg-center bg-no-repeat relative"}>
            <div className={"flex flex-row items-center bg-white rounded-10px py-2 px-4"}>
              <div className={"flex-1 flex flex-col"}>
                <Typography
                  text={"Enter monthly payment volume"}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-600"}
                />
                <input
                  type="number"
                  name="value"
                  onWheel={numberInputOnWheelPreventChange}
                  value={amount}
                  className={"text-[32px] text-heading26 !font-bold focus:outline-none w-full"}
                  placeholder="8000"
                  onFocus={() => {
                    analytics.trackAsync(Events.FOCUSED_HOME.FAQ_SAVINGS_INTERACTED, {
                      project: "fhv2",
                      subpage: "fh_intent",
                      interaction_method: "number_input",
                    });
                  }}
                  onChange={(e) => {
                    setAmountInput(+e.target.value);
                  }}
                />
              </div>
              <div
                className={"flex flex-row items-center gap-1 cursor-pointer"}
                onClick={(e) => {
                  setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen);
                  e.stopPropagation();
                }}
              >
                <ImporterLocationVsIconComp location={CURRENCY_VS_LOCATION_MAP[currency]} height={40} width={40} />
                <Typography
                  text={currency}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!font-bold"}
                />
                <DropdownArrow isOpen={isCurrencyDropdownOpen} />
                {isCurrencyDropdownOpen ? (
                  <div
                    ref={currencyDropdownRef}
                    className={"absolute top-[100px] right-[32px] w-[130px] bg-white rounded-10px z-1"}
                  >
                    {CALCULATOR_ALLOWED_CURRENCIES.map((value) => (
                      <div
                        key={currency}
                        className={`group px-4 py-3 flex gap-2 items-center hover:bg-blue-50`}
                        onClick={() => {
                          analytics.trackAsync(Events.FOCUSED_HOME.FAQ_SAVINGS_INTERACTED, {
                            project: "fhv2",
                            subpage: "fh_intent",
                            interaction_method: "currency_dropdown",
                          });
                          setCurrency(value);
                        }}
                      >
                        <ImporterLocationVsIconComp location={CURRENCY_VS_LOCATION_MAP[value]} height={24} width={24} />
                        <Typography
                          text={value}
                          size={TYPOGRAPHY_SIZES.MEDIUM}
                          type={TYPOGRAPHY_TYPES.PARA}
                          textClasses={value === currency ? "!text-blue-400" : ""}
                        />
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
            <NonLinearSlider
              onChange={(value) => {
                sliderInteractEventDebounced();
                setAmountInput(value);
              }}
              parentValue={+amount}
              defaultValue={+amount}
              thumbColor={theme.hexColors.blue[600]}
              dotColor={theme.hexColors.blue[200]}
              dotTextColor={theme.hexColors.black[500]}
              activeDotColor={theme.hexColors.blue[200]}
              trackColor={theme.hexColors.blue[600]}
              railColor={theme.hexColors.blue[100]}
              fontSize={"16px"}
              sliderHeight={12}
              dotHeight={6}
              thumbHeight={24}
              labelTop={"100%"}
            />
            <a
              href={`${process.env.NEXT_PUBLIC_FX_CALCULATOR_URL}&amount=${amount}&currency=${currency}`}
              target="_blank"
              rel="noopener noreferrer"
              className={"flex flex-row items-center gap-2 mt-6"}
              onClick={(e) => {
                e.preventDefault();
                analytics.trackAsync(Events.FOCUSED_HOME.FAQ_SAVINGS_INTERACTED, {
                  project: "fhv2",
                  subpage: "fh_intent",
                  interaction_method: "compare_link",
                });
                analytics.trackAsync(Events.FOCUSED_HOME.COMPARE_LINK_OPENED, {
                  project: "fhv2",
                  subpage: "fh_intent",
                });
                window.open(
                  `${process.env.NEXT_PUBLIC_FX_CALCULATOR_URL}&amount=${amount}&currency=${currency}`,
                  "_blank"
                );
              }}
            >
              <Typography
                text={Locale.focusedHome.faq.compareWithOtherPlatforms}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!text-blue-400 !font-semibold cursor-pointer"}
              />
              <NewPageIcon />
            </a>
          </div>

          <Typography
            text={Locale.focusedHome.faq.youCanSave}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"w-full bg-green-50 py-2 text-center rounded-10px border border-green-500 !font-bold"}
          >
            <Typography
              text={formatIncomingCurrencyWithSymbol({
                value: savings,
                currency: CURRENCY_CODE.INR,
                formatOptions: {
                  maximumFractionDigits: 0,
                  minimumFractionDigits: 0,
                },
              })}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-green-400 !font-bold"}
            />
            <Typography
              text={Locale.focusedHome.faq.everyYear}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!font-bold"}
            />
          </Typography>

          <div className={"w-full"}>
            <div className={"flex flex-row justify-end h-[68px]"}>
              <div
                className={
                  "basis-1/3 rounded-t-10px border border-black-400 flex flex-row items-center justify-center gap-2"
                }
              >
                <BankIcon width={24} height={24} />
                <Typography
                  text={"Banks"}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!font-bold"}
                />
              </div>
              <div
                className={
                  "basis-1/3 rounded-t-10px border border-black-400 flex flex-row items-center justify-center bg-green-50"
                }
              >
                <SkydoFullIcon />
              </div>
            </div>

            <div className={"flex flex-row h-[104px]"}>
              <div className={"rounded-tl-10px bg-black-50 basis-1/3 border-b border-black-400 pt-5 pl-10"}>
                <Typography
                  text={"Fx margin"}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-black-600"}
                />
              </div>
              <div className={"basis-1/3 flex flex-col items-center pt-4 border border-black-400"}>
                <Typography
                  text={competitorCost.fxMargin.label}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_LARGE}
                  textClasses={"!text-black-600"}
                />
                <Typography
                  text={`(1 ${currency} = ${formatIncomingNumber({
                    value: baseToInr - Number(competitorCost.fxMargin.value),
                    formatOptions: { maximumFractionDigits: 4, minimumFractionDigits: 4 },
                  })} INR)`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-600"}
                />
              </div>
              <div className={"basis-1/3 flex flex-col items-center pt-4 border border-black-400 bg-green-50"}>
                <Typography
                  text={`₹0.00/${currency}`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_LARGE}
                  textClasses={"!text-green-400"}
                />
                <Typography
                  text={`(1 ${currency} = ${baseToInr} INR)`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-600"}
                />
                <Typography
                  text={Locale.liveFx}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-green-400 py-0.5 px-2 rounded-full bg-white mt-1"}
                />
              </div>
            </div>

            <div className={"flex flex-row h-[46px]"}>
              <div className={"bg-black-50 basis-1/3 border-y border-black-400 pt-3 pl-10"}>
                <Typography
                  text={"Wire fee"}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-black-600"}
                />
              </div>
              <div className={"basis-1/3 flex flex-col items-center pt-3 border border-black-400"}>
                <Typography
                  text={competitorCost.wireFee.label}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-black-600"}
                />
              </div>
              <div className={"basis-1/3 flex flex-col items-center pt-3 border border-black-400 bg-green-50"}>
                <Typography
                  text={`${currency} 0`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-green-400"}
                />
              </div>
            </div>

            <div className={"flex flex-row h-[46px]"}>
              <div className={"bg-black-50 basis-1/3 border-y border-black-400 pt-3 pl-10"}>
                <Typography
                  text={"FIRA fee"}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-black-600"}
                />
              </div>
              <div className={"basis-1/3 flex flex-col items-center pt-3 border border-black-400"}>
                <Typography
                  text={competitorCost.firaFee.label}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-black-600"}
                />
              </div>
              <div className={"basis-1/3 flex flex-col items-center pt-3 border border-black-400 bg-green-50"}>
                <Typography
                  text={`${currency} 0`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-green-400"}
                />
              </div>
            </div>

            <div className={"flex flex-row h-[46px]"}>
              <div className={"bg-black-50 basis-1/3 border-t border-black-400 pt-3 pl-10 rounded-bl-10px"}>
                <Typography
                  text={"Transaction fee"}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-black-600"}
                />
              </div>
              <div className={"basis-1/3 flex flex-col items-center pt-3 border border-black-400"}>
                <Typography
                  text={competitorCost.transactionFee.label}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-black-600"}
                />
              </div>
              <div className={"basis-1/3 flex flex-col items-center pt-3 border border-black-400 bg-green-50"}>
                <Typography
                  text={`${CURRENCY_SYMBOL_MAP[currency]}${skydoCost.sourceCurrencyFees.toFixed(2)}`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!text-green-400"}
                />
              </div>
            </div>

            <div className={"flex flex-row h-[52px]"}>
              <div className={"basis-1/3 pt-3 pl-10"}>
                <Typography
                  text={Locale.finalReceived}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                />
              </div>
              <div className={"basis-1/3 flex flex-col items-center pt-3 border border-black-400 rounded-b-10px"}>
                <Typography
                  text={formatIncomingCurrencyWithSymbol({
                    value: competitorCost.finalInrAmountPostGst,
                    currency: CURRENCY_CODE.INR,
                    formatOptions: {
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    },
                  })}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-black-600"}
                />
              </div>
              <div
                className={
                  "basis-1/3 flex flex-col items-center pt-3 border border-black-400 bg-green-50 rounded-b-10px"
                }
              >
                <Typography
                  text={formatIncomingCurrencyWithSymbol({
                    value: skydoCost.finalInrAmountPostGst,
                    currency: CURRENCY_CODE.INR,
                    formatOptions: {
                      maximumFractionDigits: 0,
                      minimumFractionDigits: 0,
                    },
                  })}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-green-400"}
                />
              </div>
            </div>
          </div>
        </div>
      </AccordionWithIcon>

      <AccordionWithIcon
        title={Locale.focusedHome.faq.faq2Title}
        onOpen={() => {
          analytics?.trackAsync(Events.FOCUSED_HOME.FAQ_EXPAND, {
            project: "fhv2",
            subpage: "fh_intent",
            faq_type: "settlement",
            faq_text: Locale.focusedHome.faq.faq2Title,
          });
        }}
        onClose={() => {
          analytics?.trackAsync(Events.FOCUSED_HOME.FAQ_COLLAPSE, {
            project: "fhv2",
            subpage: "fh_intent",
            faq_type: "settlement",
            faq_text: Locale.focusedHome.faq.faq2Title,
          });
        }}
      >
        <div className={"flex flex-row gap-8"}>
          <div className={"flex-1 shrink-0 flex flex-col gap-4"}>
            <div
              className={
                "w-full rounded-10px flex items-center justify-center h-[120px] bg-gradient-to-b from-blue-100 via-white to-blue-100"
              }
            >
              <Image src={"/account-cards.webp"} height={100} width={120} />
            </div>
            <div className={"flex flex-col gap-1"}>
              <Typography
                text={Locale.focusedHome.faq.step1}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-semibold !text-black-500"}
              />
              <Typography
                text={Locale.focusedHome.faq.step1Title}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!font-semibold"}
              />
              <Typography
                text={Locale.focusedHome.faq.step1Desc}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500 !font-normal"}
              />
            </div>
          </div>

          <div className={"flex-1 shrink-0 flex flex-col gap-4"}>
            <div
              className={
                "w-full rounded-10px flex items-center justify-center h-[120px] bg-gradient-to-b from-blue-100 via-white to-blue-100"
              }
            >
              <Image src={"/invoice.webp"} height={100} width={120} />
            </div>
            <div className={"flex flex-col gap-1"}>
              <Typography
                text={Locale.focusedHome.faq.step2}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-semibold !text-black-500"}
              />
              <Typography
                text={Locale.focusedHome.faq.step2Title}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!font-semibold"}
              />
              <Typography
                text={Locale.focusedHome.faq.step2Desc}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500 !font-normal"}
              />
            </div>
          </div>

          <div className={"flex-1 shrink-0 flex flex-col gap-4"}>
            <div
              className={
                "w-full rounded-10px flex items-center justify-center h-[120px] bg-gradient-to-b from-blue-100 via-white to-blue-100"
              }
            >
              <Image src={"/fira.webp"} height={84} width={100} />
            </div>
            <div className={"flex flex-col gap-1"}>
              <Typography
                text={Locale.focusedHome.faq.step3}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-semibold !text-black-500"}
              />
              <Typography
                text={Locale.focusedHome.faq.step3Title}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"!font-semibold"}
              />
              <Typography
                text={Locale.focusedHome.faq.step3Desc}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500 !font-normal"}
              />
            </div>
          </div>
        </div>
      </AccordionWithIcon>
    </div>
  );
};

export default FAQ;
