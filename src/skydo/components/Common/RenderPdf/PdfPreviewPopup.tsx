//Jun 2023

import Popup from "../../AtomicComponents/Popup";
import React, { useState } from "react";
import Preview from "../../../containers/InvoicePreviewContainer/Preview";

interface Props {
  showPreview: boolean;
  closePreview: () => void;
  onDownloadClick?: () => void;
  url: string;
  pageNumber?: number;
  onOutsideClick?: () => void;
}

const PdfPreviewPopup = (props: Props) => {
  const { showPreview, closePreview, onDownloadClick, url, pageNumber = 1, onOutsideClick } = props;

  const [numPages, setNumberOfPages] = useState(1);

  const [pageRendered, setPageRendered] = useState(pageNumber);

  const onRightClick = () => {
    if (pageRendered < numPages) {
      setPageRendered(pageRendered + 1);
    }
  };

  const onLeftClick = () => {
    if (pageRendered > 1) {
      setPageRendered(pageRendered - 1);
    }
  };

  const renderInvoicePreview = () => {
    return (
      <Preview
        fileLink={url}
        isWhiteLoader={true}
        setNumberOfPages={setNumberOfPages}
        pageNumber={pageRendered}
        isPdf={true}
      />
    );
  };
  return (
    <Popup
      renderContent={renderInvoicePreview}
      open={showPreview}
      closeIconClick={closePreview}
      outsideClick={onOutsideClick}
      containerClass={"!p-0 !overflow-visible !rounded-none !w-0"}
      containerStyle={{ height: 900, width: "0px", maxHeight: "85%" }}
      isPdfPreviewPopup={true}
      onDownloadDocClick={onDownloadClick}
      numberOfPages={numPages}
      pageRendered={pageRendered}
      onLeftClick={onLeftClick}
      onRightClick={onRightClick}
    />
  );
};

export default PdfPreviewPopup;
