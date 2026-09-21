import useInternationalAccountsStore, { ACCOUNTS_SHARE_TYPE } from "../../store/useInternationalAccountsStore";
import ShareAccountDetailsDescriptionPopup from "./ShareAccountDetailsDescriptionPopup";
import { CountryToPreviewImageMap } from "../../constants/publicBankAccountCardConstants";
import ShareDetailsEmailPreview from "./ShareDetailsEmailPreview";
import ShareDetailsCopyInstruction from "./ShareDetailsCopyInstruction";

interface ShareDetailsPopupRightContentProps {
  setShareDetailsState: (shareDetailsState: string) => void;
}

const ShareDetailsPopupRightContent = ({ setShareDetailsState }: ShareDetailsPopupRightContentProps) => {
  const { shareType, publicLink, shareAccountLocation, globalImageUrl, businessName } = useInternationalAccountsStore();
  const link = publicLink + (shareAccountLocation ? `?location=${shareAccountLocation.toLowerCase()}` : "");
  if (shareType === ACCOUNTS_SHARE_TYPE.LINK) {
    return (
      <ShareAccountDetailsDescriptionPopup
        link={link}
        confirmingLogo={false}
        setShareDetailsState={setShareDetailsState}
        logoImageUrl={globalImageUrl}
        businessName={businessName}
        previewImage={CountryToPreviewImageMap[shareAccountLocation]}
        isFileUploadLoading={false}
        previewLocation={shareAccountLocation}
      />
    );
  }

  if (shareType === ACCOUNTS_SHARE_TYPE.EMAIL) {
    return <ShareDetailsEmailPreview setShareDetailsState={setShareDetailsState} logo={globalImageUrl} />;
  }

  if (shareType === ACCOUNTS_SHARE_TYPE.COPY) {
    return <ShareDetailsCopyInstruction />;
  }

  return null;
};

export default ShareDetailsPopupRightContent;
