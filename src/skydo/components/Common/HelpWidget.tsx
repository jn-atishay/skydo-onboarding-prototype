import React, { ForwardedRef } from "react";
import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import MessageIcon from "../Icons/MessageIcon";
import MailIcon from "../Icons/MailIcon";
import Button from "../AtomicComponents/Button";
import useUserData from "../../store/useUserData";
import { USER_STATES } from "../../constants/onboarding";
import useSkydoDetails from "../../util/customHooks/useSkydoDetails";
import { SKYDO_WEBSITE_URL } from "../../config";
import NewPageIcon from "../Icons/NewPageIcon";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import WhatsappLineIcon from "../Icons/WhatsappLineIcon";

interface HelpWidgetProps {
  closeWidget: () => void;
  setBookADemoPopupOpen: (value: boolean) => void;
}

const HelpWidget = React.forwardRef<HTMLDivElement, HelpWidgetProps>(
  ({ closeWidget, setBookADemoPopupOpen }: HelpWidgetProps, ref: ForwardedRef<HTMLDivElement>) => {
    const analytics = useAnalytics();
    const { isTransacting, userState } = useUserData();
    const requestCallback = userState === USER_STATES.BENEFICIARY_ACCOUNT_PENDING && !isTransacting;
    const { skydoContact, skydoEmail } = useSkydoDetails();

    // Show WhatsApp for specific user states
    const showWhatsApp =
      userState === USER_STATES.BENEFICIARY_ACCOUNT_PENDING ||
      userState === USER_STATES.MANUAL_VERIFICATION ||
      userState === USER_STATES.VIRTUAL_ACCOUNT_CREATE ||
      userState === USER_STATES.BLACK_LISTED ||
      userState === USER_STATES.ARCHIVED ||
      userState === USER_STATES.NO_STATE;

    const customProps = requestCallback
      ? {
          headerText: Locale.needHelpWithFirstPayment,
          cta: true,
          headerClassName: "gap-2",
          supportText: Locale.forAnyQueries,
        }
      : {
          headerText: Locale.visitFaq,
          cta: false,
          headerClassName: "gap-1",
          supportText: null,
        };

    const onBookADemoClicked = () => {
      setBookADemoPopupOpen(true);
    };

    return (
      <div
        ref={ref}
        className={classNames(
          "absolute bg-white w-[451px] rounded-10px shadow-stateIcon flex flex-col right-0 mt-3.5 overflow-hidden"
        )}
      >
        <div className={"p-6 bg-yellow-50 flex flex-row items-center gap-4"}>
          <MessageIcon />
          <div className={classNames("flex flex-col", customProps.headerClassName)}>
            <Typography
              text={customProps.headerText}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={"bold"}
            />
            {customProps.cta ? (
              <div>
                <Button
                  title={Locale.bookADemo}
                  type={BUTTON_TYPES.SECONDARY}
                  size={BUTTON_SIZES.SMALL}
                  onButtonClick={onBookADemoClicked}
                  buttonClass={"mb-2"}
                />
                <a
                  href={`${SKYDO_WEBSITE_URL}/faqs?loggedIn=true`}
                  rel="noopener noreferrer"
                  target="_blank"
                  className={""}
                >
                  <Typography
                    onTextClick={() => {
                      analytics.trackAsync(Events.VISIT_FAQ_CLICKED, {
                        source: "GetHelp",
                        loggedIn: true,
                      });
                    }}
                    text={Locale.visitFaqSubText}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    type={TYPOGRAPHY_TYPES.PARA}
                    textClasses={"cursor-pointer !text-blue-400 !mr-1"}
                  />
                </a>
                <Typography text={Locale.visitFaqSubText1} size={TYPOGRAPHY_SIZES.SMALL} type={TYPOGRAPHY_TYPES.PARA} />
              </div>
            ) : (
              <Typography
                text={Locale.findAnswersToYourQuestions}
                size={TYPOGRAPHY_SIZES.SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses={"!text-black-600"}
              />
            )}
          </div>
          {!customProps.cta && (
            <div className={"cursor-pointer"}>
              <a
                href={`${SKYDO_WEBSITE_URL}/faqs?loggedIn=true`}
                rel="noopener noreferrer"
                target="_blank"
                className={""}
              >
                <NewPageIcon />
              </a>
            </div>
          )}
        </div>
        <div className={"p-6 flex flex-col gap-4"}>
          {customProps.supportText ? <Typography text={customProps.supportText} /> : null}
          <div className={"flex flex-row gap-6 items-center"}>
            <div className={"flex-1 flex flex-col gap-4"}>
              <Typography
                text={showWhatsApp ? Locale.callWhatsapp : Locale.callUs}
                fontWeight={"bold"}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                type={TYPOGRAPHY_TYPES.LABEL}
              />
              <div className={"flex flex-row items-center gap-2"}>
                {showWhatsApp && (
                  <>
                    <WhatsappLineIcon width={24} height={24} />
                    <a href={`https://wa.me/${skydoContact.replace(/-/g, "")}`} className={"underline"}>
                      <Typography
                        text={skydoContact}
                        type={TYPOGRAPHY_TYPES.LABEL}
                        size={TYPOGRAPHY_SIZES.MEDIUM}
                        fontWeight={"bold"}
                        textClasses={"!text-blue-400"}
                      />
                    </a>
                  </>
                )}
                {!showWhatsApp && (
                  <Typography
                    text={skydoContact}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={"bold"}
                  />
                )}
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
  }
);

HelpWidget.displayName = "HelpWidget";

export default HelpWidget;
