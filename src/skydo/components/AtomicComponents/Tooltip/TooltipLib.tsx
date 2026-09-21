import { Theme, Tooltip as CoreTooltip } from "react-tippy";
import { TOOLTIP_POSITION } from "../../../constants/atomicConstants";
import React from "react";

export interface TooltipProps {
  children: React.ReactElement | string;
  tooltipText: JSX.Element | string;
  position: any;
  arrow: boolean;
  html?: JSX.Element;
  className?: string;
  style?: { [key: string]: any };
  tooltipTheme?: Theme;
  offset?: number;
  /** popper.js options passthrough; needed when the trigger sits inside a scroll container that would otherwise clip/flip the tooltip */
  popperOptions?: Record<string, unknown>;
}

const TooltipLib = (props: TooltipProps) => {
  const {
    tooltipText,
    children,
    position,
    arrow,
    className,
    style,
    tooltipTheme = "light",
    offset,
    popperOptions,
  } = props;
  const TOOLTIP_MARGIN = 8;

  const renderTooltipContent = () => {
    return <div>{tooltipText}</div>;
  };
  return (
    // @ts-ignore
    <CoreTooltip
      html={renderTooltipContent()}
      interactive={true}
      position={position}
      arrow={arrow}
      distance={TOOLTIP_MARGIN}
      offset={offset}
      popperOptions={popperOptions}
      unmountHTMLWhenHide={true}
      theme={tooltipTheme}
      className={className}
      trigger={"mouseenter"}
      style={style}
    >
      {children}
    </CoreTooltip>
  );
};

TooltipLib.defaultProps = {
  position: TOOLTIP_POSITION.BOTTOM,
  arrow: true,
};

export default TooltipLib;
