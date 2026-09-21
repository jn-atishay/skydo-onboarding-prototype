import Popup from "../AtomicComponents/Popup";
import Image from "next/image";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import { LOCATION_CODE, locationVsSampleTrackerMap } from "../../constants/dashboardConstants";

interface Props {
  isOpen: boolean;
  closePopup: () => void;
  location?: string;
}

const SampleTracker = (props: Props) => {
  const { isOpen, closePopup, location = LOCATION_CODE.USA } = props;
  const trackerUrl = locationVsSampleTrackerMap[location];
  const { theme } = useContext(AppContext);
  const convertImage = (w: number, h: number) => `
  <svg width="${w}" height="${h}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <defs>
      <linearGradient id="g">
        <stop stop-color="#333" offset="20%" />
        <stop stop-color="#222" offset="50%" />
        <stop stop-color="#333" offset="70%" />
      </linearGradient>
    </defs>
    <rect width="${w}" height="${h}" fill="#333" />
    <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
    <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
  </svg>`;

  const toBase64 = (str: string) => window.btoa(str);

  const renderContent = () => {
    return (
      <div>
        <div className={"flex_row_item_center justify-between mb-6"}>
          <Typography text={Locale.sampleTracker} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
          <div className={"cursor-pointer"} onClick={closePopup}>
            <CrossIcon stroke={theme.hexColors.black[500]} />
          </div>
        </div>
        <div className={"w-[524px] h-[554px] relative"}>
          <Image
            src={trackerUrl}
            layout={"fill"}
            objectFit={"contain"}
            placeholder={"blur"}
            blurDataURL={`data:image/svg+xml;base64,${toBase64(convertImage(524, 574))}`}
          />
        </div>
      </div>
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      open={isOpen}
      outsideClick={closePopup}
      containerClass={"max-h-[90%] !p-6 !w-[574px] !max-w-none"}
    />
  );
};

export default SampleTracker;
