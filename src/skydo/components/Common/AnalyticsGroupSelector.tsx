import useAnalyticsDetailsStore from "../../store/useAnalyticesStore";
import React from "react";
import { groupingOptionList } from "../BusinessAnalytics/constants";
import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Tooltip from "../AtomicComponents/Tooltip";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

const AnalyticsGroupSelector = () => {
  const { setGroupingOption, groupingOption, disabledGroupingOption } = useAnalyticsDetailsStore();
  const analytics = useAnalytics();

  return (
    <div className={"flex flex-row space-x-2"}>
      {groupingOptionList.map((el, idx) => {
        const isSelected = el.value == groupingOption;
        const isDisabled = disabledGroupingOption.includes(el.value);

        const baseComponent = () => (
          <div
            key={idx}
            className={classNames("rounded-20px border cursor-pointer py-1 w-[85px] text-center", {
              "bg-blue-50 border-blue-400": isSelected,
              "border-black-400": !isSelected && !isDisabled,
              "bg-black-50 border-black-400": isDisabled,
            })}
            onClick={() => {
              analytics?.trackAsync(Events.ANALYTICS.GROUPING_CLICK, { grouping: el.value });
              if (!isDisabled) setGroupingOption(el.value);
            }}
          >
            <Typography
              textClasses={classNames({
                "!text-blue-400": isSelected,
                "!text-black-500": isDisabled,
              })}
              text={el.label}
              size={TYPOGRAPHY_SIZES.SMALL}
              type={TYPOGRAPHY_TYPES.LABEL}
            />
          </div>
        );

        return (
          <>
            {isDisabled ? (
              <Tooltip key={idx} tooltipText={"This view is not available"}>
                {baseComponent()}
              </Tooltip>
            ) : (
              baseComponent()
            )}
          </>
        );
      })}
    </div>
  );
};

export default AnalyticsGroupSelector;
