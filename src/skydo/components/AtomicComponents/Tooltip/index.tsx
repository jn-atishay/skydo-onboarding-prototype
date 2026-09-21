import React from "react";
import { TooltipProps } from "./TooltipLib";
import * as Sentry from "@sentry/react";
import dynamic from "next/dynamic";
import { TOOLTIP_POSITION } from "../../../constants/atomicConstants";

const TooltipLib = dynamic(() => import("./TooltipLib"), { ssr: false });

const Tooltip = (props: TooltipProps) => {
  return (
    <Sentry.ErrorBoundary fallback={<>{props.children}</>}>
      <TooltipLib {...props}>{props.children}</TooltipLib>
    </Sentry.ErrorBoundary>
  );
};

Tooltip.defaultProps = {
  position: TOOLTIP_POSITION.BOTTOM,
  arrow: true,
};

export default Tooltip;
