/**
 * @author Raj Sheth
 * created: 13/12/23
 */

import React, { FC, useEffect, useState } from "react";
import Popup from "../AtomicComponents/Popup";
import SuggestionPopupContent from "../BusinessAnalytics/SuggestionPopupContent";
import Locale from "../../util/locale/en";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import { SUGGESTION_POPUP_TYPES } from "../BusinessAnalytics/constants";
import CountryRequestFeedbackContent from "./CountryRequestFeedbackContent";

const SuggestionFeedbackPopup: FC = () => {
  const { suggestionPopupType, setSuggestionPopupType } = useInternationalAccountsStore();
  const onCloseSuggestionPopup = () => setSuggestionPopupType("");
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);

  useEffect(() => {
    setSubmitSuccess(false);
  }, [suggestionPopupType]);

  const getTitle = () => {
    switch (suggestionPopupType) {
      case SUGGESTION_POPUP_TYPES.NAV_BAR_INT_ACC_PLATFORM:
        return Locale.whichPlatformsNeeded;
      case SUGGESTION_POPUP_TYPES.NEED_HELP_OTHER_PLATFORMS:
        return Locale.whichPlatform;
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        if (submitSuccess) {
          return "";
        }
        return Locale.focusedHome.moreQuesPopup.title;
      default:
        return Locale.whichCountriesAccountNeeded;
    }
  };

  const getSubtitle = () => {
    switch (suggestionPopupType) {
      case SUGGESTION_POPUP_TYPES.NAV_BAR_INT_ACC_PLATFORM:
        return "";
      case SUGGESTION_POPUP_TYPES.NEED_HELP_OTHER_PLATFORMS:
        return "";
      case SUGGESTION_POPUP_TYPES.HAVE_MORE_QUESTIONS:
        return "";
      default:
        return Locale.whichCountriesAccountNeededSubtitle;
    }
  };

  const renderContent = () => {
    // The international-accounts request asks for countries, not free text.
    if (suggestionPopupType === SUGGESTION_POPUP_TYPES.NAV_BAR_INTERNATIONAL_ACCOUNTS) {
      return <CountryRequestFeedbackContent closePopup={onCloseSuggestionPopup} />;
    }
    return (
      <SuggestionPopupContent
        closePopup={onCloseSuggestionPopup}
        popupType={suggestionPopupType}
        setSubmitSuccess={setSubmitSuccess}
        submitSuccess={submitSuccess}
      />
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      open={!!suggestionPopupType}
      closeIconClick={onCloseSuggestionPopup}
      isCommonHeader={true}
      title={getTitle()}
      subtitle={getSubtitle()}
      isDashboardPopup={true}
      outsideClick={onCloseSuggestionPopup}
    />
  );
};

export default SuggestionFeedbackPopup;
