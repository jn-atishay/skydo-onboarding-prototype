import { useEffect, useRef, useState } from "react";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import useToastMessages from "../../store/toastMessages";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import Locale from "../../util/locale/en";
import { TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import UnsupportedPanPopup from "./UnsupportedPanPopup";
import CurrStateTitle from "../Common/CurrStateTitle";
import CustomisedNavigationForm from "../AtomicComponents/CustomisedNavigationForm";
import PanInput from "../Common/AlphaNumericInput";
import Button from "../AtomicComponents/Button";
import PANCardIcon from "../Icons/PANCardIcon";
import Popup from "../AtomicComponents/Popup";
import { TrustMarkerMobile } from "../TrustMarker";
import classNames from "classnames";
import GlobeIcon from "../Icons/GlobeIcon";
import PanAlreadyRegisteredPopup from "./PanAlreadyRegisteredPopup";
import BottomSheet from "../AtomicComponents/BottomSheet";
import useArchiveOrBlacklistStore from "../../store/useArchiveOrBlacklistStore";
import useUserData from "../../store/useUserData";
import Notes from "../AtomicComponents/Notes";
import Typography from "../AtomicComponents/Typography";
import BusinessTypeSelector from "./BusinessTypeSelector";

const CompanyPANInput = ({
  refetch,
  isForcePanInput,
  businessPAN,
}: {
  refetch: () => void;
  isForcePanInput: boolean;
  businessPAN: string | undefined;
}) => {
  const { loggedInUserEmail, phoneNumber } = useUserData();
  const [panNumber, changePanNumber] = useState(isForcePanInput ? "" : businessPAN);
  const [isLoading, setLoading] = useState(false);
  const [panError, setPanError] = useState("");
  const [isUnsupportedPopupOpen, setUnsupportedPopup] = useState(false);
  const [panAlreadyRegisteredPopup, setPanAlreadyRegisteredPopup] = useState(false);
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const { setArchiveOrBlacklistPopup } = useArchiveOrBlacklistStore();
  const analytics = useAnalytics();
  const isPersonalPan = panNumber?.[3] === "P";
  const isPartnerShipLlpPan = panNumber?.[3] === "F";
  const refForPersonalPanNote = useRef<HTMLDivElement>(null);
  const refForBusinessTypeSelector = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isPersonalPan) {
      refForPersonalPanNote.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [isPersonalPan]);

  useEffect(() => {
    if (isPartnerShipLlpPan) {
      refForBusinessTypeSelector.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    } else {
      setSelectedBusinessType("");
    }
  }, [isPartnerShipLlpPan]);

  useEffect(() => {
    analytics?.trackAsync(Events.ENTITY_SCREEN_LOAD);
  }, [analytics]);

  useEffect(() => {
    if (businessPAN && !isForcePanInput) {
      changePanNumber(businessPAN);
    }
  }, [businessPAN]);

  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));

  const onPanChange = (value: string) => {
    changePanNumber(value);
    setPanError("");
  };

  const onVerifyPan = async () => {
    if (isPartnerShipLlpPan && !selectedBusinessType) {
      return;
    }
    setLoading(true);
    setPanError("");
    try {
      const response = await beCall({
        path: BE_ROUTES.CREATE_EXPORTER_PAN,
        method: "POST",
        body: {
          pan: panNumber,
          ...(isPartnerShipLlpPan ? { businessType: selectedBusinessType } : {}),
        },
      });
      analytics?.trackAsync(Events.ENTITY_PAN_SUBMIT, { success: response.success, message: response.message || "" });
      setLoading(false);
      if (response.success) {
        analytics?.fireMarketingEvent(Events.TAG_MANAGER_EVENT.ENTER_COMPANY_PAN, {
          email_address: loggedInUserEmail,
          phone_number: phoneNumber,
          country: "IN",
        });
        refetch();
      } else {
        throw response;
      }
    } catch (e: any) {
      if (e.message === "NO_RECORD_FOUND") {
        setPanError("No record found for this PAN. Kindly enter a valid PAN or contact support.");
      } else if (e.message === "INVALID_PAN") {
        setPanError("Invalid PAN format. Kindly enter a valid PAN.");
      } else if (e.message === "ALREADY_REGISTERED_PAN") {
        setPanError(Locale.alreadyRegisteredPan);
      } else if (e.message?.includes("NO_GSTN_FOUND")) {
        /*
         * using include because exception is coming in the form of com.skydo....Exception
         * */
        setPanError(Locale.noGstnFound);
      } else if (e.message?.includes("NO_ACTIVE_GSTIN")) {
        setPanError(Locale.noActiveGstin);
      } else if (e.message === "UNSUPPORTED_PAN") {
        setUnsupportedPopup(true);
      } else if (e.message === "PAN_ALREADY_USED") {
        setPanAlreadyRegisteredPopup(true);
      } else if (e.message === "PAN_BLACKLISTED") {
        setArchiveOrBlacklistPopup(true);
      } else {
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "pan_error",
          body: Locale.panProfileErrorIssue,
        });
      }
    } finally {
      return;
    }
  };

  const renderUnsupportedPan = () => <UnsupportedPanPopup setUnsupportedPopup={setUnsupportedPopup} />;

  const renderPanAlreadyUsedPopup = () => (
    <PanAlreadyRegisteredPopup setPanAlreadyRegisteredPopup={setPanAlreadyRegisteredPopup} />
  );

  const renderPopupContent = () => {
    if (isUnsupportedPopupOpen) {
      return renderUnsupportedPan();
    }
    return null;
  };

  const allPopupsHidden = !isUnsupportedPopupOpen;

  return (
    <div className={classNames("flex flex-1 flex-col md:flex-row md:px-0")}>
      {allPopupsHidden ? (
        <div className={"flex flex-col"}>
          <div className={"flex flex-col-reverse md:flex-row flex-1 pb-[144px] md:pb-0"}>
            <div className={"content-area md:mr-28 flex-col"}>
              <CurrStateTitle
                containerClass={"mt-2 md:mt-0"}
                title={Locale.enterCompanyPan}
                subTitle={Locale.enterCompanyPanSubtitle}
                icon={() => <GlobeIcon width={16} height={16} />}
              />
              <CustomisedNavigationForm onSubmit={onVerifyPan}>
                <PanInput
                  onChange={onPanChange}
                  placeholder={"ABJCS8987H"}
                  value={panNumber}
                  label={""}
                  errorText={panError}
                  isError={!!panError}
                />
                <div className={"mt-4"}>
                  <Typography
                    text={Locale.solePropFreelancerNote}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_SMALL}
                    textClasses={"!text-xs !font-semibold"}
                  >
                    <Typography
                      text={Locale.shouldEnterPersonalPan}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_SMALL}
                      textClasses={"!text-xs !text-black-500"}
                    />
                  </Typography>
                </div>
                {isPartnerShipLlpPan ? (
                  <div ref={refForBusinessTypeSelector}>
                    <BusinessTypeSelector
                      selectedBusinessType={selectedBusinessType}
                      onSelect={setSelectedBusinessType}
                      containerClass={"mt-4 md:mt-6"}
                    />
                  </div>
                ) : null}
                <Button
                  isLoading={isLoading}
                  title={Locale.verifyPanCta}
                  onButtonClick={onVerifyPan}
                  buttonClass={"md:mt-6 mt-2 hidden md:!flex flex-row justify-center"}
                  isDisabled={!panNumber || (isPartnerShipLlpPan && !selectedBusinessType)}
                />
              </CustomisedNavigationForm>
              {isPersonalPan ? (
                <div ref={refForPersonalPanNote}>
                  <Notes
                    text={Locale.enterBusinessPanIfBusiness}
                    className={"mt-6 md:hidden !bg-blue-50 border border-blue-200"}
                    iconColor={"#276EF1"}
                  />
                </div>
              ) : null}
            </div>
            <div className={"remaining-area"}>
              <PANCardIcon containerClass={"w-[75px] h-[60px] md:w-[257px] md:h-[191px]"} />
            </div>
            <div className={"hide_for_desktop fixed bottom-0 left-0 right-0 p-4 bg-white"}>
              <Button
                isLoading={isLoading}
                title={Locale.verifyPanCta}
                onButtonClick={onVerifyPan}
                buttonClass={"mt-2 !flex !flex-1 flex-row justify-center !w-full"}
                isDisabled={!panNumber || (isPartnerShipLlpPan && !selectedBusinessType)}
              />
              <TrustMarkerMobile />
            </div>
          </div>
          {isPersonalPan ? (
            <Notes
              text={Locale.enterBusinessPanIfBusiness}
              className={"mt-8 !hidden md:!flex !bg-blue-50 border border-blue-200"}
              iconColor={"#276EF1"}
            />
          ) : null}
        </div>
      ) : (
        <div className={"hide_for_desktop max-h-screen flex items-center md:mt-0"}>{renderPopupContent()}</div>
      )}
      <div className={"!hide_for_mob"}>
        <Popup
          renderContent={renderUnsupportedPan}
          open={isUnsupportedPopupOpen}
          outsideClick={() => setUnsupportedPopup(false)}
          containerClass={"!pb-0 !px-0"}
        />
        <Popup
          renderContent={renderPanAlreadyUsedPopup}
          open={panAlreadyRegisteredPopup}
          outsideClick={() => setPanAlreadyRegisteredPopup(false)}
          containerClass={"!pb-0 !px-0 !w-[448px]"}
        />
      </div>
      <div className={"hide_for_desktop"}>
        <BottomSheet
          withCloseIcon={false}
          isOpen={panAlreadyRegisteredPopup}
          onClose={() => setPanAlreadyRegisteredPopup(false)}
        >
          {renderPanAlreadyUsedPopup()}
        </BottomSheet>
      </div>
    </div>
  );
};

export default CompanyPANInput;
