//Jul 2023

import useEInvoicingStore from "../../store/useEInvoicingStore";
import Popup from "../AtomicComponents/Popup";
import ArrowLeftIcon from "../Icons/ArrowLeftIcon";
import React, { useContext, useState } from "react";
import Button from "../AtomicComponents/Button";
import {
  BadgeSizes,
  BadgeTypes,
  BUTTON_SIZES,
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import Image from "next/image";
import Badge from "../AtomicComponents/Badge";
import RadioButton from "../AtomicComponents/RadioButton";
import StepWiseDetails from "../Common/StepWiseDetails";
import { getCompanyName } from "../../util/functions";
import { UserDetailsContext } from "../DashboardContainer";
import useToastMessages from "../../store/toastMessages";
import TextInput from "../AtomicComponents/TextInput";
import beCall from "../../util/beCall";
import EInvoiceIcon from "../Icons/EInvoiceIcon";
import IconContainer from "../Common/IconContainer";
import BE_ROUTES from "../../util/beRoutes";
import { SERVICES } from "../../constants/apiConstants";
import useUserData from "../../store/useUserData";

interface Props {}

enum EInvoicePopupStates {
  Description = "Description",
  Step0 = "Step0",
  Step1 = "Step1",
  Step2 = "Step2",
  Step3 = "Step3",
}

enum EInvoiceRegistrationStatus {
  Registered = "registered",
  NotSure = "notSure",
}

const EInvoicingPopup = (props: Props) => {
  const {} = props;
  const { exporterDetails, refetchUserDetails } = useContext(UserDetailsContext);
  const { userDetailsPreKyc } = useUserData();
  const {
    openSampleEInvoicePopup,
    showSampleEInvoice,
    isPopupVisible,
    closeEInvoicePopup,
    showBackButton,
    startWithDescription,
    onSuccess,
    onSkip,
    openSampleEInvoice,
    onClose,
    gstin: gstIn,
  } = useEInvoicingStore();
  const initialPopupState = startWithDescription ? EInvoicePopupStates.Description : EInvoicePopupStates.Step0;
  const [popupState, setPopupState] = useState<EInvoicePopupStates>(initialPopupState);
  const [registrationStatus, setRegistrationStatus] = useState<EInvoiceRegistrationStatus | null>(null);
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const [userName, setUserName] = useState<string>("");
  const [userNameError, setUserNameError] = useState<string>("");
  const [passwordError, setPasswordError] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isSkipButtonLoading, setIsSkipButtonLoading] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const onCopyGstinClick = () => {
    navigator?.clipboard
      ?.writeText(gstIn)
      .then(() => {
        addToast({
          type: TOAST_TYPES.SUCCESS,
          id: "success_copied",
          body: Locale.copied,
          time: 2000,
        });
      })
      .catch(() => console.log("Error copying"));
  };
  const renderImage = (url: string) => (
    <div className={"w-[230px] h-[130px] relative overflow-hidden"}>
      <Image src={url} layout={"fill"} objectFit={"contain"} alt={""} />
    </div>
  );

  const step1Map = [
    {
      body: () => {
        return (
          <Typography text={Locale.goToEInvoicingPortal} fontWeight={700}>
            <a href={"https://einvoice1.gst.gov.in/"} target={"_blank"} rel={"noopener noreferrer"}>
              <Typography text={"https://einvoice1.gst.gov.in/"} fontWeight={700} textClasses={"!text-blue-400 ml-1"} />
            </a>
          </Typography>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step1NS.webp"),
    },
    {
      body: () => {
        return (
          <ul className={"list-disc ml-3.5"}>
            <li>
              <Typography text={Locale.clickOn}>
                <Typography text={`"${Locale.registration}"`} fontWeight={700} />
              </Typography>
            </li>
            <li>
              <Typography text={Locale.click}>
                <Typography text={`"${Locale.portalLogin}"`} fontWeight={700} />
                <Typography text={Locale.toOpenEInvoicePortal} />
              </Typography>
            </li>
          </ul>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step2NS.webp"),
    },
    {
      body: () => {
        return (
          <div>
            <Typography
              text={Locale.enterExporterGst.replace(
                ":exporter",
                getCompanyName({ ...exporterDetails, defaultVal: userDetailsPreKyc?.businessName })
              )}
            />
            <div
              className={"mt-1 h-12 px-4 py-3.5 flex flex-row items-center rounded-10px border border-black-400 w-fit"}
            >
              <Typography text={gstIn} type={TYPOGRAPHY_TYPES.LABEL} />
              <Typography
                text={Locale.copy}
                onTextClick={onCopyGstinClick}
                type={TYPOGRAPHY_TYPES.LABEL}
                textClasses={"!text-blue-400 !ml-44 cursor-pointer"}
              />
            </div>
          </div>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step3NS.webp"),
    },
    {
      body: () => {
        return (
          <Typography text={Locale.verifyDetail} fontWeight={700}>
            <Typography text={Locale.and} textClasses={"ml-1"} />
            <Typography text={Locale.enterOtp} fontWeight={700} textClasses={"ml-1"} />
          </Typography>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step4NS.webp"),
    },
    {
      body: () => {
        return (
          <ul className={"list-disc ml-3.5"}>
            <li>
              <Typography text={Locale.enterThe}>
                <Typography text={Locale.usernameAndPass} fontWeight={700} textClasses={"ml-1"} />
              </Typography>
            </li>
            <li>
              <Typography text={Locale.confirmPass} fontWeight={700} />
            </li>
            <li>
              <Typography text={Locale.click}>
                <Typography text={`"${Locale.save}"`} fontWeight={700} textClasses={"ml-1"} />
              </Typography>
            </li>
          </ul>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step5NS.webp"),
    },
  ];

  const step2Map = [
    {
      body: () => {
        return (
          <Typography text={Locale.goToEInvoicingPortal} fontWeight={700}>
            <a href={"https://einvoice1.gst.gov.in/"} target={"_blank"} rel={"noopener noreferrer"}>
              <Typography text={"https://einvoice1.gst.gov.in/"} fontWeight={700} textClasses={"!text-blue-400 ml-1"} />
            </a>
          </Typography>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step1NS.webp"),
    },
    {
      body: () => {
        return (
          <div>
            <ul className={"list-disc ml-3.5"}>
              <li>
                <Typography text={Locale.click}>
                  <Typography text={`"${Locale.login}"`} fontWeight={700} textClasses={"ml-1"} />
                </Typography>
              </li>
              <li>
                <Typography text={Locale.enter}>
                  <Typography text={`${Locale.usernameAndPass}`} fontWeight={700} textClasses={"ml-1"} />
                  <Typography text={Locale.withCaptcha} textClasses={"ml-1"} />
                </Typography>
              </li>
            </ul>
          </div>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step2R.webp"),
    },
    {
      body: () => {
        return (
          <ul className={"list-disc"}>
            <li>
              <Typography text={Locale.click}>
                <Typography text={`"${Locale.apiReg}"`} fontWeight={700} textClasses={"ml-1"} />
                <Typography text={Locale.frmLftMenu} textClasses={"ml-1"} />
              </Typography>
            </li>
            <li>
              <Typography text={Locale.select}>
                <Typography text={`"${Locale.userCreds}"`} fontWeight={700} textClasses={"ml-1"} />
              </Typography>
            </li>
            <li>
              <Typography text={Locale.select}>
                <Typography text={`"${Locale.crtApiUsr}"`} fontWeight={700} textClasses={"ml-1"} />
              </Typography>
            </li>
          </ul>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step3R.webp"),
    },
    {
      body: () => {
        return (
          <Typography text={Locale.enterOtp} fontWeight={700}>
            <Typography text={Locale.rcvregMobNo} textClasses={"ml-1"} />
          </Typography>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step4R.jpeg"),
    },
    {
      body: () => {
        return (
          <Typography text={Locale.clickOn}>
            <Typography text={`'${Locale.thrGsp}'`} fontWeight={700} textClasses={"ml-1"} />
          </Typography>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step5R.jpeg"),
    },
    {
      body: () => {
        return (
          <Typography text={Locale.selectGsp}>
            <Typography text={`'${Locale.vayNSPL}'`} fontWeight={700} textClasses={"ml-1"} />
          </Typography>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step6R.jpeg"),
    },
    {
      body: () => {
        return (
          <ul className={"list-disc ml-3.5"}>
            <li>
              <Typography text={Locale.fill}>
                <Typography text={Locale.apiUsrnmAndPass} fontWeight={700} textClasses={"ml-1"} />
              </Typography>
            </li>
            <li>
              <Typography text={Locale.click}>
                <Typography text={`"${Locale.submit}"`} fontWeight={700} textClasses={"ml-1"} />
              </Typography>
            </li>
          </ul>
        );
      },
      renderIcon: () => renderImage("/EInvoiceImages/step7R.jpeg"),
    },
  ];

  const onSaveUserCreds = () => {
    let isErr = false;
    if (!userName) {
      isErr = true;
      setUserNameError("API Username is required");
    }
    if (!password) {
      isErr = true;
      setPasswordError("API Password is required");
    }
    if (isErr) return;
    setIsLoading(true);

    void beCall({
      method: "POST",
      path: BE_ROUTES.SAVE_E_INVOICE_CREDS,
      server: SERVICES.CHALLAN,
      body: {
        username: window.btoa(userName),
        password: window.btoa(password),
        gstin: gstIn,
      },
      onSuccess: (data) => {
        if (data?.success) {
          addToast({
            type: TOAST_TYPES.SUCCESS,
            body: "E-invoicing successfully enabled.",
            id: "saveUserCreds",
          });
          onSuccess?.();
          closeEInvoicePopup();
          openSampleEInvoice && openSampleEInvoicePopup();
          setIsLoading(false);
          refetchUserDetails();
        } else {
          throw data;
        }
      },
      onError: (e: any) => {
        setIsLoading(false);
        if (e?.message === "AUTHENTICATE_E_INVOICE") {
          addToast({
            type: TOAST_TYPES.ERROR,
            body: "Either username or password is incorrect. Please try again.",
            id: "saveUserCreds",
          });
        } else {
          addToast({
            type: TOAST_TYPES.ERROR,
            body: "Failed to save user credentials, Please try again later.",
            id: "saveUserCreds1",
          });
        }
      },
    });
  };
  const onCtaClick = () => {
    if (popupState === EInvoicePopupStates.Step3) {
      onSaveUserCreds();
    } else {
      const states = Object.values(EInvoicePopupStates);
      const index = states.indexOf(popupState);
      setPopupState(states[index + 1]);
    }
  };

  const getCurrStep = () => {
    if (popupState === EInvoicePopupStates.Step1) {
      return 1;
    }
    if (popupState === EInvoicePopupStates.Step2) {
      if (registrationStatus === EInvoiceRegistrationStatus.Registered) return 1;
      return 2;
    }
    if (popupState === EInvoicePopupStates.Step3) {
      if (registrationStatus === EInvoiceRegistrationStatus.Registered) return 2;
      return 3;
    }
    return 0;
  };

  const getTotalsSteps = () => {
    if (registrationStatus === EInvoiceRegistrationStatus.NotSure) return 3;
    if (registrationStatus === EInvoiceRegistrationStatus.Registered) return 2;
    return 0;
  };
  const renderCta = () => {
    if (popupState === EInvoicePopupStates.Step0 || popupState === EInvoicePopupStates.Description) return null;
    const curr = getCurrStep();
    const total = getTotalsSteps();
    const title =
      popupState === EInvoicePopupStates.Step3
        ? Locale.connectAndAuthSkydo
        : Locale.stepOutOf.replace(":curr", curr.toString()).replace(":total", total.toString());
    return <Button isLoading={isLoading} title={title} size={BUTTON_SIZES.SMALL} onButtonClick={onCtaClick} />;
  };

  const renderGstinStepSelector = () => {
    return (
      <div className={"w-full flex flex-col items-center"}>
        <div className={"mb-2"}>
          <Typography text={Locale.gstinTitle} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
        </div>
        <div className={"flex_row_item_center mb-4"}>
          <Typography text={Locale.forGstin} size={TYPOGRAPHY_SIZES.SMALL}></Typography>
          <Badge
            size={BadgeSizes.Medium}
            type={BadgeTypes.Full}
            title={gstIn}
            className={"!bg-yellow-400 ml-1 flex items-center justify-center"}
            textClasses={"!text-black-700"}
          />
        </div>
        <div className={"flex_row_item_center gap-6"}>
          <RadioButton
            label={Locale.noOrDontKnow}
            checked={registrationStatus === EInvoiceRegistrationStatus.NotSure}
            onChange={() => {
              setRegistrationStatus(EInvoiceRegistrationStatus.NotSure);
              setPopupState(EInvoicePopupStates.Step1);
            }}
            id={"noOrDontKnow"}
          />
          <RadioButton
            label={Locale.yes}
            checked={registrationStatus === EInvoiceRegistrationStatus.Registered}
            onChange={() => {
              setRegistrationStatus(EInvoiceRegistrationStatus.Registered);
              setPopupState(EInvoicePopupStates.Step2);
            }}
            id={"EIyes"}
          />
        </div>
      </div>
    );
  };

  const renderStepTitle = (title: string, className?: string) => {
    const curr = getCurrStep();
    const total = getTotalsSteps();
    return (
      <div className={className}>
        <Typography
          text={`${Locale.stepOutOf.replace(":curr", curr.toString()).replace(":total", total.toString())}:`}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          type={TYPOGRAPHY_TYPES.HEADING}
          textClasses={"!text-green-400"}
        >
          <Typography
            text={title}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            type={TYPOGRAPHY_TYPES.HEADING}
            textClasses={"ml-1"}
          />
        </Typography>
      </div>
    );
  };

  const renderStepDetails = () => {
    if (popupState === EInvoicePopupStates.Description) {
      return (
        <div className={"w-full flex flex-col items-center justify-center text-center"}>
          <IconContainer containerClass={"!w-[136px] !h-[136px] !bg-blue-50 shrink-0"}>
            <EInvoiceIcon className={"shrink-0"} width={90} height={90} />
          </IconContainer>
          <div className={"my-4"}>
            <Typography text={Locale.enableEInvoice} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
          </div>
          <Typography text={Locale.eInvoiceFaqContent} size={TYPOGRAPHY_SIZES.SMALL} />
          <a href={process.env.NEXT_PUBLIC_E_INVOICE_KNOW_MORE_URL} target={"_blank"} rel={"noopener noreferrer"}>
            <Typography text={Locale.knowMore} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-blue-400"} />
          </a>
          <div className={"mt-6 w-full flex_row_item_center justify-center gap-4"}>
            <Button
              isLoading={isSkipButtonLoading}
              title={Locale.skipAndFinalInvoice}
              type={BUTTON_TYPES.SECONDARY}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={async () => {
                setIsSkipButtonLoading(true);
                await onSkip?.();
                setIsSkipButtonLoading(false);
                closeEInvoicePopup();
              }}
            />
            <Button
              title={Locale.enableEInvoice}
              size={BUTTON_SIZES.SMALL}
              onButtonClick={() => setPopupState(EInvoicePopupStates.Step0)}
            />
          </div>
        </div>
      );
    }
    if (popupState === EInvoicePopupStates.Step0) {
      return (
        <div className={"w-full flex flex-col items-center"}>
          <div className={"rounded-10px shadow-elevation4 flex flex-col items-center overflow-hidden w-[280px] mb-10"}>
            <div className={"bg-blue-50 py-2 w-full text-center"}>
              <Typography text={Locale.gstEInvoiceSS} size={TYPOGRAPHY_SIZES.X_X_X_SMALL} />
            </div>
            <div className={"w-full h-[202px] relative"}>
              <Image src={"/EInvoiceImages/eInvoiceRegistration.webp"} alt={""} layout={"fill"} objectFit={"contain"} />
            </div>
          </div>
          {renderGstinStepSelector()}
        </div>
      );
    }
    if (popupState === EInvoicePopupStates.Step1) {
      return (
        <div className={"w-full flex flex-col items-center overflow-auto"}>
          {renderGstinStepSelector()}
          <hr className={"w-full my-10 border-black-400"} />
          <div className={"flex flex-col w-full"}>
            {renderStepTitle(Locale.registerForEInvoice, "mb-10")}
            {step1Map.map((item, index) => {
              const { body, renderIcon } = item;
              const isLast = index === step1Map.length - 1;
              return (
                <StepWiseDetails key={index} index={index} renderBody={body} isLast={isLast} renderIcon={renderIcon} />
              );
            })}
          </div>
        </div>
      );
    }
    if (popupState === EInvoicePopupStates.Step2) {
      return (
        <div className={"w-full flex flex-col items-center overflow-auto"}>
          {renderGstinStepSelector()}
          <hr className={"w-full my-10 border-black-400"} />
          <div className={"flex flex-col w-full"}>
            {renderStepTitle(Locale.setUpEInvoice, "mb-10")}
            {step2Map.map((item, index) => {
              const { body, renderIcon } = item;
              const isLast = index === step2Map.length - 1;
              return (
                <StepWiseDetails key={index} index={index} renderBody={body} isLast={isLast} renderIcon={renderIcon} />
              );
            })}
          </div>
        </div>
      );
    }
    if (popupState === EInvoicePopupStates.Step3) {
      return (
        <div className={"w-full flex flex-col items-center overflow-auto"}>
          {renderGstinStepSelector()}
          <hr className={"w-full my-10 border-black-400"} />
          <div className={"flex flex-col w-full"}>
            {renderStepTitle(Locale.enterApiCredentials)}
            <TextInput
              label={Locale.apiUsrnm}
              value={userName}
              onChange={(value) => {
                setUserName(value);
                setUserNameError("");
              }}
              isError={!!userNameError}
              footerText={userNameError}
              inputClass={"w-full my-6"}
            />
            <TextInput
              label={Locale.apiPass}
              value={password}
              onChange={(value) => {
                setPassword(value);
                setPasswordError("");
              }}
              isError={!!passwordError}
              footerText={passwordError}
              inputClass={"w-full"}
            />
          </div>
        </div>
      );
    }
  };
  const renderContent = () => {
    return (
      <div className={"flex flex-col flex-1 overflow-auto"}>
        <div key={popupState} className={"flex-1 flex flex-col justify-center overflow-auto"}>
          {renderStepDetails()}
        </div>
        <div className={"justify-self-end w-full flex justify-end"}>{renderCta()}</div>
      </div>
    );
  };

  const isBackButtonVisible = () => {
    if (showBackButton) {
      return true;
    }
    return popupState !== initialPopupState;
  };

  const onBackButtonClick = () => {
    if (popupState === initialPopupState && showBackButton) {
      onClose?.();
      closeEInvoicePopup();
      return;
    }
    const states = Object.values(EInvoicePopupStates);
    const index = states.indexOf(popupState);
    let newIndex = index - 1;
    if (
      newIndex &&
      states[newIndex] === EInvoicePopupStates.Step1 &&
      registrationStatus === EInvoiceRegistrationStatus.Registered
    ) {
      newIndex = newIndex - 1;
    }
    if (newIndex && states[newIndex] === EInvoicePopupStates.Step0) {
      setRegistrationStatus(null);
    }

    setPopupState(states[newIndex]);
  };

  const renderTitle = () => {
    if (isBackButtonVisible()) {
      return (
        <div className={"cursor-pointer"} onClick={onBackButtonClick}>
          <ArrowLeftIcon />
        </div>
      );
    } else {
      return "";
    }
  };

  return (
    <Popup
      renderContent={renderContent}
      open={isPopupVisible}
      isDashboardPopup={true}
      isLargePopup={true}
      containerClass={"!h-[80%] flex flex-col"}
      isCommonHeader={true}
      outsideClick={() => {
        onClose?.();
        closeEInvoicePopup();
      }}
      closeIconClick={() => {
        onClose?.();
        closeEInvoicePopup();
      }}
      title={renderTitle()}
    />
  );
};

export default EInvoicingPopup;
