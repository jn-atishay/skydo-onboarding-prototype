import Breadcrumb from "../Common/Breadcrumb";
import FE_ROUTES from "../../util/feRoutes";
import React from "react";
import { QRCodeSVG } from "qrcode.react";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import useVideoKycStore from "../../store/useVideoKycStore";
import Locale from "../../util/locale/en";

interface Props {
  goBack: () => void;
}
export const QRCodePageForVkyc = (props: Props) => {
  const { goBack } = props;
  const { vkycLink } = useVideoKycStore();
  return (
    <div className={"flex flex-1 flex-col h-full pb-[80px] md:pb-0"}>
      <div className={"hide_for_mob"}>
        <Breadcrumb text={Locale.homePage} textRoute={FE_ROUTES.HOME} subText={Locale.videoVerification} />
      </div>
      <div className={"flex flex-col items-center p-8 flex-1 h-full justify-center bg-white rounded-10px"}>
        <Typography
          text={Locale.scanCodeWithPhoneCamera}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!text-black-500 max-w-[376px] text-center"}
          fontWeight={"bold"}
        >
          <Typography
            text={Locale.continueVideoVerification}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!text-black-500 pl-1"}
          />
        </Typography>
        <div className={"flex border-[1px] p-3 rounded-10px border-black-500 mt-6"}>
          <QRCodeSVG value={vkycLink} size={168} />
        </div>
        <Typography
          text={Locale.goBack}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-blue-400 cursor-pointer pt-8"}
          fontWeight={"bold"}
          onTextClick={goBack}
        >
          <Typography
            text={Locale.toContinueVideoVerifText}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500 pl-1"}
          />
          <Typography
            text={Locale.desktopText}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500 pl-1"}
            fontWeight={"bold"}
          />
        </Typography>
      </div>
    </div>
  );
};
