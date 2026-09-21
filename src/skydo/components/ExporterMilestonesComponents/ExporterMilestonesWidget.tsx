import Typography from "../AtomicComponents/Typography";
import {TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES} from "../../constants/atomicConstants";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import RightArrowIcon from "../Icons/RightArrowIcon";
import React from "react";
import Locale from "../../util/locale/en";

// Visibility is owned by NavBar, which also reserves the rail height this occupies —
// hiding from in here would leave that reserved space stranded and empty.
const ExporterMilestonesWidget = (props: { onCtaClick: () => void; onClose: () => void; isCollapsed: boolean; }) => {
  const { onCtaClick, onClose, isCollapsed } = props;
  if(isCollapsed) {
    return <div className={"flex flex-col mb-4"}>
      <div
          className={
            "p-1 border-2 border-navyblue-300 rounded-[0.625rem] gap-1 bg-gradient-to-r from-[#5671D2] via-[#6B85E7] via-[#829DFF] via-[#6580E9] to-[#334DB3] cursor-pointer"
          }
          onClick={onCtaClick}
      >
        <StarIcon />
      </div>
    </div>;
  }

  return (
    <div className={"flex flex-col mb-4"}>
      <div
        className={
          "flex items-center justify-between p-1 border-2 border-navyblue-300 rounded-t-[0.625rem] gap-1 bg-gradient-to-r from-[#5671D2] via-[#6B85E7] via-[#829DFF] via-[#6580E9] to-[#334DB3]"
        }
      >
        <div className={"flex items-center"}>
          <StarIcon />
          <Typography
            text={Locale.milestoneUnlocked}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={600}
            fontColor={"white"}
          />
        </div>
        <div className={"rounded-full hover:bg-navyblue-500 cursor-pointer"} onClick={onClose}>
          <CrossIcon width={16} height={16} stroke={"white"} />
        </div>
      </div>
      <div
        className={"flex justify-center items-center border-2 border-navyblue-300 rounded-b-[0.625rem] py-2 group"}
        onClick={onCtaClick}
      >
        <Typography
          text={Locale.takeAPeek}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontWeight={600}
          textClasses={"!text-black p-2 cursor-pointer group-hover:!text-navyblue-300"}
        />
        <div className={"group-hover:hidden cursor-pointer"}>
          <RightArrowIcon width={13} height={12} stroke={"black"} />
        </div>
        <div className={"hidden group-hover:block cursor-pointer"}>
          <RightArrowIcon width={13} height={12} stroke={"#276EF1"} />
        </div>
      </div>
    </div>
  );
};

// TODO : Refactor the below icons
const StarIcon = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M6.70769 13.4133L8.3832 9.70355C8.64835 9.11648 9.11854 8.64629 9.70561 8.38114L13.4154 6.70564L9.70561 5.03013C9.11854 4.76498 8.64835 4.29479 8.3832 3.70772L6.70769 -0.00205575L5.03218 3.70772C4.76704 4.29479 4.29685 4.76498 3.70978 5.03013L-5.86405e-07 6.70564L3.70978 8.38114C4.29685 8.64629 4.76704 9.11648 5.03218 9.70355L6.70769 13.4133Z"
        fill="white"
      />
      <path
        d="M10.9538 15.998L11.4231 14.959C11.6883 14.3719 12.1584 13.9017 12.7455 13.6366L13.7846 13.1673L12.7455 12.698C12.1584 12.4328 11.6883 11.9626 11.4231 11.3756L10.9538 10.3365L10.4845 11.3756C10.2194 11.9626 9.74919 12.4328 9.16212 12.698L8.12305 13.1673L9.16212 13.6366C9.74919 13.9017 10.2194 14.3719 10.4845 14.959L10.9538 15.998Z"
        fill="white"
      />
    </svg>
  );
};

export default ExporterMilestonesWidget;
