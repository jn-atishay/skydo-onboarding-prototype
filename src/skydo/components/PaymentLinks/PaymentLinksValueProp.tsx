import { useState } from "react";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Typography from "../AtomicComponents/Typography";
import BOAIcon from "../Icons/BOAIcon";
import StripeIcon from "../Icons/Brands/StripeIcon";
import CitiIcon from "../Icons/CitiIcon";
import InvoicePaidIcon from "../Icons/InvoicePaidIcon";
import MoneyJarIcon from "../Icons/MoneyJarIcon";
import PaypalLogo from "../Icons/PaypalLogo";
import PhoneInHandIcon from "../Icons/PhoneInHandIcon";
import PlaidIcon from "../Icons/PlaidIcon";
import USBankIcon from "../Icons/USBankIcon";
import WellsFargoIcon from "../Icons/WellsFargoIcon";
import Image from "next/image";
import classNames from "classnames";
import DropdownArrow from "../Common/DropdownArrow";
import SmartPhoneIcon from "../Icons/SmartPhoneIcon";
import VerticalLine from "../Icons/VerticalLine";
import ClockIcon from "../Icons/ClockIcon";
import FullTickBWIcon from "../Icons/FullTickBWIcon";
import RequestOtherPaymentLinkMethodsComponent from "./RequestOtherPaymentLinkMethodsComponent";

interface PaymentLinksValuePropProps {
  isAccordion?: boolean;
  showSettlementTime?: boolean;
}

const PaymentLinksValueProp = (props: PaymentLinksValuePropProps) => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false);
  const { isAccordion = false, showSettlementTime = false } = props;
  const onHeaderClick = () => {
    setIsAccordionOpen((v) => !v);
  };

  const isBodyVisible = isAccordion ? isAccordionOpen : true;

  return (
    <div className={classNames("flex flex-col bg-white rounded-10px", { "border border-black-400": isAccordion })}>
      {isAccordion ? (
        <div
          className={classNames("flex flex-row justify-between items-center cursor-pointer p-6", {
            "border-b border-black-400": isBodyVisible,
          })}
          onClick={onHeaderClick}
        >
          <div className={"flex flex-row gap-4"}>
            <SmartPhoneIcon />
            <Typography
              text={Locale.whyShouldYouUseInstaLinks}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={""}
            />
          </div>
          <DropdownArrow isOpen={isBodyVisible} />
        </div>
      ) : null}
      {isBodyVisible ? (
        <div className={"rounded-10px bg-white p-6 flex flex-col gap-6"}>
          <div className={"flex flex-row gap-6"}>
            <div
              className={"flex-1 shrink-0 bg-black-50 p-6 rounded-10px relative overflow-hidden flex flex-col gap-4"}
            >
              <Typography
                text={Locale.costEffectivePricing}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={
                  "absolute top-0 right-0 !text-white bg-green-400 py-0.5 text-center w-[206px] transform rotate-45 translate-x-10 translate-y-12"
                }
              />
              <div className={"shrink-0 p-6 rounded-full flex items-center justify-center h-fit w-fit bg-blue-100"}>
                <InvoicePaidIcon height={50} width={50} borderStroke={"#5671D2"} stroke={"#5671D2"} fill={"#D4E2FC"} />
              </div>
              <div className={"flex flex-col"}>
                <Typography
                  text={Locale.achFeesText}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-green-400 !font-bold"}
                />
                <Typography
                  text={Locale.noAddCharges}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!font-bold"}
                />
              </div>
            </div>
            <div className={"flex-1 shrink-0 flex flex-col gap-6"}>
              <div className={"rounded-10px bg-black-50 p-6 flex-1 flex flex-row gap-4"}>
                <div className={"flex shrink-0 items-center justify-center p-4 bg-blue-100 rounded-full"}>
                  <MoneyJarIcon />
                </div>
                <div className={"flex flex-col gap-1"}>
                  <div className={"flex flex-row gap-2 items-center"}>
                    <Typography
                      text={Locale.cheaperThanPaypal}
                      type={TYPOGRAPHY_TYPES.HEADING}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses={"!font-bold !text-green-400"}
                    />
                    <Typography
                      text={Locale.than}
                      type={TYPOGRAPHY_TYPES.HEADING}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses={"!font-bold"}
                    />
                    <PaypalLogo height={20} width={76} />
                    <StripeIcon height={20} width={48} />
                  </div>
                  <Typography
                    text={Locale.seamlessCardLikeFlow}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    textClasses={"!text-black-500"}
                  />
                </div>
              </div>
              <div className={"rounded-10px bg-black-50 p-6 flex-1 flex flex-row items-center gap-4"}>
                <div className={"flex shrink-0 items-center justify-center p-4 bg-blue-100 rounded-full"}>
                  <PhoneInHandIcon />
                </div>
                <Typography
                  text={Locale.payAnytimeFromMobile}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!font-bold !text-green-400"}
                >
                  <Typography
                    text={Locale.noSetup}
                    type={TYPOGRAPHY_TYPES.HEADING}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={"!font-bold"}
                  />
                </Typography>
              </div>
            </div>
          </div>
          <div className={"flex flex-col"}>
            <div className={"p-6 bg-black-50 flex flex-row rounded-t-10px gap-6 items-center  justify-between"}>
              <div className={"flex flex-col gap-1"}>
                <Typography
                  text={"Get paid faster "}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!font-bold !text-green-400"}
                >
                  <Typography
                    text={"with Net banking"}
                    type={TYPOGRAPHY_TYPES.HEADING}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={"!font-bold ml-1"}
                  />
                </Typography>
                <Typography
                  text={"Enabling payments from 100+ trusted US banks"}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  type={TYPOGRAPHY_TYPES.PARA}
                  textClasses={"!text-neutral-500"}
                  fontWeight={400}
                />
              </div>
              <div className={"flex flex-row items-center gap-6 shrink-0"}>
                <USBankIcon />
                <CitiIcon />
                <BOAIcon />
                <WellsFargoIcon />
                <Image src={"/chase.png"} height={28} width={113} />
                <VerticalLine />
                <div className={"flex flex-row items-center gap-2"}>
                  <Typography
                    text={"Powered by Plaid"}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    type={TYPOGRAPHY_TYPES.PARA}
                    textClasses={"!text-neutral-600"}
                    fontWeight={400}
                  />
                  <PlaidIcon />
                </div>
              </div>
            </div>
            <RequestOtherPaymentLinkMethodsComponent className="bg-neutral-100 rounded-b-10px py-4 px-6" />
          </div>
          {showSettlementTime && (
            <div className="flex flex-row gap-6 justify-between">
              <div className="flex flex-row gap-2 items-center">
                <ClockIcon />
                <Typography
                  text={"Settlement time: 6 business days"}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight={"600"}
                />
              </div>
              <div className="flex flex-row gap-2 items-center">
                <FullTickBWIcon />
                <Typography
                  text={"FIRA will be provided by Skydo"}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight={"600"}
                />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};

export default PaymentLinksValueProp;
