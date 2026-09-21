/**
 * @author Raj Sheth
 * created: 13/10/23
 */

import { useEffect, useState } from "react";
import { InvoiceOrReminderPopupContentCase } from "../InvoiceOrRemindEmailPopUp/InvoiceOrReminderEmailPreviewPopUpChange";
import { TOAST_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import useToastMessages from "../../store/toastMessages";
import useEditLogoStore from "../../store/useEditLogoStore";
import useEmailPopupStore from "../../store/useEmailPopupStore";

interface Props {
  initialContentCase: InvoiceOrReminderPopupContentCase;
  onConfirmSuccess?: () => void;
}

interface UseUploadLogoFlowReturn {
  /**
   * use this to show logo in local
   * won't be in sync with backend while in middle of the updating phase
   */
  logoUrl: string;
  /**
   * sets in local
   * @param imageUrl
   */
  setLogoUrl: (imageUrl: string) => void;
  /**
   * already saved in backend
   */
  globalImageUrl: string;
  /**
   * while uploading logo, this will be true
   * loading flag for confirm logo api call
   */
  isConfirmLogoLoading: boolean;
  setFilWrapper: (file: File | null) => void;
  onConfirmLogo: () => void;
}

const useUploadLogoFlow = (props: Props): UseUploadLogoFlowReturn => {
  const { setPopupContentCase } = useEmailPopupStore();

  const { setLogoUrl, confirmLogo, setFile, globalImageUrl, logoUrl, fetchAndSetLogoUrl } = useEditLogoStore();

  const [confirmLogoLoading, setConfirmLogoLoading] = useState(false);
  const { addToast } = useToastMessages();

  const setFilWrapper = (file: File | null) => {
    if (file) {
      setLogoUrl(URL.createObjectURL(file));
      setFile(file);
    }
  };

  const onConfirmLogo = () => {
    setConfirmLogoLoading(true);
    const onFileUploadSuccess = (success: any) => {
      addToast({
        type: TOAST_TYPES.SUCCESS,
        id: "logo_upload_success",
        body: Locale.logoAddedSuccessfully,
      });
      setPopupContentCase(InvoiceOrReminderPopupContentCase.EMAIL);
      props.onConfirmSuccess?.();
      setConfirmLogoLoading(false);
    };

    const onFileUploadError = (error: any) => {
      addToast({
        type: TOAST_TYPES.SUCCESS,
        id: "logo_upload_failure",
        body: Locale.wentWrongMessage,
      });
      setConfirmLogoLoading(false);
    };
    confirmLogo({ onSuccess: onFileUploadSuccess, onError: onFileUploadError });
  };

  useEffect(() => {
    void fetchAndSetLogoUrl();
    setPopupContentCase(props.initialContentCase);
  }, []);

  return {
    logoUrl,
    setLogoUrl,
    globalImageUrl,
    isConfirmLogoLoading: confirmLogoLoading,
    setFilWrapper,
    onConfirmLogo,
  };
};

export default useUploadLogoFlow;
