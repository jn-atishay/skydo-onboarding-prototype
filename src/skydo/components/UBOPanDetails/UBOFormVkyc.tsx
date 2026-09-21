import Locale from "../../util/locale/en";
import CurrStateTitle from "../Common/CurrStateTitle";
import TextInput from "../AtomicComponents/TextInput";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import React, { useContext, useEffect, useRef, useState } from "react";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import Popup from "../AtomicComponents/Popup";
import ResendOtp from "../Common/ResendOtp";
import { gql, useQuery } from "@apollo/client";
import useToastMessages from "../../store/toastMessages";
import { getCompanyName, getSplittedAadhaar, parseErrorMessage } from "../../util/functions";
import AadhaarInput from "../Common/AadhaarInput";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import useUserData from "../../store/useUserData";
import {
  BUSSINESS_TYPES,
  INDIVIDUAL_BUSINESSES,
  PRE_SELECTED_AADHAAR_UBOS_BUSINESSES,
  SANCTION_CATEGORY,
} from "../../constants/onboarding";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { FE_BASE_URL } from "../../config";
import FE_ROUTES from "../../util/feRoutes";
import "../../styles/basic-onboarding.module.css";
import Image from "next/image";
import Loader from "./CircularLoader";
import AppContext from "../../context/AppContext";
import PepDeclaration from "../ManagementDetails/PepDeclaration";
import { AadhaarNumberType, OtpInputRef } from "../../types/atomicComponentTypes";
import UserIcon from "../Icons/UserIcon";
import { TrustMarkerMobile } from "../TrustMarker";
import BottomSheet from "../AtomicComponents/BottomSheet";
import useArchiveOrBlacklistStore from "../../store/useArchiveOrBlacklistStore";
import useOnboardingStore from "../../store/useOnboardingStore";
import OtpInput from "../AtomicComponents/OTPInput";

interface Props {
  exporterUserDetails: { [key: string]: any };
  defaultAadhaarVendor: string;
  exporterUserPanUrl: string;
  reFetchDirectorDetails: () => void;
}

const FETCH_VERIFICATION_STATUS = gql`
  query {
    exporterUser {
      exporter {
        verificationStatus {
          verificationStep
          isVerified
        }
        sanctionCategories
      }
    }
  }
`;

const DigiLockerPopup = ({ digiLockerLinkInitiation }: { digiLockerLinkInitiation: () => Promise<string> }) => {
  const [seconds, setSeconds] = useState(5);
  const [url, setUrl] = useState("");
  const { theme } = useContext(AppContext);
  const countDown = () => {
    setSeconds((seconds) => seconds - 1);
  };

  useEffect(() => {
    if (seconds === 0 && url) {
      window.open(url, "_self");
    }
  }, [seconds, url]);

  useEffect(() => {
    if (seconds > 0) {
      setTimeout(() => {
        countDown();
      }, 1000);
    }
  }, [seconds]);

  const fetchDigilockerUrl = async () => {
    const url = await digiLockerLinkInitiation();
    setUrl(url);
  };

  useEffect(() => {
    void fetchDigilockerUrl();
  }, []);
  return (
    <div className="flex justify-center flex-col">
      <div className="flex flex-row justify-center mb-4">
        <Typography
          text={Locale.uidaiIssue}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          fontColor={theme.hexColors.black[700]}
        />
      </div>
      <div className={"flex flex-row justify-between gap-4"}>
        <div className="flex flex-1">
          <Typography
            text={Locale.redirectingToDigiLcoker.replace(":seconds", String(seconds))}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
          />
        </div>
        <div className={"w-[72px] h-[72px] relative flex flex-row"}>
          <Image src={"/tracker/digilockerLogo.png"} layout={"fill"} objectFit={"contain"} />
        </div>
      </div>
    </div>
  );
};

