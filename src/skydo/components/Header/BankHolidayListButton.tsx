/**
 * @author Raj Sheth
 * created: 25/08/23
 */

import React, { FC, useEffect } from "react";
import CalendarIcon from "../Icons/CalendarIcon";
import useBankHolidayStore from "../../store/useBankHolidayStore";
import BankHolidayPopup from "../BankHolidayPopup";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import Tooltip from "../AtomicComponents/Tooltip";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import { useRouter } from "next/router";

interface BankHolidayListButtonProps {}

const BankHolidayListButton: FC<BankHolidayListButtonProps> = (props) => {
  const router = useRouter();
  const { isPopupOpen, setIsPopupOpen } = useBankHolidayStore();
  const analytics = useAnalytics();
  const { bankHolidayPopup } = router.query;

  const onBtnClick = () => {
    setIsPopupOpen(true);
    analytics.trackAsync(Events.BANK_HOLIDAYS_CTA_CLICK);
  };
  const onClosePopup = () => {
    setIsPopupOpen(false);
  };

  useEffect(() => {
    if (bankHolidayPopup) {
      setIsPopupOpen(true);
    } else {
      setIsPopupOpen(false);
    }
  }, [bankHolidayPopup]);

  return (
    <div>
      <Tooltip
        tooltipText={
          <Typography text={Locale.bankHolidayList} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-white"} />
        }
        tooltipTheme={"dark"}
      >
        <CalendarIcon onClick={onBtnClick} containerClass={"cursor-pointer"} />
      </Tooltip>

      {isPopupOpen && <BankHolidayPopup isPopupOpen={isPopupOpen} onClosePopup={onClosePopup} />}
    </div>
  );
};

export default BankHolidayListButton;
