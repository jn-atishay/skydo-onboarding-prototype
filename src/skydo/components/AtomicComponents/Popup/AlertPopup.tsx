import React, { FC, ReactElement } from "react";
import Locale from "../../../util/locale/en";
import Typography from "../Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import Popup from "./index";
import Button from "../Button";
import ErrorIcon from "../../Icons/ErrorIcon";

interface AlertPopupProps {
  title: string;
  text: string;
  isOpen: boolean;
  onCancel: () => void;
  rightCta: string;
  onRightCtaClick: () => void;
  isRightCtaLoading?: boolean;
  headerIcon?: () => ReactElement;
  containerClass?: string;
}

const AlertPopup: FC<AlertPopupProps> = (props) => {
  const { containerClass = "" } = props;

  const renderCTAs = () => {
    return (
      <div className={"flex flex-row mt-6"}>
        <Button
          title={Locale.cancel}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={props.onCancel}
          buttonClass={"mr-2"}
        />
        <Button
          title={props.rightCta}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={props.onRightCtaClick}
          isRedButton={true}
          isLoading={props.isRightCtaLoading}
        />
      </div>
    );
  };

  const renderPopupTitle = () => {
    return (
      <div className={"flex items-center gap-4"}>
        {props.headerIcon ? props.headerIcon() : <ErrorIcon />}
        <Typography text={props.title} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
    );
  };

  return (
    <Popup
      title={renderPopupTitle()}
      isCommonHeader={true}
      renderContent={() => <Typography text={props.text} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />}
      open={props.isOpen}
      outsideClick={props.onCancel}
      closeIconClick={props.onCancel}
      renderCTAs={renderCTAs}
      isDashboardPopup={true}
      containerClass={containerClass}
    />
  );
};

export default AlertPopup;
