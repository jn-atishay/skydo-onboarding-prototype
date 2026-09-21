/**
 * @author Raj Sheth
 * created: 27/10/23
 */

import React, { FC, ReactNode } from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { CurrencyWiseTotal } from "../../types/ClientLedger";
import { formatIncomingCurrency } from "../../util/formatters";
import Button from "../AtomicComponents/Button";
import Image from "next/image";
import SkydoFullIcon from "../Icons/SkydoFullIcon";

export interface EmailPreviewProps {
  logo?: string;
  emailTitle: string;
  from: string;
  subject: string;
  dearName: string;
  content: string;
  outstandingInvoices?: CurrencyWiseTotal[];
  overrideMainContent?: () => ReactNode;
  exporterName: string;
  onEditLogoClick: () => void;
  containerClass?: string;
  showHeader?: boolean;
  withSubject?: boolean;
  title?: string;
  editLogoText?: string;
}

interface FromAndSubjectProps {
  header: string;
  body: string;
}

export const FromAndSubject: React.FC<FromAndSubjectProps> = (props) => {
  return (
    <div className={"flex flex-row"}>
      <div>
        <Typography text={`${props.header}:`} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
      <div className={"ml-1"}>
        <Typography text={props.body} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
    </div>
  );
};

export const EmailContent: FC<EmailPreviewProps> = (props) => {
  const renderEmailBody = () => {
    if (props.overrideMainContent) {
      return props.overrideMainContent();
    }
    return (
      <>
        <div className={"mt-2 mb-1"}>
          <Typography
            text={"Total outstanding balance"}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
        <div className={"mt-2 mb-4"}>
          {props.outstandingInvoices?.map((invoice) => {
            return (
              <div className={"flex flex-row"} key={invoice.currency}>
                <Typography
                  text={formatIncomingCurrency(invoice.total, invoice.currency)}
                  type={TYPOGRAPHY_TYPES.HEADING}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-orange-400 !mr-1"}
                />
              </div>
            );
          })}
        </div>

        <div className={"mt-1"}>
          <Button
            title={Locale.viewClientLedger}
            type={BUTTON_TYPES.PRIMARY}
            size={BUTTON_SIZES.SMALL}
            buttonClass={"!py-[10px] !px-4 !cursor-not-allowed !hover:bg-navyblue-500"}
          />
        </div>
      </>
    );
  };

  return (
    <>
      {props.logo && props.logo.length > 0 && (
        <div className={"relative min-h-[48px] mt-4"}>
          <Image src={props.logo} alt={`company-logo`} layout={"fill"} objectFit={"contain"} objectPosition={"left"} />
        </div>
      )}
      <div className={"mt-2"}>
        <Typography text={props.emailTitle} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
      <div className={"mt-6"}>
        <Typography text={props.dearName} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
      <div className={"mt-2 mb-8"}>
        <Typography text={props.content} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
      </div>
      {renderEmailBody()}
      <div className={"mt-6 flex flex-row items-center"}>
        <Typography
          text={Locale.poweredBySkydo}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_X_SMALL}
          textClasses={"!text-black-500"}
        />
        <div className={"ml-1"}>
          <SkydoFullIcon isSmall={true} />
        </div>
      </div>
      <div className={"-mt-1 "}>
        <Typography
          text={Locale.exporterUserSkydoTo.replaceAll(":exporter", props.exporterName ?? "exporter")}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_X_SMALL}
          textClasses={"!leading-3 !text-black-500"}
        />
      </div>
    </>
  );
};

export const PreviewEmail: FC<EmailPreviewProps> = (props) => {
  const { showHeader = true, withSubject = true } = props;
  return (
    <div className={`flex flex-col overflow-hidden rounded-10px pb-6 mr-6 ${props.containerClass}`}>
      {showHeader && (
        <div className={"flex flex-row bg-blue-50 justify-center items-center py-3"}>
          <Typography
            text={props.editLogoText ?? Locale.thisIsClientSeeText}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
          {props.logo && props.logo.length > 0 && (
            <Typography
              text={Locale.editLogo}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-blue-400 !ml-1 !cursor-pointer"}
              onTextClick={() => {
                props?.onEditLogoClick && props?.onEditLogoClick();
              }}
            />
          )}
        </div>
      )}
      <div className={`flex flex-col px-6 bg-white rounded-b-10px pb-2`}>
        {withSubject && (
          <>
            <div className={"my-2"}>
              <FromAndSubject header={Locale.from} body={props.from} />
            </div>
            <hr className={"border-black-400"} />
            <div className={"my-2"}>
              <FromAndSubject header={Locale.subject} body={props.subject} />
            </div>
          </>
        )}
        <hr className={"border-black-400"} />
        <EmailContent {...props} />
      </div>
    </div>
  );
};

export default PreviewEmail;
