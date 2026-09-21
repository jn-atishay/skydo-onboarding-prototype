import Locale from "../../util/locale/en";
import CurrStateTitle from "../Common/CurrStateTitle";
import Typography from "../AtomicComponents/Typography";
import { TOAST_TYPES, TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React, { useContext, useEffect, useRef, useState } from "react";
import Button from "../AtomicComponents/Button";
import AlternateUBOPan from "./AlternateUBOPan";
import { gql, useQuery } from "@apollo/client";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import CheckBox from "../AtomicComponents/CheckBox";
import useToastMessages from "../../store/toastMessages";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import InfoIcon from "../Icons/InfoIcon";
import Tooltip from "../AtomicComponents/Tooltip";
import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import { BUSSINESS_TYPES, SANCTION_CATEGORY } from "../../constants/onboarding";
import CompanyPersonnelList from "./CompanyPersonnelList";
import CompanyPersonnelStaticList from "./CompanyPersonnelStaticList";
import PepDeclaration from "./PepDeclaration";
import MultiUsersIcon from "../Icons/MultiUsersIcon";
import AppContext from "../../context/AppContext";
import { TrustMarkerMobile } from "../TrustMarker";
import useArchiveOrBlacklistStore from "../../store/useArchiveOrBlacklistStore";
import useOnboardingStore from "../../store/useOnboardingStore";

const FETCH_MANAGEMENT_DETAILS = gql`
  query {
    exporterUser {
      exporter {
        businessType
        verificationStatus {
          verificationStep
          isVerified
        }
        ubo {
          id
          fullName
          isPrimary
          nationality
          ownershipPercentage
          uboSource
          pan
          nameMatched
        }
        sanctionCategories
      }
    }
    country {
      nationality
    }
  }
`;
const SeniorManagementDetailsForm = () => {
  const [directorList, setDirectorList] = useState<any[]>([]);
  const [uboList, updateUBOList] = useState<any[]>([]);

  const [showAlternateUbo, toggleAlternateUboSection] = useState(false);

  const [isConsentrecorded, recordConsent] = useState(false);

  const [countries, setCountries] = useState([]);
  const [isuboSubmitLoading, setUboButtonLoading] = useState(false);
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const [isConsentSavedinDB, setConsentSavedinDB] = useState(false);

  const [directorFormError, setDirectorFormError] = useState<{ [key: string]: any }>({});
  const [uboformError, setUboFormError] = useState<{ [key: string]: any }>({});

  const [businessType, setBusinessType] = useState<string>("");
  const analytics = useAnalytics();
  const isLlp = businessType === BUSSINESS_TYPES.LLP;
  const isPartnership = businessType === BUSSINESS_TYPES.PARTNERSHIP;
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const [isOwnerPercentageError, setOwnerPercentageError] = useState<boolean>(false);
  const [isUboCountError, setUboCountError] = useState(false);

  const [showDeclarationScreen, setShowDeclarationScreen] = useState<boolean>(false);
  const [sanctionCategories, setSanctionCategories] = useState<string[]>([]);
  const { theme } = useContext(AppContext);
  const errorRef = useRef<HTMLDivElement | null>(null);
  const [underAgeError, setUnderAgeError] = useState<boolean>(false);
  const [duplicatePanError, setDuplicatePanError] = useState(false);

  const { setArchiveOrBlacklistPopup } = useArchiveOrBlacklistStore();

  useEffect(() => {
    analytics?.trackAsync(Events.UBO_SCREEN_LOAD);
  }, [analytics]);

  const onCompleted = (data: any) => {
    if (data) {
      const uboAndDirectorList = data.exporterUser?.exporter?.ubo || [];
      const businessType = data.exporterUser?.exporter?.businessType || "";
      const countires = (data.country || []).map((country: { nationality: any }) => ({
        label: country.nationality,
        value: country.nationality,
      }));
      const verificationStatuses = data.exporterUser?.exporter?.verificationStatus || [];
      for (let i = 0; i < verificationStatuses.length; ++i) {
        const { isVerified, verificationStep } = verificationStatuses[i];
        if (verificationStep === "UBO_DETAILS_ACCEPTED" && isVerified) {
          recordConsent(true);
          setConsentSavedinDB(true);
          break;
        }
      }
      setBusinessType(businessType);

      const uboList = uboAndDirectorList.filter((i: any) => i.uboSource !== "MCA");
      // if (uboList.length == 0) {
      //   uboList.push({})
      // }
      // Checking for PAN name mismatched error
      for (const i in uboList) {
        const ubo = uboList[i];
        if (!ubo.nameMatched) {
          uboformError[`form${i}pan`] = Locale.ownerOrDirectorPanNameMatchError.replace("${uboName}", ubo.fullName);
        }
      }

      updateUBOList(new Array(...uboList));
      setDirectorList(new Array(...uboAndDirectorList.filter((i: any) => i.uboSource === "MCA")));
      setCountries(countires);

      // const sanctionCategories = data.exporterUser?.exporter?.sanctionCategories;
      // const isPep = sanctionCategories?.includes(SANCTION_CATEGORY.PEP) || false;
      // const isAdverseMedia = sanctionCategories?.includes(SANCTION_CATEGORY.ADVERSE_MEDIA) || false;
      // if (!sanctionCategories || sanctionCategories.length === 0) {
      //   // Sanction has not run for this case yet
      //   setShowDeclarationScreen(false);
      // } else if (isPep || isAdverseMedia) {
      //   // Show declaration in case of pep or adverse media hits
      //   setShowDeclarationScreen(true);
      //   setSanctionCategories(sanctionCategories);
      //   toggleAlternateUboSection(false);
      // }
    }
  };

  const { data, loading, refetch } = useQuery(FETCH_MANAGEMENT_DETAILS, {
    onCompleted,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const validate = (list: any[], setter: any, panRequired: boolean = false) => {
    const error: { [key: string]: any } = {};
    if (!isConsentrecorded) {
      error.consent = Locale.uboUndertakingError;
    }
    for (let i = 0; i < list.length; ++i) {
      const ubo = list[i] || {};
      if (ubo.isDeleted) continue;
      if (!ubo.fullName) {
        error[`form${i}name`] = isPartnership ? Locale.partnerNameError : Locale.ownerOrDirectorNameError;
      }
      if (!ubo.nationality) {
        error[`form${i}nationality`] = isPartnership
          ? Locale.partnerNationalityError
          : panRequired
          ? Locale.uboSmpNationalityError
          : Locale.directorNationalityError;
      }
      if (isPartnership && !ubo.ownershipPercentage) {
        error[`form${i}ownershipPercentage`] = Locale.partnerOwnershipError;
      }
      if (!ubo.pan && panRequired) {
        error[`form${i}pan`] = Locale.ownerOrDirectorPanError;
      }
      // if (ubo.uboSource === "USER_ENTERED" && !ubo.nameMatched) {
      //   error[`form${i}pan`] = Locale.ownerOrDirectorPanNameMatchError.replace("${uboName}", ubo.fullName)
      // }
    }
    if (Object.keys(error).length !== 0) {
      setter(error);
      return false;
    }
    return true;
  };

  const onSubmitUboList = async () => {
    const isUBOFormValid = validate(uboList, setUboFormError, true);
    const isDirectorFormValid = validate(directorList, setDirectorFormError);
    if (!isUBOFormValid || !isDirectorFormValid) {
      return;
    }
    setUboFormError({});
    setDirectorFormError({});
    setUboButtonLoading(true);
    setUnderAgeError(false);
    setDuplicatePanError(false);

    const combinedList = [...uboList, ...directorList];

    try {
      const resposne = await beCall({
        path: BE_ROUTES.UPDATE_UBO_DETAILS_V2,
        method: ALLOWED_METHODS.POST,
        body: {
          uboList: combinedList.filter((ubo) => !ubo.isDeleted),
        },
        params: {
          isUserDetailsRequired: true,
        },
      });
      analytics?.trackAsync(Events.UBO_SUBMIT, { numUbo: combinedList.length });
      if (resposne.success) {
        refetch();
        refetchUserState();
        toggleAlternateUboSection(true);
      } else {
        throw resposne;
      }
      setUboButtonLoading(false);
    } catch (e: any) {
      if (e.message === "INVALID_OWNERSHIP_PERCENTAGE") {
        setOwnerPercentageError(true);
      } else if (e.message === "INVALID_UBO_COUNT") {
        setUboCountError(true);
      } else if (e.message === "UBO_PAN_NAME_MISMATCH") {
        // Ignore
        refetch();
        refetchUserState();
      } else if (e.message === "DUPLICATE_PAN_PROVIDED") {
        setDuplicatePanError(true);
      } else if (e.message === "UNDERAGE_UBO") {
        setUnderAgeError(true);
      } else if (e.message === "PAN_BLACKLISTED") {
        setArchiveOrBlacklistPopup(true);
      } else {
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "ubo_add",
          body: Locale.wentWrongMessage,
        });
      }
      setUboButtonLoading(false);
    }
  };

  const renderDirectorTitle = () => {
    let title = Locale.companyDirectorTitle;
    let tooltipText = Locale.directorsAutofilled;
    return (
      <div className={"flex flex-row items-center"}>
        <Typography text={title} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"mr-1"} />
        <Tooltip tooltipText={tooltipText} position={TOOLTIP_POSITION.RIGHT}>
          <InfoIcon />
        </Tooltip>
      </div>
    );
  };

  const renderUBOTitle = () => {
    let title = Locale.companyUBOAndSMPTitle;
    return (
      <div className={"flex flex-col"}>
        <div className={"flex flex-row items-center"}>
          <Typography
            text={title}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"mr-1"}
          />
        </div>
        <Typography
          text={Locale.uboAndSMPexplainText}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"block !text-black-500 mb-2"}
        />
        <Typography
          text={Locale.reenterNotReqDirectorSMPText}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"mb-6 block !text-black-500"}
        />
      </div>
    );
  };

  const errorConsentNotSelected = !isConsentrecorded && !!uboformError.consent;
  if (errorConsentNotSelected || showAlternateUbo || showDeclarationScreen) {
    if (errorRef?.current) {
      errorRef?.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "end" });
    }
  }

  return (
    <div className={"flex flex-col px-4 md:px-0"}>
      <CurrStateTitle
        title={renderDirectorTitle()}
        subTitle={Locale.directorsAutofilled}
        icon={() => <MultiUsersIcon stroke={theme.hexColors.white} />}
      />

      {/* Add UBo and country section */}
      <div className={"flex flex-row mb-10"}>
        <div className={"flex-1 flex flex-col"}>
          {showDeclarationScreen || showAlternateUbo ? (
            <CompanyPersonnelStaticList uboList={directorList} />
          ) : (
            <CompanyPersonnelList
              uboList={directorList}
              updateUBOList={setDirectorList}
              onNationalitySelected={() => toggleAlternateUboSection(false)}
              countries={countries}
              askForPan={false}
              canAddNew={false}
              formError={directorFormError}
              setFormError={setDirectorFormError}
            />
          )}
          {underAgeError ? (
            <div className={"mb-4"}>
              <Typography text={Locale.underAgeUboError} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-red-400"} />
            </div>
          ) : null}

          {duplicatePanError ? (
            <div className={"mb-4"}>
              <Typography text={Locale.duplicatePanError} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-red-400"} />
            </div>
          ) : null}
          <div className={"mt-2 mb-6 cell bg-black-400 h-px mr-6"} />
          {renderUBOTitle()}
          {showDeclarationScreen || showAlternateUbo ? (
            <CompanyPersonnelStaticList uboList={uboList} />
          ) : (
            <CompanyPersonnelList
              uboList={uboList}
              updateUBOList={updateUBOList}
              onNationalitySelected={() => toggleAlternateUboSection(false)}
              countries={countries}
              askForPan={true}
              canAddNew={true}
              formError={uboformError}
              setFormError={setUboFormError}
            />
          )}

          <div className={"mt-6 cell bg-black-400 h-px mr-6"} />

          {!showDeclarationScreen && (
            <div>
              <CustomisedNavigationForm onSubmit={onSubmitUboList}>
                <CheckBox
                  isDisabled={isConsentSavedinDB}
                  checked={isConsentrecorded}
                  label={Locale.uboAcceptanceText}
                  onCheckboxClick={() => recordConsent(!isConsentrecorded)}
                  containerClass={"mt-6 !items-start"}
                  textClasses={isConsentSavedinDB ? "!text-black-500 ml-3" : ""}
                />
              </CustomisedNavigationForm>
            </div>
          )}

          {!isConsentrecorded && !!uboformError.consent ? (
            <div>
              <Typography
                text={Locale.uboUndertakingError}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-red-400 mt-2"}
              />
            </div>
          ) : null}
        </div>
      </div>

      {showAlternateUbo ? (
        <div>
          <AlternateUBOPan uboList={[...uboList, ...directorList]} fetchUboDetails={refetch} />
        </div>
      ) :
          showDeclarationScreen ? (
        <PepDeclaration sanctionCategories={sanctionCategories} />
      ) :
          (
        <>
          <div className={"hide_for_mob"}>
            <Button isLoading={isuboSubmitLoading} onButtonClick={onSubmitUboList} title={Locale.submitandCont} />
            {isuboSubmitLoading && (
              <Typography
                text={Locale.sanctionCheckProcessText}
                size={TYPOGRAPHY_SIZES.SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses={"mt-2"}
              />
            )}
          </div>
          <div className={"hide_for_desktop fixed bottom-0 left-0 right-0 bg-white p-4"}>
            <TrustMarkerMobile />
            <Button
              isLoading={isuboSubmitLoading}
              title={Locale.submitandCont}
              onButtonClick={onSubmitUboList}
              buttonClass={"mt-2 !flex !flex-1 flex-row justify-center !w-full"}
            />
          </div>
        </>
      )}

      {isPartnership && isOwnerPercentageError ? (
        <div className={"mt-4"}>
          <Typography text={Locale.ownerPercentError} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-red-400"} />
        </div>
      ) : null}
      {isPartnership && isUboCountError ? (
        <div className={"mt-4"}>
          <Typography text={Locale.uboCountInPartnership} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-red-400"} />
        </div>
      ) : null}
      <div ref={errorRef}></div>
    </div>
  );
};

export default SeniorManagementDetailsForm;
