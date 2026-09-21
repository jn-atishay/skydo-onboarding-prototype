import React from "react";
import { FixedHeaderOverEmailPreview } from "./PaymentReminderEmailPreview";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import getEmailPreviewLoader from "./EmailPreviewLoader";

interface Props {
  logoUrl?: string;
  companyName?: string;
  onEditLogoClick: () => void;
  isDataFetched: boolean;
  children?: React.ReactNode;
}

interface FooterProps {
  addLogo: () => void;
}

export const FixedFooter: React.FC<FooterProps> = (props) => {
  return (
    <div className={"flex flex-row bg-yellow-200 px-4 py-2 rounded-10px h-14 mr-6 justify-between mb-2"}>
      <div className={"flex flex-row mr-6 flex-3"}>
        <Typography text={Locale.addLogoToFullText} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} />
      </div>
      <div className={"flex flex-row"}>
        <Button
          title={Locale.addLogoButtonText}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={props.addLogo}
          type={BUTTON_TYPES.SECONDARY}
        />
      </div>
    </div>
  );
};

export const EmailPreviewRightSection: React.FC<Props> = (props) => {
  const isLogoSaved = !!props.logoUrl;
  const isLoading = !props.isDataFetched;

  const addLogoClick = () => {
    props.onEditLogoClick();
  };

  if (isLoading) {
    return (
      <div className={`pl-6 flex flex-col flex-1 mt-6`}>
        <div className={"flex flex-col"}>
          <div className={"flex flex-col h-[600px] mr-6"}>
            <div>
              <FixedHeaderOverEmailPreview headerText={Locale.loadingPreview} />
            </div>
            <div>{getEmailPreviewLoader()}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`pl-6 flex flex-col flex-1 mt-6`}>
      <div className={"flex flex-col overflow-auto"}>{props.children}</div>
      {!isLogoSaved && <FixedFooter addLogo={addLogoClick} />}
    </div>
  );
};

export default EmailPreviewRightSection;
