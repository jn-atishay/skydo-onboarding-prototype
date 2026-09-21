import classnames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { BadgeSizes, BadgeTypes, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import IconContainer from "./IconContainer";
import DownArrowIcon from "../Icons/DownArrowIcon";
import { useContext } from "react";
import AppContext from "../../context/AppContext";
import Badge from "../AtomicComponents/Badge";
import Locale from "../../util/locale/en";

export type SubNavBarItem = {
  label?: string;
  icon?: (isSelected?: boolean) => JSX.Element;
  onRowClick?: () => void;
  isSelectedFun?: () => boolean;
  labelTypographyClass?: string;
  headerText?: string;
  subTitle?: string;
  renderHeader?: () => JSX.Element;
  className?: string;
  showNewBadge?: boolean;
  isBadgeAfterLabel?: boolean;
  badgeTitle?: string;
};

interface Props {
  containerClass?: string;
  subNavBarList: SubNavBarItem[];
  subNavBarFooter?: JSX.Element | null;
  bodyClass?: string;
}

/*
@Functionality:
  - takes list of items
    - each item has
      - label
      - icon
      - onRowClick callback
  - renders container with list of items
  - renders row
  - handles selected nav bar
  -
 */

const SubNavBar = (props: Props) => {
  const { containerClass, subNavBarList, subNavBarFooter, bodyClass } = props;
  const { theme } = useContext(AppContext);

  const renderSubNavBarItem = (subNavBarItem: SubNavBarItem) => {
    const {
      label,
      renderHeader,
      className,
      icon,
      onRowClick,
      isSelectedFun,
      headerText,
      labelTypographyClass,
      subTitle,
      showNewBadge,
      isBadgeAfterLabel,
      badgeTitle,
    } = subNavBarItem;
    const isSelected = isSelectedFun && isSelectedFun();
    const renderBadge = () => (
      <Badge type={BadgeTypes.Full} size={BadgeSizes.Small} title={badgeTitle || Locale.newNormal} />
    );
    return (
      <div
        className={classnames(
          "h-16 border-b border-b-black-400 py-2 pl-6 pr-2 flex items-center",
          {
            "bg-white": isSelected,
            "cursor-pointer": !headerText,
          },
          className
        )}
        onClick={onRowClick}
        key={headerText || label}
      >
        {renderHeader ? (
          renderHeader()
        ) : headerText ? (
          <Typography
            text={headerText}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.LARGE}
            textClasses={"!text-black-600"}
          />
        ) : (
          <div className={"flex flex-row items-center justify-between w-full"}>
            <div className={"flex_row_item_center"}>
              <IconContainer containerClass={isSelected ? "bg-blue-500" : "bg-white"}>
                {icon ? icon(isSelected) : null}
              </IconContainer>
              <div className={"flex flex-col"}>
                <div className={"flex flex-row items-center gap-1"}>
                  <Typography
                    text={label}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={
                      isSelected ? `ml-4 ${labelTypographyClass}` : `ml-4 !text-black-500 ${labelTypographyClass}`
                    }
                  />
                  {showNewBadge && isBadgeAfterLabel ? renderBadge() : null}
                </div>
                {subTitle ? (
                  <Typography
                    text={subTitle}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_X_SMALL}
                    textClasses={
                      isSelected
                        ? `ml-4 mt-0.5 ${labelTypographyClass}`
                        : `ml-4 !text-black-500 mt-0.5 ${labelTypographyClass}`
                    }
                  />
                ) : null}
              </div>
            </div>
            <div className={"flex items-center gap-4"}>
              {showNewBadge && !isBadgeAfterLabel ? renderBadge() : null}
              {isSelected ? (
                <div className={"-rotate-90"}>
                  <DownArrowIcon stroke={theme.hexColors.blue[400]} />
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={classnames("flex flex-col w-fit sticky top-headerHeight justify-between", containerClass)}>
      <div className={classnames("overflow-auto", bodyClass)}>
        {subNavBarList.map((subNavBarItem: SubNavBarItem) => renderSubNavBarItem(subNavBarItem))}
      </div>
      {subNavBarFooter && <div className={"mb-8"}>{subNavBarFooter}</div>}
    </div>
  );
};

export default SubNavBar;
