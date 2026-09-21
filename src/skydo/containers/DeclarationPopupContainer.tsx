/**
 * @author Raj Sheth
 * created: 27/11/23
 */

import React, { FC } from "react";
import useDeclarationStore from "../store/useDeclarationStore";
import useToastMessages from "../store/toastMessages";
import { TOAST_TYPES } from "../constants/atomicConstants";
import Locale from "../util/locale/en";
import DeclarationPopup from "../components/DeclarationPopup/DeclarationPopup";
import { DECLARATION_RESPONSE, SANCTION_CATEGORY } from "../constants/onboarding";
import useOnboardingStore from "../store/useOnboardingStore";
import { ResponseWrapper } from "../authentication/api/AuthApiDto";
import { logApiFailureToSentry } from "../util/sentryLogger";
import BE_ROUTES from "../util/beRoutes";

interface Props {
  businessType: string;
  /** Fired once the declaration is stored, so the caller can release the doc slot it stands in for. */
  onDeclarationAccepted?: () => void;
}

const DeclarationPopupContainer: FC<Props> = (props) => {
  const { postDeclarationBackend, onClosePopup, isSubmitting } = useDeclarationStore();
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const { addToast } = useToastMessages();

  const showFailureToast = () => {
    addToast({
      type: TOAST_TYPES.ERROR,
      id: "be_api_err",
      body: Locale.wentWrongMessage,
    });
  };

  const postDeclaration = () => {
    const declarationDataList = [
      {
        declarationType: SANCTION_CATEGORY.ENTITY_PROOF_DOC_UNAVAILABLE,
        userResponse: DECLARATION_RESPONSE.YES,
      },
    ];
    void postDeclarationBackend({
      declarationDataList,
      // beCall resolves onSuccess for any 2xx without inspecting the payload, so a `success: false`
      // body would otherwise release the second-doc submit gate with no declaration on record.
      onSuccess: (resp: ResponseWrapper<unknown>) => {
        if (!resp?.success) {
          logApiFailureToSentry(
            "DeclarationPopupContainer.tsx",
            BE_ROUTES.CAPTURE_SOLE_PROP_DECLARATION,
            declarationDataList,
            resp
          );
          showFailureToast();
          return;
        }
        // beCall invokes onSuccess inside its own try/catch, so a throw from any of these would be
        // reported as an API failure for a declaration that was in fact saved.
        try {
          onClosePopup();
          props.onDeclarationAccepted?.();
          refetchUserState();
          addToast({
            type: TOAST_TYPES.SUCCESS,
            id: "be_api_success",
            body: Locale.declarationSaved,
          });
        } catch (e) {
          logApiFailureToSentry(
            "DeclarationPopupContainer.tsx",
            BE_ROUTES.CAPTURE_SOLE_PROP_DECLARATION,
            declarationDataList,
            e
          );
        }
      },
      onError: showFailureToast,
    });
  };

  return <DeclarationPopup onAccept={postDeclaration} isSubmitting={isSubmitting} />;
};

export default DeclarationPopupContainer;
