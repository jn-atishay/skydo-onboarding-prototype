/**
 * @author Raj Sheth
 * created: 27/11/23
 */

import React, { FC, useEffect } from "react";
import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import useDeclarationStore from "../../store/useDeclarationStore";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import BottomSheet from "../AtomicComponents/BottomSheet";

interface Props {
  onAccept: () => void;
  isSubmitting?: boolean;
}

const DeclarationPopup: FC<Props> = (props) => {
  const analytics = useAnalytics();
  const { isPopupVisible, onClosePopup } = useDeclarationStore();

  useEffect(() => {
    if (isPopupVisible) {
      analytics.trackAsync(Events.SP_DECLARATION_SHOWN);
    }
  }, []);

  const onClose = () => {
    analytics.trackAsync(Events.SP_DECLARATION_CANCELLED);
    onClosePopup();
  };

  const onDecAccept = () => {
    analytics.trackAsync(Events.SP_DECLARATION_ACCEPTED);
    props.onAccept();
  };

  const renderContent = () => {
    return (
      <div className={"mb-6"}>
        <Typography
          text={Locale.decForm}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"mr-1 hide_for_desktop"}
        />
        <ol className={"ml-3.5 list-decimal marker:bullet_points"}>
          <li className={"mt-6 pl-1"}>
            <Typography
              text={Locale.solePropDeclarationLine1}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </li>
          <li className={"mt-6 pl-1"}>
            <Typography
              text={Locale.solePropDeclarationLine2}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </li>
          <li className={"mt-6 pl-1"}>
            <Typography
              text={Locale.solePropDeclarationLine3}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </li>
        </ol>
        <div className={"hide_for_desktop"}>
          <Button
            title={Locale.iAccept}
            onButtonClick={onDecAccept}
            size={BUTTON_SIZES.MEDIUM}
            buttonClass={"mt-6 !w-full justify-center"}
            isLoading={props.isSubmitting}
          />
        </div>
      </div>
    );
  };
  const renderCTAs = () => {
    return (
      <Button
        title={Locale.iAccept}
        onButtonClick={onDecAccept}
        size={BUTTON_SIZES.SMALL}
        isLoading={props.isSubmitting}
      />
    );
  };

  return (
    <div>
      <div className={"hide_for_mob"}>
        <Popup
          open={isPopupVisible}
          renderContent={renderContent}
          isDashboardPopup={true}
          title={"Declaration form"}
          renderCTAs={renderCTAs}
          outsideClick={onClose}
          isCommonHeader={true}
          closeIconClick={onClose}
        />
      </div>
      <div className={"hide_for_desktop"}>
        <BottomSheet isOpen={isPopupVisible} onClose={onClosePopup}>
          {renderContent()}
        </BottomSheet>
      </div>
    </div>
  );
};

export default DeclarationPopup;
