import { POPUP_STATES } from "./UploadInvoicePopup";
import dynamic from "next/dynamic";
import FilePreview from "../../components/Common/FilePreview";
import React, { useEffect } from "react";
import classnames from "classnames";
import InvoiceParseLoader from "./InvoiceParseLoader";
import { OcrParsedInvoiceDto } from "../../types/Invoice";
import { Importer } from "../../types";
import ParsedDataForm from "./ParsedDataForm";
import useCountriesStore from "../../store/useCountriesStore";
import { PDFPageProxy } from "pdfjs-dist";

const PdfViewer = dynamic(() => import("../../components/Common/PdfViewer"), { ssr: false });

interface ParsedInvoicePreviewProps {
  invoiceUrl: string;
  popupState: number;
  setPopupState: (value: number) => void;
  closeIconClick: () => void;
  isPdf: boolean;
  ocrInvoiceData: OcrParsedInvoiceDto;
  importerList: Importer[];
  unparsedInvoiceId: number;
  uploadSource?: "upload" | "re-upload";
  triggerReupload?: () => void;
}
const ParsedInvoicePreview = (props: ParsedInvoicePreviewProps) => {
  const { popupState } = props;

  const pdfContainerRef = React.useRef<HTMLDivElement>(null);
  const [pdfWrapper, setPdfWrapper] = React.useState({} as { width: number; height: number });
  const [pdfDimensions, setPdfDimensions] = React.useState({} as { width: number; height: number });
  const { fetchCountryList } = useCountriesStore();
  const [scale, setScale] = React.useState(1);

  const setPdfWrapperDimensions = () => {
    if (pdfContainerRef.current) {
      const width = pdfContainerRef.current.getBoundingClientRect().width;
      const height = pdfContainerRef.current.getBoundingClientRect().height;
      setPdfWrapper({ width, height });
    }
    if (pdfContainerRef.current && pdfDimensions.width && pdfDimensions.height) {
      setPdfWrapper({ width: pdfDimensions.width, height: pdfDimensions.height });
      const computedScale = Math.min(
        pdfContainerRef.current.getBoundingClientRect().width / pdfDimensions.width,
        pdfContainerRef.current.getBoundingClientRect().height / pdfDimensions.height
      );
      setScale(computedScale);
    } else {
      setScale(1);
    }
  };

  useEffect(() => {
    setPdfWrapperDimensions();
    window.addEventListener("resize", setPdfWrapperDimensions);
    fetchCountryList();
    return () => {
      window.removeEventListener("resize", setPdfWrapperDimensions);
    };
  }, [pdfDimensions]);

  const isLoading = popupState === POPUP_STATES.LOADING;

  return (
    <div className={"flex flex-row h-full"}>
      <div className={"flex-1 p-6 bg-black-50 basis-1/2 rounded-l-10px max-w-[50%]"}>
        <div
          className={classnames(
            "flex bg-white w-full h-full items-center justify-center rounded-10px overflow-hidden !border-[0.256148px] border-black-400",
            { relative: !props.isPdf }
          )}
          ref={pdfContainerRef}
        >
          {!props.isPdf ? (
            <FilePreview fileLink={props.invoiceUrl} />
          ) : (
            <PdfViewer
              pageNumber={1}
              url={props.invoiceUrl}
              scale={scale}
              width={pdfWrapper.width}
              height={pdfWrapper.height}
              onPageLoadSuccess={(page: PDFPageProxy) => {
                const viewport = page.getViewport({ scale: 1 });
                setPdfDimensions({ width: viewport.width, height: viewport.height });
              }}
            />
          )}
        </div>
      </div>
      <div className={"flex-1 flex flex-col bg-white basis-1/2 p-6 rounded-r-10px"}>
        {isLoading ? (
          <InvoiceParseLoader />
        ) : (
          <ParsedDataForm
            {...{
              importerList: props.importerList,
              ocrInvoiceData: props.ocrInvoiceData,
              closeIconClick: props.closeIconClick,
              setPopupState: props.setPopupState,
              unparsedInvoiceId: props.unparsedInvoiceId,
              uploadSource: props.uploadSource,
              triggerReupload: props.triggerReupload,
            }}
          />
        )}
      </div>
    </div>
  );
};
export default ParsedInvoicePreview;
