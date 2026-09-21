import React, { useContext } from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import SkydoFullIcon from "../Icons/SkydoFullIcon";
import AppContext from "../../context/AppContext";
import { formatIncomingCurrencyWithNumber } from "../../util/formatters";
import { BankAccountField } from "../../types";
import Image from "next/image";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import PreferredAccountInfo from "./PreferredAccountInfo";
import { FromAndSubject } from "../TwoPartitionEmailPopup/PreviewEmail";

interface RowItem {
  label: string;
  value?: string;
}

interface TwoColTableProps {
  rows: RowItem[];
}

const RowItem: React.FC<RowItem> = (props) => {
  const { theme } = useContext(AppContext);

  return (
    <div className={"flex flex-row"}>
      <div className={"flex flex-row flex-1"}>
        <Typography
          text={`${props.label}: `}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          fontColor={theme.hexColors.black[500]}
        />
      </div>
      <div className={"flex flex-row flex-1"}>
        <Typography
          text={props.value ?? "-"}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          fontColor={theme.hexColors.black[700]}
        />
      </div>
    </div>
  );
};

const TwoColTable: React.FC<TwoColTableProps> = (props) => {
  return (
    <div className={"w-2/3"}>
      {props.rows.map((row) => {
        return <RowItem key={row.label} label={row.label} value={row.value} />;
      })}
    </div>
  );
};
export const DEFAULT_PAYMENT_REMINDER_EMAIL = "client-alerts@skydo.com";

interface HeaderProps {
  logo?: string;
  onEditLogoClick?: () => void;
  headerText?: string;
}

export const FixedHeaderOverEmailPreview: React.FC<HeaderProps> = (props) => {
  const analytics = useAnalytics();
  return (
    <div className={"flex flex-row bg-blue-50 justify-center items-center py-3"}>
      <Typography
        text={props.headerText ?? Locale.thisIsClientSeeText}
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
            analytics.trackAsync(Events.EDIT_LOGO_CLICK, {
              location: "client_reminder_popup",
            });
          }}
        />
      )}
    </div>
  );
};

interface PaymentReminderEmailProps {
  exporterSystemInvoiceId: string;
  correspondentName?: string;
  importerName: string;
  invoiceAmount: number;
  invoiceCurrency: string;
  invoiceDate?: string;
  dueDate?: string;
  outstandingAmount: number;
  withFixedHeader?: boolean;
  withFrom?: boolean;
  withSubject?: boolean;
  logo?: string;
  onEditLogoClick: () => void;
  containerClasses?: string;
  emailPreviewClasses?: string;
  title?: string;
  subject?: string;
  emailDescription?: string;
  bankAccountFieldList: BankAccountField[] | null;
  showIgnoreLine: boolean;
  paymentLink: string | null;
  passOnFee: boolean;
}

