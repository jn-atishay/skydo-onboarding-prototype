import { popupStateType } from "./constants";
import PopupHeader from "../AtomicComponents/Popup/PopupHeader";
import Locale from "../../util/locale/en";
import Typography from "../AtomicComponents/Typography";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TOOLTIP_POSITION,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import Dropdown from "../AtomicComponents/Dropdown";
import React, { useCallback, useContext, useEffect, useRef, useState } from "react";
import Router from "next/router";
import Button from "../AtomicComponents/Button";
import CheckBox from "../AtomicComponents/CheckBox";
import beCall from "../../util/beCall";
import useToastMessages from "../../store/toastMessages";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { PurposeCode, PurposeCodeList } from "../../types";
import { UserDetailsContext } from "../DashboardContainer";
import { PURPOSE_CODE_UPDATE_EVENT } from "../../constants/customeEvents";
import useAnalytics, { Analytics } from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { TextInputRef } from "../../types/atomicComponentTypes";
import PurposeCodeFollowUpQuestions from "./PurposeCodeFollowUpQuestions";
import AmazonPurposeCodePopup from "./AmazonPurposeCodePopup";
import DefaultPurposeCodeSelector from "./DefaultPurposeCodeSelector";
import Tooltip from "../AtomicComponents/Tooltip";
import InformationIcon from "../Icons/InformationIcon";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import useExporterAndExporterUserStore from "../../store/useExporterAndExporterUserStore";
import DefaultPurposeCodeSoftex from "./DefaultPurposeCodeSoftex";
import PurposeCodeSelectorTrigger from "./PurposeCodeSelectorTrigger";
import { SOFTEX_COMPLIANT_PURPOSE_CODE, SOFTEX_PURPOSE_CODES } from "../../constants/purposeCodeConstants";
import usePurposeCodeList from "../../store/usePurposeCodeList";
import useDocInputStore from "../../store/useDocInputStore";

interface Props extends BodyProps {
  onClosePopup: (isRefreshRequired?: boolean, isSubmit?: boolean) => void;
  defaultPC: string;
  onSubmitClick?: (isRemove: boolean, changeDefaultPC: boolean) => Promise<void>;
  setPopupState: (state: string) => void;
  isEdit?: boolean;
  exporterSystemInvoiceId: string;
  invoiceId: string;
  isSubmitDisabled?: boolean;
  isAmazon?: boolean;
  /** When backend has shippingMethod (e.g. CSB5), pre-select it in Amazon popup */
  defaultShippingMethod?: string;
}

interface BodyProps {
  popupState: string;
  purposeCodeOption?: PurposeCodeList;
  onPCSelect?: (value: any) => void;
  selectedPC?: string;
  isButtonLoading?: boolean;
  isSystemGeneratedInvoice?: boolean;
  dropDownError?: boolean;
  arePurposeCodesLoading?: boolean;
  purposeCodesLoadFailed?: boolean;
  onRetryPurposeCodes?: () => void;
}

const isConfirmationPopup = (state: string) =>
  popupStateType.REMOVE_DEFAULT === state || popupStateType.SKIP_DEFAULT === state;

const isInvoicePopup = (state: string): boolean =>
  [popupStateType.ADD_PC_INVOICE, popupStateType.EDIT_PC_INVOICE].includes(state);

