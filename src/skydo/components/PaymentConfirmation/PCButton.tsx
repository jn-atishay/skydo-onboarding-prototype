/**
 * @author Raj Sheth
 * created: 12/10/23
 */

import React, { FC } from "react";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import EmailIcon from "../Icons/EmailIcon";
import Button from "../AtomicComponents/Button";
import { PCButtonCase } from "../../types/PaymentConfirmation";
import Typography from "../AtomicComponents/Typography";
import InfoIcon from "../AtomicComponents/ToastMessages/InfoIcon";
import Tooltip from "../AtomicComponents/Tooltip";
import FullTick from "../Icons/FullTick";
import { formatDate } from "../../util/formatters";
import { Transaction } from "../../types";
import usePCButtonDisplay from "../../util/customHooks/usePCButtonDisplay";

interface SendEmailConfirmationButtonProps {
  transaction: Transaction | null | undefined;
}

/**
 * idp = Invoice Detail Page
 * PC = Payment Confirmation
 */
export type PopupOpenSource = "email" | "idp";

const PCButton: FC<SendEmailConfirmationButtonProps> = (props) => {
  const { buttonCase, sentAt, buttonType, setIsPopupVisible, exporterUserDetails } = usePCButtonDisplay({
    transaction: props.transaction,
  });

  if (buttonCase === PCButtonCase.SHOW_NOTHING) return null;

  if (buttonCase === PCButtonCase.ALREADY_SENT_INFO) {
    // date string --> 2023-10-24T11:57:14.875Z
    // display: DD MMM YYYY
    let displayDate = formatDate(sentAt as string, { day: "numeric", month: "short", year: "numeric" });

    return (
      <div className={"ml-10 mt-2 flex flex-1 flex-row items-center"}>
        <FullTick className={"mr-1 !w-4 !h-4"} />
        <Typography
          text={Locale.confirmationEmailSentToClientAndCcedTo.replace(
            ":exporterEmail",
            exporterUserDetails.emailAddress
          )}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"mr-1"}
        />
        <Tooltip tooltipText={`Email sent on ${displayDate}`}>
          <InfoIcon className={"!w-4 !h-4 cursor-pointer"} />
        </Tooltip>
      </div>
    );
  }

  // Check if this is an instant settlement transaction
  const isInstantSettlement = !!(
    props.transaction?.pricingRecord?.instantSettlementCharges ||
    props.transaction?.pricingRecord?.instantSettlementChargesInr ||
    props.transaction?.pricingRecord?.instantSettlementChargesCurrency
  );

  return (
    <div className={"ml-8 mt-2"}>
      <Button
        title={Locale.sendConfirmationEmailToClient}
        onButtonClick={() => setIsPopupVisible("idp")}
        type={buttonType}
        size={BUTTON_SIZES.SMALL}
        buttonProps={isInstantSettlement ? {
          style: {
            background: '#FFFFFF',
            backgroundColor: '#FFFFFF !important',
            borderRadius: '10px',
            border: '1px solid #CFD7DF',
          }
        } : undefined}
        textProps={isInstantSettlement ? {
          color: '#000000',
        } as any : undefined}
        leftIcon={() => (
          <div className={"-mr-2 -ml-2"}>
            <EmailIcon
              fill={buttonType === BUTTON_TYPES.PRIMARY ? "#white" : "white"}
              stroke={buttonType === BUTTON_TYPES.PRIMARY ? "black" : "#283C8B"}
            />
          </div>
        )}
      />
    </div>
  );
};

export default PCButton;
