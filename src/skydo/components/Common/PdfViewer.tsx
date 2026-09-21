import React from "react";

import { Document, Page, pdfjs } from "react-pdf";
import workerSrc from "../../pdf-worker";
import CircularLoader from "../UBOPanDetails/CircularLoader";
import { PDFPageProxy } from "pdfjs-dist";

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc;

interface Props {
  url: string;
  width?: number;
  height?: number;
  pageNumber: number;
  setNumberOfPages?: (pageNumber: number) => void;
  isWhiteLoader?: boolean;
  isGrayLoader?: boolean;
  onLoadSuccess?: () => void;
  scale?: number;
  onPageLoadSuccess?: (page: PDFPageProxy) => void;
}

const PdfViewer = ({
  url,
  width,
  height,
  pageNumber,
  setNumberOfPages,
  isWhiteLoader,
  isGrayLoader,
  onLoadSuccess,
  scale,
  onPageLoadSuccess,
}: Props) => {
  const renderPdfLoader = () => {
    return (
      <div className={"flex w-full h-full items-center justify-center"} style={{ width: width }}>
        <CircularLoader isWhite={isWhiteLoader} isGray={isGrayLoader} />
      </div>
    );
  };

  return (
    <Document file={url} loading={renderPdfLoader} onLoadSuccess={onLoadSuccess}>
      <Page
        pageNumber={pageNumber}
        width={width}
        onLoadSuccess={onPageLoadSuccess}
        height={height}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        onRenderSuccess={(d) => {
          setNumberOfPages && setNumberOfPages(d?._transport?._numPages);
        }}
        scale={scale}
      />
    </Document>
  );
};

export default PdfViewer;
