import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { ExporterUseCase, FocusedHomeCompState, PaymentMethod } from "../../constants/focusedHomeConstants";
import useFocusedHomeStore from "../../store/useFocusedHomeStore";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import RadioButton from "../AtomicComponents/RadioButton";
import Typography from "../AtomicComponents/Typography";
import BankIcon from "../Icons/BankIcon";
import EditIcon from "../Icons/EditIcon";
import MoneyTransferIcon from "../Icons/FocusedHome/MoneyTransferIcon";
import LinkIcon from "../Icons/LinkIcon";
import FocusedHomeWrapper from "./FocusedHomeWrapper";
import classNames from "classnames";
import {
  ALLOWED_FREELANCER_PLATFORMS,
  FREELANCER_PLATFORM_CODE,
  FREELANCER_PLATFORMS_DETAILS_MAP,
} from "../../constants/dashboardConstants";
import FreelancerPlatformVsIconComp from "../Common/FreelancerPlatformVsIconComp";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { useRouter } from "next/router";
import FE_ROUTES from "../../util/feRoutes";
import { useEffect } from "react";

const PaymentMethodStep = () => {
  const { paymentMethod, setPaymentMethod, submitPaymentMethod, submitPaymentMethodLoading } = useFocusedHomeStore();
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.trackAsync(Events.FOCUSED_HOME.METHOD_STEP_SHOWN, {
      project: "fhv2",
      subpage: "fh_receive_first_payment",
    });
  }, []);

  return (
    <div className={"flex flex-col gap-8 w-full"}>
      <div className={"flex flex-col gap-2"}>
        <Typography
          text={"Step 1"}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 !font-semibold"}
        />
        <Typography
          text={Locale.focusedHome.methods.inProgressTitle}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.LARGE}
          textClasses={"!font-bold"}
        />
      </div>
      <div className={"flex flex-row gap-6"}>
        <div
          className={classNames(
            "flex-1 shrink-0 flex flex-row rounded-10px overflow-hidden border",
            paymentMethod === PaymentMethod.BANK_TRANSFER ? "border-blue-400 bg-blue-50" : "border-black-400"
          )}
          onClick={() => {
            setPaymentMethod(PaymentMethod.BANK_TRANSFER);
            if (paymentMethod !== PaymentMethod.BANK_TRANSFER) {
              analytics.trackAsync(Events.FOCUSED_HOME.METHOD_SELECTED, {
                project: "fhv2",
                subpage: "fh_receive_first_payment",
                method: PaymentMethod.BANK_TRANSFER,
              });
            }
          }}
        >
          <div
            className={classNames(
              "p-6 flex items-center justify-center border-r",
              paymentMethod === PaymentMethod.BANK_TRANSFER
                ? "bg-blue-100 border-blue-400"
                : "bg-black-100 border-black-400"
            )}
          >
            <BankIcon
              height={32}
              width={32}
              stroke={paymentMethod === PaymentMethod.BANK_TRANSFER ? "#276EF1" : "#0A2540"}
            />
          </div>
          <RadioButton
            id={"1"}
            label={() => (
              <div className={"flex flex-col gap-2"}>
                <Typography
                  text={Locale.focusedHome.faq.intAccountsBankTransfer}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={classNames(
                    "!font-semibold",
                    paymentMethod === PaymentMethod.BANK_TRANSFER && "!text-blue-400"
                  )}
                />
                <ul className={"list-disc list-outside pl-6"}>
                  <li>
                    <Typography
                      text={Locale.focusedHome.faq.countriesCount}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={"!font-semibold -ml-1 !text-black-600"}
                    />
                  </li>
                  <li>
                    <Typography
                      text={Locale.focusedHome.methods.bankTransferDesc}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={"!font-semibold -ml-1 !text-black-600"}
                    />
                  </li>
                </ul>
              </div>
            )}
            checked={paymentMethod === PaymentMethod.BANK_TRANSFER}
            className={"!flex-row-reverse gap-2 p-6"}
          />
        </div>

        <div
          className={classNames(
            "flex-1 shrink-0 flex flex-row rounded-10px overflow-hidden border",
            paymentMethod === PaymentMethod.INSTALINKS ? "border-blue-400 bg-blue-50" : "border-black-400"
          )}
          onClick={() => {
            setPaymentMethod(PaymentMethod.INSTALINKS);
            if (paymentMethod !== PaymentMethod.INSTALINKS) {
              analytics.trackAsync(Events.FOCUSED_HOME.METHOD_SELECTED, {
                project: "fhv2",
                subpage: "fh_receive_first_payment",
                method: PaymentMethod.INSTALINKS,
              });
            }
          }}
        >
          <div
            className={classNames(
              "p-6 flex items-center justify-center border-r",
              paymentMethod === PaymentMethod.INSTALINKS
                ? "bg-blue-100 border-blue-400"
                : "bg-black-100 border-black-400"
            )}
          >
            <LinkIcon
              height={32}
              width={32}
              stroke={paymentMethod === PaymentMethod.INSTALINKS ? "#276EF1" : "#0A2540"}
            />
          </div>
          <RadioButton
            id={"2"}
            label={() => (
              <div className={"flex flex-col gap-2"}>
                <Typography
                  text={Locale.focusedHome.methods.instaLinksTitle}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={classNames(
                    "!font-semibold",
                    paymentMethod === PaymentMethod.INSTALINKS && "!text-blue-400"
                  )}
                />
                <ul className={"list-disc list-outside pl-6"}>
                  <li>
                    <Typography
                      text={Locale.focusedHome.methods.instaLinksDesc1}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={"!font-semibold -ml-1 !text-black-600"}
                    />
                  </li>
                  <li>
                    <Typography
                      text={Locale.focusedHome.methods.instaLinksDesc2}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={"!font-semibold -ml-1 !text-black-600"}
                    />
                  </li>
                </ul>
              </div>
            )}
            checked={paymentMethod === PaymentMethod.INSTALINKS}
            className={"!flex-row-reverse gap-2 p-6"}
          />
        </div>
      </div>
      <div className={"flex flex-row gap-4 items-center justify-end"}>
        <Typography
          text={Locale.focusedHome.methods.buttonSubtext}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 !font-semibold"}
        />
        <Button
          title={Locale.continue}
          onButtonClick={() => {
            analytics.trackAsync(Events.FOCUSED_HOME.METHOD_CONTINUE_CLICKED, {
              project: "fhv2",
              subpage: "fh_receive_first_payment",
              method: paymentMethod,
            });
            submitPaymentMethod();
          }}
          size={BUTTON_SIZES.SMALL}
          isLoading={submitPaymentMethodLoading}
        />
      </div>
    </div>
  );
};

