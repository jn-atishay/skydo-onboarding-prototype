import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";

const FAQFooterForPaymentLinks = () => {
    return (
        <div className={"flex flex-row items-center !justify-between !w-full"}>
            <div className={"flex flex-row gap-4 items-center w-full justify-between"}>
                <Typography text={"Read about Skydo's chargeback policy. "} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-neutral-600"} >
                    <Typography text={"Learn more"} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-primary-300 cursor-pointer"} onTextClick={() => {
                        window.open("https://skydo-public-documents.s3.ap-south-1.amazonaws.com/veem/Terms+%26+Conditions+_+InstaLinks.pdf", "_blank");
                    }} />
                </Typography>
                <Typography text={"Skydo US Account vs InstaLinks — what's the difference? "} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-neutral-600"} >
                    <Typography text={"Read FAQs"} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-primary-300 cursor-pointer"} onTextClick={() => {
                        window.open("https://www.skydo.com/faqs/instalinks", "_blank");
                    }}/>
                </Typography>
            </div>
        </div>
    )
}

export default FAQFooterForPaymentLinks;