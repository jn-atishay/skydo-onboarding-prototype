import React, { useEffect, useRef, useState } from "react";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import Button from "../AtomicComponents/Button";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES } from "../../constants/atomicConstants";
import HelpWidget from "../Common/HelpWidget";
import { PopupModal, useCalendlyEventListener } from "react-calendly";
import useUserData from "../../store/useUserData";
import QuestionIcon from "../Icons/QuestionIcon";

type CalendalyBookADemoProps = {
  setBookADemoPopupOpen: (value: boolean) => void;
  isBookADemoPopupOpen: boolean;
  loggedInUserEmail: string;
  userName: string;
};
const CalendalyBookADemo = (props: CalendalyBookADemoProps) => {
  const analytics = useAnalytics();

  useCalendlyEventListener({
    onProfilePageViewed: () => {
      analytics.trackAsync(Events.CALENDLY_PROFILE_PAGE_VIEW, { eventType: "book_demo" });
    },
    onDateAndTimeSelected: () => {
      analytics.trackAsync(Events.CALENDLY_DATE_TIME_SELECTED, { eventType: "book_demo" });
    },
    onEventTypeViewed: () => {
      analytics.trackAsync(Events.CALENDLY_EVENT_TYPE_VIEWED, { eventType: "book_demo" });
    },
    onEventScheduled: (e) => {
      analytics.trackAsync(Events.CALENDLY_EVENT_SCHEDULED, { eventType: "book_demo" });
    },
  });
  return (
    <PopupModal
      onModalClose={() => {
        props.setBookADemoPopupOpen(false);
      }}
      open={props.isBookADemoPopupOpen}
      rootElement={document.getElementById("__next") as HTMLElement}
      url={`https://calendly.com/d/cnkb-s72-bw5/skydo-demo`}
      prefill={{
        email: props.loggedInUserEmail,
        name: props.userName,
      }}
    />
  );
};

const Help = () => {
  const [openHelpPopup, openPopupState] = useState(false);
  const buttonRef = useRef<HTMLInputElement | null>(null);
  const helpContentRef = useRef<HTMLInputElement | null>(null);
  const analytics = useAnalytics();
  const [isBookADemoPopupOpen, setBookADemoPopupOpen] = useState(false);
  const { userName, loggedInUserEmail, fetchLoggedInUserDetails } = useUserData();

  useEffect(() => {
    fetchLoggedInUserDetails();
  }, []);
  const onHelpClick = (event: React.MouseEvent) => {
    openPopupState((v) => !v);
    analytics.trackAsync(Events.HEADER_HELP_ICON_CLICK);
    // event.preventDefault();
    // event.stopPropagation();
  };

  function onBodyClick(event: any) {
    const target = event.target as HTMLInputElement;
    if (buttonRef?.current?.contains(target)) {
      return;
    }
    if (!helpContentRef?.current?.contains(target)) {
      openPopupState(false);
    }
    return;
  }

  useEffect(() => {
    document.addEventListener("click", onBodyClick);
    return () => {
      document.removeEventListener("click", onBodyClick);
    };
  }, []);

  return (
    <div className={"relative mr-6"} ref={buttonRef}>
      <Button
        title={Locale.getInTouch}
        type={BUTTON_TYPES.SECONDARY}
        size={BUTTON_SIZES.X_SMALL}
        rightIcon={() => <QuestionIcon stroke={"#0A2540"} />}
        onButtonClick={onHelpClick}
        buttonClass={"hover:!shadow-elevation1 focus:!shadow-elevation1"}
      />
      {openHelpPopup ? (
        <HelpWidget
          ref={helpContentRef}
          closeWidget={() => {
            openPopupState(false);
          }}
          setBookADemoPopupOpen={setBookADemoPopupOpen}
        />
      ) : null}
      {isBookADemoPopupOpen ? (
        <CalendalyBookADemo
          isBookADemoPopupOpen={isBookADemoPopupOpen}
          setBookADemoPopupOpen={setBookADemoPopupOpen}
          loggedInUserEmail={loggedInUserEmail}
          userName={userName}
        />
      ) : null}
    </div>
  );
};

export default Help;
