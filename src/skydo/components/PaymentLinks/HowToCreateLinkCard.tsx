import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import DropdownArrow from "../Common/DropdownArrow";
import React from "react";
import LinkIcon from "../Icons/LinkIcon";
import ClickIcon from "../Icons/ClickIcon";
import PaymentOnLaptopIcon from "../Icons/PaymentOnLaptopIcon";
import Image from "next/image";

interface HowToCreateLinkCardProps {}

const HowToCreateLinkCard = (props: HowToCreateLinkCardProps) => {
  const [isBodyVisible, setIsBodyVisible] = React.useState<boolean>(false);

  const onHeaderClick = () => {
    setIsBodyVisible((v) => !v);
  };

  return (
    <div className={"flex flex-col bg-white rounded-10px border border-black-400"}>
      <div
        className={classNames("flex flex-row justify-between items-center cursor-pointer p-6", {
          "border-b border-black-400": isBodyVisible,
        })}
        onClick={onHeaderClick}
      >
        <div className={"flex flex-row gap-4"}>
          <LinkIcon height={32} width={32} />
          <Typography
            text={Locale.howToCreatePaymentLink}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={""}
          />
        </div>
        <DropdownArrow isOpen={isBodyVisible} />
      </div>
      {isBodyVisible ? (
        <div className={"p-6 flex flex-row"}>
          <div className={"flex-1 shrink-0 flex flex-row gap-4 items-center"}>
            <Image src={"/createPaymentLink.png"} alt={"Create Payment Link"} width={60} height={60} />
            <Typography
              text={Locale.paymentLinkSteps1}
              textClasses={"!font-bold"}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </div>
          <div className={"flex-1 shrink-0 flex flex-row gap-4 items-center pl-6 border-l border-black-400"}>
            <ClickIcon />
            <Typography
              text={Locale.paymentLinkSteps2}
              textClasses={"!font-bold"}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </div>
          <div className={"flex-1 shrink-0 flex flex-row gap-4 items-center pl-6 border-l border-black-400"}>
            <PaymentOnLaptopIcon />
            <Typography
              text={Locale.paymentLinkSteps3}
              textClasses={"!font-bold"}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default HowToCreateLinkCard;
