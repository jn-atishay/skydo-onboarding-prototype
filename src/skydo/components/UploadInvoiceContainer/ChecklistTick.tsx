import React, { useContext } from "react";
import classNames from "classnames";
import FullTick from "../Icons/FullTick";
import AppContext from "../../context/AppContext";

interface Props {
  /** Overrides the box height; the mobile business-name row uses a one-line box so the tick
   *  optically centres on the first line even when the name wraps. */
  boxHeightClass?: string;
}

const ChecklistTick = ({ boxHeightClass = "h-6" }: Props) => {
  const { theme } = useContext(AppContext);

  return (
    <div className={classNames("flex items-center justify-center w-6 shrink-0", boxHeightClass)}>
      <FullTick is30X30 fill={theme.hexColors.green[100]} className={"w-4.5 h-4.5"} />
    </div>
  );
};

export default ChecklistTick;