const UBOFormVkyc = (props: Props) => {
  const { exporterUserDetails, reFetchDirectorDetails } = props;
  const { fullName, registeredName, phoneNumber, maskedAadhaar, exporter } = exporterUserDetails;
  const ubo = exporterUserDetails?.exporter?.ubo || [];

  const companyName = getCompanyName(exporter || {});
  const MAX_ALLOWED_OTP_RETRIES = 3;

  const { data, refetch } = useQuery(FETCH_VERIFICATION_STATUS);
  const parsedPhoneNumber = phoneNumber?.slice(-10);
  const [mobileNumber, changeMobileNumber] = useState(parsedPhoneNumber);
  const [isPhonePopupOpen, openPhonePopup] = useState(false);
  const [isDigiLockerAadhaarProcessingPopupOpen, setDigiLockerAadhaarProcessingPopup] = useState(false);
  const [otp, setOtp] = useState<string>("");
  const [isAadhaarVerified, setAadhaarVerified] = useState(false);
  const [isAadhaarPopupOpen, openAadhaarPopup] = useState(false);
  const [aadhaarOtpAttempt, setAadhaarOtpAttempt] = useState(MAX_ALLOWED_OTP_RETRIES);
  const aadhaarRequestId = useRef(null);
  const [aadhaarNumber, updateAadhaar] = useState<AadhaarNumberType>(new Array(3).fill("") as AadhaarNumberType);
  const [aadhaarOtp, setAadhaarOtp] = useState<string>("");
  const [isAadhaarOtpLoading, setAadharLoading] = useState(false);
  const [isPhoneOtpLoading, setPhoneLoading] = useState(false);
  const aadhaarOtpRef = useRef<OtpInputRef | null>(null);
  const phoneOtpRef = useRef<OtpInputRef | null>(null);
  const [aadhaarOtpError, setAadhaarOtpError] = useState("");
  const [shortName, setShortName] = useState(registeredName);
  const [phoneOtpError, setPhoneOtpError] = useState("");
  const [isAadhaarVerifyLoading, setAadhaarVerifyLoading] = useState(false);
  const [isPhoneVerifyLoading, setPhoneVerifyLoading] = useState(false);
  const router = useRouter();
  const { state, status, error }: { [key: string]: string | undefined | string[] } = router.query;
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const [digiLockerError, setDigiLockerError] = useState("");
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const { businessType } = useUserData();
  const analytics = useAnalytics();
  const [isDigiLockerRedirectPopupOpen, setDigiLockerRedirectPopup] = useState(false);
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [showDeclarationScreen, setShowDeclarationScreen] = useState<boolean>(false);
  const [sanctionCategories, setSanctionCategories] = useState<string[]>([]);
  const pepRef = useRef<HTMLDivElement | null>(null);
  const { theme } = useContext(AppContext);
  const { setArchiveOrBlacklistPopup } = useArchiveOrBlacklistStore();

  const decrementAadhaarOtpAttempt = () => {
    setAadhaarOtpAttempt(aadhaarOtpAttempt - 1);
  };

  useEffect(() => {
    if (aadhaarOtpAttempt <= 0) {
      openAadhaarPopup(false);
      setAadhaarError(Locale.aadhaarOtpMaxAttemptTitle);
    }
  }, [aadhaarOtpAttempt]);

  useEffect(() => {
    if (maskedAadhaar) {
      updateAadhaar(getSplittedAadhaar(maskedAadhaar));
    }
  }, [exporterUserDetails]);

  const fetchAadhaarDataWithDigilocker = async (state: string, status: string, error: string | undefined) => {
    if (state && status) {
      setDigiLockerRedirectPopup(false);
      setDigiLockerAadhaarProcessingPopup(true);
      const response = await beCall({
        path: BE_ROUTES.VERIFY_DIGILOCKER_AADHAAR_LINK,
        method: ALLOWED_METHODS.POST,
        body: {
          referenceId: state,
          status: status,
          error: error,
        },
      });
      if (response.success) {
        analytics.trackAsync(Events.DIGILOCKER_AADHAAR_VERIFIED);
        setDigiLockerAadhaarProcessingPopup(false);
        refetch();
        reFetchDirectorDetails();
        await router.push(
          {
            pathname: router.pathname,
            query: {},
          },
          undefined,
          { shallow: true }
        );
      } else {
        analytics.trackAsync(Events.DIGILOCKER_AADHAAR_FAILED, { message: response.message });
        if (response.message === "NAME_MATCH_FAILED") {
          if (INDIVIDUAL_BUSINESSES.includes(businessType)) {
            setDigiLockerError(Locale.nameMatchErrorVkycInd);
          } else if (businessType === BUSSINESS_TYPES.LLP || businessType === BUSSINESS_TYPES.PRIVATE_LIMITED_COMPANY) {
            setDigiLockerError(Locale.nameMatchErrorVkyc);
          }
        } else if (response.message === "USER_CANCELLED_DIGILOCKER") {
          setDigiLockerError(Locale.userCancelledMessage);
        } else if (response.message === "USER_ACCESS_DENIED_DIGILOCKER") {
          setDigiLockerError(Locale.notProvidedAccessMessage);
        } else {
          setDigiLockerError(Locale.digiLockerWentWrongMessage);
        }
        setDigiLockerAadhaarProcessingPopup(false);
        await router.push(
          {
            pathname: router.pathname,
            query: {},
          },
          undefined,
          { shallow: true }
        );
      }
    }
  };

  useEffect(() => {
    void fetchAadhaarDataWithDigilocker(state as string, status as string, error as string | undefined);
  }, [state, status]);

  useEffect(() => {
    if (data) {
      const verificationStatus = data.exporterUser?.exporter?.verificationStatus || [];
      let isAadhaarVerified = false;
      let isPhoneVerified = false;
      for (let i = 0; i < verificationStatus.length; ++i) {
        const { verificationStep, isVerified } = verificationStatus[i];
        if (verificationStep === "AADHAAR_NAME_MATCH" && isVerified) {
          isAadhaarVerified = true;
          continue;
        }
        if (verificationStep === "UBO_PHONE_OTP" && isVerified) {
          isPhoneVerified = true;
        }
      }
      setAadhaarVerified(isAadhaarVerified);
      setPhoneVerified(isPhoneVerified);
      if (!isAadhaarVerified) {
        updateAadhaar(getSplittedAadhaar(""));
      }

      // const sanctionCategories = data.exporterUser?.exporter?.sanctionCategories;
      // const isPep = sanctionCategories?.includes(SANCTION_CATEGORY.PEP) || false;
      // const isAdverseMedia = sanctionCategories?.includes(SANCTION_CATEGORY.ADVERSE_MEDIA) || false;
      // if (!sanctionCategories) {
      //   // Sanction has not run for this case yet
      //   setShowDeclarationScreen(false);
      // } else if (isPep || isAdverseMedia) {
      //   // Show declaration in case of pep or adverse media hits
      //   setShowDeclarationScreen(true);
      //   setSanctionCategories(sanctionCategories);
      // }


      //TODO : Check what does this do
      // if (isPhoneVerified && (isPep || isAdverseMedia)) {
      //   if (pepRef && pepRef.current) {
      //     pepRef.current?.scrollIntoView({ behavior: "smooth" });
      //   }
      // }
    }
  }, [data]);

  useEffect(() => {
    if (registeredName) {
      setShortName(registeredName);
    }
  }, [registeredName]);

  useEffect(() => {
    if (phoneNumber) {
      changeMobileNumber(phoneNumber?.slice(-10));
    }
  }, [phoneNumber]);

  const onVerifyMobileClick = async () => {
    setPhoneVerifyLoading(true);
    try {
      const response = await beCall({
        path: BE_ROUTES.INITIATE_PHONE_OTP,
        method: ALLOWED_METHODS.POST,
        body: {
          phoneNumber: `+91${mobileNumber}`,
        },
      });
      analytics?.trackAsync(Events.MOBILE_VERIFY_CLICK, { phoneNumber: mobileNumber });
      setPhoneVerifyLoading(false);
      if (response.success) {
        openPhonePopup(true);
      } else {
        throw response;
      }
    } catch (e) {
      const message = parseErrorMessage(e);
      if (message === "INVALID_PHONE") {
        setPhoneError(Locale.incorrectPhone);
        return;
      }
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "otp_error",
        body: Locale.wentWrongMessage,
      });
    }
  };

  const onVerifyMobileButtonClick = () => {
    if (isInvalid(mobileNumber)) {
      setPhoneError(Locale.invalidPhone);
      return;
    } else {
      setPhoneError("");
    }
    onVerifyMobileClick();
  };

  const renderCountryCode = () => {
    return (
      <Typography
        text={"+91 -"}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        textClasses={"py-3 mr-1 min-w-[38px]" + (phoneVerified ? " !text-black-500" : "")}
      />
    );
  };

  const onOtpChange = (otp: string) => {
    setPhoneOtpError("");
    setOtp(otp);
  };

  const onAadhaarOtpChange = (otp: string) => {
    setAadhaarOtpError("");
    setAadhaarOtp(otp);
  };

  const onResendOtpClick = () => {
    onVerifyMobileClick();
  };

  const onEditClick = () => {
    openPhonePopup(false);
    setPhoneOtpError("");
  };

  const digiLockerButtonClick = async () => {
    const url = await digiLockerLinkInitiation();
    window.open(url, "_self");
  };
  const digiLockerLinkInitiation = async () => {
    setDigiLockerError("");
    setAadhaarVerifyLoading(true);
    let referenceId = uuidv4();
    const response = await beCall({
      path: BE_ROUTES.GENERATE_DIGILOCKER_AADHAAR_LINK,
      method: ALLOWED_METHODS.POST,
      body: {
        referenceId: referenceId,
        redirectURL: `${FE_BASE_URL}${FE_ROUTES.INSTANT_ONBOARDING}`,
      },
    });
    analytics?.trackAsync(Events.GENERATE_DIGILOCKER_AADHAAR_LINK, {
      referenceId: referenceId,
      success: response.success,
    });
    if (response.success && response.data) {
      // @ts-ignore
      let digiLockerUrl: string = response.data.link;
      return digiLockerUrl;
    } else {
      setDigiLockerError(Locale.digiLockerWentWrongMessage);
      setDigiLockerRedirectPopup(false);
      setAadhaarVerifyLoading(false);
      return "";
    }
  };
  const onConfirmOtpClick = async () => {
    setPhoneLoading(true);
    try {
      const response = await beCall({
        path: BE_ROUTES.VERIFY_DIRECTOR_OTP_SAVE_DATA,
        method: ALLOWED_METHODS.POST,
        body: {
          otp: otp,
          name: shortName,
          phone: `+91${mobileNumber}`,
        },
      });
      analytics?.trackAsync(Events.MOBILE_OTP_SUBMIT, { phoneNumber: mobileNumber, success: response.success });
      if (response.success && response.data) {
        refetchUserState();
        refetch();
        openPhonePopup(false);
        setPhoneLoading(false);
      } else {
        throw response;
      }
    } catch (e: any) {
      const message = parseErrorMessage(e);
      setPhoneLoading(false);
      if (message === "PAN_BLACKLISTED") {
        setArchiveOrBlacklistPopup(true);
        openPhonePopup(false);
        return;
      }
      if (message === "WRONG_OTP" || !e?.data) {
        setPhoneOtpError(Locale.wrongAadhaarOtp);
        return;
      }
      if (message === "MAX_RETRIES_REACHED") {
        setPhoneOtpError(Locale.maxRetries);
        return;
      }
      openPhonePopup(false);
      setPhoneOtpError("");
      addToast({
        type: TOAST_TYPES.ERROR,
        id: "aadhaar_otp_error",
        body: Locale.wentWrongMessage,
      });
    }
  };

  const onAadhaarVerifyClick = async () => {
    const aadhaar = aadhaarNumber?.join("");
    if (isInvalid(aadhaar, true)) {
      setAadhaarError(Locale.invalidAadhaar);
      return;
    } else {
      setAadhaarError("");
    }
    setAadhaarVerifyLoading(true);
    analytics?.trackAsync(Events.AADHAR_VERIFY_CLICK, { aadhaar: aadhaar.slice(-4) });
    try {
      const res = await beCall({
        path: BE_ROUTES.GENERATE_AADHAAR_OTP,
        method: ALLOWED_METHODS.POST,
        body: {
          aadhaarNo: aadhaar,
        },
      });
      if (res.success) {
        // @ts-ignore
        const requestId = res.data?.requestId;
        aadhaarRequestId.current = requestId;
        setAadhaarVerifyLoading(false);
        setAadhaarOtpAttempt(MAX_ALLOWED_OTP_RETRIES);
        setAadhaarOtpError("");
        openAadhaarPopup(true);
      } else {
        throw res;
      }
    } catch (e) {
      setAadhaarVerifyLoading(false);
      const message = parseErrorMessage(e);
      if (message === "INVALID_AADHAAR") {
        setAadhaarError(Locale.invalidAadhaar);
        return;
      }
      if (message === "MAX_RETRIES_EXCEEDED" || message === "SERVICE UNAVAILABLE") {
        openDigiLockerRedirectPopup();
        return;
      }
      addToast({
        type: "error",
        body: Locale.wentWrongMessage,
        id: "aadhaar_popup",
      });
    }
  };

  const onConfirmAadhaarOtpClick = async () => {
    setAadharLoading(true);
    try {
      const res = await beCall({
        path: BE_ROUTES.VERIFY_AADHAAR_OTP,
        method: ALLOWED_METHODS.POST,
        body: {
          requestId: aadhaarRequestId.current,
          otp: aadhaarOtp,
          aadhaarNo: aadhaarNumber?.join(""),
        },
      });
      analytics?.trackAsync(Events.AADHAR_OTP_SUBMIT, { success: res.success });
      if (res.success) {
        refetch();
        openAadhaarPopup(false);
        setAadharLoading(false);
      } else {
        throw res;
      }
    } catch (e) {
      const message = parseErrorMessage(e);
      setAadharLoading(false);
      if (message !== "INVALID_OTP") {
        openAadhaarPopup(false);
      }
      setAadhaarOtp("");
      aadhaarOtpRef?.current?.focus(0);
      if (message === "INVALID_OTP") {
        setAadhaarOtpError(Locale.wrongAadhaarOtp);
        decrementAadhaarOtpAttempt();
      } else if (message === "NAME_MATCH_FAILED") {
        setAadhaarError(Locale.nameMatchError.replace(":name", fullName));
      } else if (message === "MAX_RETRIES_EXCEEDED" || message === "SERVICE UNAVAILABLE") {
        openDigiLockerRedirectPopup();
        return;
      } else {
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "aadhaar_otp_error",
          body: Locale.wentWrongMessage,
        });
      }
    }
  };

  const isInvalid = (value: string, isAadhaar?: boolean) => {
    if (isAadhaar) {
      return !value || value.length !== 12;
    }
    return !value || value.length !== 10;
  };

  const [aadhaarError, setAadhaarError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const openDigiLockerRedirectPopup = () => {
    setDigiLockerRedirectPopup(true);
  };

  const renderDigiLockeAadhaarVerifyingPopup = () => {
    return (
      <div className="flex items-center flex-col">
        <div className={"w-[305px] h-[172px] relative"}>
          <Image src={"/tracker/aadhaar.png"} layout={"fill"} objectFit={"contain"} />
          <div className="absolute right-0 bottom-0 left-0 top-0 bg-black-700 opacity-50 rounded-20px flex items-center justify-center">
            {" "}
            <Loader isWhite={true} />{" "}
          </div>
        </div>
        <div className="flex flex-row justify-center mt-6 mb-4">
          <Typography
            text={Locale.validatingAadhaar}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontColor={theme.hexColors.black[700]}
          />
        </div>
        <div className="flex flex-row justify-center">
          <Typography
            text={Locale.validatingAadhaarSubtext}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
          />
        </div>
      </div>
    );
  };

  const renderDigiLockeAadhaarInitPopup = () => <DigiLockerPopup digiLockerLinkInitiation={digiLockerLinkInitiation} />;
  const renderAadhaarVerificationPopup = () => {
    return (
      <div>
        <Typography text={Locale.aadhaarOtpTitle} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />
        <CustomisedNavigationForm onSubmit={onConfirmAadhaarOtpClick}>
          <OtpInput
            ref={aadhaarOtpRef}
            onChange={onAadhaarOtpChange}
            error={aadhaarOtpError}
            containerClass={"mt-10 mb-6"}
            otp={aadhaarOtp}
          />
          <ResendOtp
            timeToResend={120}
            onResendOTPClick={() => {
              onAadhaarOtpChange("");
              aadhaarOtpRef?.current?.focus(0);
              void onAadhaarVerifyClick();
            }}
          />
          <div className={"mt-4"}>
            <Typography text={Locale.wrongAadhaarNumber} textClasses={"!text-black-600"} />
            <Typography
              text={Locale.editHere}
              textClasses={"!text-blue-400 ml-1 cursor-pointer"}
              onTextClick={() => openAadhaarPopup(false)}
            />
          </div>
          <Button
            isLoading={isAadhaarOtpLoading}
            onButtonClick={onConfirmAadhaarOtpClick}
            title={Locale.continue}
            size={BUTTON_SIZES.LARGE}
            buttonClass={"mt-6 !w-full justify-center"}
          />
        </CustomisedNavigationForm>
      </div>
    );
  };

  const SelectAadharOnDigilockerPageGuide = () => {
    return (
      <div className={"flex flex-col gap-4 mb-4"}>
        <img src={"/images/SelectAadharDigilocker.png"} width={375} />
        <Typography
          text={Locale.digilockerStepsSignInPart1}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-700"}
          fontWeight={400}
        >
          <Typography
            text={Locale.digilockerStepsSignInPart2}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-700"}
            fontWeight={700}
          />
          <Typography
            text={Locale.digilockerStepsSignInPart3}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-700"}
            fontWeight={400}
          />
          <Typography
            text={Locale.digilockerStepsSignInPart4}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-700"}
            fontWeight={700}
          />
          <Typography
            text={Locale.digilockerStepsSignInPart5}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-700"}
            fontWeight={400}
          />
        </Typography>
      </div>
    );
  };

  const renderPhoneVerificationPopup = () => {
    return (
      <div>
        <Typography
          text={Locale.enterOTP}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"mr-1"}
        />
        <Typography
          text={Locale.phoneNumber.replace(":number", mobileNumber)}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
        />
        <CustomisedNavigationForm onSubmit={onConfirmOtpClick}>
          <OtpInput
            ref={phoneOtpRef}
            error={phoneOtpError}
            otpLength={4}
            onChange={onOtpChange}
            containerClass={"mt-10 mb-6"}
            otp={otp}
          />
          <ResendOtp
            timeToResend={120}
            onResendOTPClick={() => {
              setOtp("");
              phoneOtpRef?.current?.focus(0);
              onResendOtpClick();
            }}
          />
          <div className={"mt-4"}>
            <Typography text={Locale.wrongNumber} textClasses={"!text-black-600"} />
            <Typography
              text={Locale.editHere}
              textClasses={"!text-blue-400 ml-1 cursor-pointer"}
              onTextClick={onEditClick}
            />
          </div>
          <Button
            isLoading={isPhoneOtpLoading}
            onButtonClick={onConfirmOtpClick}
            title={Locale.continue}
            size={BUTTON_SIZES.LARGE}
            buttonClass={"mt-6 !w-full justify-center"}
          />
        </CustomisedNavigationForm>
      </div>
    );
  };

  const title = INDIVIDUAL_BUSINESSES.includes(businessType)
    ? Locale.verifySolePropsTitleVkyc
    : businessType === BUSSINESS_TYPES.PRIVATE_LIMITED_COMPANY
    ? Locale.uploadUBOPanFormVkyc
    : businessType == BUSSINESS_TYPES.HUF
    ? Locale.verifyHufAadhar
    : Locale.verifyPartnerAadhaarVkyc;
  const subTitle = INDIVIDUAL_BUSINESSES.includes(businessType)
    ? Locale.uploadFreelancerPanSubtextVkyc
    : businessType === BUSSINESS_TYPES.PRIVATE_LIMITED_COMPANY
    ? Locale.uploadBeneSubtitleVkyc
    : businessType == BUSSINESS_TYPES.HUF
    ? Locale.verifyHufAadhaarSubtitleVkyc
    : Locale.verifyPartnerAadhaarSubtitleVkyc;
  const acceptedListHeading =
    businessType === BUSSINESS_TYPES.PRIVATE_LIMITED_COMPANY
      ? Locale.listOfAcceptedDirectors
      : businessType == BUSSINESS_TYPES.HUF
      ? Locale.listOfAcceptedKarta
      : Locale.listOfAcceptedPartners;
  const showDigiLockerCTA = !isAadhaarVerified;

  return (
    <div className={"flex flex-1 flex-col px-4 md:px-0 mb-[120px] md:mb-0"}>
      <CurrStateTitle title={title} subTitle={subTitle} icon={() => <UserIcon stroke={theme.hexColors.white} />} />
      <>
        <div className={"flex flex-col md:flex-row space-y-4 justify-between"}>
          {PRE_SELECTED_AADHAAR_UBOS_BUSINESSES.includes(businessType) &&
          (ubo.length > 0 || exporterUserDetails?.fullName) ? (
            <div className={"flex flex-col gap-1 remaining-area min-w-[150px]"}>
              <Typography
                text={acceptedListHeading}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses={"!text-black-500"}
              />
              {INDIVIDUAL_BUSINESSES.includes(businessType) ? (
                <Typography
                  text={`1. ${exporterUserDetails?.fullName}`}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!font-semibold"}
                />
              ) : (
                ubo.map((item: { fullName: string }, index: number) => (
                  <Typography
                    text={`${ubo.length == 1 ? "" : `${index + 1}.`} ${item.fullName}`}
                    key={index}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    textClasses={"!font-semibold"}
                  />
                ))
              )}
            </div>
          ) : null}
          <div className={"half-flex mb-10 min-w-[350px]"}>
            {!showDigiLockerCTA ? (
              <AadhaarInput
                isAadhaarVerifyLoading={isAadhaarVerifyLoading}
                title={Locale.aadhaarNumber}
                aadhaarNumb={aadhaarNumber}
                onAadhaarChange={(value: any) => {
                  setAadhaarError("");
                  updateAadhaar(value);
                }}
                onAadhaarVerifyClick={onAadhaarVerifyClick}
                isError={!!aadhaarError}
                errorText={aadhaarError}
                containerClass={"mb-6"}
                isVerified={isAadhaarVerified}
              />
            ) : (
              <>
                <div className={"flex flex-col"}>
                  <SelectAadharOnDigilockerPageGuide />
                  <Button
                    leftIcon={() => {
                      return (
                        <div className={"relative w-6 h-6"}>
                          <Image src={"/tracker/digiLockerLogo.png"} layout={"fill"} objectFit={"contain"} />
                        </div>
                      );
                    }}
                    isLoading={isAadhaarVerifyLoading}
                    title={Locale.digiLockerButtonText}
                    onButtonClick={digiLockerButtonClick}
                    buttonClass={"!w-full flex flex-row justify-center"}
                  />
                  {digiLockerError != "" ? (
                    <Typography
                      text={digiLockerError}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={"mt-2 !text-red-400"}
                    />
                  ) : null}
                </div>
              </>
            )}

            {isAadhaarVerified ? (
              <CustomisedNavigationForm onSubmit={onVerifyMobileButtonClick}>
                <div>
                  <TextInput
                    value={shortName}
                    label={Locale.shortName}
                    inputClass={"mb-6"}
                    onChange={(value: any) => setShortName(value)}
                    isDisabled={phoneVerified}
                  />
                  <div className={"flex flex-row mt-2"}>
                    <TextInput
                      value={mobileNumber}
                      onChange={(value: string) => {
                        changeMobileNumber(value);
                        setPhoneError("");
                      }}
                      label={Locale.mobileNumber}
                      leftElement={renderCountryCode}
                      labelTextClass={"text-black-700"}
                      // rightElement={() => renderPhoneVerificationCTAs()}
                      isError={!!phoneError}
                      footerText={phoneError ? phoneError : Locale.mobileInputFooter.replace(":company", companyName)}
                      isDisabled={phoneVerified}
                    />
                    <Button
                      onButtonClick={() => {
                        if (phoneVerified) {
                          return;
                        }
                        onVerifyMobileButtonClick();
                      }}
                      isLoading={isPhoneVerifyLoading}
                      title={phoneVerified ? Locale.verified : Locale.verify}
                      buttonClass={phoneVerified ? "mt-6 ml-3 !bg-green-50" : "mt-6 ml-3"}
                      textClasses={phoneVerified ? "!text-green-400" : ""}
                    />
                  </div>
                </div>
              </CustomisedNavigationForm>
            ) : null}
          </div>
        </div>
        {phoneVerified && showDeclarationScreen ? (
          <div ref={pepRef}>
            <hr className={"w-full mt-6 mb-10 border-black-400"} />
            <PepDeclaration sanctionCategories={sanctionCategories} isIndividualBusiness={true} />
          </div>
        ) : (
          <div className={"hide_for_desktop fixed bottom-0 left-0 right-0 bg-white p-4"}>
            <TrustMarkerMobile />
            <Button
              isDisabled={!phoneVerified}
              isLoading={isPhoneVerifyLoading}
              title={phoneVerified ? Locale.verified : Locale.verify}
              onButtonClick={() => {
                if (phoneVerified) {
                  return;
                }
                onVerifyMobileButtonClick();
              }}
              buttonClass={"mt-2 !flex !flex-1 flex-row justify-center !w-full"}
            />
          </div>
        )}
      </>

      {/*Mobile OTP*/}
      <BottomSheet isOpen={isPhonePopupOpen} onClose={() => {}} withCloseIcon={false}>
        {renderPhoneVerificationPopup()}
      </BottomSheet>
      <div className={"hide_for_mob"}>
        <Popup renderContent={renderPhoneVerificationPopup} open={isPhonePopupOpen} />
      </div>

      <Popup renderContent={renderAadhaarVerificationPopup} open={isAadhaarPopupOpen} />

      {/*Aadhaar Verification Loading*/}
      <BottomSheet
        isOpen={isDigiLockerAadhaarProcessingPopupOpen}
        onClose={() => {}}
        containerClass={"hide_for_desktop"}
        withCloseIcon={false}
      >
        {renderDigiLockeAadhaarVerifyingPopup()}
      </BottomSheet>
      <div className={"hide_for_mob"}>
        <Popup renderContent={renderDigiLockeAadhaarVerifyingPopup} open={isDigiLockerAadhaarProcessingPopupOpen} />
      </div>

      <div className={"hide_for_mob"}>
        <Popup renderContent={renderDigiLockeAadhaarInitPopup} open={isDigiLockerRedirectPopupOpen} />
      </div>
      {/*  Figure out: If above pop up is built on bottom sheet, automatically digilocker flow opens*/}
    </div>
  );
};

export default UBOFormVkyc;