const PopupBody = (props: BodyProps) => {
  const { popupState, purposeCodeOption = [], onPCSelect, selectedPC, isSystemGeneratedInvoice } = props;
  const isFirstTime = useRef(true);
  const getBodyText = () => {
    if (isConfirmationPopup(popupState) || isInvoicePopup(popupState)) {
      if (isSystemGeneratedInvoice) {
        return Locale.pcGuidelineConfirmationForPayment;
      } else {
        return Locale.pcGuidelineConfirmation;
      }
    }
    if (isSystemGeneratedInvoice) {
      return Locale.pcGuidelineForPayment;
    }
    return Locale.pcGuideline;
  };

  const onDropdownLoad = (inputElement: TextInputRef | null) => {
    if (isFirstTime.current) {
      inputElement?.focus();
      isFirstTime.current = false;
      return;
    }
  };

  return (
    <div className={"flex flex-col mb-6"}>
      <Typography text={getBodyText()} size={TYPOGRAPHY_SIZES.SMALL} />
      {isConfirmationPopup(popupState) ? null : (
        <div className={"mt-6"}>
          <Dropdown
            searchable={true}
            options={purposeCodeOption.map((option: PurposeCode) => ({
              label: option.code,
              value: option.code,
              subText: option.description,
            }))}
            onSelect={onPCSelect as (value: any, option: any) => void}
            selectedValue={selectedPC}
            placeholder={Locale.selectPC}
            showAllOptionsInit={true}
            onLoadCallback={onDropdownLoad}
            showSubtext={true}
            inputTextClass={"truncate"}
            isError={props.dropDownError}
          />
        </div>
      )}
    </div>
  );
};

const CTAs = (props: { children: React.ReactElement | React.ReactElement[] }): JSX.Element => {
  return <div className={"flex flex-row justify-end items-center gap-x-2"}>{props.children}</div>;
};

