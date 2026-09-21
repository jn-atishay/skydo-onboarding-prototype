/**
 * @author Raj Sheth
 * created: 01/09/23
 */

import React, { FC } from "react";
import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import classNames from "classnames";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  leftTitle?: string | (() => React.ReactNode);
  leftContainerClass?: string;
  rightContainerClass?: string;
  rightContainerWrapperClass?: string;
  rightSectionClass?: string;
  leftContent: () => React.ReactNode;
  rightContent: () => React.ReactNode;
  containerClass?: string;
}

const Index: FC<Props> = (props) => {
  const {
    containerClass,
    leftContainerClass = "",
    rightContainerClass = "",
    rightContainerWrapperClass = "",
    rightSectionClass = "",
    rightContent,
    isOpen,
    onClose,
    leftTitle,
    leftContent,
  } = props;

  const renderLeftTitle = () => {
    if (leftTitle) {
      if (typeof leftTitle === "string") {
        return <Typography text={leftTitle} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />;
      } else {
        return leftTitle();
      }
    }
  };

  const renderLeftSection = () => {
    return (
      <div className={"flex flex-1 flex-col -my-6 -ml-6 overflow-auto"}>
        <div className={classNames("flex flex-col w-full p-6 flex-1", leftContainerClass)}>
          <div className={"flex flex-row"}>{renderLeftTitle()}</div>
          <div className={"flex mt-2 flex-1"}>{leftContent()}</div>
        </div>
      </div>
    );
  };
  const renderRightSection = () => {
    return (
      <div className={`flex flex-1 flex-col -my-6 -mr-6 overflow-auto bg-black-50`}>
        <div className={classNames(`flex flex-col`, rightContainerWrapperClass)}>
          <div className={`cursor-pointer flex flex-1 flex-col pr-6 pt-6 self-end`} onClick={onClose}>
            <CrossIcon />
          </div>
          <div className={classNames("p-6", rightContainerClass)}>
            <div className={rightSectionClass}>{rightContent()}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={"flex flex-row h-full"}>
        {renderLeftSection()}
        {renderRightSection()}
      </div>
    );
  };

  return (
    <Popup
      isDashboardPopup={true}
      renderContent={renderContent}
      open={isOpen}
      closeIconClick={onClose}
      outsideClick={onClose}
      containerClass={classNames(containerClass)}
    />
  );
};

export default Index;
