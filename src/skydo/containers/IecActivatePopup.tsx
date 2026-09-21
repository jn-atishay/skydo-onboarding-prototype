import BottomSheet from "../components/AtomicComponents/BottomSheet";
import Popup from "../components/AtomicComponents/Popup";
import Locale from "../util/locale/en";
import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../constants/atomicConstants";
import Typography from "../components/AtomicComponents/Typography";
import Button from "../components/AtomicComponents/Button";
import useSkydoDetails from "../util/customHooks/useSkydoDetails";
import useDocInputStore from "../store/useDocInputStore";
import { Events } from "../analytics/EventConstants";
import useAnalytics from "../analytics/useAnalytics";

const IecActivatePopup = () => {
  const { showIecActivatePopup: isPopupVisible, setShowIecActivatePopup: setIsPopupVisible } = useDocInputStore();
  const { skydoContact, skydoEmail } = useSkydoDetails();
  const analytics = useAnalytics();
  const onClose = () => {
    setIsPopupVisible(false);
  };

  const renderContent = () => {
    return (
      <div>
        <div className={"flex flex-col gap-4 md:gap-6 md:px-6 md:pb-4"}>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex flex-row gap-2 items-center pl-2"}>
              <div className={"w-2 h-2 rounded-full bg-black-700"} />
              <Typography
                text={Locale.iecActivateStep1TitlePart1}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-bold"}
              >
                <a href={"https://www.dgft.gov.in/CP/"} target={"_blank"} rel={"noreferrer"}>
                  <Typography
                    text={Locale.iecActivateStep1TitlePart2}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={"!font-bold !text-blue-400 underline cursor-pointer"}
                  />
                </a>
              </Typography>
            </div>
            <Typography
              text={Locale.iecActivateStep1Subtext}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"text-black-500"}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex flex-row gap-2 items-center pl-2"}>
              <div className={"w-2 h-2 rounded-full bg-black-700"} />
              <Typography
                text={Locale.iecActivateStep2Title}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-bold"}
              />
            </div>
            <Typography
              text={Locale.iecActivateStep2Subtext}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"text-black-500"}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex flex-row gap-2 items-center pl-2"}>
              <div className={"w-2 h-2 rounded-full bg-black-700"} />
              <Typography
                text={Locale.iecActivateStep3Title}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-bold"}
              />
            </div>
            <Typography
              text={Locale.iecActivateStep3Subtext}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"text-black-500"}
            />
          </div>
          <div className={"flex flex-col gap-2"}>
            <div className={"flex flex-row gap-2 items-center pl-2"}>
              <div className={"w-2 h-2 rounded-full bg-black-700"} />
              <Typography
                text={Locale.iecActivateStep4Title}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-bold"}
              />
            </div>
            <Typography
              text={Locale.iecActivateStep4Subtext}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"text-black-500"}
            />
          </div>
          <hr className={"!text-black-400"} />
          <div className={"flex flex-col gap-6 md:flex-row"}>
            <Typography text={Locale.iecVideoText} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.SMALL}>
              <a
                href={"https://www.youtube.com/watch?v=4U1PE4MJWOo"}
                target={"_blank"}
                rel={"noreferrer"}
                onClick={() => analytics?.trackAsync(Events.IEC_VERIFICATION.IEC_VIDEO_CLICK)}
              >
                <Typography
                  text={Locale.videoLink}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-blue-400 underline cursor-pointer !font-bold"}
                />
              </a>
            </Typography>
            <Button
              size={BUTTON_SIZES.SMALL}
              title={Locale.close}
              buttonClass={"!w-full md:!w-fit"}
              onButtonClick={onClose}
            />
          </div>
        </div>
        <div className={"bg-blue-50 p-4 md:px-6 hidden md:flex justify-start"}>
          <Typography
            text={Locale.assistanceTextGeneric
              .replace("{{SkydoContact}}", skydoContact)
              .replace("{{SkydoEmail}}", skydoEmail)}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={"hide_for_mob"}>
        <Popup
          open={isPopupVisible}
          renderContent={renderContent}
          isDashboardPopup={true}
          title={Locale.howToActivateIec}
          outsideClick={onClose}
          isCommonHeader={true}
          closeIconClick={onClose}
          containerClass={"!p-0"}
          headerContainerClass={"p-6 pb-0"}
        />
      </div>
      <div className={"hide_for_desktop"}>
        <BottomSheet
          isOpen={isPopupVisible}
          onClose={onClose}
          title={Locale.howToActivateIec}
          bottomContent={() => (
            <div className={"bg-blue-50 p-4 md:px-6 -mx-6 -mb-6 mt-6 flex justify-start"}>
              <Typography
                text={Locale.assistanceTextGeneric
                  .replace("{{SkydoContact}}", skydoContact)
                  .replace("{{SkydoEmail}}", skydoEmail)}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500"}
              />
            </div>
          )}
        >
          {renderContent()}
        </BottomSheet>
      </div>
    </>
  );
};

export default IecActivatePopup;
