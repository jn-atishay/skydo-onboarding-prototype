import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import {TRANSACTION_STATES} from "../../constants/dashboardConstants";
import {isUnparsed} from "../../util/functions";
import {TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES} from "../../constants/atomicConstants";
import HelpIcon from "../Icons/HelpIcon";
import Tooltip from "../AtomicComponents/Tooltip";
import React, {useContext} from "react";
import AppContext from "../../context/AppContext";
import {
  DELAYABLE_TRANSACTION_INCIDENTS,
  DISPLAYABLE_TRANSACTION_INCIDENTS,
  TransactionIncident,
  TransactionIncidentType,
  TxnDelayDisplayInfo,
} from "../../types/TransactionIncident";

interface Props {
  invoiceStatus?: string;
  transactionStatus?: string;
  status?: string;
  textColor: string;
  expectedSettlement: string;
  transactionIncident?: TransactionIncident[];
}

const getTransactionIncidentDelayInfo = (transactionIncidents?: TransactionIncident[]): TxnDelayDisplayInfo => {
  /**
   * 1. check if `bankDelay` is present "BANK_DELAY"
   * 2. delayDays = FX_BANK_HOLIDAY + FRIDAY_CUT_OFF + BANK_DELAY
   */

  let delayDays = 0;
  let isBankDelayPresent = false;
  let isFxHolidayPresent = false;
  delayDays =
    transactionIncidents?.filter((incident) => DELAYABLE_TRANSACTION_INCIDENTS.includes(incident.incidentType))
      .length || 0;
  isBankDelayPresent =
    transactionIncidents?.some((incident) => incident.incidentType === TransactionIncidentType.BANK_DELAY) || false;
  isFxHolidayPresent =
    transactionIncidents?.some((incident) => incident.incidentType === TransactionIncidentType.FX_BANK_HOLIDAY) ||
    false;
  const displayableIncidents =
    transactionIncidents?.filter((incident) => DISPLAYABLE_TRANSACTION_INCIDENTS.includes(incident.incidentType)) || [];

  return {
    delayDays,
    isBankDelayPresent,
    isFxHolidayPresent,
    displayableIncidents,
  };
};

const RightSubTitle = (props: Props) => {
  const { invoiceStatus, textColor, expectedSettlement, transactionStatus, transactionIncident } = props;
  const { theme } = useContext(AppContext);

  const { delayDays, isBankDelayPresent, isFxHolidayPresent, displayableIncidents } =
    getTransactionIncidentDelayInfo(transactionIncident);

  if (isUnparsed(invoiceStatus)) {
    return <Typography text={Locale.invoiceProcessing} />;
  }

  const nthNumber = (number: number) => {
    if (number > 3 && number < 21) return "th";
    switch (number % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  function getDelayString(incident: TransactionIncident, index: number) {
    const date = new Date(incident.incidentDate);
    const day = `${date.getDate()}${nthNumber(date.getDate())}`;
    const month = date.toLocaleString("default", { month: "long" }).slice(0, 3);
    const description = incident.incidentDescription ? incident.incidentDescription : "festival";
    return `${index + 1}. Bank Holiday on ${day} ${month} due to ${description}`;
  }

  const toolTipText = () => {
    return (
      <div className={"text-start"}>
        <span>
          {"Reasons for delay:"}
          <br />
          <br />
          {displayableIncidents.map((incident, index) => (
            <div key={index}>{getDelayString(incident, index)}</div>
          ))}
          {isBankDelayPresent && <div key={delayDays}>{`${displayableIncidents.length + 1}. Unexpected bank delay`}</div>}
        </span>
      </div>
    );
  };

  if (transactionStatus !== TRANSACTION_STATES.EXPORTER_SUCCESS && expectedSettlement) {
    return (
      <div className={"flex flex-col"}>
        <div className={"flex_row_item_center"}>
          <Typography text={Locale.expectedSettlement} textClasses={"mr-1"} />
          <Typography
            text={expectedSettlement}
            textProps={{
              color: textColor,
            }}
          />
        </div>
        {displayableIncidents.length > 0 ? (
          <div className={"flex_row_item_center mt-1"}>
            <Typography
              text={Locale.transactionDelayText
                .replace(":num_of_days", delayDays.toString())
                .replace(":isPlural", delayDays > 1 ? "s" : "")
                .replace(":dueToBankHoliday", isFxHolidayPresent ? "due to bank holiday" : "")}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500 mr-2"}
            />
            <Tooltip tooltipText={toolTipText()} position={TOOLTIP_POSITION.BOTTOM} tooltipTheme={"dark"}>
              <HelpIcon height={"16"} width={"16"} borderColor={theme.hexColors.black[500]} />
            </Tooltip>
          </div>
        ) : null}
      </div>
    );
  }
  return null;
};

export default RightSubTitle;
