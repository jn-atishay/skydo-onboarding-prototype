//Jul 2023

import useEInvoicingStore from "../../store/useEInvoicingStore";
import Popup from "../AtomicComponents/Popup";
import FullTick from "../Icons/FullTick";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import CreateInvoiceButton from "../Common/CreateInvoiceButton";
import Image from "next/image";
import PopupHeader from "../AtomicComponents/Popup/PopupHeader";

interface Props {}

const SampleEinvoicePopup = (props: Props) => {
  const {} = props;
  const { showSampleEInvoice, closeSampleEInvoicePopup } = useEInvoicingStore();
  const { theme } = useContext(AppContext);
  if (!showSampleEInvoice) return null;

  const renderEInvoiceList = (text: string) => {
    return (
      <div className={"flex_row_item_center"}>
        <FullTick
          width={32}
          height={32}
          bgColor={theme.hexColors.green[100]}
          tickColor={theme.hexColors.green[400]}
          className={"mr-2"}
        />
        <Typography text={text} size={TYPOGRAPHY_SIZES.SMALL} />
      </div>
    );
  };
  const renderContent = () => {
    return (
      <div className={"flex flex-col w-full h-full"}>
        <PopupHeader title={""} closeIconClick={closeSampleEInvoicePopup} />
        <div className={"flex flex-row gap-6 flex-1"}>
          <div className={"basis-1/2 flex flex-col h-full justify-between"}>
            <div className={"flex flex-col"}>
              <FullTick width={72} height={72} className={"mb-1"} strokeWidth={1.5} />
              <div className={"mt-1 mb-4"}>
                <Typography
                  text={Locale.eInvoiceEnabled}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-green-400"}
                />
              </div>
              {renderEInvoiceList(Locale.allInvReg)}
              {renderEInvoiceList(Locale.genIrnQr)}
              {renderEInvoiceList(Locale.abToCancel)}
              {/*{renderEInvoiceList(Locale.automatedProcess)}*/}
              <div className={"mt-6 flex flex-col gap-2"}>
                <Typography text={Locale.howWorks} size={TYPOGRAPHY_SIZES.SMALL} fontWeight={700} />
                <Typography text={Locale.stepCreateInvoice} size={TYPOGRAPHY_SIZES.SMALL} />
                <Typography text={Locale.stepFinaliseInvoice} size={TYPOGRAPHY_SIZES.SMALL} />
                <Typography text={Locale.stepGenerateEInvoice} size={TYPOGRAPHY_SIZES.SMALL} />
              </div>
            </div>
            <div className={"flex flex-row justify-end"}>
              <CreateInvoiceButton onSuccess={closeSampleEInvoicePopup} />
            </div>
          </div>
          <div className={"basis-1/2 flex flex-col bg-blue-50 rounded-10px items-center h-full pb-5 px-4"}>
            <div className={"w-full text-center py-2.5"}>
              <Typography text={Locale.sampleInvoice} />
            </div>
            <div className={"relative w-full flex-1"}>
              <Image src={"/EInvoiceImages/sampleEInvoice.webp"} layout={"fill"} objectFit={"contain"} alt={""} />
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      open={showSampleEInvoice}
      isLargePopup={true}
      isDashboardPopup={true}
      containerClass={"!h-[80%]"}
      closeIconClick={closeSampleEInvoicePopup}
      outsideClick={closeSampleEInvoicePopup}
    />
  );
};

export default SampleEinvoicePopup;