const AddDefaultPC = (props: Props) => {
  const analytics = useAnalytics();
  const [overrideCta, setOverrideCta] = useState<boolean>(false);
  const [dropDownError, setDropDownError] = useState<boolean>(false);
  const [fileForSoftex, setFileForSoftex] = useState<boolean | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(!props.isEdit);
  const [iec, setIec] = useState<string>("");
  const [iecError, setIecError] = useState<string>("");
  const [isIecLoading, setIsIecLoading] = useState<boolean>(false);
  // Invalidates an in-flight IEC verification when the user changes the selection,
  // reopens the selector, answers differently, edits the IEC, or closes the popup —
  // otherwise the stale async callback could submit a purpose code the user has moved
  // away from. Closing always happens via a route change (including outside-click,
  // which bypasses this component's own close handler), so routeChangeStart is the
  // synchronous hook that covers every close path before unmount.
  const iecSubmitEpochRef = useRef(0);
  const invalidatePendingIecSubmit = () => {
    iecSubmitEpochRef.current += 1;
    // Restore interactivity immediately; the invalidated request is barred from
    // touching the loading flag when it eventually settles (it may hang for long).
    setIsIecLoading(false);
  };
  useEffect(() => {
    Router.events.on("routeChangeStart", invalidatePendingIecSubmit);
    return () => {
      Router.events.off("routeChangeStart", invalidatePendingIecSubmit);
      invalidatePendingIecSubmit();
    };
  }, []);
  const { addToast } = useToastMessages();
  const { exporter } = useExporterAndExporterUserStore();
  const { iecVerified } = usePurposeCodeList();
  const { verifyIec } = useDocInputStore();
  const selectedPurposeCode = props.purposeCodeOption?.find((option) => option.code === props.selectedPC);
  const isSoftexCompliantCode = props.selectedPC === SOFTEX_COMPLIANT_PURPOSE_CODE;
  const requiresSoftexFollowUp = SOFTEX_PURPOSE_CODES.includes(props.selectedPC || "");
  const closePopup = () => {
    invalidatePendingIecSubmit();
    props.onClosePopup();
  };
  const onCloseKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      closePopup();
    }
  };

  if ([popupStateType.DEFAULT, popupStateType.EDIT_DEFAULT].includes(props.popupState)) {
    const showErrorToast = (body: string) => {
      addToast({ type: TOAST_TYPES.ERROR, id: "pc_change_error", body });
    };

    const onDefaultPurposeCodeSubmit = async () => {
      if (!props.selectedPC) {
        setDropDownError(true);
        analytics.trackAsync(Events.PURPOSE_CODE_ERROR, { error: "purpose_code_not_selected" });
        showErrorToast(Locale.purposeCodeRequiredError);
        return;
      }

      if (!requiresSoftexFollowUp) {
        props.onSubmitClick?.(false, false);
        return;
      }

      if (fileForSoftex === null) {
        analytics.trackAsync(Events.PURPOSE_CODE_ERROR, { error: "file_for_softex_not_selected" });
        showErrorToast(Locale.pleaseSelectAnOption);
        return;
      }

      const hasSoftexMismatch = isSoftexCompliantCode ? !fileForSoftex : fileForSoftex;
      if (hasSoftexMismatch) {
        setDropDownError(true);
        analytics.trackAsync(Events.PURPOSE_CODE_ERROR, {
          error: "purpose_code_softex_mismatch",
          purposeCode: props.selectedPC,
          fileForSoftex,
        });
        showErrorToast(isSoftexCompliantCode ? Locale.softexNotFiledError : Locale.softexPurposeCodeError);
        return;
      }

      if (isSoftexCompliantCode && fileForSoftex && !iecVerified) {
        if (!iec.trim()) {
          analytics.trackAsync(Events.PURPOSE_CODE_ERROR, { error: "iec_not_entered" });
          setIecError(Locale.iecRequired);
          return;
        }

        const submitEpoch = iecSubmitEpochRef.current;
        setIsIecLoading(true);
        const response = await verifyIec(iec.trim());
        if (submitEpoch !== iecSubmitEpochRef.current) return;
        setIsIecLoading(false);
        if (!response.success || !response.data) {
          analytics.trackAsync(Events.PURPOSE_CODE_ERROR, { error: "iec_not_valid" });
          setIecError(Locale.iecValidation);
          return;
        }
      }

      props.onSubmitClick?.(false, false);
    };

    return (
      <div className={"overflow-hidden rounded-10px"}>
        <div className={"bg-neutral-50 px-6 pb-5 pt-6"}>
          <div className={"flex items-center justify-between"}>
            <div className={"flex items-center gap-2"}>
              <Typography
                text={props.isEdit ? Locale.changeDefaultPC : Locale.setDefaultPC}
                type={TYPOGRAPHY_TYPES.HEADING}
                size={TYPOGRAPHY_SIZES.X_SMALL}
              />
              <Tooltip
                tooltipText={<div className={"w-56 text-left"}>{Locale.purposeCodeInfoTooltip}</div>}
                position={TOOLTIP_POSITION.TOP}
                tooltipTheme={"dark"}
              >
                <InformationIcon />
              </Tooltip>
            </div>
            <div
              role={"button"}
              aria-label={Locale.close}
              tabIndex={0}
              className={"cursor-pointer focus:outline-none"}
              onClick={closePopup}
              onKeyDown={onCloseKeyDown}
            >
              <CrossIcon width={24} height={24} />
            </div>
          </div>
          <Typography
            text={Locale.defaultPCDescription}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"mt-2 !text-neutral-500"}
          />
        </div>

        <div className={"bg-neutral-50 px-6 pb-4"}>
          {!isSelectorOpen && requiresSoftexFollowUp && selectedPurposeCode ? (
            <DefaultPurposeCodeSoftex
              purposeCode={selectedPurposeCode}
              fileForSoftex={fileForSoftex}
              isError={dropDownError}
              showFollowUp={requiresSoftexFollowUp}
              warningText={
                isSoftexCompliantCode && fileForSoftex === false
                  ? Locale.softexNotFiledWarning
                  : !isSoftexCompliantCode && fileForSoftex === true
                  ? Locale.softexPurposeCodeWarning
                  : undefined
              }
              showIecInput={isSoftexCompliantCode && fileForSoftex === true && !iecVerified}
              iec={iec}
              iecError={iecError}
              onChangePurposeCode={() => {
                invalidatePendingIecSubmit();
                setIsSelectorOpen(true);
              }}
              onFileForSoftexChange={(value) => {
                analytics.trackAsync(Events.SOFTEX_FILING_ANSWER_SELECTED, { filingAnswer: value });
                invalidatePendingIecSubmit();
                setFileForSoftex(value);
                setDropDownError(isSoftexCompliantCode ? !value : value);
                setIecError("");
              }}
              onIecChange={(value) => {
                invalidatePendingIecSubmit();
                setIec(value);
                setIecError("");
              }}
            />
          ) : !isSelectorOpen ? (
            <PurposeCodeSelectorTrigger
              purposeCode={selectedPurposeCode}
              isError={dropDownError}
              onClick={() => setIsSelectorOpen(true)}
            />
          ) : (
            <DefaultPurposeCodeSelector
              currentIndustryId={exporter?.selectedExporterIndustry?.industryId}
              purposeCodeOption={props.purposeCodeOption}
              selectedPC={props.selectedPC}
              onPCSelect={(value) => {
                invalidatePendingIecSubmit();
                setDropDownError(false);
                setFileForSoftex(null);
                setIec("");
                setIecError("");
                setIsSelectorOpen(false);
                props.onPCSelect?.(value);
              }}
              onClose={() => setIsSelectorOpen(false)}
              isError={dropDownError}
              isLoading={props.arePurposeCodesLoading}
              hasLoadError={props.purposeCodesLoadFailed}
              onRetryLoad={props.onRetryPurposeCodes}
            />
          )}
        </div>

        <div className={"flex flex-col gap-4 border-t border-neutral-100 bg-white px-6 pb-6 pt-5"}>
          <CTAs>
            <Button
              title={Locale.doItLater}
              onButtonClick={() => {
                if (!props.isEdit) analytics.trackAsync(Events.SKIP_DEFAULT_PC_CLICK);
                closePopup();
              }}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
            />
            <Button
              title={Locale.submit}
              isDisabled={!!props.isEdit && props.isSubmitDisabled}
              onButtonClick={onDefaultPurposeCodeSubmit}
              size={BUTTON_SIZES.SMALL}
              isLoading={props.isButtonLoading || isIecLoading}
            />
          </CTAs>
          <div className={"flex items-center justify-center gap-1.5"}>
            <Typography
              text={Locale.purposeCodeSupportPrompt}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-neutral-500"}
            />
            <Typography
              text={Locale.purposeCodeSupportNumber}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PopupHeader
        title={props.isEdit ? Locale.changeDefaultPC : Locale.addDefaultPC}
        closeIconClick={() => props.onClosePopup()}
      />
      <PopupBody
        popupState={props.popupState}
        onPCSelect={(value) => {
          setDropDownError(false);
          props.onPCSelect?.(value);
        }}
        purposeCodeOption={props.purposeCodeOption}
        selectedPC={props.selectedPC}
        dropDownError={dropDownError}
      />
      {props.isSubmitDisabled ? null : (
        <PurposeCodeFollowUpQuestions
          purposeCode={props.selectedPC || ""}
          setOverrideCta={setOverrideCta}
          setDropDownError={setDropDownError}
          onSubmitClick={() => {
            props.onSubmitClick?.(false, false);
          }}
          isSubmitLoading={props.isButtonLoading || false}
        />
      )}
      {overrideCta && !props.isSubmitDisabled ? null : (
        <CTAs>
          <Button
            title={props.isEdit ? Locale.removePC : Locale.skip}
            onButtonClick={() => {
              props.setPopupState(props.isEdit ? popupStateType.REMOVE_DEFAULT : popupStateType.SKIP_DEFAULT);
              analytics?.trackAsync(props.isEdit ? Events.REMOVE_DEFAULT_PC_CLICK : Events.SKIP_DEFAULT_PC_CLICK);
            }}
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.SMALL}
          />
          <Button
            title={Locale.submit}
            isDisabled={props.isSubmitDisabled}
            // @ts-ignore
            onButtonClick={() => props.onSubmitClick()}
            size={BUTTON_SIZES.SMALL}
            isLoading={props.isButtonLoading}
          />
        </CTAs>
      )}
    </div>
  );
};