const PaymentMethodSelectFocusedHome = ({
  isSelected,
  compState,
  platform,
  setPlatform,
}: {
  isSelected: boolean;
  compState: FocusedHomeCompState;
  platform: string;
  setPlatform: (platform: string) => void;
}) => {
  const { paymentMethod, resetPaymentMethodState, exporterUseCase } = useFocusedHomeStore();
  const analytics = useAnalytics();
  const router = useRouter();

  const notStartedTitle =
    exporterUseCase === ExporterUseCase.FREELANCE_PLATFORMS
      ? Locale.focusedHome.methods.choosePlatform
      : Locale.focusedHome.methods.notStartedTitle;

  const onPlatformClick = (val: string) => {
    setPlatform(val);
  };

  const renderComponent = () => {
    if (compState !== FocusedHomeCompState.NOT_STARTED && exporterUseCase === ExporterUseCase.FREELANCE_PLATFORMS) {
      return (
        <div className={"flex flex-col gap-8 w-full"}>
          <div className={"flex flex-col gap-2"}>
            <Typography
              text={"Step 1"}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500 !font-semibold"}
            />
            <Typography
              text={Locale.focusedHome.methods.choosePlatform}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses={"!font-bold"}
            />
          </div>
          <div className={"flex flex-row gap-4"}>
            {ALLOWED_FREELANCER_PLATFORMS.map((val, idx) => {
              return (
                <div
                  key={idx}
                  onClick={() => onPlatformClick(val)}
                  className={classNames(
                    "border border-black-400 rounded-10px px-4 py-2 cursor-pointer flex-1 shrink-0",
                    {
                      "border-blue-300 bg-black-50": val == platform,
                      "!flex-[1.5]": val === FREELANCER_PLATFORM_CODE.OTHERS,
                    }
                  )}
                >
                  <div className={"flex flex-row gap-1 items-center justify-center"}>
                    <FreelancerPlatformVsIconComp platform={val} width={24} height={24} isSelected={false} />
                    <Typography
                      text={
                        FREELANCER_PLATFORMS_DETAILS_MAP[val as keyof typeof FREELANCER_PLATFORMS_DETAILS_MAP]
                          ?.displayHeader || val
                      }
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.MEDIUM}
                      fontWeight={"600"}
                      textClasses={val === platform ? "!text-blue-300" : "!text-black"}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className={"flex flex-row gap-4 items-center justify-end"}>
            <Typography
              text={Locale.focusedHome.methods.buttonSubtextPlatform}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500 !font-semibold"}
            />
            <Button
              title={Locale.continue}
              onButtonClick={() => {
                router.push(FE_ROUTES.PLATFORM_WITHDRAWALS_DETAILS.replace("[platform]", platform.toLowerCase()));
              }}
              size={BUTTON_SIZES.SMALL}
            />
          </div>
        </div>
      );
    }

    switch (compState) {
      case FocusedHomeCompState.NOT_STARTED:
        return (
          <div className={"flex flex-row gap-6 w-full items-center"}>
            <MoneyTransferIcon />
            <div className={"flex flex-col gap-2"}>
              <Typography
                text={"Step 1"}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"!text-black-500 !font-semibold"}
              />
              <Typography
                text={notStartedTitle}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses={"!text-black-500 !font-bold"}
              />
            </div>
          </div>
        );
      case FocusedHomeCompState.IN_PROGRESS:
        return <PaymentMethodStep />;
      case FocusedHomeCompState.COMPLETED:
        return (
          <div className={"flex flex-col gap-2 w-full"}>
            <Typography
              text={Locale.focusedHome.methods.completedTitleHeader}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!font-semibold !text-black-500"}
            />
            <div className={"flex flex-row gap-2"}>
              {paymentMethod === PaymentMethod.BANK_TRANSFER ? (
                <BankIcon height={24} width={24} />
              ) : (
                <LinkIcon height={24} width={24} />
              )}
              <Typography
                text={
                  paymentMethod === PaymentMethod.BANK_TRANSFER ? Locale.internationalAccounts : Locale.paymentLinks
                }
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses={"!font-bold flex-1"}
              />
              <div
                className={"flex flex-row gap-2 items-center cursor-pointer"}
                onClick={() => {
                  analytics.trackAsync(Events.FOCUSED_HOME.CHANGE_METHOD_CLICKED, {
                    project: "fhv2",
                    subpage: "fh_receive_first_payment",
                  });
                  resetPaymentMethodState();
                }}
              >
                <Typography
                  text={Locale.focusedHome.methods.changeMethod}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  textClasses={"!font-semibold !text-blue-400"}
                />
                <EditIcon height={20} width={20} />
              </div>
            </div>
          </div>
        );
    }
  };
  return <FocusedHomeWrapper isSelected={isSelected}>{renderComponent()}</FocusedHomeWrapper>;
};

export default PaymentMethodSelectFocusedHome;