const PaymentReminderEmailPreview: React.FC<PaymentReminderEmailProps> = (props) => {
  const { theme } = useContext(AppContext);
  const { withFixedHeader = true, withFrom = true, withSubject = true, bankAccountFieldList } = props;
  const totalAmount = formatIncomingCurrencyWithNumber({
    value: props.invoiceAmount,
    currency: props.invoiceCurrency,
    minFractionDigits: 2,
    maxFractionDigits: 2,
  });
  return (
    <div className={`flex flex-col rounded-10px pb-6 mr-6 ${props.containerClasses}`}>
      {withFixedHeader && <FixedHeaderOverEmailPreview logo={props.logo} onEditLogoClick={props.onEditLogoClick} />}
      <div className={`flex flex-col px-6 bg-white rounded-b-10px pb-2 ${props.emailPreviewClasses ?? ""}`}>
        {withFrom && (
          <>
            <div className={"my-2"}>
              <FromAndSubject header={Locale.from} body={DEFAULT_PAYMENT_REMINDER_EMAIL} />
            </div>
            <hr className={"border-black-400"} />
          </>
        )}
        {withSubject && (
          <>
            <div className={"my-2"}>
              <FromAndSubject
                header={Locale.subject}
                body={
                  props.subject ||
                  Locale.paymentReminderEmailSubject
                    .replace(":exporterName", props.correspondentName ?? "")
                    .replace(":invoiceNumber", props.exporterSystemInvoiceId)
                    .replace(":amount", totalAmount)
                }
              />
            </div>
            <hr className={"border-black-400"} />
          </>
        )}

        {props.logo && props.logo.length > 0 && (
          <div className={"relative min-h-[48px] mt-6"}>
            <Image
              src={props.logo}
              alt={`${props.correspondentName}-logo`}
              layout={"fill"}
              objectFit={"contain"}
              objectPosition={"left"}
            />
          </div>
        )}

        <div className={"mt-6"}>
          <Typography
            text={props.title || Locale.paymentReminderFrom.replace(":exporterName", props.correspondentName ?? "")}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
          />
          <div className={"mt-6"}>
            <Typography
              text={Locale.dearImporter.replace(":importerName", props.importerName)}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
            />
          </div>
          <div className={"mt-2 mb-6"}>
            <Typography
              text={
                props.emailDescription ||
                Locale.emailDescription.replaceAll(":customerEntityName", props.correspondentName ?? "exporter")
              }
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
            />
            {props.showIgnoreLine ? (
              <div className={"mt-2"}>
                <Typography text={Locale.ignoreEmail} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
              </div>
            ) : null}
          </div>

          <hr className={"border-black-400"} />
          <div className={"mt-6"}>
            <Typography
              text={Locale.outstandingAmount}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontColor={theme.hexColors.black[500]}
            />
          </div>
          <div>
            <Typography
              text={formatIncomingCurrencyWithNumber({
                value: props.outstandingAmount,
                currency: props.invoiceCurrency,
                minFractionDigits: 2,
              })}
              type={TYPOGRAPHY_TYPES.HEADING}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontColor={theme.hexColors.red[400]}
            />
          </div>

          {/* invoice details here */}

          <div className={"my-6"}>
            <TwoColTable
              rows={[
                {
                  label: "Invoice no",
                  value: props.exporterSystemInvoiceId,
                },
                {
                  label: "Amount",
                  value: formatIncomingCurrencyWithNumber({
                    value: props.invoiceAmount,
                    currency: props.invoiceCurrency,
                    minFractionDigits: 2,
                  }),
                },
                {
                  label: "Due date",
                  value: props.dueDate,
                },
                {
                  label: "Invoice date",
                  value: props.invoiceDate,
                },
              ]}
            />
          </div>

          {/* account details card here */}
          <PreferredAccountInfo
            correspondentName={props.correspondentName ?? ""}
            bankAccountFieldList={bankAccountFieldList}
          />

          {props.paymentLink && (
            <div className={"mt-6"}>
              <Typography
                text={`Pay online via bank${props.passOnFee ? "*" : ""}`}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                fontColor={theme.hexColors.black[700]}
              />
              <div className={"mt-1"}>
                <Typography
                  text={props.paymentLink}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  fontColor={theme.hexColors.blue[500]}
                />
              </div>
            </div>
          )}

          <div className={"mt-6"}>
            <Typography
              text={Locale.onBehalfOf}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontColor={theme.hexColors.black[700]}
            />
          </div>
          <div className={"-mt-1 mb-6"}>
            <Typography
              text={props.correspondentName}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontColor={theme.hexColors.black[700]}
            />
          </div>

          <hr className={"border-black-400"} />

          {/* TODO: check if we can re-use `getPoweredBySkydo` */}
          <div className={"mt-6 flex flex-row items-center"}>
            <Typography
              text={Locale.poweredBySkydo}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_X_SMALL}
              fontColor={theme.hexColors.black[500]}
            />
            <div className={"ml-1"}>
              <SkydoFullIcon isSmall={true} />
            </div>
          </div>
          <div className={"-mt-1 "}>
            <Typography
              text={Locale.exporterUserSkydoTo.replaceAll(":exporter", props.correspondentName ?? "exporter")}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_X_SMALL}
              fontColor={theme.hexColors.black[500]}
              textClasses={"!leading-3"}
            />
          </div>
          {props.paymentLink && props.passOnFee && (
            <div className={"-mt-2"}>
              <Typography
                text="*Note: Processing fees will apply when paying via link"
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.X_X_SMALL}
                fontColor={theme.hexColors.black[500]}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentReminderEmailPreview;