const SkipDefaultPC = (props: Props) => {
  const analytics = useAnalytics();
  return (
    <>
      <PopupHeader title={Locale.areYouSure} closeIconClick={() => props.onClosePopup()} />
      <PopupBody popupState={props.popupState} />
      <CTAs>
        <Button
          title={Locale.undo}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={() => {
            props.setPopupState(popupStateType.DEFAULT);
            analytics?.trackAsync(Events.UNDO_SKIP_DEFAULT_CLICK);
          }}
        />
        <Button
          title={Locale.confirmSkip}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={() => props.onClosePopup()}
          isRedButton={true}
        />
      </CTAs>
    </>
  );
};

const RemoveDefaultPC = (props: Props) => {
  return (
    <>
      <PopupHeader title={Locale.areYouSure} closeIconClick={() => props.onClosePopup()} />
      <PopupBody popupState={props.popupState} />
      <CTAs>
        <Button
          title={Locale.undo}
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.SMALL}
          onButtonClick={() => props.setPopupState(popupStateType.EDIT_DEFAULT)}
        />
        <Button
          title={Locale.remove}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.SMALL}
          // @ts-ignore
          onButtonClick={() => props.onSubmitClick(true)}
          isRedButton={true}
          isLoading={props.isButtonLoading}
        />
      </CTAs>
    </>
  );
};

