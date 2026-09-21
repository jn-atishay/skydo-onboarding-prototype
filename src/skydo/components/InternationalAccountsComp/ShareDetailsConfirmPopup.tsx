import Popup from "../AtomicComponents/Popup";
import PopupHeader from "../AtomicComponents/Popup/PopupHeader";
import Locale from "../../util/locale/en";
import ShareAccountDetailsDescriptionPopup from "./ShareAccountDetailsDescriptionPopup";
import useInternationalAccountsStore, { ACCOUNTS_SHARE_TYPE } from "../../store/useInternationalAccountsStore";
import { CountryToPreviewImageMap } from "../../constants/publicBankAccountCardConstants";
import ShareDetailsEmailPreview from "./ShareDetailsEmailPreview";

interface ShareDetailsConfirmPopupProps {
  onClose: () => void;
  setShareDetailsState: (val: string) => void;
  isFileUploadLoading: boolean;
  renderCTAs: () => JSX.Element;
}

const ShareDetailsConfirmPopup = ({
  onClose,
  setShareDetailsState,
  isFileUploadLoading,
  renderCTAs,
}: ShareDetailsConfirmPopupProps) => {
  const { publicLink, shareAccountLocation, businessName, logoImageUrl, shareType } = useInternationalAccountsStore();

  const link = publicLink + (shareAccountLocation ? `?location=${shareAccountLocation.toLowerCase()}` : "");

  return (
    <Popup
      isLargePopup={true}
      open={true}
      renderContent={() => (
        <div className={"flex flex-col h-full"}>
          <PopupHeader title={Locale.confirmLogo} closeIconClick={onClose} />
          {shareType === ACCOUNTS_SHARE_TYPE.LINK ? (
            <ShareAccountDetailsDescriptionPopup
              link={link}
              setShareDetailsState={setShareDetailsState}
              businessName={businessName}
              previewImage={CountryToPreviewImageMap[shareAccountLocation]}
              logoImageUrl={logoImageUrl}
              confirmingLogo={true}
              isFileUploadLoading={isFileUploadLoading}
              renderCTAs={renderCTAs}
              previewLocation={shareAccountLocation}
            />
          ) : (
            <ShareDetailsEmailPreview
              setShareDetailsState={setShareDetailsState}
              isConfirming={true}
              logo={logoImageUrl}
              renderCTAs={renderCTAs}
            />
          )}
        </div>
      )}
    />
  );
};

export default ShareDetailsConfirmPopup;
