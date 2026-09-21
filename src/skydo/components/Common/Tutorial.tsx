import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React, { useContext, useEffect, useRef } from "react";
import Button from "../AtomicComponents/Button";
import IconContainer from "./IconContainer";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import AppContext from "../../context/AppContext";
import Image from "next/image";
import Triangle from "../Triangle";

interface Props {
  outsideClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  buttonClick?: () => void;
  isPaymentDone?: boolean;
}

const Tutorial = (props: Props) => {
  const { outsideClick, buttonClick } = props;
  const elementRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useContext(AppContext);

  const handleClickOutside = (event: React.MouseEvent<HTMLInputElement>) => {
    const target = event.target as HTMLInputElement;
    if (elementRef.current && !elementRef.current.contains(target)) {
      outsideClick && outsideClick(event);
    }
  };

  useEffect(() => {
    // @ts-ignore
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // @ts-ignore
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={elementRef}
      className={"z-20 absolute -translate-x-[108%] transform -translate-y-[50%] max-w-[252px] max-h-[228px]"}
    >
      <div className="relative flex flex-col space-y-4 bg-black-700 rounded-20px px-4 pb-4 pt-8">
        <IconContainer containerClass={"bg-black-700 fixed top-0 right-0 cursor-pointer"} onClick={buttonClick}>
          <CrossIcon width={16} height={16} stroke={theme.hexColors.white} />
        </IconContainer>
        <span>
          <Typography
            text={"Yay! Your payment is"}
            textClasses={"!text-white"}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
          <Typography
            text={props.isPaymentDone ? " completed" : " in progress"}
            textClasses={"!text-green-400"}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
        </span>
        <Typography
          text={
            "This is the invoice details page, where you can track your test payment. For this test payment, we have created a sample invoice for you."
          }
          textClasses={"!text-white"}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
        />
        <Typography
          text={"For subsequent payments, this page will be created every time you share an invoice with us."}
          textClasses={"!text-white"}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
        />
        <div className={"flex flex-row justify-end"}>
          <Button
            title={"Done"}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.X_SMALL}
            buttonClass={"bg-black-700 rounded"}
            textClasses={"!text-white mx-3 my-1.5"}
            onButtonClick={buttonClick}
          />
        </div>
        <Triangle isCustom={true} containerClass={"absolute left-[99%] top-[33%] -rotate-90"} />
        <div className="absolute -top-12 left-4 w-[62px] h-[62px]">
          <Image src="/tutorial_girl.png" layout="fill" objectFit="cover" />
        </div>
      </div>
    </div>
  );
};

export default Tutorial;
