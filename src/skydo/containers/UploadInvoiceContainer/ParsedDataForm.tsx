import React, { useContext, useEffect, useReducer, useRef, useState } from "react";
import { OcrParsedInvoiceDto } from "../../types/Invoice";
import { Importer, ImporterType, InvoiceSource } from "../../types";
import PopupHeader from "../../components/AtomicComponents/Popup/PopupHeader";
import Locale from "../../util/locale/en";
import Dropdown from "../../components/AtomicComponents/Dropdown";
import { Option, Options } from "../../types/atomicComponentTypes";
import { ALL_CURRENCIES } from "../../constants/dashboardConstants";
import { isNicheCurrency } from "../../util/functions";
import UaeAedPricingPopup from "../../components/InternationalAccountsComp/UaeAedPricingPopup";
import { CurrencyOption } from "../../components/Common/CurrencySelector";
import TextInput from "../../components/AtomicComponents/TextInput";
import DateSelector, { formatDate } from "../../components/AtomicComponents/DateSelector";
import Button from "../../components/AtomicComponents/Button";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  INPUT_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import { POPUP_STATES } from "./UploadInvoicePopup";
import Typography from "../../components/AtomicComponents/Typography";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { SERVICE_DESCRIPTION_ISSUE_TYPE } from "../../constants/fundingInvoiceMappingConstants";
import { ResponseWrapper } from "../../authentication/api/AuthApiDto";
import useToastMessages from "../../store/toastMessages";
import * as R from "remeda";
import UploadInvoicePopupContext from "../../context/UploadInvoicePopupContext";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import useReferralStore from "../../store/useReferralStore";
import Notes from "../../components/AtomicComponents/Notes";
import useVideoKycStore from "../../store/useVideoKycStore";
import { VKYCStatus } from "../../types/vkyc";
import CurrencyInput from "../../components/Common/CurrencyInput";
import useMobileDetect from "../../util/customHooks/useMobileDetect";
import CrossIcon from "../../components/AtomicComponents/ToastMessages/CrossIcon";
import classNames from "classnames";
import MobileStickyButton from "../../components/Common/MobileStickyButton";
import PdfFileIcon from "../../components/Icons/PdfFileIcon";
import NewPageIcon from "../../components/Icons/NewPageIcon";
import SearchIcon from "../../components/Icons/SearchIcon";
import useCountriesStore from "../../store/useCountriesStore";
import useExporterKnownNames from "../../hooks/useExporterKnownNames";
import ReuploadPromptPanel from "../../components/UploadInvoiceContainer/ReuploadPromptPanel";
import { getServiceDescriptionRowVariant } from "../../components/UploadInvoiceContainer/reuploadNoteSegments";

interface Props {
  ocrInvoiceData: OcrParsedInvoiceDto;
  importerList: Importer[];
  closeIconClick: () => void;
  setPopupState: (value: number) => void;
  unparsedInvoiceId: number;
  file?: File | null;
  fileUrl?: string;
  onCompactPreviewChange?: (isCompact: boolean) => void;
  uploadSource?: "upload" | "re-upload";
  // When provided, reupload actions open the native file picker directly instead of
  // navigating back to the generic "Upload invoice" screen first.
  triggerReupload?: () => void;
}

type State = {
  importer: {
    importerId?: number | string | null;
    importerName: string;
    importType: ImporterType;
  };
  amount: number;
  currency: string;
  dueDate: string | null;
  exporterSystemInvoiceId: string;
  raisedDate: string | null;
  importerCountry: string;
  errors: { [key: string]: string };
};

type Action = {
  type: string;
  payload: { [key: string]: any };
};