const AddPCInvoice = (props: Props): JSX.Element => {
  const analytics = useAnalytics();
  const [changeDefaultPC, setDefaultPCChange] = useState<boolean>(false);
  const [isSelectorOpen, setIsSelectorOpen] = useState<boolean>(true);
  const [dropDownError, setDropDownError] = useState<boolean>(false);
  const { addToast } = useToastMessages();
  const { exporter } = useExporterAndExporterUserStore();
  const selectedPurposeCode = props.purposeCodeOption?.find((option) => option.code === props.selectedPC);

  const title = props.isSystemGeneratedInvoice
    ? Locale.setPCForPayment
    : Locale.setPCForInvoice.replace(":exporterSystemInvoiceId", String(props.exporterSystemInvoiceId || ""));

  const closePopup = () => props.onClosePopup();
  const onCloseKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      closePopup();
    }
  };

  const onSubmit = () => {
    if (!props.selectedPC) {
      setDropDownError(true);
      setIsSelectorOpen(true);
      analytics.trackAsync(Events.PURPOSE_CODE_ERROR, { error: "purpose_code_not_selected" });
      addToast({ type: TOAST_TYPES.ERROR, id: "pc_change_error", body: Locale.purposeCodeRequiredError });
      return;
    }
    props.onSubmitClick?.(false, changeDefaultPC);
  };

  return (
    <div className={"overflow-hidden rounded-10px"}>
      <div className={"bg-neutral-50 px-6 pb-5 pt-6"}>
        <div className={"flex items-center justify-between"}>
          <Typography text={title} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
          <div
            role={"button"}
            aria-label={Locale.close}
            tabIndex={0}
            className={"cursor-pointer focus:outline-none"}
            onClick={closePopup}
            onKeyDown={onCloseKeyDown}
          >
            <CrossIcon width={24} height={24} />
          </div>
        </div>
        <Typography
          text={
            props.isSystemGeneratedInvoice ? Locale.paymentPurposeCodeDescription : Locale.invoicePurposeCodeDescription
          }
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"mt-2 !text-neutral-500"}
        />
      </div>

      <div className={"flex flex-col gap-3 bg-neutral-50 px-6 pb-5"}>
        {isSelectorOpen ? (
          <DefaultPurposeCodeSelector
            currentIndustryId={exporter?.selectedExporterIndustry?.industryId}
            purposeCodeOption={props.purposeCodeOption}
            selectedPC={props.selectedPC}
            onPCSelect={(value) => {
              setDropDownError(false);
              setIsSelectorOpen(false);
              props.onPCSelect?.(value);
            }}
            onClose={() => setIsSelectorOpen(false)}
            isError={dropDownError}
            isLoading={props.arePurposeCodesLoading}
            hasLoadError={props.purposeCodesLoadFailed}
            onRetryLoad={props.onRetryPurposeCodes}
          />
        ) : (
          <PurposeCodeSelectorTrigger
            purposeCode={selectedPurposeCode}
            isError={dropDownError}
            onClick={() => setIsSelectorOpen(true)}
          />
        )}

        {props.selectedPC && props.selectedPC !== props.defaultPC ? (
          <CheckBox
            label={
              props.isSystemGeneratedInvoice
                ? Locale.applyInvoicePCtoDefaultInvocieLess
                : Locale.applyInvoicePCtoDefault
            }
            checked={changeDefaultPC}
            onCheckboxClick={() => setDefaultPCChange((isChecked) => !isChecked)}
            checkboxClass={"!h-4 !w-4 cursor-pointer"}
          />
        ) : null}
      </div>

      <div className={"flex flex-col gap-4 border-t border-neutral-100 bg-white px-6 pb-6 pt-5"}>
        <CTAs>
          <Button
            title={Locale.doItLater}
            onButtonClick={closePopup}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
          />
          <Button
            title={Locale.submit}
            onButtonClick={onSubmit}
            size={BUTTON_SIZES.SMALL}
            isLoading={props.isButtonLoading}
          />
        </CTAs>
        <div className={"flex items-center justify-center gap-1.5"}>
          <Typography
            text={Locale.purposeCodeSupportPrompt}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-neutral-500"}
          />
          <Typography
            text={Locale.purposeCodeSupportNumber}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
        </div>
      </div>
    </div>
  );
};

