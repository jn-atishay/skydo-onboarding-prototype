/**
 * @author Raj Sheth
 * created: 13/10/23
 */

import React, { FC, useContext } from "react";
import { formatIncomingCurrency } from "../../util/formatters";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";
import useEditLogoStore from "../../store/useEditLogoStore";
import useEmailPopupStore from "../../store/useEmailPopupStore";
import { InvoiceOrReminderPopupContentCase } from "../InvoiceOrRemindEmailPopUp/InvoiceOrReminderEmailPreviewPopUpChange";
import Locale from "../../util/locale/en";
import { UserDetailsContext } from "../DashboardContainer";
import PreviewEmail from "../TwoPartitionEmailPopup/PreviewEmail";

interface Props {
  importerName: string;
  amount: number;
  currency: string;
  /**
   * e.g. 22 Aug, 2022, 11:44 AM (EST)
   */
  fundingDate: string;
  showHeader?: boolean;
  canOverrideEditLogoText?: boolean;
}

const PCEmailContent: FC<Props> = (props) => {
  const { importerName, amount, currency, fundingDate } = props;
  const { logoUrl } = useEditLogoStore();
  const { setPopupContentCase } = useEmailPopupStore();
  const { exporterDetails } = useContext(UserDetailsContext);
  const exporterName = exporterDetails.correspondentName;

  const fundingAmount = formatIncomingCurrency(amount.toString(), currency.toString());

  const getCopyContent = () => {
    return `Your payment of ${fundingAmount} to ${exporterName} has been successfully received.
    ${exporterName} thanks you for your business and looks forward to continue working with you.`;
  };

  const getPaymentBody = () => {
    return (
      <div>
        <hr className={"border-black-400 -mt-4"} />
        <div className={"mt-2 mb-1"}>
          <Typography
            text={"Amount received"}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
        <div>
          <Typography
            text={fundingAmount}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-green-400"}
          />
        </div>
        <div>
          <Typography
            text={`${Locale.receivedOn} ${fundingDate}`}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
          />
        </div>
        <div>
          <Typography
            text={`To see your payment and invoice history with ${exporterName}, click below.`}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
          />
        </div>
        <Button
          title={"View ledger"}
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.SMALL}
          buttonClass={"my-6 !cursor-not-allowed"}
        />
      </div>
    );
  };

  return (
    <PreviewEmail
      logo={logoUrl}
      emailTitle={Locale.pcEmailTitle}
      from={"payment-received@skydo.com"}
      subject={Locale.pcSubject.replace(":exporterName", exporterName)}
      dearName={`Team ${importerName},`}
      content={getCopyContent()}
      exporterName={exporterName}
      onEditLogoClick={() => {
        setPopupContentCase(InvoiceOrReminderPopupContentCase.UPLOAD_LOGO);
      }}
      showHeader={props?.showHeader ?? true}
      overrideMainContent={getPaymentBody}
      editLogoText={props.canOverrideEditLogoText ? Locale.sampleEmailWithPlaceholderValues : undefined}
    />
  );
};

export default PCEmailContent;
