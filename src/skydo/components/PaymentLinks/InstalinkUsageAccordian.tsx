import SearchIcon from "../Icons/SearchIcon";
import Typography from "../AtomicComponents/Typography";

import classNames from "classnames";
import Accordion from "../AtomicComponents/Accordion";
import Card from "../Common/Card";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import ProfileWithEllipseIcon from "../Icons/ProfileWithEllipseIcon";
import CreditCardIconWithEllipse from "../Icons/CreditCardIconWithEllipse";
import LinkIcon from "../Icons/LinkIcon";
import LinkIconWithEllipse from "../Icons/LinkIconWithEllipse";
import RightArrowIcon from "../Icons/RightArrowIcon";
import RightArrowIconWithEllipse from "../Icons/RightArrowIconWithEllipse";
import analytics from "../../pages/analytics";
import { Events } from "../../analytics/EventConstants";
import Image from "next/image";
import { useState } from "react";
import useAnalytics from "../../analytics/useAnalytics";
import Popup from "../AtomicComponents/Popup";

const InstalinkUsageAccordian = ({ className, isDefaultOpen = true, showYoutubeVideo = false, exporterEligibleForVeemCards = false }: { className?: string; isDefaultOpen?: boolean, showYoutubeVideo?: boolean, exporterEligibleForVeemCards?: boolean }) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const analytics = useAnalytics();
    const getAccordionTitle = () => {
        return (
            <div className={"flex flex-row items-center gap-4"}>
                <SearchIcon />
                <Typography text={"How to use InstaLinks in 3 easy steps"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} />
            </div>
        )
    };

    const renderAccordianContentWithoutYoutubeVideo = () => {
        return <div className={"flex flex-row gap-6 p-6 items-center justify-between"}>
            <div className={"flex flex-row gap-4 items-center"}>
                <ProfileWithEllipseIcon />
                <Typography text={"Add client & amount"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} textClasses={"text-neutral-600"} />
            </div>
            <RightArrowIconWithEllipse />
            <div className={"flex flex-row gap-4 items-center"}>
                <CreditCardIconWithEllipse bgStrokeColor={"#EEF3FE"} />
                <Typography text={"Choose payment method"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} textClasses={"text-neutral-600"} />
            </div>
            <RightArrowIconWithEllipse />
            <div className={"flex flex-row gap-4 items-center"}>
                <LinkIconWithEllipse />
                <Typography text={"Share link & get paid"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} textClasses={"text-neutral-600"} />
            </div>
        </div>;
    }

    const renderAccordianContentWithYoutubeVideo = () => {
        return <div className={"flex flex-row gap-6 p-6 items-center justify-between"}>
            <div className={"flex flex-col gap-6"}>
                <div className={"flex flex-row gap-4 items-center"}>
                    <ProfileWithEllipseIcon />
                    <Typography text={"Add client & amount"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} textClasses={"text-neutral-600"} />
                </div>
                {/* <RightArrowIconWithEllipse /> */}
                <div className={"flex flex-row gap-4 items-center"}>
                    <CreditCardIconWithEllipse bgStrokeColor={"#EEF3FE"} />
                    <Typography text={"Choose payment method"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} textClasses={"text-neutral-600"} />
                </div>
                {/* <RightArrowIconWithEllipse /> */}
                <div className={"flex flex-row gap-4 items-center"}>
                    <LinkIconWithEllipse />
                    <Typography text={"Share link & get paid"} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} fontWeight={"700"} textClasses={"text-neutral-600"} />
                </div>
            </div>
            <div className={"flex flex-col gap-6 rounded-10px overflow-hidden"}>
                <Image
                    src={"/paymentLinkThumbnailLatest.png"}
                    height={180}
                    width={360}
                    alt={"Payment Link Thumbnail"}
                    onClick={() => {
                        analytics.trackAsync(Events.PAYPAL.PAYMENT_LINK_VIDEO_WATCHED);
                        setIsPopupOpen(true);
                    }}
                    className={"cursor-pointer"}
                />
            </div>
        </div>;
    }


    return (
        <>
            <Card className={classNames("w-full !p-0 flex flex-col border border-black-400", className)}>
                <Accordion
                    titleEle={getAccordionTitle()}
                    titleClasses={"p-6"}
                    openTitleClasses={"border-b border-black-400"}
                    isDefaultOpen={isDefaultOpen}
                >
                    {showYoutubeVideo ? renderAccordianContentWithYoutubeVideo() : renderAccordianContentWithoutYoutubeVideo()}
                </Accordion>

            </Card>
            <Popup
                containerClass={"!p-0 aspect-video relative"}
                isLargePopup={true}
                renderContent={() => (
                    <div>
                        <iframe
                            src={!exporterEligibleForVeemCards ? "https://www.youtube.com/embed/Y_1lPHgaGag?autoplay=1" : "https://www.youtube.com/embed/mQOtVdt1vGQ?autoplay=1"}
                            allow={
                                "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            }
                            allowFullScreen
                            className={"absolute top-0 left-0 w-full h-full rounded-lg"}
                        />
                    </div>
                )}
                isDashboardPopup={true}
                open={isPopupOpen}
                outsideClick={() => {
                    setIsPopupOpen(false);
                }}
            />
        </>
    );
};

export default InstalinkUsageAccordian;