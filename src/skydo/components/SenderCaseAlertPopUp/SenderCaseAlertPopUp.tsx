import Popup from "../AtomicComponents/Popup";
import Typography from "../AtomicComponents/Typography";
import { TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import ExcalmationIcon from "../Icons/ExcalmationIcon";
import MoneyIcon from "../Icons/MoneyIcon";
import React, {useEffect, useState} from "react";
import SenderCaseAlertDocInput from "./SenderCaseAlertDocInput";
import { SenderAlertDetails } from "../../types";
import Locale from "../../util/locale/en";
import beCall from "../../util/beCall";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import useToastMessages from "../../store/toastMessages";
import { PROOF_SUBMITTED } from "../../constants/customeEvents";
import SenderCaseAlertLinkInput from "./SenderCaseAlertLinkInput";
import Notes from "../AtomicComponents/Notes";
import useAnalytics from "../../analytics/useAnalytics";
import {Events} from "../../analytics/EventConstants";
import BE_ROUTES from "../../util/beRoutes";

interface Props {
  closePopUp: () => void;
  importerName: string;
  amountString: string;
  receivedOnString: string;
  senderAlertDetails: SenderAlertDetails;
}

const SenderCaseAlertPopUp = (props: Props) => {
  const senderAlertDetails = props.senderAlertDetails;
  const senderName = senderAlertDetails?.senderName || "";
  const proofType = senderAlertDetails?.proofType || "DOC";
  const proofContent = senderAlertDetails?.proofContent || "";
  const proofSampleUrl = senderAlertDetails?.proofSampleUrl;
  const proofTutorialUrl = senderAlertDetails?.proofTutorialUrl;
  const { addToast } = useToastMessages();
  const analytics = useAnalytics();


  const renderLeftTopInfoBox = (key: string, value: string) => {
    return (
      <div className={"flex flex-col space-y-2 my-4"}>
        <Typography
          text={key}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500"}
          fontWeight={"600"}
        />
        <Typography text={value} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
    );
  };

  const renderLeftBottomInfoBox = (key: string, value: string) => {
    return (
      <div className={"flex flex-col space-y-2 my-4"}>
        <Typography
          text={key}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500"}
          fontWeight={"600"}
        />
        <Typography text={value} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} fontWeight={"600"} />
      </div>
    );
  };

  const onSubmitDocsSuccess = () => {
    document.dispatchEvent(new Event(PROOF_SUBMITTED));
    addToast({
      type: TOAST_TYPES.SUCCESS,
      id: "submit_proof_success",
      body: "Proof submitted successfully",
    });
    props.closePopUp();
  };

  const onSubmitDocsFail = () => {
    addToast({
      type: TOAST_TYPES.ERROR,
      id: "submit_proof_error",
      body: Locale.wentWrongMessage,
    });
    props.closePopUp();
  };

  const onSubmitDocs = (files?: File[], text?: string) => {
    const formData = new FormData();
    if (!files && !text) return;
    files?.forEach((file) => {
      formData.append("proofDocs", file);
    });

    // files && formData.append("proofDocs", files);
    text && formData.append("proofLink", text);
    formData.append("caseId", String(senderAlertDetails.caseId));
    beCall({
      url: "/api/route/file",
      path: BE_ROUTES.SUBMIT_PROOF_FOR_SENDER_CASE,
      method: ALLOWED_METHODS.POST,
      body: formData,
      onSuccess: onSubmitDocsSuccess,
      onError: onSubmitDocsFail,
    });
    analytics.trackAsync(Events.TM_DOCUMENT_SUBMITTED, {
      docType: "TM"
    });
  };

  const renderContent = () => {
    return (
      <div className={"flex flex-col h-full"}>
        <Notes
          text={Locale.senderAlertRBI}
          typographySize={TYPOGRAPHY_SIZES.SMALL}
          iconHeight={24}
          iconWidth={24}
          className={"bg-yellow-100 border-yellow-200 border-[1px]"}
        />
        <div className={"flex flex-row mt-6 space-x-4 flex-grow"}>
          <div className={"flex flex-col border border-black-400 rounded-10px flex-1 p-6"}>
            <div className={"flex flex-row space-x-2 items-center mb-4"}>
              <MoneyIcon />
              <Typography text={Locale.paymentDetails} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} />
            </div>
            {renderLeftTopInfoBox("Payer name", senderName)}
            {renderLeftTopInfoBox("Client name", props.importerName)}
            <div className="border-t border-black-400 my-4"></div>
            {renderLeftBottomInfoBox("Total received amount", props.amountString)}
            {renderLeftBottomInfoBox("Received on", props.receivedOnString)}
          </div>
          {/*Left and Right Divide*/}
          <div className={"flex flex-col items-center justify-start flex-1"}>
            <div className={"flex flex-col space-y-2 items-center text-center pt-6"}>
              <Typography
                text={Locale.documentRequired}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500"}
                fontWeight={"600"}
              />
              <Typography text={proofContent} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
            </div>
            {(proofSampleUrl || proofTutorialUrl) && (
              <div className={"flex flex-row space-x-1 items-center mb-4 cursor-pointer"}>
                {proofSampleUrl &&
                  <Typography
                    text={Locale.viewSample}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-blue-400"}
                    fontWeight={"600"}
                    onTextClick={() => {
                      window.open(proofSampleUrl, "_blank", "noopener noreferrer");
                      analytics.trackAsync(Events.TM_VIEW_SAMPLE_CLICKED, {
                        source: proofContent
                      });
                    }}
                  />
                }
                {proofSampleUrl && proofTutorialUrl && <div className={"text-blue-500"}>|</div>}
                {proofTutorialUrl &&
                  <Typography
                    text={Locale.whereToFindThis}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-blue-400"}
                    fontWeight={"600"}
                    onTextClick={() => {
                      window.open(proofTutorialUrl, "_blank", "noopener noreferrer");
                      analytics.trackAsync(Events.TM_WHERE_TO_FIND_THIS_CLICKED, {
                        source: proofContent
                      });
                    }}
                  />
                }
              </div>
            )}
            {proofType == "DOC" ? (
              <SenderCaseAlertDocInput onSubmitDocs={onSubmitDocs} />
            ) : proofType == "DOC_OR_URL" ? (
              <div className="w-full space-y-4">
                <SenderCaseAlertLinkInput onSubmitDocs={onSubmitDocs} hideSubmit={true}/>
                <div className="flex items-center justify-center w-full px-4">
                  <div className="border-[1px] border-black-400 my-4 w-full"></div>
                  <Typography text={"OR"} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-600 mx-4"} />
                  <div className="border-[1px] border-black-400 my-4 w-full"></div>
                </div>
                <SenderCaseAlertDocInput onSubmitDocs={onSubmitDocs} />
              </div>
            ) : (
              <SenderCaseAlertLinkInput onSubmitDocs={onSubmitDocs} />
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <Popup
      title={Locale.documentRequiredToProcessPayment}
      isCommonHeader={true}
      renderContent={renderContent}
      open={true}
      containerClass={"h-[80%] flex flex-col !p-6"}
      closeIconClick={props.closePopUp}
      isLargePopup={true}
      outsideClick={props.closePopUp}
    />
  );
};

export default SenderCaseAlertPopUp;
