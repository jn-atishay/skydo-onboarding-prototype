import React, {useEffect, useRef, useState} from "react";
import Typography from "../AtomicComponents/Typography";
import {TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES,} from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import Locale from "../../util/locale/en";
import {DECLARATION_RESPONSE, SANCTION_CATEGORY} from "../../constants/onboarding";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import {ALLOWED_METHODS} from "../../constants/apiConstants";
import useToastMessages from "../../store/toastMessages";
import {TrustMarkerMobile} from "../TrustMarker";
import useOnboardingStore from "../../store/useOnboardingStore";
import RadioButton from "../AtomicComponents/RadioButton";

type Props = {
  sanctionCategories: string[];

  isIndividualBusiness?: boolean;
};

const PepDeclaration = (props: Props) => {
  // State variable from parent
  const sanctionCategories = props.sanctionCategories;
  const isIndividualBusiness = props.isIndividualBusiness;

  const [pepDeclaration, setPepDeclaration] = useState<{ [key: string]: any }>({});
  const [adverseMediaDeclaration, setAdverseMediaDeclaration] = useState<{ [key: string]: any }>({});
  const [isLoadingAltButton, setAltButtonLoading] = useState(false);
  const [declarationError, setDeclarationError] = useState<{ [key: string]: any }>({});
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));

  useEffect(() => {
    const isPep = sanctionCategories?.includes(SANCTION_CATEGORY.PEP) || false;
    const isAdverseMedia = sanctionCategories?.includes(SANCTION_CATEGORY.ADVERSE_MEDIA) || false;
    if (isPep) {
      setPepDeclaration({
        isRequired: true,
      });
    }
    if (isAdverseMedia) {
      setAdverseMediaDeclaration({
        isRequired: true,
      });
    }
  }, [sanctionCategories]);

  const validateDeclaration = () => {
    let isPepError = false;
    let isAdverseMediaError = false;
    if (pepDeclaration.isRequired && !pepDeclaration.userResponse) {
      isPepError = true;
    }

    if (adverseMediaDeclaration.isRequired && !adverseMediaDeclaration.userResponse) {
      isAdverseMediaError = true;
    }
    setDeclarationError({
      pepNoResponse: isPepError,
      adverseMediaNoResponse: isAdverseMediaError,
    });
    return isPepError || isAdverseMediaError;
  };

  const submitDeclaration = async () => {
    const isNotValidated = validateDeclaration();
    if (isNotValidated) {
      return;
    }
    setAltButtonLoading(true);
    try {
      const declarationDataList = [];
      if (pepDeclaration.isRequired) {
        declarationDataList.push({
          declarationType: SANCTION_CATEGORY.PEP,
          userResponse: pepDeclaration.userResponse,
        });
      }
      if (adverseMediaDeclaration.isRequired) {
        declarationDataList.push({
          declarationType: SANCTION_CATEGORY.ADVERSE_MEDIA,
          userResponse: adverseMediaDeclaration.userResponse,
        });
      }
      const response = await beCall({
        path: BE_ROUTES.CAPTURE_USER_DECLARATION,
        method: ALLOWED_METHODS.POST,
        body: {
          isUserDetailsRequired: true,
          declarationDataList: declarationDataList,
        },
        params: {
          isUserDetailsRequired: true,
        },
      });
      if (response.success) {
        refetchUserState();
      } else {
        throw response;
      }
      setAltButtonLoading(false);
    } catch (e: any) {
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "ubo_add",
        body: Locale.wentWrongMessage,
      });
      setAltButtonLoading(false);
    }
  };

  const pepDeclarationClicked = (userResponse: string) => {
    setPepDeclaration({
      ...pepDeclaration,
      userResponse: userResponse,
    });
    setDeclarationError({});
  };

  const adverseMediaDeclarationClicked = (userResponse: string) => {
    setAdverseMediaDeclaration({
      ...adverseMediaDeclaration,
      userResponse: userResponse,
    });
    setDeclarationError({});
  };

  const errorRef = useRef<HTMLDivElement | null>(null);

  if (declarationError.adverseMediaNoResponse || declarationError.pepNoResponse) {
    if (errorRef?.current) {
      errorRef?.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
    }
  }

  return (
    <div className={"flex flex-col"}>
      <Typography text={Locale.pepDeclarationHeading} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
      {pepDeclaration.isRequired && (
        <div className={"flex flex-col mt-6"}>
          <div className={"flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0"}>
            <Typography
              text={isIndividualBusiness ? Locale.pepDeclarationForIndividualBusinesses : Locale.pepDeclarationText}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!text-black-700"}
            />
            <div className={"flex flex-row gap-x-2 justify-end"}>
              <RadioButton
                  id={"yes_button"}
                  label={Locale.yes}
                  checked={pepDeclaration.userResponse === "YES"}
                  onChange={(event) => {
                    // event.preventDefault();
                    pepDeclarationClicked("YES");
                  }}
                  className={"flex_row_item_center"}
              />
              <RadioButton
                  id={"no_button"}
                  label={Locale.no}
                  checked={pepDeclaration.userResponse === "NO"}
                  onChange={(event) => {
                    // event.preventDefault();
                    pepDeclarationClicked("NO");
                  }}
                  className={"flex_row_item_center"}
              />
            </div>
          </div>

          {declarationError.pepNoResponse && (
            <Typography
              text={Locale.declarationNoResponseError}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-red-400 mt-2"}
            />
          )}
        </div>
      )}

      {adverseMediaDeclaration.isRequired && (
        <div className={"flex flex-col mt-6"}>
          <div className={"flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0"}>
            <Typography
              text={
                isIndividualBusiness
                  ? Locale.criminalDeclarationTextForIndividualBusinesses
                  : Locale.criminalDeclarationText
              }
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={"!text-black-700"}
            />
            <div className={"flex flex-row gap-x-2 justify-end"}>
              <RadioButton
                  id={"yes_button"}
                  label={Locale.yes}
                  checked={adverseMediaDeclaration.userResponse === DECLARATION_RESPONSE.YES}
                  onChange={(event) => {
                    // event.preventDefault();
                    adverseMediaDeclarationClicked(DECLARATION_RESPONSE.YES);
                  }}
                  className={"flex_row_item_center"}
              />
              <RadioButton
                  id={"no_button"}
                  label={Locale.no}
                  checked={adverseMediaDeclaration.userResponse === DECLARATION_RESPONSE.NO}
                  onChange={(event) => {
                    // event.preventDefault();
                    adverseMediaDeclarationClicked(DECLARATION_RESPONSE.NO);
                  }}
                  className={"flex_row_item_center"}
              />
            </div>
          </div>
          {declarationError.adverseMediaNoResponse && (
            <Typography
              text={Locale.declarationNoResponseError}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-red-400 mt-2"}
            />
          )}
        </div>
      )}

      <Typography
        text={Locale.pepDeclarationFooterNote}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        type={TYPOGRAPHY_TYPES.PARA}
        textClasses={"!text-black-500 mt-10"}
      />

      <Button
        buttonClass={"mt-10 hide_for_mob"}
        isLoading={isLoadingAltButton}
        title={Locale.submitandCont}
        onButtonClick={submitDeclaration}
      />

      <div className={"hide_for_desktop fixed bottom-0 left-0 right-0 bg-white p-4"}>
        <TrustMarkerMobile />
        <Button
          isLoading={isLoadingAltButton}
          title={Locale.submitandCont}
          onButtonClick={submitDeclaration}
          buttonClass={"mt-2 !flex !flex-1 flex-row justify-center !w-full"}
        />
      </div>
      <div ref={errorRef}></div>
    </div>
  );
};

export default PepDeclaration;
