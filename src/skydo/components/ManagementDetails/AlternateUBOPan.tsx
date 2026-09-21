import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Dropdown from "../AtomicComponents/Dropdown";
import React, { useEffect, useState } from "react";
import Button from "../AtomicComponents/Button";
import PanInput from "../Common/AlphaNumericInput";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { parseErrorMessage } from "../../util/functions";
import useToastMessages from "../../store/toastMessages";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import useUserData from "../../store/useUserData";
import { BUSSINESS_TYPES } from "../../constants/onboarding";
import { UBO } from "../../types/Onboarding";
import { TrustMarkerMobile } from "../TrustMarker";
import TickIcon from "../Icons/TickIcon";
import useOnboardingStore from "../../store/useOnboardingStore";

interface Props {
  uboList: any;
  fetchUboDetails: () => void;
}

const AlternateUBOPan = (props: Props) => {
  const { uboList, fetchUboDetails } = props;
  const initialErrorState: { isError: boolean; errorText: string } = { isError: false, errorText: "" };
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const [isLoadingAltButton, setAltButtonLoading] = useState(false);
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const { businessType } = useUserData();

  const primaryUbo = uboList.filter((ubo: UBO) => ubo.isPrimary)?.[0];
  const otherUbos = uboList.filter((ubo: UBO) => !ubo.isPrimary);

  const [askForPan, setAskForPan] = useState({
    askForPrimaryPAN: !(primaryUbo?.pan && primaryUbo?.nameMatched),
    askForSecondaryPAN: uboList.length > 1 && otherUbos.every((ubo: UBO) => !(ubo.pan && ubo.nameMatched)),
  });
  const { askForPrimaryPAN, askForSecondaryPAN } = askForPan;

  const panNoRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  /*
  todo
    1. form validation on submit, error state
    2. post success handling - upate next user state
   */

  const [selectedUser, selectUser] = useState<{
    value: string | number;
    label: string;
  }>({ value: "", label: "" });
  const [panNumber, setpan] = useState("");
  const [primaryPanNumber, setPrimaryPan] = useState("");
  const [error, setError] = useState(initialErrorState);
  const [primaryError, setPrimaryError] = useState(initialErrorState);
  const [userError, setUserError] = useState(false);
  const analytics = useAnalytics();
  const alternateUserOptions = otherUbos.map((ubo: UBO) => {
    const { fullName, id, isPrimary, pan, nameMatched } = ubo || {};
    return {
      label: fullName,
      value: id,
      isPrimary,
      ...(pan && nameMatched
        ? {
            isDisabled: true,
            subText: Locale.panProvided,
          }
        : {}),
    };
  });
  const primaryUserOption = [
    {
      label: primaryUbo.fullName,
      value: primaryUbo.id,
      isPrimary: primaryUbo.isPrimary,
    },
  ];

  alternateUserOptions.sort((a: UBO, b: UBO) => {
    if (a.isPrimary === b.isPrimary) {
      return 0;
    }
    if (a.isPrimary > b.isPrimary) {
      return 1;
    }
    return -1;
  });

  const onAlternatePanSelect = (value: any, option: any) => {
    selectUser({ value, label: option.label });
    setError(initialErrorState);
  };

  const validatePanNameMatch = () => {
    if (primaryUbo?.pan && !primaryUbo?.nameMatched) {
      setPrimaryError({
        isError: true,
        errorText: Locale.ownerOrDirectorPanNameMatchError.replace("${uboName}", primaryUbo?.fullName),
      });
    }

    const secondaryUbo = uboList.filter((ubo: UBO) => ubo.id === selectedUser.value)?.[0];

    if (secondaryUbo?.pan && !secondaryUbo?.nameMatched) {
      setError({
        isError: true,
        errorText: Locale.ownerOrDirectorPanNameMatchError.replace("${uboName}", secondaryUbo?.fullName),
      });
    }
  };

  useEffect(() => {
    validatePanNameMatch();
  }, [uboList]);

  //todo - add error state here ---
  const validate = () => {
    let isError = false;
    if (askForSecondaryPAN) {
      if (!selectedUser.value) {
        isError = true;
        setUserError(true);
      }
      if (!panNumber) {
        isError = true;
        setError({ isError: true, errorText: Locale.alternatePanError });
      }
      if (!panNoRegex.test(panNumber)) {
        isError = true;
        setError({ isError: true, errorText: Locale.invalidPan });
      }
    }
    if (askForPrimaryPAN) {
      if (!primaryPanNumber) {
        isError = true;
        setPrimaryError({ isError: true, errorText: Locale.alternatePanError });
      }

      if (!panNoRegex.test(primaryPanNumber)) {
        isError = true;
        setPrimaryError({ isError: true, errorText: Locale.invalidPan });
      }
    }

    return !isError;
  };

  const onSubmitAndContinue = async () => {
    const isValidForm = validate();
    if (!isValidForm) {
      return;
    }
    setAltButtonLoading(true);
    const body = [];
    if (askForSecondaryPAN) {
      body.push({
        uboId: selectedUser.value,
        pan: panNumber,
      });
    }
    if (askForPrimaryPAN) {
      body.push({
        uboId: primaryUbo.id,
        pan: primaryPanNumber,
      });
    }
    try {
      const res = await beCall({
        path: BE_ROUTES.UPDATE_AND_VERIFY_ALTERNATE_UBO_PAN,
        method: ALLOWED_METHODS.POST,
        body: { uboList: body },
      });
      analytics?.trackAsync(Events.ALT_UBO_DATA_SUBMIT, { altUbo: selectedUser.label });
      setAltButtonLoading(false);
      if (res.success) {
        refetchUserState();
        fetchUboDetails();
      } else {
        throw res;
      }
    } catch (e) {
      setAltButtonLoading(false);
      const message = parseErrorMessage(e);
      if (
        message === "ALT_UBO_PAN_NAME_MISMATCH" ||
        message === "INVALID_PAN" ||
        message === "NO_RECORD_FOUND" ||
        message === "NOT_PERSONAL_PAN"
      ) {
        // Ignore
        refetchUserState();
        fetchUboDetails();
      } else {
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "alt_director_error",
          body: Locale.wentWrongMessage,
        });
      }
    }
  };

  const onPanChange = (value: string) => {
    setpan(value);
    setError(initialErrorState);
  };

  const onPrimaryPanChange = (value: string) => {
    setPrimaryPan(value);
    setPrimaryError(initialErrorState);
  };

  const title =
    businessType === BUSSINESS_TYPES.PARTNERSHIP
      ? Locale.alternatePartnerTitle.replaceAll(":plural", askForPrimaryPAN && askForSecondaryPAN ? "s" : "")
      : Locale.alternateUboTitle.replaceAll(":plural", askForPrimaryPAN && askForSecondaryPAN ? "s" : "");
  const subtitle =
    businessType === BUSSINESS_TYPES.PARTNERSHIP
      ? Locale.alternatePartnerSubtitle.replaceAll(":plural", askForPrimaryPAN && askForSecondaryPAN ? "s" : "")
      : Locale.alternateUBOSubtitle.replaceAll(":plural", askForPrimaryPAN && askForSecondaryPAN ? "s" : "");

  return (
    <div className={"flex flex-col"}>
      <Typography text={title} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"mb-0.5"} />
      <Typography
        text={subtitle}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        textClasses={"!text-black-500"}
      />
      <CustomisedNavigationForm onSubmit={onSubmitAndContinue}>
        {askForPrimaryPAN ? (
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-4 my-4 md:my-10"}>
            <Dropdown
              onSelect={() => {}}
              dropdownLabel={Locale.beneOwnerNameNum.replace(":num", askForSecondaryPAN ? "1" : "")}
              placeholder={Locale.selectBeneOwner}
              options={primaryUserOption}
              selectedValue={primaryUbo.id}
              isDisabled={true}
              searchable={false}
              optionsContainerClass={"-mt-6"}
              inputClassNonSearch={"!bg-black-50 !text-black-500"}
              inputWrapperClass={"!bg-black-50"}
              disabledClass={"!cursor-auto"}
              footerText={
                <Typography
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  text={
                    <div className={"flex flex-ro items-center gap-1"}>
                      <TickIcon />
                      <span>{Locale.aadhaarVerified}</span>
                    </div>
                  }
                  textClasses={"!text-black-500"}
                />
              }
            />
            <PanInput
              onChange={onPrimaryPanChange}
              placeholder={Locale.examplePanNumber}
              value={primaryPanNumber}
              label={Locale.beneOwnerPanNum}
              errorText={primaryError.errorText}
              isError={primaryError.isError}
            />
          </div>
        ) : null}
        {askForSecondaryPAN ? (
          <div className={"grid grid-cols-1 md:grid-cols-2 gap-y-4 md:gap-x-4 my-4 md:my-10"}>
            <Dropdown
              onSelect={onAlternatePanSelect}
              dropdownLabel={Locale.beneOwnerNameNum.replace(":num", askForPrimaryPAN ? "2" : "")}
              placeholder={Locale.selectBeneOwner}
              options={alternateUserOptions}
              selectedValue={selectedUser.value}
              isError={userError}
              footerText={Locale.alternateuserError}
              searchable={false}
              optionsContainerClass={"-mt-6"}
            />

            <PanInput
              onChange={onPanChange}
              placeholder={Locale.examplePanNumber}
              value={panNumber}
              label={Locale.beneOwnerPanNum}
              errorText={error.errorText}
              isError={error.isError}
            />
          </div>
        ) : null}
        <div className={"hide_for_mob"}>
          <Button isLoading={isLoadingAltButton} title={Locale.submitandCont} onButtonClick={onSubmitAndContinue} />
        </div>
        <div className={"hide_for_desktop fixed bottom-0 left-0 right-0 bg-white p-4"}>
          <TrustMarkerMobile />
          <Button
            isLoading={isLoadingAltButton}
            title={Locale.submitandCont}
            onButtonClick={onSubmitAndContinue}
            buttonClass={"mt-2 !flex !flex-1 flex-row justify-center !w-full"}
          />
        </div>
        {isLoadingAltButton && (
          <Typography
            text={Locale.sanctionCheckProcessText}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
            textClasses={"mt-2"}
          />
        )}
      </CustomisedNavigationForm>
    </div>
  );
};

export default AlternateUBOPan;
