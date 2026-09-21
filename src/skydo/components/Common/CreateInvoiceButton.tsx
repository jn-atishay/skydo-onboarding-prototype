import { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { useRouter } from "next/router";
import useToastMessages from "../../store/toastMessages";
import beCall from "../../util/beCall";
import { ALLOWED_METHODS, SERVICES } from "../../constants/apiConstants";
import BE_ROUTES from "../../util/beRoutes";
import FE_ROUTES from "../../util/feRoutes";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TOAST_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import AddIcon from "../Icons/AddIcon";
import useInvoicingStore from "../../store/useInvoicingStore";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  className?: string;
  onSuccess?: () => void;
  source?: string;
  buttonType?: string;
  title?: string;
  rightIcon?: () => any;
}

const CreateInvoiceButton = (props: Props) => {
  const { theme } = useContext(AppContext);
  const router = useRouter();
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const { getNumberOfDraftInvoices } = useInvoicingStore();
  const [isLoaderVisible, setIsLoaderVisible] = useState(false);
  const analytics = useAnalytics();

  const onCreateButtonClick = async () => {
    analytics.trackAsync(Events.CREATE_INVOICE_CLICKED, {
      source: props.source || "",
    });
    try {
      setIsLoaderVisible(true);
      const response = await beCall({
        server: SERVICES.CHALLAN,
        path: BE_ROUTES.CHALLAN_CREATE_INVOICE,
        method: ALLOWED_METHODS.POST,
      });
      if (response.success) {
        await router.push(FE_ROUTES.DRAFT_INVOICE_DETAILS.replace("[draft_id]", String(response?.data)));
        getNumberOfDraftInvoices(true, false);
        props.onSuccess && props.onSuccess();
      } else {
        if (response.message == "GST_NOT_FOUND") {
          addToast({
            id: "draft_invoice_created_error",
            body: Locale.gstNotFound,
            type: TOAST_TYPES.ERROR,
          });
        } else {
          throw response;
        }
      }
    } catch (e: any) {
      addToast({
        id: "draft_invoice_created_error",
        body: Locale.wentWrongMessage,
        type: TOAST_TYPES.ERROR,
      });
    } finally {
      setIsLoaderVisible(false);
    }
  };

  return (
    <Button
      isLoading={isLoaderVisible}
      buttonClass={props.className}
      type={props.buttonType || BUTTON_TYPES.PRIMARY}
      title={props.title || Locale.createNewInvoice}
      size={BUTTON_SIZES.SMALL}
      onButtonClick={onCreateButtonClick}
      rightIcon={
        props.rightIcon ? props.rightIcon : () => <AddIcon height={16} width={16} stroke={theme.hexColors.white} />
      }
    />
  );
};

export default CreateInvoiceButton;
