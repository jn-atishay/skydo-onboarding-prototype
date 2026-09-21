import React, { useContext } from "react";
import { TableColumn } from "../../types/atomicComponentTypes";
import Locale from "../../util/locale/en";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import FullTick from "../Icons/FullTick";
import Tooltip from "../AtomicComponents/Tooltip";
import AppContext from "../../context/AppContext";
import { EmailTemplate } from "../../types";
import { formatDate } from "../../util/formatters";
import { dateFormattingOptionsWithoutTimeZone } from "../InvoiceDetails/TransactionTracker";
import classnames from "classnames";

/**
 * [
 *     {
 *         "emailOutboxId": 1112,
 *         "invoiceId": 359,
 *         "sentOn": "2023-06-01T12:17:06.862+05:30",
 *         "deliveredOn": "2023-06-01T12:40:18.621+05:30",
 *         "openedOn": "1970-01-20T17:43:22.614+05:30",
 *         "deliveredEmails": [],
 *         "openedEmails": [
 *             "raj+reminders@skydo.com"
 *         ]
 *     },
 * ]
 */
export interface HistoricalReminder {
  emailOutboxId: number;
  invoiceId: number;
  sentOn: string;
  deliveredOn: string;
  openedOn: string;
  deliveredEmails: string[];
  openedEmails: string[];
  emailTemplate: EmailTemplate;
}

export interface EmailHistory {
  sentOn: string;
  delivered: string[];
  opened: string[];
  emailTemplateValue?: string;
}
export interface EmailHistoryTableProps {
  history: EmailHistory[];
  isInvoiceEmail?: boolean;
}

const EmailCell: React.FC<{ emails: string[]; type: "delivered" | "opened" }> = (props) => {
  const { theme } = useContext(AppContext);

  const getTooltipText = () => {
    return (
      <div className={"flex flex-col"}>
        <div className={"flex flex-col"}>
          <div className={"flex items-start"}>
            {props.type === "delivered" ? (
              <Typography text={Locale.deliveredTo} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
            ) : (
              <Typography text={Locale.openedBy} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
            )}
          </div>
          <div>
            {props.emails.map((email) => (
              <div key={email} className={"flex items-start"}>
                <Typography text={email} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  if (!props.emails || !props.emails.length) {
    return (
      <div className={"flex flex-col"}>
        <div className={"items-center self-center"}>
          <FullTick tickColor={theme.hexColors.white} bgColor={theme.hexColors.black[400]} />
        </div>
        <div className={"flex flex-row justify-center"}>
          <Typography
            text={props.type === "delivered" ? Locale.notDelivered : Locale.notOpened}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
      </div>
    );
  }

  if (props.emails.length > 1) {
    return (
      <div className={"flex flex-col"}>
        <div className={"items-center self-center"}>
          <FullTick />
        </div>
        <Tooltip tooltipText={getTooltipText()} className={""}>
          <div className={"items-center self-center cursor-pointer flex flex-row justify-center"}>
            <div className={`flex flex-row items-center`}>
              <Typography text={props.emails[0]} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
              <div className={""}>
                <Typography text={`,`} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
                <Typography
                  text={`+${props.emails.length - 1}`}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.X_SMALL}
                  textClasses={"!text-blue-400 ml-1"}
                />
              </div>
            </div>
          </div>
        </Tooltip>
      </div>
    );
  }

  return (
    <div className={"flex flex-col"}>
      <div className={"items-center self-center"}>
        <FullTick />
      </div>
      <div className={"items-center self-center"}>
        <div className={`flex flex-row items-center`}>
          <Typography text={props.emails[0]} type={TYPOGRAPHY_TYPES.PARA} size={TYPOGRAPHY_SIZES.X_SMALL} />
        </div>
      </div>
    </div>
  );
};

const tableColumns: TableColumn[] = [
  {
    dataKey: "sentOn",
    headerTitle: Locale.sentOn,
  },
  {
    dataKey: "delivered",
    headerTitle: Locale.delivered,
  },
  {
    dataKey: "opened",
    headerTitle: Locale.opened,
  },
];

const tableColumnsWithEmailTemplate: TableColumn[] = [
  {
    dataKey: "emailTemplateValue",
    headerTitle: Locale.emailType,
  },
  {
    dataKey: "sentOn",
    headerTitle: Locale.sentOn,
  },
  {
    dataKey: "delivered",
    headerTitle: Locale.delivered,
  },
  {
    dataKey: "opened",
    headerTitle: Locale.opened,
  },
];

const EmailHistoryTable: React.FC<EmailHistoryTableProps> = (props) => {
  const noEmailHistory = props.history.length == 0;

  const emailHistoryData: EmailHistory[] = !noEmailHistory
    ? props.history
    : [
        {
          sentOn: formatDate(Date(), dateFormattingOptionsWithoutTimeZone),
          delivered: [],
          opened: [],
          emailTemplateValue: "Reminder",
        },
      ];

  const textClass = noEmailHistory ? "!text-black-500" : "";

  const tableColumnsFinal = props.isInvoiceEmail && !noEmailHistory ? tableColumnsWithEmailTemplate : tableColumns;

  const leftAlignedHeaderTitles = [Locale.sentOn, Locale.emailType];

  return (
    <div className={"flex flex-col flex-grow mb-5 overflow-auto max-h-[350px]"}>
      <div
        className={classnames("flex flex-col flex-grow flex-1 overflow-auto", {
          "bg-black-100 p-4 rounded-10px": noEmailHistory,
        })}
      >
        {noEmailHistory ? (
          <div className={"border-b border-black-400 flex flex-row justify-center pb-2"}>
            <Typography
              text={Locale.howReminderTrackerLook}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-500"}
            />
          </div>
        ) : null}
        <table>
          <thead className={""}>
            <tr className={"border-b border-black-400"}>
              {tableColumnsFinal.map((column, index) => {
                let classes = "";
                const headerTitle = typeof column.headerTitle == "string" ? column.headerTitle : "";
                if (leftAlignedHeaderTitles.includes(headerTitle)) {
                  classes = "text-left ";
                }
                return (
                  <th className={`${classes} pb-2 pt-2`} key={column.dataKey}>
                    <Typography
                      text={column.headerTitle}
                      type={TYPOGRAPHY_TYPES.LABEL}
                      size={TYPOGRAPHY_SIZES.SMALL}
                      textClasses={textClass}
                    />
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {emailHistoryData.map((row, index) => {
              return (
                <tr className={"border-b border-black-400"} key={row.emailTemplateValue}>
                  {props.isInvoiceEmail && !noEmailHistory ? (
                    <td className={`py-[10px] !max-w-[70px]`}>
                      <div className={"flex flex-col justify-center max-w-[70px] break-words"}>
                        <Typography
                          text={row.emailTemplateValue}
                          type={TYPOGRAPHY_TYPES.PARA}
                          size={TYPOGRAPHY_SIZES.X_SMALL}
                          textClasses={textClass}
                        />
                      </div>
                    </td>
                  ) : null}
                  <td className={`py-[10px] !max-w-[70px]`}>
                    <div className={"flex flex-col justify-center max-w-[70px] break-words"}>
                      <Typography
                        text={row.sentOn}
                        type={TYPOGRAPHY_TYPES.PARA}
                        size={TYPOGRAPHY_SIZES.X_SMALL}
                        textClasses={textClass}
                      />
                    </div>
                  </td>
                  <td className={"py-2.5"}>
                    <EmailCell emails={row.delivered} type={"delivered"} />
                  </td>
                  <td className={"py-2.5"}>
                    <EmailCell emails={row.opened} type={"opened"} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EmailHistoryTable;
