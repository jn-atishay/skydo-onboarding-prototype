import { isFileTypeNotPdf } from "../../util/functions";
import FilePreview from "../../components/Common/FilePreview";
import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import classnames from "classnames";

const PdfViewer = dynamic(() => import("../../components/Common/PdfViewer"), { ssr: false });

interface Props {
  fileLink: string;
  isWhiteLoader?: boolean;
  isGrayLoader?: boolean;
  setNumberOfPages?: (pageNumber: number) => void;
  pageNumber?: number;
  isPdf?: boolean;
  isFixedHeight?: boolean;
  containerClass?: string;
}

const Preview = (props: Props) => {
  const { pageNumber = 1 } = props;
  const pdfContainerRef = React.useRef<HTMLDivElement>(null);
  const [pdfWrapper, setPdfWrapper] = React.useState({} as { width: number; height: number });

  const setPdfWrapperDimensions = () => {
    if (pdfContainerRef.current) {
      const width = pdfContainerRef.current.getBoundingClientRect().width;
      const height = pdfContainerRef.current.getBoundingClientRect().height;
      setPdfWrapper({ width, height });
    }
  };

  useEffect(() => {
    setPdfWrapperDimensions();
    window.addEventListener("resize", setPdfWrapperDimensions);
    return () => {
      window.removeEventListener("resize", setPdfWrapperDimensions);
    };
  }, []);

  return (
    <div ref={pdfContainerRef} className={classnames("flex items-center justify-center h-full", props.containerClass)}>
      {isFileTypeNotPdf(props.fileLink) && !props.isPdf ? (
        <FilePreview fileLink={props.fileLink} />
      ) : (
        <PdfViewer
          pageNumber={pageNumber}
          url={props.fileLink}
          height={pdfWrapper.height}
          width={!props.isFixedHeight ? pdfWrapper.width : undefined}
          isWhiteLoader={props.isWhiteLoader}
          isGrayLoader={props.isGrayLoader}
          setNumberOfPages={props.setNumberOfPages}
          onLoadSuccess={() => setPdfWrapperDimensions()}
        />
      )}
    </div>
  );
};

export default Preview;