enum NEW_IMPORTER_STATE {
  NEW = "NEW",
  NEW_UPDATE = "NEW_UPDATE",
  NEW_ADD = "NEW_ADD",
}

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_IMPORTER":
      return {
        ...state,
        errors: { ...state.errors, importerName: "" },
        importer: {
          importerId: action.payload.importerId,
          importerName: action.payload.importerName,
          importType: action.payload.importerType,
        },
      };
    case "currency":
      return { ...state, errors: { ...state.errors, currency: "" }, currency: action.payload.currency };

    case "amount":
      return { ...state, errors: { ...state.errors, amount: "" }, amount: action.payload.amount };
    case "dueDate":
      return { ...state, errors: { ...state.errors, dueDate: "" }, dueDate: action.payload.dueDate };
    case "raisedDate":
      return { ...state, errors: { ...state.errors, raisedDate: "" }, raisedDate: action.payload.raisedDate };
    case "exporterSystemInvoiceId":
      return {
        ...state,
        errors: { ...state.errors, exporterSystemInvoiceId: "" },
        exporterSystemInvoiceId: action.payload.exporterSystemInvoiceId,
      };
    case "importerCountry":
      return {
        ...state,
        errors: { ...state.errors, importerCountry: "" },
        importerCountry: action.payload.importerCountry,
      };
    case "SET_ERRORS":
      return { ...state, errors: action.payload.errors };
    default:
      return state;
  }
};

