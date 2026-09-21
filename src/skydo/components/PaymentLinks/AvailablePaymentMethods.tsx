import classNames from "classnames";
import Accordion from "../AtomicComponents/Accordion";
import Card from "../Common/Card";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import BookIcon from "../Icons/BookIcon";
import CreditCardIconWithEllipse from "../Icons/CreditCardIconWithEllipse";
import VisaBWIcon from "../Icons/VisaBWIcon";
import MastercardBWIcon from "../Icons/MastercardBWIcon";
import NetBankingIcon from "../Icons/NetBankingIcon";
import NetBankingIconWithEllipse from "../Icons/NetBankingIconWithEllipse";
import PlaidIcon from "../Icons/PlaidIcon";
import USBankBWIcon from "../Icons/USBankBWIcon";
import CitiBankBWIcon from "../Icons/CitiBankBWIcon";
import BankOfAmericaBWIcon from "../Icons/BankOfAmericaBWIcon";
import WellsFargoBWIcon from "../Icons/WellsFargoBWIcon";
import ChaseBankBWIcon from "../Icons/ChaseBankBWIcon";
import ClockIcon from "../Icons/ClockIcon";
import FullTickBWIcon from "../Icons/FullTickBWIcon";
import CreditCardIcon from "../Icons/CreditCardIcon";
import USFlagIcon from "../Icons/CountryFlags/USFlagIcon";
import React from "react";
import InfoIconTwoV2 from "../Icons/InfomationIconV2";

const AvailablePaymentMethods = ({ className, isDefaultOpen = true }: { className?: string; isDefaultOpen?: boolean }) => {
    const getAccordionTitle = () => {
        return (
            <div className={"flex flex-row items-center gap-4"}>
                <CreditCardIcon />
                <Typography text={"Available payment methods"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} />
            </div>
        )
    };

    return (
        <Card className={classNames("w-full !p-0 flex flex-col border border-black-400", className)}>
            <Accordion
                titleEle={getAccordionTitle()}
                titleClasses={"p-6"}
                openTitleClasses={"border-b border-black-400"}
                isDefaultOpen={isDefaultOpen}
            >
                <div className={"flex flex-col gap-6 p-6"}>
                    <div className={"flex flex-row gap-6 items-center"}>
                        <div className={"flex flex-col gap-6 bg-neutral-50 rounded-[10px] p-6 w-[50%] !h-[240px]"}>
                            <div className={"flex flex-row justify-between"}>
                                <div className={"flex flex-row items-center gap-4"}>
                                    <CreditCardIconWithEllipse />
                                    <Typography text={"Credit / debit card"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} />
                                </div>
                                <div className="bg-secondary-50 rounded-full items-center px-4 py-2 border border-secondary-400">
                                    <div className="flex flex-row gap-1 items-center">
                                        <Typography
                                            text="Pricing "
                                            type={TYPOGRAPHY_TYPES.PARA}
                                            size={TYPOGRAPHY_SIZES.X_X_SMALL}
                                            textClasses="text-secondary-500"
                                        />
                                        <Typography text={" Flat 5% "} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} textClasses={"text-secondary-500"} />
                                        <Typography text={"(min $9)"} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"text-secondary-500"} />
                                    </div>
                                </div>
                            </div>
                            <hr className="border-black-400" />
                            <div className="flex flex-col gap-2">
                                <Typography text={"All major VISA and mastercards are supported"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} fontWeight={"700"} />
                                <div className="flex flex-row gap-3">
                                    <VisaBWIcon />
                                    <MastercardBWIcon />
                                </div>
                            </div>
                            <div className={"flex flex-row items-center gap-2"}>
                                    <InfoIconTwoV2 width={16} height={16} />
                                    <Typography text={"Currently supporting payments only in USD"} size={TYPOGRAPHY_SIZES.SMALL} type={TYPOGRAPHY_TYPES.PARA} fontWeight={"400"} textClasses={"text-neutral-600"} />
                                </div>
                        </div>
                        <div className={"flex flex-col gap-6 bg-neutral-50 rounded-[10px] p-6 w-[50%] !h-[240px]"}>
                            <div className={"flex flex-row justify-between"}>
                                <div className={"flex flex-row items-center gap-4"}>
                                    <NetBankingIconWithEllipse />
                                    <div className="flex flex-col gap-1">
                                        <Typography text={"Net banking"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} />
                                        <div className="flex flex-row items-center gap-2">
                                            <Typography text={"Powered by"} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"!text-neutral-600"} />
                                            <PlaidIcon />
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-secondary-50 rounded-full items-center px-4 py-2 border border-secondary-400">
                                    <div className="flex flex-row gap-1 items-center">
                                        <Typography
                                            text="Pricing "
                                            type={TYPOGRAPHY_TYPES.PARA}
                                            size={TYPOGRAPHY_SIZES.X_X_SMALL}
                                            textClasses="text-secondary-500"
                                        />
                                        <Typography text={" Flat 2% "} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} textClasses={"text-secondary-500"} />
                                        <Typography text={"(min $9)"} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"text-secondary-500"} />
                                    </div>
                                </div>
                            </div>
                            <hr className="border-black-400" />
                            <div className="flex flex-col gap-2">
                                <Typography text={"Enabling payments from "} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} fontWeight={"700"} >
                                    <Typography text={"100+ trusted US banks"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} fontWeight={"700"} textClasses={"text-secondary-400"} />
                                </Typography>
                                <div className="flex flex-row gap-4 items-center">
                                    <USBankBWIcon />
                                    <CitiBankBWIcon />
                                    <BankOfAmericaBWIcon />
                                    <WellsFargoBWIcon />
                                    <ChaseBankBWIcon />
                                </div>
                            </div>
                            <div className={"flex flex-row items-center gap-2 h-6"}>
                                    {/* Empty div to maintain spacing alignment with card section */}
                                </div>
                        </div>
                    </div>
                    <div className="flex flex-row gap-6">
                        <div className="flex flex-row gap-2 items-center">
                            <ClockIcon />
                            <Typography text={"Settlement time: 6 business days"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} fontWeight={"600"} />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <FullTickBWIcon />
                            <Typography text={"FIRA will be provided by Skydo"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} fontWeight={"600"} />
                        </div>
                    </div>
                </div>
            </Accordion>
        </Card>)
}

export default AvailablePaymentMethods;