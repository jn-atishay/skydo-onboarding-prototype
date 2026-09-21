import { useContext } from "react";
import Notes from "../components/AtomicComponents/Notes";
import Typography from "../components/AtomicComponents/Typography";
import AppContext from "../context/AppContext";
import useDocInputStore from "../store/useDocInputStore";
import Locale from "../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../constants/atomicConstants";
import useAnalytics from "../analytics/useAnalytics";
import { Events } from "../analytics/EventConstants";

export const IEC_ERROR_CODES = {
  NO_RECORD_FOUND: "NO_RECORD_FOUND",
  IEC_DEACTIVATED: "IEC_DEACTIVATED",
  IEC_NAME_MISMATCH: "IEC_NAME_MISMATCH",
  API_ERROR: "API_ERROR",
};

const IecErrorNote = ({ className }: { className?: string }) => {
  const { iecErrorType, setShowIecActivatePopup } = useDocInputStore();
  const { setShowHelpPopup } = useDocInputStore();
  const { theme } = useContext(AppContext);
  const analytics = useAnalytics();

  const renderIecErrorNote = () => {
    if (iecErrorType === IEC_ERROR_CODES.IEC_DEACTIVATED) {
      return (
        <Notes
          text={
            <Typography
              text={Locale.howDoIActivateMyIec}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!font-semibold"}
            >
              <Typography
                text={Locale.knowMore}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-semibold !text-blue-400 ml-1 cursor-pointer"}
                onTextClick={() => {
                  setShowIecActivatePopup(true);
                  analytics.trackAsync(Events.IEC_VERIFICATION.IEC_SUPPORT_CLICK, {
                    source: iecErrorType,
                  });
                }}
              />
            </Typography>
          }
          iconHeight={24}
          iconWidth={24}
          iconColor={theme.hexColors.blue[400]}
          className={"!bg-blue-50 border-blue-200 border"}
        />
      );
    }
    if (iecErrorType === IEC_ERROR_CODES.IEC_NAME_MISMATCH) {
      return (
        <Notes
          text={
            <Typography
              text={Locale.iecNameMismatch}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!font-semibold"}
            >
              <Typography
                text={Locale.contactSupportWithCaps}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-semibold !text-blue-400 mx-1 cursor-pointer"}
                onTextClick={() => {
                  setShowHelpPopup(true);
                  analytics.trackAsync(Events.IEC_VERIFICATION.IEC_SUPPORT_CLICK, {
                    source: iecErrorType,
                  });
                }}
              />
              <Typography
                text={Locale.ifYouNeedFurtherHelp}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!font-semibold"}
              />
            </Typography>
          }
          iconHeight={24}
          iconWidth={24}
          iconColor={theme.hexColors.blue[400]}
          className={"!bg-blue-50 border-blue-200 border"}
        />
      );
    }
    return (
      <Notes
        text={
          <Typography
            text={Locale.weCouldNotVerifyIec}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!font-semibold"}
          >
            <Typography
              text={Locale.contactSupport}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!font-semibold !text-blue-400 cursor-pointer"}
              onTextClick={() => {
                setShowHelpPopup(true);
                analytics.trackAsync(Events.IEC_VERIFICATION.IEC_SUPPORT_CLICK, {
                  source: iecErrorType,
                });
              }}
            />
          </Typography>
        }
        iconHeight={24}
        iconWidth={24}
        iconColor={theme.hexColors.blue[400]}
        className={"!bg-blue-50 border-blue-200 border"}
      />
    );
  };

  if (
    iecErrorType === IEC_ERROR_CODES.IEC_DEACTIVATED ||
    iecErrorType === IEC_ERROR_CODES.IEC_NAME_MISMATCH ||
    iecErrorType === IEC_ERROR_CODES.API_ERROR
  ) {
    return <div className={className}>{renderIecErrorNote()}</div>;
  }

  return null;
};

export default IecErrorNote;
