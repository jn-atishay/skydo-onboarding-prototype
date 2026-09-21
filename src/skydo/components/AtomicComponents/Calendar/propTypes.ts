import {
  ClassName,
  LooseValue,
  NavigationLabelFunc,
  OnArgs,
  TileClassNameFunc,
  TileContentFunc,
  TileDisabledFunc,
  Value,
  View,
} from "react-calendar/src/shared/types";
import React from "react";

export interface CalendarProps {
  value?: LooseValue;
  next2Label?: React.ReactNode;
  prev2Label?: React.ReactNode;
  showNeighboringMonth?: boolean;
  className?: string;
  view?: View;
  onChange?: (value: Value, event: React.MouseEvent<HTMLButtonElement>) => void;
  navigationLabel?: NavigationLabelFunc;
  tileClassName?: TileClassNameFunc | ClassName;
  tileContent?: TileContentFunc | React.ReactNode;
  tileDisabled?: TileDisabledFunc;
  activeStartDate?: Date;
  onActiveStartDateChange?: ({ action, activeStartDate, value, view }: OnArgs) => void;
}
