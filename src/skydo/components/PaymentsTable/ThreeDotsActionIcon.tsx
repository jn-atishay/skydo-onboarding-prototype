import React, { useContext } from "react";
import classNames from "classnames";
import ThreeDotsIcon from "../Icons/ThreeDotsIcon";
import AppContext from "../../context/AppContext";

interface Props {
  classname?: string;
  width?: number;
  height?: number;
  tooltipText?: string;
  onClick?: () => void;
}

const ThreeDotsActionIcon = (props: Props) => {
  const { theme } = useContext(AppContext);

  return (
    <div
      className={classNames("cursor-pointer rounded-full p-2")}
      onClick={props.onClick}
    >
      <ThreeDotsIcon />
    </div>
  );
};

export default ThreeDotsActionIcon;
