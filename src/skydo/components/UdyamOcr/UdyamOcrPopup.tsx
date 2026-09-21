/**
 * @author Raj Sheth
 * created: 23/04/24
 */

import React, { FC } from "react";
import Popup from "../AtomicComponents/Popup";
import BottomSheet from "../AtomicComponents/BottomSheet";
import useUdyamOcrStore from "../../store/useUdyamOcrStore";
import UdyamOcrContent from "./UdyamOcrContent";
import usePollUdyamOcrStatus from "../../util/customHooks/usePollUdyamOcrStatus";
import { TaskStatus } from "../../types/UdyamOcr";

interface Props {
  businessLegalName: string;
  onUploadAnotherDoc: () => void;
}

const UdyamOcrPopup: FC<Props> = (props) => {
  const { isPopupVisible, setPopupVisible, setIsPolling, status } = useUdyamOcrStore();
  usePollUdyamOcrStatus();

  const onClose = () => {
    setPopupVisible(false);
    setIsPolling(false);
    status == TaskStatus.ERROR && props.onUploadAnotherDoc();
  };

  return (
    <>
      <div className={"hide_for_mob"}>
        <Popup
          isCommonHeader={true}
          renderContent={() => (
            <UdyamOcrContent
              businessLegalName={props.businessLegalName}
              onUploadAnotherDoc={props.onUploadAnotherDoc}
            />
          )}
          closeIconClick={onClose}
          open={isPopupVisible}
          outsideClick={onClose}
          title={""}
          isDashboardPopup={true}
        />
      </div>
      <div className={"hide_for_desktop"}>
        <BottomSheet withCloseIcon={true} isOpen={isPopupVisible} onClose={onClose}>
          {isPopupVisible && (
            <UdyamOcrContent
              businessLegalName={props.businessLegalName}
              onUploadAnotherDoc={props.onUploadAnotherDoc}
              containerClass={"mt-8"}
            />
          )}
        </BottomSheet>
      </div>
    </>
  );
};

export default UdyamOcrPopup;
