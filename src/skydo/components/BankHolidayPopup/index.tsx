/**
 * @author Raj Sheth
 * created: 01/09/23
 */

import React, { FC, useContext, useEffect, useMemo, useState } from "react";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import TwoPartitionPopup from "../TwoPartitionPopup";
import Dropdown from "../AtomicComponents/Dropdown";
import HolidaysTimeline from "./HolidaysTimeline";
import { fetchData } from "../../util/beCall";
import { Holiday } from "../../types";
import HolidayCalendar from "./HolidayCalendar";
import { Option } from "../../types/atomicComponentTypes";
import { getDateInYYYYMMDD, getMonthDisplayLabel, getMonthValue } from "./bankHolidayUtil";
import AppContext from "../../context/AppContext";
import InfoNote from "../AtomicComponents/Notes/InfoNote";

interface Props {
  isPopupOpen: boolean;
  onClosePopup: () => void;
}

const Index: FC<Props> = (props) => {
  const { isPopupOpen, onClosePopup } = props;
  const { theme } = useContext(AppContext);

  const [holidays, setHolidays] = useState<Array<Holiday>>();

  let monthOptions = useMemo(() => {
    // iterate through all dates from response and create unique array of months in sorted fashion
    let monthMap: {
      [key: string]: boolean;
    } = {};
    let monthArr: Option[] = [];
    if (holidays) {
      holidays.forEach((holiday, index) => {
        // format: YYYY-MM-DD
        // e.g. `2023-12-25`
        let option = {
          label: getMonthDisplayLabel(holiday.date),
          value: getMonthValue(holiday.date),
        };
        if (!monthMap[option.value]) {
          monthMap[option.value] = true;
          monthArr.push(option);
        }
      });
    }
    return monthArr;
  }, [holidays]);

  const [selectedMon, setSelectedMon] = useState<string>(
    // today's months first date in YYYY-MM-DD format
    getMonthValue(getDateInYYYYMMDD(new Date()))
  );

  const fetchHolidays = () => {
    void fetchData({
      url: `/api/holiday`,
      onSuccess: (response: any) => {
        setHolidays(response.holidays);
      },
      onError: (e) => {
        console.error("something went wrong", e);
      },
    });
  };

  useEffect(() => {
    fetchHolidays();
  }, []);

  const getLeftTitle = () => {
    return (
      <div className={"flex-1 flex flex-row items-center justify-between"}>
        <div>
          <Typography text={Locale.bankHolidayList} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />
        </div>
        <div>
          <Dropdown
            textInputSize={TYPOGRAPHY_SIZES.SMALL}
            placeholder={Locale.selectOne}
            onSelect={(value: any, option: any) => {
              setSelectedMon(value);
            }}
            searchable={false}
            containerClass={"flex-1"}
            selectedValue={selectedMon}
            options={monthOptions.map((option, index) => {
              return {
                ...option,
                customRowRenderer: (
                  option: any,
                  onOptionClick: (value: any, isDisabled: boolean | undefined) => void
                ) => {
                  return (
                    <div
                      key={option.value}
                      className={"px-2 py-3 flex_row_item_center hover:bg-blue-50"}
                      onClick={() => {
                        onOptionClick(option.value, false);
                      }}
                    >
                      <div className={"flex-1 flex justify-between flex-row items-center"}>
                        <div className={"flex flex-col"}>
                          <Typography text={option.label} size={TYPOGRAPHY_SIZES.SMALL} />
                        </div>
                      </div>
                    </div>
                  );
                },
              };
            })}
          />
        </div>
      </div>
    );
  };

  const renderLeftContent = () => {
    return (
      <div className={"flex flex-col flex-1"}>
        <InfoNote text={Locale.defaultFxHoliday} />
        <div className={"flex flex-col flex-1 mt-6 overflow-y-scroll max-h-[420px]"}>
          <HolidaysTimeline holidays={holidays || []} selectedMonth={selectedMon} />
        </div>
      </div>
    );
  };

  const renderRightContent = () => {
    return (
      <div className={"flex flex-col flex-1"}>
        <div>
          <HolidayCalendar setSelectedMonth={setSelectedMon} holidays={holidays || []} selectedMonth={selectedMon} />
        </div>
      </div>
    );
  };

  return (
    <TwoPartitionPopup
      isOpen={isPopupOpen}
      onClose={onClosePopup}
      leftTitle={() => getLeftTitle()}
      leftContent={() => renderLeftContent()}
      rightContent={() => renderRightContent()}
      containerClass={"!h-[80%] !w-11/12 !max-w-[860px] !min-w-[500px] !max-h-[606px]"}
    />
  );
};

export default Index;
