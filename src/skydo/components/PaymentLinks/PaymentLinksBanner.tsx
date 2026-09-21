import React from "react";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Image from "next/image";
import Typography from "../AtomicComponents/Typography";
import USFlagIcon from "../Icons/CountryFlags/USFlagIcon";
import VerticalLineIcon from "../Icons/VerticalLineIcon";
import Button from "../AtomicComponents/Button";
import router, { useRouter } from "next/router";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import FE_ROUTES from "../../util/feRoutes";

const PaymentLinksBanner = () => {
    const router = useRouter();
    const analytics = useAnalytics();
    return (
        <div className="flex flex-row justify-between w-full h-[230px] bg-primary-600 rounded-10px mb-6">
            <div className="flex flex-col p-6">
                <div className="flex flex-col gap-2.5">
                    <Typography text="InstaLinks now supports cards payments!" type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} textClasses="!text-white" />
                    <div className="flex flex-row gap-1 items-center pb-[25px]">
                        <Typography text="Credit / debit card payment method is now available!" type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="!text-primary-100" fontWeight={400} />
                    </div>
                    <div className="flex flex-row gap-6 items-center pb-[15px]">
                        <Typography text={"Pricing:"} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="!text-primary-200" fontWeight={400}>
                            <Typography text={"Flat 5% (min $9)"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} textClasses="!text-white pl-2" fontWeight={700} />
                        </Typography>
                        <VerticalLineIcon />
                        <Typography text={"Settlement time"} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses="!text-primary-200" fontWeight={400}>
                            <Typography text={"6 business days"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} textClasses="!text-white pl-2" fontWeight={700} />
                        </Typography>
                    </div>
                    <Button title="Create payment link" type={BUTTON_TYPES.SECONDARY} size={BUTTON_SIZES.SMALL} onButtonClick={() => {
                        router.push(FE_ROUTES.CREATE_PAYMENT_LINK);
                        analytics?.trackAsync(Events.PAYPAL.INSTALINKS_PAGE_BANNER_CLICKED);
                    }} />
                </div>
            </div>
            <div className="flex justify-end pb-4">
                <Image src={"/RightHandSideInstaLinksBanner.png"} alt="Payment Links Banner" height={230} width={450} />
            </div>
        </div>
    );
};

export default PaymentLinksBanner; 