const ParsedDataForm = (props: Props) => {
  const { isMobile } = useMobileDetect();
  const { ocrInvoiceData, file, fileUrl } = props;
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [showRegionalPricingPopup, setShowRegionalPricingPopup] = React.useState(false);
  const importerOptions = props.importerList.map((importer) => ({
    label: importer.businessName,
    value: importer.id,
    importerType: importer.importerType,
  }));
  const analytics = useAnalytics();
  const { onSuccess, setAlert } = useContext(UploadInvoicePopupContext);
  const { fetchInvoiceCount } = useReferralStore();
  const fieldRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  const buttonsRef = useRef<HTMLDivElement | null>(null);

  const { addToast } = useToastMessages();

  const { isVideoKycDone, verifStatus } = useVideoKycStore();

  const { countryList, fetchCountryList } = useCountriesStore();

  // Fetch country list on component mount
  useEffect(() => {
    if (!countryList.length) {
      fetchCountryList();
    }
  }, []);

  // A country that isn't in our list (unrecognized name, mapping gap, etc.) is functionally
  // unusable even though Reducto did extract something -- silently substituting a default here
  // would submit an unreviewed, likely-wrong country. Leaving it blank instead surfaces the
  // existing "Country is required" validation, forcing the exporter to explicitly pick the
  // right one rather than the gap going unnoticed.
  const getRecognizedCountry = (country: string) => {
    const countryNames = countryList.map((c) => c.name);
    return country && countryNames.includes(country) ? country : "";
  };

  const recognizedImporterCountry = getRecognizedCountry(ocrInvoiceData.importerCountry);

  const init: State = {
    importer: {
      importerId: ocrInvoiceData.importerId || NEW_IMPORTER_STATE.NEW,
      importerName: ocrInvoiceData.invoiceRaisedTo?.trim(),
      importType:
        importerOptions.find((option) => option.value === ocrInvoiceData.importerId)?.importerType ||
        ImporterType.ENTITY,
    },
    amount: ocrInvoiceData.amount,
    currency: ocrInvoiceData.currency,
    dueDate: formatDate(ocrInvoiceData.dueDate),
    exporterSystemInvoiceId: ocrInvoiceData.invoiceNumber,
    raisedDate: formatDate(ocrInvoiceData.invoiceRaiseDate),
    importerCountry: recognizedImporterCountry,
    errors: {},
  };

  const isUnableToParse = !(
    R.isTruthy(ocrInvoiceData) &&
    R.isObject(ocrInvoiceData) &&
    Object.keys(ocrInvoiceData).length
  );

  // A country we cannot map to a dropdown option is as unusable as one that was never extracted, so
  // both route to the same panel. Gated on the country list having loaded, since nothing is
  // recognizable before it does and the panel would otherwise flash on for every invoice.
  const isCountryMissing = !isUnableToParse && countryList.length > 0 && !recognizedImporterCountry;
  const [isReuploadPromptAcknowledged, setIsReuploadPromptAcknowledged] = useState(false);

  const { knownNames, isPersonalIdentity } = useExporterKnownNames();
  const isBusinessLegalNameMissing = !isUnableToParse && !ocrInvoiceData.invoiceRaisedBy;
  const isBusinessLegalNameMismatched =
    !isUnableToParse && Boolean(ocrInvoiceData.invoiceRaisedBy) && ocrInvoiceData.flags?.exporterNameMismatch === true;
  const hasBusinessLegalNameIssue = isBusinessLegalNameMissing || isBusinessLegalNameMismatched;

  const isCountryConfidenceLow = !isCountryMissing && ocrInvoiceData.flags?.importerCountryNeedsReview === true;
  const serviceDescriptionReasons =
    !isUnableToParse && ocrInvoiceData.flags?.serviceDescriptionNeedsReview === true
      ? ocrInvoiceData.flags.serviceDescriptionReviewReasons ?? []
      : [];
  const serviceDescriptionVariant = getServiceDescriptionRowVariant(serviceDescriptionReasons);
  const hasServiceDescriptionIssue = serviceDescriptionVariant !== null;
  // Every flagged state lands on the same panel: a low-confidence country is reported as an error
  // just like a missing one, rather than being asked about separately. Nothing blocks submission --
  // "Ignore warnings & proceed" latches the panel away and hands the exporter the normal form,
  // where the country field's own validation still applies.
  const shouldShowReuploadPromptPanel =
    (isCountryMissing || isCountryConfidenceLow || hasBusinessLegalNameIssue || hasServiceDescriptionIssue) &&
    !isReuploadPromptAcknowledged;
  // The panel replaces the default multi-field form with a compact single-issue layout.
  const shouldShowCompactPanel = shouldShowReuploadPromptPanel;

  useEffect(() => {
    props.onCompactPreviewChange?.(shouldShowCompactPanel);
  }, [shouldShowCompactPanel]);

  // confidence_level only has meaning for the country "verify" case (PRD's own field table
  // marks BLN's extract-confidence as "Any" -- BLN is decided by match Yes/No, not confidence).
  // It's omitted for "missing" (nothing was extracted, so there's no confidence to report) and
  // for BLN's "not_matching" (not a confidence-driven decision at all).
  const sharedAnalyticsProperties = {
    platform: isMobile ? "mobile" : "desktop",
    invoice_id: props.unparsedInvoiceId,
    source: props.uploadSource,
  };

  useEffect(() => {
    if (isCountryMissing) {
      analytics.trackAsync(Events.INVOICE_DATA_QUALITY_ISSUE_SHOWN, {
        ...sharedAnalyticsProperties,
        issue_type: "missing",
        field_name: "importer_country",
      });
    } else if (isCountryConfidenceLow) {
      analytics.trackAsync(Events.INVOICE_DATA_QUALITY_ISSUE_SHOWN, {
        ...sharedAnalyticsProperties,
        issue_type: "verify",
        field_name: "importer_country",
        confidence_level: "low",
      });
    }
    if (isBusinessLegalNameMissing) {
      analytics.trackAsync(Events.INVOICE_DATA_QUALITY_ISSUE_SHOWN, {
        ...sharedAnalyticsProperties,
        issue_type: "missing",
        field_name: "business_legal_name",
      });
    } else if (isBusinessLegalNameMismatched) {
      analytics.trackAsync(Events.INVOICE_DATA_QUALITY_ISSUE_SHOWN, {
        ...sharedAnalyticsProperties,
        issue_type: "not_matching",
        field_name: "business_legal_name",
      });
    }
  }, [
    props.unparsedInvoiceId,
    isCountryMissing,
    isCountryConfidenceLow,
    isBusinessLegalNameMissing,
    isBusinessLegalNameMismatched,
  ]);

  useEffect(() => {
    if (!serviceDescriptionVariant) return;
    analytics.trackAsync(Events.INVOICE_DATA_QUALITY_ISSUE_SHOWN, {
      ...sharedAnalyticsProperties,
      issue_type: SERVICE_DESCRIPTION_ISSUE_TYPE[serviceDescriptionVariant],
      field_name: "service_description",
    });
  }, [props.unparsedInvoiceId, serviceDescriptionVariant]);

  useEffect(() => {
    if (isUnableToParse) {
      analytics.trackAsync(Events.UPLOAD_PARSE_FAILURE, {
        manual: true,
      });
    }
  }, [isUnableToParse]);

  const [formState, dispatch] = useReducer(reducer, init);

  // `init` is read only on the first render, which can happen before the async country list lands --
  // re-resolve once it does, or a recognized country stays blank for the rest of the form's life.
  useEffect(() => {
    if (recognizedImporterCountry && recognizedImporterCountry !== formState.importerCountry) {
      dispatch({ type: "importerCountry", payload: { importerCountry: recognizedImporterCountry } });
    }
  }, [recognizedImporterCountry]);

  const renderCurrencyOption = (currencyOption: Option, onOptionClick: (val: any, isDisabled: any) => void) => (
    <CurrencyOption
      currencyOption={currencyOption}
      inputCurrency={formState.currency}
      onCurrencySelect={(value) => onOptionClick(value, false)}
    />
  );
  const currencyOptions: Options = ALL_CURRENCIES.map((currency: string) => ({
    value: currency,
    label: currency,
    customRowRenderer: renderCurrencyOption,
  }));

  const countryOptions: Options = countryList.map((country) => ({
    label: country.name,
    value: country.name,
  }));

  const onImporterSelect = (value: string, option: Option) => {
    dispatch({
      type: "SET_IMPORTER",
      payload: { importerId: option.value, importerName: option.label, ...option },
    });
  };

  const validateForm = () => {
    const error = {} as any;
    if (!formState.importer.importerName) {
      if (isMobile) {
        fieldRefs.current.importerDropdown?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      }
      error.importerName = "Importer name is required";
    }
    if (formState.errors.importerName) {
      if (isMobile) {
        fieldRefs.current.importerDropdown?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      }
      error.importerName = formState.errors.importerName;
    }
    if (!formState.importerCountry) {
      if (isMobile) {
        fieldRefs.current.countryDropdown?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      }
      error.importerCountry = "Country is required";
    }
    if (!formState.amount) {
      if (isMobile) {
        fieldRefs.current.amountInput?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      }
      error.amount = "Amount is required";
    }
    if (!formState.currency) {
      if (isMobile) {
        fieldRefs.current.currencyDropdown?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      }
      error.currency = "Currency is required";
    }
    if (!formState.dueDate) {
      if (isMobile) {
        fieldRefs.current.dueDateInput?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      }
      error.dueDate = "Due date is required";
    }
    if (!formState.exporterSystemInvoiceId) {
      if (isMobile) {
        fieldRefs.current.invoiceNumberInput?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      }
      error.exporterSystemInvoiceId = "Invoice number is required";
    }
    if (!formState.raisedDate) {
      if (isMobile) {
        fieldRefs.current.raisedDateInput?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      }
      error.raisedDate = "Raised date is required";
    }

    // Validate raised date is before or equal to due date
    if (formState.raisedDate && formState.dueDate) {
      const raisedDate = new Date(formState.raisedDate);
      const dueDate = new Date(formState.dueDate);
      console.log("raisedDate", raisedDate);
      console.log("dueDate", dueDate);
      if (raisedDate > dueDate) {
        if (isMobile) {
          fieldRefs.current.dueDateInput?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
        }
        error.dueDate = "Due date must be on or after the invoice date. Please update it.";
        analytics.trackAsync(Events.INVOICE_UPLOAD_ERROR, {
          due_date_error: true,
        });
      }
    }

    if (formState.exporterSystemInvoiceId && formState.exporterSystemInvoiceId.length > 30) {
      if (isMobile) {
        fieldRefs.current.invoiceNumberInput?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
      }
      error.exporterSystemInvoiceId = "Invoice number should be less than 30 characters";
      analytics.trackAsync(Events.INVOICE_UPLOAD_ERROR, {
        invoice_number_limit_error: true,
      });
    }

    if (formState.importer.importerName) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(formState.importer.importerName)) {
        if (isMobile) {
          fieldRefs.current.importerDropdown?.scrollIntoView({ block: "center", inline: "center", behavior: "smooth" });
        }
        error.importerName = "Client name can’t be an email. Please enter the name of the client.";
        analytics.trackAsync(Events.INVOICE_CREATION_ERROR, {
          email_name_error: true,
        });
      }
    }

    return error;
  };

  const onInvoiceParseSuccess = (data: ResponseWrapper<string>) => {
    if (data.success) {
      analytics.trackAsync(Events.UPLOAD_SUCCESS, {
        manual: isUnableToParse,
      });
      setIsButtonLoading(false);
      if (!isMobile) {
        addToast({
          type: TOAST_TYPES.SUCCESS,
          body: Locale.invoiceParseSuccess,
          id: "invoice-parse-success",
        });
      }
      onSuccess({ exporterSystemInvoiceId: formState.exporterSystemInvoiceId, invoiceId: data.data });
      setTimeout(() => props.closeIconClick(), 0);
      // Fetching invoice count so that the referral widget is able to reload
      fetchInvoiceCount();
    } else {
      onInvoiceParseError(data);
    }
  };

  const onInvoiceParseError = (error: any) => {
    setIsButtonLoading(false);
    analytics.trackAsync(Events.UPLOAD_PARSE_FAILURE);
    if (error.message === "INVOICE_AMOUNT_LIMIT_EXCEEDED") {
      addToast({
        type: TOAST_TYPES.ERROR,
        body: Locale.invoiceAmountGreaterThan10KException,
        id: "invoice-amount-limit-exceeded",
        time: 10000,
      });
      props.closeIconClick();
    } else if (error.message === "SAME_INVOICE_ERROR") {
      dispatch({
        type: "SET_ERRORS",
        payload: { errors: { exporterSystemInvoiceId: Locale.invoiceNumberAlreadyExists } },
      });
    } else if (error.message === "IMPORTER_PLATFORM_NAME") {
      dispatch({
        type: "SET_ERRORS",
        payload: { errors: { importerName: Locale.importerPlatformNameError } },
      });
      analytics.trackAsync(Events.INVOICE_CREATION_ERROR, {
        platform_name_error: true,
      });
    } else {
      addToast({
        type: TOAST_TYPES.ERROR,
        body: Locale.invoiceParseFailure,
        id: "invoice-parse-failure",
      });
    }
  };

  const onConfirmClick = () => {
    analytics.trackAsync(Events.UPLOAD_INVOICE_CONFIRM);
    setIsButtonLoading(true);
    const error = validateForm();
    if (Object.keys(error).length) {
      setIsButtonLoading(false);
      dispatch({ type: "SET_ERRORS", payload: { errors: error } });
      return;
    }
    // Regional currencies carry a 1% fee, so the pricing must be acknowledged before the invoice is created.
    if (isNicheCurrency(formState.currency)) {
      setIsButtonLoading(false);
      setShowRegionalPricingPopup(true);
      return;
    }
    submitInvoice();
  };

  const submitInvoice = () => {
    const invoiceBody = {
      unparsedInvoiceId: props.unparsedInvoiceId,
      importerId: [NEW_IMPORTER_STATE.NEW, NEW_IMPORTER_STATE.NEW_UPDATE, NEW_IMPORTER_STATE.NEW_ADD].includes(
        formState.importer.importerId as NEW_IMPORTER_STATE
      )
        ? null
        : formState.importer.importerId,
      importerName: formState.importer.importerName,
      importerCountry: formState.importerCountry,
      amount: formState.amount,
      currency: formState.currency,
      dueDate: formState.dueDate,
      exporterSystemInvoiceId: formState.exporterSystemInvoiceId,
      raisedDate: formState.raisedDate,
      source: isMobile ? InvoiceSource.EXPORTER_DASHBOARD_MOBILE : InvoiceSource.EXPORTER_DASHBOARD,
    };
    void beCall({
      path: BE_ROUTES.PARSE_INVOICE,
      method: ALLOWED_METHODS.POST,
      body: invoiceBody,
      onSuccess: onInvoiceParseSuccess,
      onError: onInvoiceParseError,
    });
  };

  const renderClientDetails = () => {
    const importerId = formState.importer.importerId as NEW_IMPORTER_STATE;
    let text;
    if (importerId === NEW_IMPORTER_STATE.NEW) {
      text = Locale.newClient;
    }
    if (importerId === NEW_IMPORTER_STATE.NEW_UPDATE) {
      text = Locale.updatedClient;
    }
    if (importerId === NEW_IMPORTER_STATE.NEW_ADD) {
      text = Locale.addedClient;
    }
    if (!text || !formState.importer.importerName) return null;
    return (
      <div className={"mt-2"}>
        <Typography text={text} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-green-400 "} />
      </div>
    );
  };

  const onClose = () => {
    analytics.trackAsync(Events.UPLOAD_INVOICE_CLOSE_INITIATE);
    // The event carries one field, so precedence is BLN, then country, then service description --
    // BLN is always part of the panel's content and is the harder problem to fix.
    const getCloseAlertIssue = () => {
      if (hasBusinessLegalNameIssue) {
        return {
          field_name: "business_legal_name",
          issue_type: isBusinessLegalNameMismatched ? "not_matching" : "missing",
        };
      }
      if (isCountryMissing || isCountryConfidenceLow) {
        return { field_name: "importer_country", issue_type: isCountryMissing ? "missing" : "verify" };
      }
      if (serviceDescriptionVariant) {
        return {
          field_name: "service_description",
          issue_type: SERVICE_DESCRIPTION_ISSUE_TYPE[serviceDescriptionVariant],
        };
      }
      return null;
    };
    setAlert(true, shouldShowReuploadPromptPanel ? getCloseAlertIssue() : null);
  };

  const onReuploadClick = () => {
    analytics.trackAsync(Events.UPLOAD_INVOICE_ALTERNATE);
    if (props.triggerReupload) {
      props.triggerReupload();
    } else {
      props.setPopupState(POPUP_STATES.UPLOAD);
    }
  };

  // Both panels' "proceed" paths report the same event: the exporter saw the flags and chose to
  // carry on regardless.
  const trackVerificationSelected = () => analytics.trackAsync(Events.INVOICE_VERIFY_VERIFICATION_SELECTED);

  const onReuploadPromptProceed = () => {
    trackVerificationSelected();
    setIsReuploadPromptAcknowledged(true);
  };

  return (
    <div className={"flex-1 flex flex-col justify-between"}>
      {/* Compact panels fill the pane so their footer can pin to the bottom; the form keeps auto height */}
      <div className={classNames({ "flex-1 flex flex-col": shouldShowCompactPanel })}>
        {shouldShowCompactPanel ? null : isMobile ? (
          <div className={"bg-white p-4 flex flex-row items-center gap-4"}>
            <CrossIcon
              onClick={() => {
                setAlert(true);
              }}
            />
            <Typography
              text={Locale.confirmInvDetails}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses={"!font-bold"}
            />
          </div>
        ) : (
          <PopupHeader title={Locale.confirmInvDetails} closeIconClick={onClose} />
        )}
        <div
          className={classNames({
            "pt-4 px-4 pb-[360px] overflow-auto h-[calc(100vh-52px)] border": isMobile && !shouldShowCompactPanel,
            "py-2 bg-white": isMobile && shouldShowCompactPanel,
            // The preview pane already applies p-6; adding padding here would double-inset the panel
            "bg-white flex-1 flex flex-col": !isMobile && shouldShowCompactPanel,
          })}
        >
          {shouldShowReuploadPromptPanel ? (
            <ReuploadPromptPanel
              isMobile={isMobile}
              isCountryMissing={isCountryMissing}
              isCountryConfidenceLow={isCountryConfidenceLow}
              hasBusinessLegalNameIssue={hasBusinessLegalNameIssue}
              serviceDescriptionVariant={serviceDescriptionVariant}
              serviceDescriptionPurposeCode={ocrInvoiceData.flags?.serviceDescriptionPurposeCode ?? null}
              knownNames={knownNames}
              isPersonalIdentity={isPersonalIdentity}
              onReuploadClick={onReuploadClick}
              onCloseClick={onClose}
              onProceedClick={onReuploadPromptProceed}
            />
          ) : (
            <>
              {isUnableToParse && (
                <Notes text={Locale.unableToParseNote} className={classNames(isMobile ? "mb-2.5" : "mb-6")} />
              )}
              {verifStatus === VKYCStatus.NOT_STARTED && !isMobile && (
                <Notes text={Locale.completeVideoKyc} className={"mb-6"} />
              )}
              {isMobile && file && fileUrl ? (
                <a href={fileUrl} target={"_blank"} rel={"noopener noreferrer"}>
                  <div className={"p-4 bg-white mb-2.5 rounded-[8px] flex flex-row items-center gap-2"}>
                    <PdfFileIcon />
                    <Typography
                      text={file.name}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      textClasses={"!font-semibold flex-1"}
                    />
                    <NewPageIcon height={12} width={12} />
                  </div>
                </a>
              ) : null}
              <div
                className={classNames({
                  "p-4 bg-white rounded-[8px]": isMobile,
                })}
                ref={(el) => (fieldRefs.current.importerDropdown = el)}
              >
                <Dropdown
                  searchable={true}
                  leftElement={isMobile ? () => <SearchIcon width={18} height={18} /> : undefined}
                  dropdownLabel={
                    formState.importer.importType === ImporterType.PLATFORM ? Locale.platform : Locale.clientName
                  }
                  options={importerOptions}
                  onSelect={onImporterSelect}
                  isError={!!formState.errors.importerName}
                  footerText={formState.errors.importerName}
                  showSearchIcon={true}
                  addInputTextInOptions={true}
                  initialValue={formState.importer.importerName}
                  selectedValue={formState.importer.importerId || formState.importer.importerName}
                  placeholder={Locale.selectClientName}
                  textInputSize={INPUT_TYPES.SMALL}
                />
                {!formState.errors.importerName && renderClientDetails()}
                <div className={classNames("flex gap-6 my-6", isMobile ? "flex-col" : "flex-row")}>
                  <div ref={(el) => (fieldRefs.current.countryDropdown = el)} className={"flex-1"}>
                    <Dropdown
                      searchable={true}
                      leftElement={isMobile ? () => <SearchIcon width={18} height={18} /> : undefined}
                      isError={!!formState.errors.importerCountry}
                      footerText={formState.errors.importerCountry}
                      showSearchIcon={true}
                      placeholder={Locale.selectOne}
                      dropdownLabel={Locale.clientCountry}
                      selectedValue={formState.importerCountry}
                      initialValue={formState.importerCountry}
                      onSelect={(value) => {
                        dispatch({ type: "importerCountry", payload: { importerCountry: value } });
                        analytics.trackAsync(Events.INVOICE_DROPDOWN_CHANGE, {
                          section: "upload_invoice",
                          field: "country",
                        });
                      }}
                      options={countryOptions}
                      inputTextClass={"w-0"}
                      textInputSize={INPUT_TYPES.SMALL}
                      onKeyDown={(event) => {
                        // @ts-ignore
                        if (event.keyCode === 13) {
                          event.preventDefault();
                          event.stopPropagation();
                        }
                      }}
                    />
                  </div>
                  <div ref={(el) => (fieldRefs.current.invoiceNumberInput = el)} className={"flex-1"}>
                    <TextInput
                      label={Locale.invoiceNumber}
                      value={formState.exporterSystemInvoiceId}
                      isError={!!formState.errors.exporterSystemInvoiceId}
                      footerText={formState.errors.exporterSystemInvoiceId}
                      placeholder={Locale.enterInvoice}
                      onChange={(value: string) =>
                        dispatch({ type: "exporterSystemInvoiceId", payload: { exporterSystemInvoiceId: value } })
                      }
                      size={INPUT_TYPES.SMALL}
                    />
                  </div>
                </div>
                <div className={classNames("flex gap-6", isMobile ? "flex-col" : "flex-row")}>
                  <div ref={(el) => (fieldRefs.current.currencyDropdown = el)} className={"flex-1"}>
                    <CurrencyInput
                      selectedCurrency={formState.currency}
                      onCurrencySelect={(value) => dispatch({ type: "currency", payload: { currency: value } })}
                      className={classNames("!w-full !max-w-full !mr-0 !flex-1")}
                      isError={!!formState.errors.currency}
                      errorMessage={formState.errors.currency}
                      dropdownLabel={Locale.invoiceCurr}
                      currencyList={ALL_CURRENCIES}
                    />
                  </div>
                  <div ref={(el) => (fieldRefs.current.amountInput = el)} className={"flex-1"}>
                    <TextInput
                      label={Locale.invoiceAmount}
                      value={formState.amount}
                      type={"number"}
                      customClass={"w-0"}
                      inputClass={"flex-1"}
                      isError={!!formState.errors.amount}
                      footerText={formState.errors.amount}
                      onChange={(value: string) => dispatch({ type: "amount", payload: { amount: value } })}
                      placeholder={Locale.enterInvoiceAmount}
                      size={INPUT_TYPES.SMALL}
                    />
                  </div>
                </div>
                <div
                  ref={(el) => (fieldRefs.current.raisedDateInput = el)}
                  className={classNames("flex gap-6 my-6", isMobile ? "flex-col" : "flex-row")}
                >
                  <DateSelector
                    label={Locale.invoiceRaisedDate}
                    containerClass={classNames("flex-1", isMobile ? "z-10" : "z-1")}
                    isError={!!formState.errors.raisedDate}
                    footerText={formState.errors.raisedDate}
                    selectedDate={formState.raisedDate?.split("-").reverse().join("/")}
                    onDateSelect={(value: string | null) =>
                      dispatch({ type: "raisedDate", payload: { raisedDate: value } })
                    }
                    placeholder={Locale.dateFormat}
                    isDisabled={false}
                    size={INPUT_TYPES.SMALL}
                    onInputClickParent={() => {
                      if (isMobile) {
                        fieldRefs.current.raisedDateInput?.scrollIntoView({
                          block: "start",
                          inline: "start",
                          behavior: "smooth",
                        });
                      }
                    }}
                  />
                  <div ref={(el) => (fieldRefs.current.dueDateInput = el)} className={"flex-1 z-1"}>
                    <DateSelector
                      label={Locale.invoiceDueDate}
                      containerClass={"flex-1 z-1"}
                      isError={!!formState.errors.dueDate}
                      footerText={formState.errors.dueDate}
                      calendarContainerClass={"right-0"}
                      selectedDate={formState.dueDate?.split("-").reverse().join("/")}
                      onDateSelect={(value: string | null) =>
                        dispatch({ type: "dueDate", payload: { dueDate: value } })
                      }
                      placeholder={Locale.dateFormat}
                      size={INPUT_TYPES.SMALL}
                      isDisabled={false}
                      onInputClickParent={() => {
                        if (isMobile) {
                          fieldRefs.current.dueDateInput?.scrollIntoView({
                            block: "start",
                            inline: "start",
                            behavior: "smooth",
                          });
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      {shouldShowCompactPanel ? null : (
        <>
          <MobileStickyButton
            title={Locale.confirmInvDetails}
            onButtonClick={onConfirmClick}
            isLoading={isButtonLoading}
            secondaryButtonTitle={Locale.reUploadInvoice}
            secondaryButtonOnClick={() => {
              props.setPopupState(POPUP_STATES.UPLOAD);
              analytics.trackAsync(Events.UPLOAD_INVOICE_ALTERNATE);
            }}
          />
          <div
            className={classNames("flex flex-row justify-end gap-x-4", {
              hidden: isMobile,
            })}
            ref={buttonsRef}
          >
            <Button
              title={Locale.reUploadInvoice}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={() => {
                props.setPopupState(POPUP_STATES.UPLOAD);
                analytics.trackAsync(Events.UPLOAD_INVOICE_ALTERNATE);
              }}
            />
            <Button
              title={Locale.confirmButton}
              type={BUTTON_TYPES.PRIMARY}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={onConfirmClick}
              isLoading={isButtonLoading}
            />
          </div>
        </>
      )}
      <UaeAedPricingPopup
        isOpen={showRegionalPricingPopup}
        title={Locale.uaeAedPricingPopup.pricingForRegionalCurrencyPayments}
        accountLabel={Locale.uaeAedPricingPopup.swiftAccountTitle}
        isLoading={isButtonLoading}
        onClose={() => setShowRegionalPricingPopup(false)}
        onGoBack={() => setShowRegionalPricingPopup(false)}
        onAcceptPricing={() => {
          setShowRegionalPricingPopup(false);
          setIsButtonLoading(true);
          submitInvoice();
        }}
      />
    </div>
  );
};

export default ParsedDataForm;
