import Locale from "../../util/locale/en";
import CurrStateTitle from "../Common/CurrStateTitle";
import Typography from "../AtomicComponents/Typography";
import { TOAST_TYPES, TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import AddIcon from "../Icons/AddIcon";
import Dropdown from "../AtomicComponents/Dropdown";
import TextInput from "../AtomicComponents/TextInput";
import React, { useContext, useEffect, useState } from "react";
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
import DeleteIcon from "../Icons/DeleteIcon";
import InfoIcon from "../Icons/InfoIcon";
import Tooltip from "../AtomicComponents/Tooltip";
import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import { BUSSINESS_TYPES } from "../../constants/onboarding";
import classnames from "classnames";
import PanInput from "../Common/AlphaNumericInput";
import PepDeclaration from "./PepDeclaration";
import CompanyPersonnelStaticList from "./CompanyPersonnelStaticList";
import MultiUsersIcon from "../Icons/MultiUsersIcon";
import AppContext from "../../context/AppContext";
import { TrustMarkerMobile } from "../TrustMarker";
import useArchiveOrBlacklistStore from "../../store/useArchiveOrBlacklistStore";
import useOnboardingStore from "../../store/useOnboardingStore";

export const FETCH_MANAGEMENT_DETAILS = gql`
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
          pan
          nameMatched
          uboSource
        }
        sanctionCategories
      }
    }
    country {
      nationality
    }
  }
`;
/*
 * Making this component render only in case of partnership
 * We will create new component for Pvt Ltd and LLP
 * In future we will shift the partnership section also to the new design
 */
const ManagementDetailsForm = () => {
  //todo - api integration

  const [uboList, updateUBOList] = useState<any[]>([]);
  const [showAlternateUbo, toggleAlternateUboSection] = useState(false);
  const [isConsentrecorded, recordConsent] = useState(false);
  const [countries, setCountries] = useState([]);
  const [isuboSubmitLoading, setUboButtonLoading] = useState(false);
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const [isConsentSavedinDB, setConsentSavedinDB] = useState(false);
  const [formError, setFormError] = useState<{ [key: string]: any }>({});
  const [businessType, setBusinessType] = useState<string>("");
  const analytics = useAnalytics();
  const isLlp = businessType === BUSSINESS_TYPES.LLP;
  const isPartnership = businessType === BUSSINESS_TYPES.PARTNERSHIP;
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const [isOwnerPercentageError, setOwnerPercentageError] = useState<boolean>(false);
  const [isUboCountError, setUboCountError] = useState(false);
  const { theme } = useContext(AppContext);

  const [showDeclarationScreen, setShowDeclarationScreen] = useState<boolean>(false);
  const [sanctionCategories, setSanctionCategories] = useState<string[]>([]);
  const [underAgeError, setUnderAgeError] = useState<boolean>(false);
  const [duplicatePanError, setDuplicatePanError] = useState(false);
  const { setArchiveOrBlacklistPopup } = useArchiveOrBlacklistStore();

  const panNoRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  useEffect(() => {
    analytics?.trackAsync(Events.UBO_SCREEN_LOAD);
  }, [analytics]);

  const onCompleted = (data: any) => {
    if (data) {
      const uboList = data.exporterUser?.exporter?.ubo || [];
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
      for (const i in uboList) {
        const ubo = uboList[i];
        if (!ubo.nameMatched) {
          formError[`form${i}pan`] = Locale.ownerOrDirectorPanNameMatchError.replace("${uboName}", ubo.fullName);
        }
      }

      updateUBOList(new Array(...uboList));
      setCountries(countires);

      // const sanctionCategories = data.exporterUser?.exporter?.sanctionCategories;
      // const isPep = sanctionCategories?.includes(SANCTION_CATEGORY.PEP) || false;
      // const isAdverseMedia = sanctionCategories?.includes(SANCTION_CATEGORY.ADVERSE_MEDIA) || false;
      // if (!sanctionCategories || sanctionCategories?.length === 0) {
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

  const onAddUboClick = () => {
    //todo - add input for new UBO and validate it
    // @ts-ignore
    updateUBOList([...uboList, {}]);
    toggleAlternateUboSection(false);
    analytics?.trackAsync(Events.UBO_ADD_NEW_CLICK);
  };

  const onDirectorNameChange = (value: string, index: number) => {
    const newUbos = [...uboList];

    newUbos[index] = {
      ...newUbos[index],
      fullName: value,
    };
    updateUBOList(newUbos);
    resetNameError(index);
  };

  const onOwnershipChange = (value: string, index: number) => {
    const newUbos = [...uboList];
    newUbos[index] = {
      ...newUbos[index],
      ownershipPercentage: value,
    };
    updateUBOList(newUbos);
    resetOwnershipError(index);
    setOwnerPercentageError(false);
    toggleAlternateUboSection(false);
    setUboCountError(false);
  };

  const onPanChange = (value: string, index: number) => {
    const newUbos = [...uboList];
    newUbos[index] = {
      ...newUbos[index],
      pan: value,
    };
    updateUBOList(newUbos);
    resetPanError(index);
  };

  const resetNationalityError = (index: number) => {
    const newError = { ...formError };
    newError[`form${index}nationality`] = "";
    setFormError(newError);
  };

  const resetPanError = (index: number) => {
    const newError = { ...formError };
    newError[`form${index}pan`] = "";
    setFormError(newError);
  };

  const resetNameError = (index: number) => {
    const newError = { ...formError };
    newError[`form${index}name`] = "";
    setFormError(newError);
  };

  const resetOwnershipError = (index: number) => {
    const newError = { ...formError };
    newError[`form${index}ownershipPercentage`] = "";
    setFormError(newError);
  };

  const onNationalitySelect = (value: any, index: number) => {
    const newUbos = [...uboList];
    newUbos[index] = {
      ...newUbos[index],
      nationality: value,
    };
    updateUBOList(newUbos);
    resetNationalityError(index);
    toggleAlternateUboSection(false);
  };

  const validate = () => {
    const error: { [key: string]: any } = {};
    if (!isConsentrecorded) {
      error.consent = Locale.uboUndertakingError;
    }
    for (let i = 0; i < uboList.length; ++i) {
      const ubo = uboList[i] || {};
      if (ubo.isDeleted) continue;
      if (!ubo.fullName) {
        error[`form${i}name`] = isPartnership ? Locale.partnerNameError : Locale.ownerOrDirectorNameError;
      }
      if (!ubo.nationality) {
        error[`form${i}nationality`] = isPartnership
          ? Locale.partnerNationalityError
          : Locale.ownerOrDirectorNationalityError;
      }
      if (isPartnership && !ubo.ownershipPercentage) {
        error[`form${i}ownershipPercentage`] = Locale.partnerOwnershipError;
      }
      if (!ubo.pan) {
        error[`form${i}pan`] = Locale.ownerOrDirectorPanError;
      } else if (!panNoRegex.test(ubo.pan)) {
        error[`form${i}pan`] = Locale.invalidPan;
      }
    }
    if (Object.keys(error).length !== 0) {
      setFormError(error);
      return false;
    }
    return true;
  };

  const onSubmitUboList = async () => {
    const isValidForm = validate();
    if (!isValidForm) {
      return;
    }
    setFormError({});
    setUboButtonLoading(true);
    setUnderAgeError(false);
    setDuplicatePanError(false);
    try {
      const resposne = await beCall({
        path: BE_ROUTES.UPDATE_UBO_DETAILS_V2,
        method: ALLOWED_METHODS.POST,
        body: {
          uboList: uboList.filter((ubo) => !ubo.isDeleted),
        },
        params: {
          isUserDetailsRequired: true,
        },
      });
      analytics?.trackAsync(Events.UBO_SUBMIT, { numUbo: uboList.length });
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

  const onDeleteClick = (index: number) => {
    const updatedList = [...uboList];
    updatedList[index] = {
      ...updatedList[index],
      isDeleted: true,
    };
    updateUBOList(updatedList);
    const newError = { ...formError };
    newError[`form${index}nationality`] = "";
    newError[`form${index}name`] = "";
    newError[`form${index}ownershipPercentage`] = "";
    setFormError(newError);
  };

  const renderPercentageIcon = () => (
    <Typography
      text={"%"}
      type={TYPOGRAPHY_TYPES.LABEL}
      size={TYPOGRAPHY_SIZES.MEDIUM}
      textClasses={"!text-black-500"}
    />
  );

  const renderDirectorInput = ({ index, details }: { index: number; details: any; isDeleted?: boolean }) => {
    const { fullName, nationality, id, isPrimary, isDeleted, ownershipPercentage, pan, uboSource } = details; //todo - verify with backend response
    if (isDeleted) return null;
    return (
      <div className={"flex flex-row mb-6"} key={index}>
        <Typography
          text={`${index + 1}.`}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"mt-3.5 mr-4"}
        />
        <div
          className={classnames("flex-1", {
            "flex flex-col md:flex-row md:items-start md:gap-x-2 gap-y-2 md:gap-y-0": isPartnership,
            "grid grid-cols-2 gap-x-4": !isPartnership,
          })}
        >
          <TextInput
            isDisabled={isPrimary === true || uboSource === "MCA"}
            placeholder={Locale.fullName}
            value={fullName}
            onChange={(value: string) => onDirectorNameChange(value, index)}
            isError={!!formError[`form${index}name`]}
            footerText={formError[`form${index}name`]}
            inputClass={isPartnership ? "basis-[31%]" : ""}
            customClass={"w-1"}
            disabledClass={"!cursor-auto"}
          />
          {isPartnership ? (
            <PanInput
              isDisabled={uboSource === "MCA"}
              onChange={(value) => onPanChange(value, index)}
              placeholder={Locale.panNumberFull}
              value={pan}
              label={""}
              inputClass={isPartnership ? "!basis-[24%]" : ""}
              customClass={"w-1"}
              isError={!!formError[`form${index}pan`]}
              errorText={formError[`form${index}pan`]}
              disabledClass={"!cursor-auto"}
            />
          ) : null}
          <Dropdown
            searchable={true}
            onSelect={(value: any) => onNationalitySelect(value, index)}
            placeholder={Locale.selectNationalityShort}
            options={countries}
            selectedValue={nationality}
            isError={!!formError[`form${index}nationality`]}
            footerText={formError[`form${index}nationality`]}
            containerClass={isPartnership ? "basis-[23%]" : ""}
            inputTextClass={"w-1"}
          />
          {isPartnership ? (
            <TextInput
              placeholder={Locale.ownership}
              value={ownershipPercentage}
              onChange={(value: string) => onOwnershipChange(value, index)}
              isError={isOwnerPercentageError || !!formError[`form${index}ownershipPercentage`]}
              footerText={formError[`form${index}ownershipPercentage`]}
              inputClass={isPartnership ? "basis-[22%]" : ""}
              rightElement={renderPercentageIcon}
              customClass={"w-1"}
              type={"number"}
            />
          ) : null}
        </div>
        <div className={"w-4 ml-4 mt-4"}>
          {!id ? (
            <div onClick={() => onDeleteClick(index)} className={"cursor-pointer"}>
              <DeleteIcon />
            </div>
          ) : null}
        </div>
      </div>
    );
  };

  const renderTitle = () => {
    let title = Locale.companyManagementTitle;
    let tooltipText = Locale.beneOwnerDetails;
    if (isPartnership) {
      tooltipText = `${Locale.partnershipDetails_1} ${Locale.partnershipDetailsHighlight} ${Locale.partnershipDetails_2}`;
      title = Locale.partnershipDetailsTitle;
    }
    if (isLlp) {
      tooltipText = Locale.beneOwnerDetailsLlp;
    }
    return (
      <div className={"flex flex-row items-center"}>
        <Typography text={title} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"mr-1"} />
        <Tooltip tooltipText={tooltipText} position={TOOLTIP_POSITION.RIGHT}>
          <InfoIcon />
        </Tooltip>
      </div>
    );
  };

  const renderSubTitle = () => {
    if (!isPartnership) {
      return Locale.managementDetailsSubTitle;
    }
    return (
      <Typography text={Locale.partnershipSub_1} textClasses={"!text-black-500"}>
        <Typography
          text={Locale.partnershipSub_2}
          textClasses={"!text-black-500"}
          // fontWeight={'700'}
        />
        <Typography text={Locale.partnershipSub_3} textClasses={"!text-black-500"} />
      </Typography>
    );
  };

  return (
    <div className={"flex flex-col px-4 md:px-0"}>
      <CurrStateTitle
        title={renderTitle()}
        subTitle={renderSubTitle()}
        icon={() => <MultiUsersIcon stroke={theme.hexColors.white} />}
      />

      {/* Add UBo and country section */}
      <div className={"flex flex-row mb-10"}>
        <div className={"flex-1 flex flex-col"}>
          {showDeclarationScreen ? (
            <CompanyPersonnelStaticList uboList={uboList} />
          ) : (
            <>
              {uboList.map((ubo, index) => renderDirectorInput({ index: index, details: ubo }))}
              {underAgeError ? (
                <div className={"mb-4"}>
                  <Typography
                    text={Locale.underAgeUboError}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-red-400"}
                  />
                </div>
              ) : null}
              {duplicatePanError ? (
                <div className={"mb-4"}>
                  <Typography
                    text={Locale.duplicatePanError}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!text-red-400"}
                  />
                </div>
              ) : null}
              {/* Add New Button */}
              <div className={"flex flex-row items-center cursor-pointer w-fit"} onClick={onAddUboClick}>
                <AddIcon />
                <Typography
                  text={isPartnership ? Locale.addNewPartner : Locale.addNewCta}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"ml-3.5 !text-blue-400"}
                />
              </div>
            </>
          )}
          {!showDeclarationScreen && (
            <CustomisedNavigationForm onSubmit={onSubmitUboList}>
              <CheckBox
                isDisabled={isConsentSavedinDB}
                checked={isConsentrecorded}
                label={Locale.uboAcceptanceText}
                onCheckboxClick={() => recordConsent(!isConsentrecorded)}
                containerClass={"mt-10 !items-start"}
                textClasses={isConsentSavedinDB ? "!text-black-500 ml-3" : ""}
              />
            </CustomisedNavigationForm>
          )}
          {!isConsentrecorded && !!formError.consent ? (
            <Typography
              text={Locale.uboUndertakingError}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-red-400 mt-2"}
            />
          ) : null}
        </div>
      </div>

      {showAlternateUbo ? (
        <AlternateUBOPan uboList={uboList} fetchUboDetails={refetch} />
      ) : showDeclarationScreen ? (
        <PepDeclaration sanctionCategories={sanctionCategories} />
      ) : (
        <>
          <div className={"hide_for_mob"}>
            <Button isLoading={isuboSubmitLoading} onButtonClick={onSubmitUboList} title={Locale.submitandCont} />
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
        <div className={"mt-0 md:mt-4"}>
          <Typography text={Locale.ownerPercentError} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-red-400"} />
        </div>
      ) : null}
      {isPartnership && isUboCountError ? (
        <div className={"mt-0 md:mt-4"}>
          <Typography text={Locale.uboCountInPartnership} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-red-400"} />
        </div>
      ) : null}
    </div>
  );
};

export default ManagementDetailsForm;