const getBePathToSavePC = (
  state: string,
  isRemove: boolean,
  selectedPC: string,
  analytics: Analytics,
  changeDefaultPC: boolean
) => {
  if (isRemove) {
    analytics?.trackAsync(Events.REMOVE_PC_CONFIRM);
    return {
      path: BE_ROUTES.DELETE_DEFAULT_PC,
      method: ALLOWED_METHODS.DELETE,
    };
  }
  if (isInvoicePopup(state)) {
    analytics?.trackAsync(Events.SAVE_PC_FOR_INVOICE, { isDefaultChangeApplied: changeDefaultPC });
    return {
      path: BE_ROUTES.INVOICE_SPECIFIC_PC,
      method: ALLOWED_METHODS.POST,
    };
  }
  analytics?.trackAsync(Events.SUBMIT_DEFAULT_PC);
  return {
    path: BE_ROUTES.CHANGE_DEFAULT_PC.replace(":selectedPC", selectedPC),
    method: ALLOWED_METHODS.POST,
  };
};

const PurposeCodePopup = (props: Props) => {
  const { popupState, defaultPC, isSystemGeneratedInvoice, isAmazon, invoiceId, onClosePopup } = props;
  const [selectedPC, setSelectedPC] = useState<string>(defaultPC);
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const { refetchUserDetails } = useContext(UserDetailsContext);
  const [isButtonLoading, setButtonLoading] = useState<boolean>(false);

  const analytics = useAnalytics();

  const onPCSelect = useCallback(
    (value: string) => {
      if (!!value) {
        analytics.trackAsync(Events.PURPOSE_CODE_SELECTED, {
          purposeCode: value,
        });
      }
      setSelectedPC(value);
    },
    [analytics]
  );

  const isPCChange = () => [popupStateType.EDIT_PC_INVOICE, popupStateType.EDIT_DEFAULT].includes(popupState);

  const onSubmitClick = useCallback(
    async (isRemove: boolean, changeDefaultPC: boolean, shippingMethodArg?: string, purposeCodeOverride?: string) => {
      const pcToUse = purposeCodeOverride ?? selectedPC;
      const config = getBePathToSavePC(popupState, isRemove, pcToUse, analytics, changeDefaultPC);
      setButtonLoading(true);
      try {
        const resposne = await beCall({
          path: config.path,
          method: config.method,
          body: {
            ...(isInvoicePopup(popupState)
              ? {
                  code: pcToUse,
                  invoiceId,
                  updateDefault: changeDefaultPC,
                }
              : {}),
            ...(!!shippingMethodArg ? { shippingMethod: shippingMethodArg } : {}),
          },
        });
        if (resposne.success) {
          addToast({
            type: TOAST_TYPES.SUCCESS,
            id: "pc_add_success",
            body: isRemove ? Locale.pcRemovedSucces : isPCChange() ? Locale.pcChangedSuccess : Locale.pcAddedSuccess,
          });
          refetchUserDetails();
          onClosePopup(true, true);
          const event = new Event(PURPOSE_CODE_UPDATE_EVENT);
          document.dispatchEvent(event);
        } else {
          throw resposne;
        }
      } catch (e: any) {
        onClosePopup(undefined, true);
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "pc_change_error",
          body: e.message === "NOT_ALLOWED" ? Locale.notAllowedPCChange : Locale.wentWrongMessage,
          time: e.message === "NOT_ALLOWED" ? 7000 : 5000,
        });
      } finally {
        setButtonLoading(false);
      }
    },
    [selectedPC, popupState, analytics, addToast, refetchUserDetails, invoiceId, onClosePopup]
  );

  // Show Amazon popup for ALL states if user is Amazon
  if (isAmazon) {
    const isFromProfile = [popupStateType.EDIT_DEFAULT].includes(popupState);
    return (
      <div className="!m-[-24px]">
        <AmazonPurposeCodePopup
          onClosePopup={() => onClosePopup()}
          onSubmitClick={(shippingMethodArg, applyToAllFuture) =>
            onSubmitClick(false, applyToAllFuture || false, shippingMethodArg)
          }
          onPCSelect={onPCSelect}
          isButtonLoading={isButtonLoading}
          selectedPurposeCode={selectedPC}
          purposeCodeOption={props.purposeCodeOption}
          isFromProfile={isFromProfile}
          defaultShippingMethod={props.defaultShippingMethod}
        />
      </div>
    );
  }

  // Regular popups for non-Amazon users
  if (!isAmazon &&  popupStateType.DEFAULT === popupState) {
    return (
      <AddDefaultPC
        {...props}
        onPCSelect={onPCSelect}
        selectedPC={selectedPC}
        onSubmitClick={onSubmitClick}
        isButtonLoading={isButtonLoading}
        isSubmitDisabled={defaultPC === selectedPC || !selectedPC}
      />
    );
  }

  if (!isAmazon &&  popupStateType.SKIP_DEFAULT === popupState) {
    return <SkipDefaultPC {...props} />;
  }

  if (!isAmazon &&  popupStateType.EDIT_DEFAULT === popupState) {
    return (
      <AddDefaultPC
        {...props}
        onPCSelect={onPCSelect}
        selectedPC={selectedPC}
        isEdit={true}
        onSubmitClick={onSubmitClick}
        isButtonLoading={isButtonLoading}
        isSubmitDisabled={defaultPC === selectedPC || !selectedPC}
      />
    );
  }

  if (!isAmazon &&  popupStateType.REMOVE_DEFAULT === popupState) {
    return <RemoveDefaultPC {...props} onSubmitClick={onSubmitClick} isButtonLoading={isButtonLoading} />;
  }

  if (!isAmazon &&  popupStateType.ADD_PC_INVOICE === popupState) {
    return (
      <AddPCInvoice
        {...props}
        onPCSelect={onPCSelect}
        selectedPC={selectedPC}
        onSubmitClick={onSubmitClick}
        isButtonLoading={isButtonLoading}
        isSubmitDisabled={defaultPC === selectedPC || !selectedPC}
        isSystemGeneratedInvoice={isSystemGeneratedInvoice}
      />
    );
  }

  if (!isAmazon &&  popupStateType.EDIT_PC_INVOICE === popupState) {
    return (
      <AddPCInvoice
        {...props}
        isEdit={true}
        onPCSelect={onPCSelect}
        selectedPC={selectedPC}
        onSubmitClick={onSubmitClick}
        isButtonLoading={isButtonLoading}
        isSubmitDisabled={defaultPC === selectedPC || !selectedPC}
        isSystemGeneratedInvoice={isSystemGeneratedInvoice}
      />
    );
  }

  return null;
};

export default PurposeCodePopup;
