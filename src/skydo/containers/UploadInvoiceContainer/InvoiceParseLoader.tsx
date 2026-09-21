import Typography from "../../components/AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { useContext, useEffect, useState } from "react";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import CircularLoader from "../../components/UBOPanDetails/CircularLoader";
import FullTick from "../../components/Icons/FullTick";
import AppContext from "../../context/AppContext";

enum LoadingStates {
  UPLOADING,
  PARSING,
}

const InvoiceParseLoader = () => {
  const [loadingState, setLoadingState] = useState(LoadingStates.UPLOADING);
  const { theme } = useContext(AppContext);

  useEffect(() => {
    setTimeout(() => {
      setLoadingState(LoadingStates.PARSING);
    }, 350);
  }, []);

  const isUploading = loadingState === LoadingStates.UPLOADING;
  const isParsing = loadingState === LoadingStates.PARSING;

  return (
    <div className={"flex-1 flex_row_item_center justify-center"}>
      <div className={"flex flex-col"}>
        <div>
          <Typography
            text={Locale.invoiceLoadingTitle}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
          />
        </div>
        <div className={"flex_row_item_center my-6"}>
          {isUploading ? <CircularLoader /> : <FullTick />}
          <Typography
            text={Locale.uploadingInvoice}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight={"700"}
            textClasses={"!text-green-400 ml-3"}
          />
        </div>
        <div className={"flex_row_item_center"}>
          {isParsing ? <CircularLoader /> : <FullTick bgColor={theme.hexColors.black[400]} />}
          <Typography
            text={Locale.extractingInvoice}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight={isParsing ? "700" : undefined}
            textClasses={isParsing ? "!text-green-400 ml-3" : "!text-black-500 ml-3"}
          />
        </div>
      </div>
    </div>
  );
};

export default InvoiceParseLoader;
