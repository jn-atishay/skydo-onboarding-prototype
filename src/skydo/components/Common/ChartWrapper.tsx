import classnames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import React from "react";

interface Props {
  containerClass?: string;
  title?: string;
  subtitle?: string;
  children: JSX.Element;
  hideSubtitle?: boolean;
  hideColorIndicator?: boolean;
  footerComp?: JSX.Element;
}

const ChartWrapper = (props: Props) => {
  const { containerClass, title, subtitle, children, hideSubtitle, hideColorIndicator, footerComp } = props;
  return (
    <div className={classnames("flex flex-col bg-white rounded-10px p-4 overflow-hidden", containerClass)}>
      <div className={"flex flex-row items-center justify-between mb-4"}>
        <Typography text={title} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE}>
          {hideSubtitle ? undefined : (
            <Typography
              text={subtitle}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-black-500 ml-1 truncate"}
            />
          )}
        </Typography>
        {hideColorIndicator ? null : (
          <div className={"flex_row_item_center overflow-hidden"}>
            <div className={"flex_row_item_center ml-1"}>
              <div className={"w-2 h-2 rounded-full bg-green-400"} />
              <Typography
                text={Locale.paidLabel}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500 ml-1"}
              />
            </div>
            <div className={"flex_row_item_center ml-4 overflow-hidden"}>
              <div className={"w-2 h-2 rounded-full bg-black-400 shrink-0"} />
              <Typography
                text={Locale.invoicedLabel}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                textClasses={"!text-black-500 ml-1 truncate"}
              />
            </div>
          </div>
        )}
      </div>
      {children}
      {footerComp}
    </div>
  );
};

export default ChartWrapper;
