import { useContext, useEffect, useState } from "react";
import AppContext from "../context/AppContext";
import useSkydoDetails from "../util/customHooks/useSkydoDetails";
import Typography from "../components/AtomicComponents/Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../constants/atomicConstants";
import Locale from "../util/locale/en";
import Popup from "../components/AtomicComponents/Popup";
import MailIcon from "../components/Icons/MailIcon";
import CrossIcon from "../components/AtomicComponents/ToastMessages/CrossIcon";
import BottomSheet from "../components/AtomicComponents/BottomSheet";
import WhatsappLineIcon from "../components/Icons/WhatsappLineIcon";
import Button from "../components/AtomicComponents/Button";
import classNames from "classnames";
import FullTick from "../components/Icons/FullTick";
import useDocInputStore from "../store/useDocInputStore";

const DocUploadHelpPopup = ({ informTeam }: { informTeam: (fireEvent: boolean) => void }) => {
  const { theme } = useContext(AppContext);
  const { skydoContact, skydoEmail } = useSkydoDetails();
  const [letUsKnowClicked, setLetUsKnowClicked] = useState(false);
  const { showHelpPopup: open, setShowHelpPopup } = useDocInputStore();
  const onClose = () => {
    setShowHelpPopup(false);
  };

  useEffect(() => {
    setLetUsKnowClicked(false);
  }, [open]);

  const informTeamClick = () => {
    setLetUsKnowClicked(true);
    informTeam(false);
  };

  const TopContent = ({ className }: { className?: string }) => {
    return (
      <div className={classNames("p-6 bg-yellow-50 flex flex-col flex-1 gap-4 md:gap-2", className)}>
        <div className={"flex flex-row items-center gap-4 justify-between"}>
          <Typography
            text={Locale.needHelp}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            fontWeight={"bold"}
          />
          <div className={"cursor-pointer"} onClick={onClose}>
            <CrossIcon stroke={theme.hexColors.black[500]} />
          </div>
        </div>
        <Typography
          text={Locale.ourTeanShouldBeAbleToHelpYou}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-600"}
        />
        {letUsKnowClicked ? (
          <div className={"flex flex-row items-center gap-1"}>
            <FullTick />
            <Typography
              text={Locale.someoneFromOurTeamWillReachOut}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-orange-600"}
            />
          </div>
        ) : (
          <Button
            title={Locale.requestACall}
            type={BUTTON_TYPES.SECONDARY}
            size={BUTTON_SIZES.SMALL}
            buttonClass={"!w-full md:!w-fit"}
            onButtonClick={informTeamClick}
          />
        )}
      </div>
    );
  };

  const renderContent = () => {
    return (
      <div className={"bg-white md:w-[451px] rounded-10px flex flex-col overflow-hidden"}>
        <TopContent className={"hidden md:flex"} />
        <div className={"md:p-6 flex flex-col gap-4"}>
          <div className={"flex flex-row gap-6 items-center"}>
            <div className={"flex-1 flex flex-col gap-4"}>
              <Typography
                text={Locale.callUs}
                fontWeight={"bold"}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                type={TYPOGRAPHY_TYPES.LABEL}
              />
              <div className={"flex flex-row items-center gap-2"}>
                {/*<WhatsappLineIcon width={24} height={24} />*/}
                {/*<a href={`https://wa.me/${skydoContact.replace("-", "")}`} className={"underline"}>*/}
                  <Typography
                    text={skydoContact}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={"bold"}
                  />
                {/*</a>*/}
              </div>
            </div>
            <div className={"flex-1 flex flex-col gap-4"}>
              <Typography
                text={Locale.emailUs}
                fontWeight={"bold"}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                type={TYPOGRAPHY_TYPES.LABEL}
              />
              <div className={"flex flex-row items-center gap-2"}>
                <MailIcon />
                <a href={`mailto:${skydoEmail}`}>
                  <Typography
                    text={skydoEmail}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={"bold"}
                    textClasses={"!text-blue-400"}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className={"border-b border-black-400"} />
          <div className={"flex justify-center"}>
            <Typography
              text={Locale.youWillReceiveResponse}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-600"}
            >
              <Typography
                text={Locale.supportTimings}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight={"bold"}
                textClasses={"!text-black-600 !ml-1"}
              />
            </Typography>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className={"hide_for_mob"}>
        <Popup
          renderContent={renderContent}
          open={open}
          outsideClick={onClose}
          closeIconClick={onClose}
          containerClass={"!p-0"}
          customContainerWidth={true}
        />
      </div>
      <div className={"hide_for_desktop"}>
        <BottomSheet
          isOpen={open}
          onClose={onClose}
          topContent={() => <TopContent className={"flex md:hidden -mx-6 rounded-t-10px"} />}
          withCloseIcon={false}
        >
          {renderContent()}
        </BottomSheet>
      </div>
    </>
  );
};

export default DocUploadHelpPopup;
