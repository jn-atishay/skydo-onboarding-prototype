import Typography from "../AtomicComponents/Typography";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React from "react";
import classnames from "classnames";
import Locale from "../../util/locale/en";
import ExclamationIcon from "../Icons/ExclamationIcon";
import Tooltip from "../AtomicComponents/Tooltip";

const InfoBox = (props: InfoBoxInvPageProps) => {
  const {
    header,
    value,
    subValue,
    renderCTA,
    headerTypographyProps,
    valueTypographyProps,
    containerClass,
    showToolTipForBankAddressChange,  
    leftIcon,
  } = props;
  return (
    <div className={classnames("flex flex-col", containerClass)}>
      <div className={"flex flex-row items-center gap-1"}>
        <Typography
          type={headerTypographyProps?.type || TYPOGRAPHY_TYPES.LABEL}
          size={headerTypographyProps?.size || TYPOGRAPHY_SIZES.SMALL}
          textClasses={headerTypographyProps?.textClasses || "!text-black-500 mb-1"}
          text={header}
        />
        {showToolTipForBankAddressChange && (
          <Tooltip
            tooltipText={Locale.CCAddressChangeInternationalAccountsTooltipText}
            tooltipTheme={"dark"}
            position={TOOLTIP_POSITION.TOP}
          >
            <ExclamationIcon height={16} width={16} />
          </Tooltip>
        )}
      </div>
      <div className="flex flex-row items-center gap-1">
      {leftIcon ? leftIcon : null}
      <Typography
        type={valueTypographyProps?.label || valueTypographyProps?.type || TYPOGRAPHY_TYPES.LABEL}
        size={valueTypographyProps?.size || TYPOGRAPHY_SIZES.SMALL}
        text={value}
        textClasses={valueTypographyProps?.textClasses}
        typographyProps={valueTypographyProps?.typographyProps}
      />
      </div>
      {subValue ? (
        <Typography text={subValue} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!mt-1"} />
      ) : null}
      {renderCTA ? renderCTA() : null}
    </div>
  );
};

interface InfoBoxInvPageProps {
  header: string;
  value: string | JSX.Element | JSX.Element[];
  subValue?: string;
  renderCTA?: () => JSX.Element | JSX.Element[] | null;
  headerTypographyProps?: { [key: string]: string };
  valueTypographyProps?: { [key: string]: any };
  containerClass?: string;
  showToolTipForBankAddressChange?: boolean;
  leftIcon?: JSX.Element;
}

export default InfoBox;
