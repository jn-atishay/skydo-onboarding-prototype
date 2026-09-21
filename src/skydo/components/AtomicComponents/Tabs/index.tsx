import React, { FC } from "react";
import classNames from "classnames";
import { TABS_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import Typography from "../Typography";
import useAnalytics from "../../../analytics/useAnalytics";
import { Events } from "../../../analytics/EventConstants";

interface TabsProps {
  containerClass?: string;
  size?: (typeof TABS_SIZES)[keyof typeof TABS_SIZES];
  options: { heading: string; subText?: string; icon?: (selected: boolean) => JSX.Element }[];
  selected: number;
  setSelected: (id: number) => void;
  optionClass?: string;
  selectedColorText?: string;
  headingTypography?: { type?: string; size?: string; fontWeight?: string };
  headingClass?: string;
  selectedHeadingClass?: string;
  nonSelectedHoverClass?: string;
  analyticsEvent?: string;
}

const Tabs: FC<TabsProps> = (props) => {
  const analytics = useAnalytics();
  const {
    containerClass,
    size = TABS_SIZES.SMALL,
    options,
    selected,
    setSelected,
    optionClass,
    selectedColorText,
    headingTypography,
    headingClass,
    selectedHeadingClass,
    nonSelectedHoverClass,
    analyticsEvent,
  } = props;
  let styles: { headingSize: string; subTextSize: string } = {
    headingSize: TYPOGRAPHY_SIZES.SMALL,
    subTextSize: TYPOGRAPHY_SIZES.X_SMALL,
  };
  switch (size) {
    case TABS_SIZES.SMALL:
      styles = { headingSize: TYPOGRAPHY_SIZES.SMALL, subTextSize: TYPOGRAPHY_SIZES.X_SMALL };
      break;
    case TABS_SIZES.LARGE:
      styles = { headingSize: TYPOGRAPHY_SIZES.LARGE, subTextSize: TYPOGRAPHY_SIZES.SMALL };
  }

  const onSelectTab = (index: number) => {
    analytics.trackAsync(analyticsEvent || Events.INTL_ACCOUNT_TAB_CHANGE, {
      newTab: options[index].heading,
    });
    setSelected(index);
  };

  return (
    <div className={classNames("bg-blue-100 rounded-100px p-1 flex cursor-pointer", containerClass)}>
      {options.map((option, index) => {
        return (
          <div
            key={index}
            className={classNames(
              "flex-1 text-center py-3 rounded-100px flex flex-row items-center gap-2 justify-center",
              index === selected && `bg-white ${selectedColorText}`,
              index !== selected && (nonSelectedHoverClass ?? "hover:bg-blue-50"),
              optionClass
            )}
            onClick={() => onSelectTab(index)}
          >
            {option.icon ? option.icon(index === selected) : null}
            <div className={"flex flex-col"}>
              <Typography
                text={option.heading}
                type={headingTypography?.type ? headingTypography.type : TYPOGRAPHY_TYPES.LABEL}
                size={headingTypography?.size ? headingTypography.size : styles.headingSize}
                fontWeight={headingTypography?.fontWeight}
                textClasses={index === selected ? selectedHeadingClass : headingClass}
              />
              {option.subText ? (
                <Typography
                  text={option.subText}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={styles.subTextSize}
                  textClasses={"!text-black-500"}
                />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Tabs;
