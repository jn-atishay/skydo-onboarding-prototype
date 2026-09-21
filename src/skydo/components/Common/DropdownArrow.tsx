import classNames from "classnames";
import DownArrowIcon from "../Icons/DownArrowIcon";
import React from "react";

interface Props {
  onArrowClick?: () => void;
  isOpen: boolean;
  width?: number;
  height?: number;
  stroke?: string;
  containerClass?: string;
}

const DropdownArrow = (props: Props) => {
  const { onArrowClick = () => {}, isOpen, width, height, stroke, containerClass } = props;
  return (
    <div
      onClick={() => onArrowClick()}
      className={classNames(
        "cursor-pointer ease-linear duration-150 h-fit",
        {
          "rotate-180": isOpen,
        },
        containerClass
      )}
    >
      <DownArrowIcon width={width} height={height} stroke={stroke} />
    </div>
  );
};

export default DropdownArrow;
