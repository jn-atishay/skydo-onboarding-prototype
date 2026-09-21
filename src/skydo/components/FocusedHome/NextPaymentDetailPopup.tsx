import { BUTTON_SIZES, BUTTON_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import Popup from "../AtomicComponents/Popup";
import Calendar2Icon from "../Icons/Calendar2Icon";
import useFocusedHomeStore from "../../store/useFocusedHomeStore";
import { useEffect, useState } from "react";
import RadioButton from "../AtomicComponents/RadioButton";
import Calendar3Icon from "../Icons/Calendar3Icon";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import classNames from "classnames";

const NextPaymentDetailPopup = ({
  isVisible,
  onClose,
  onContinue,
}: {
  isVisible: boolean;
  onClose: () => void;
  onContinue: () => void;
}) => {
  const { submitPaymentTimeline } = useFocusedHomeStore();
  const [paymentTimeline, setPaymentTimeline] = useState("");
  const analytics = useAnalytics();

  useEffect(() => {
    if (isVisible) {
      analytics.trackAsync(Events.FOCUSED_HOME.NEXT_PAYMENT_DETAIL_POPUP_OPENED, {
        project: "fhv2",
        subpage: "fh_intent",
      });
    }
  }, [isVisible]);

  const PAYMENT_TIMELINE_OPTIONS = ["Next 30 days", "Sometime later"];

  const renderContent = () => {
    return (
      <div className={"flex flex-row gap-6"}>
        <div
          className={classNames(
            "flex-1 shrink-0 flex flex-col rounded-10px overflow-hidden border border-black-400 cursor-pointer",
            {
              "border-primary-300": paymentTimeline === PAYMENT_TIMELINE_OPTIONS[0],
            }
          )}
          onClick={() => {
            setPaymentTimeline((v) => {
              if (v !== PAYMENT_TIMELINE_OPTIONS[0]) {
                analytics.trackAsync(Events.FOCUSED_HOME.TIMELINE_OPTION_SELECTED, {
                  project: "fhv2",
                  subpage: "fh_intent",
                  option: PAYMENT_TIMELINE_OPTIONS[0],
                });
                return PAYMENT_TIMELINE_OPTIONS[0];
              }
              return v;
            });
          }}
        >
          <div
            className={
              "h-20 flex items-center justify-center bg-gradient-to-b from-[#EEF3FE] via-50% via-white to-[#EEF3FE]"
            }
          >
            <Calendar2Icon />
          </div>
          <RadioButton
            id={"next-30-days"}
            label={Locale.focusedHome.nextPaymentDetailPopup.next30Days}
            checked={paymentTimeline === PAYMENT_TIMELINE_OPTIONS[0]}
            className={"py-2 pr-4 pl-1.5 !flex-row-reverse !justify-between"}
            textClasses={paymentTimeline === PAYMENT_TIMELINE_OPTIONS[0] ? "text-primary-300" : undefined}
          />
        </div>
        <div
          className={classNames(
            "flex-1 shrink-0 flex flex-col rounded-10px overflow-hidden border border-black-400 cursor-pointer",
            {
              "border-primary-300": paymentTimeline === PAYMENT_TIMELINE_OPTIONS[1],
            }
          )}
          onClick={() => {
            setPaymentTimeline((v) => {
              if (v !== PAYMENT_TIMELINE_OPTIONS[1]) {
                analytics.trackAsync(Events.FOCUSED_HOME.TIMELINE_OPTION_SELECTED, {
                  project: "fhv2",
                  subpage: "fh_intent",
                  option: PAYMENT_TIMELINE_OPTIONS[1],
                });
                return PAYMENT_TIMELINE_OPTIONS[1];
              }
              return v;
            });
          }}
        >
          <div
            className={
              "h-20 flex items-center justify-center bg-gradient-to-b from-[#EEF3FE] via-50% via-white to-[#EEF3FE]"
            }
          >
            <Calendar3Icon />
          </div>
          <RadioButton
            id={"sometime-later"}
            label={Locale.focusedHome.nextPaymentDetailPopup.sometimeLater}
            checked={paymentTimeline === PAYMENT_TIMELINE_OPTIONS[1]}
            className={"py-2 pr-4 pl-1.5 !flex-row-reverse !justify-between"}
            textClasses={paymentTimeline === PAYMENT_TIMELINE_OPTIONS[1] ? "text-primary-300" : undefined}
          />
        </div>
      </div>
    );
  };

  return (
    <Popup
      renderContent={renderContent}
      open={isVisible}
      outsideClick={() => {
        analytics.trackAsync(Events.FOCUSED_HOME.TIMELINE_POPUP_CLOSED, {
          project: "fhv2",
          subpage: "fh_intent",
        });
        onClose();
      }}
      closeIconClick={() => {
        analytics.trackAsync(Events.FOCUSED_HOME.TIMELINE_POPUP_CLOSED, {
          project: "fhv2",
          subpage: "fh_intent",
        });
        onClose();
      }}
      isCommonHeader={true}
      title={Locale.focusedHome.nextPaymentDetailPopup.title}
      subtitle={Locale.focusedHome.nextPaymentDetailPopup.subtitle}
      ctaClass={"mt-6"}
      renderCTAs={() => (
        <>
          <Button
            title={Locale.goBack}
            size={BUTTON_SIZES.SMALL}
            type={BUTTON_TYPES.SECONDARY}
            onButtonClick={() => {
              analytics.trackAsync(Events.FOCUSED_HOME.TIMELINE_POPUP_BACK_CLICKED, {
                project: "fhv2",
                subpage: "fh_intent",
              });
              onClose();
            }}
          />
          <Button
            title={Locale.continue}
            size={BUTTON_SIZES.SMALL}
            isDisabled={!paymentTimeline}
            onButtonClick={() => {
              if (!paymentTimeline) {
                return;
              }
              submitPaymentTimeline(paymentTimeline);
              analytics.trackAsync(Events.FOCUSED_HOME.TIMELINE_POPUP_SUBMITTED, {
                project: "fhv2",
                subpage: "fh_intent",
                option: paymentTimeline,
              });
              onContinue();
              onClose();
            }}
          />
        </>
      )}
    />
  );
};

export default NextPaymentDetailPopup;
