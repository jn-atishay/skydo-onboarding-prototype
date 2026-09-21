import React from "react";
import classNames from "classnames";

const VerticalDottedLine = ({
  isTopClipped,
  isBottomClipped,
  containerClass,
}: {
  isTopClipped: boolean;
  isBottomClipped: boolean;
  containerClass?: string;
}) => {
  return (
    <div
      className={classNames(
        "absolute w-0 border-dashed border-r-2 left-0 border-black-400",
        {
          "-bottom-3 top-10": isTopClipped,
          "-top-3 h-20": isBottomClipped,
          "-top-3 -bottom-3": !isTopClipped && !isBottomClipped,
        },
        containerClass
      )}
    ></div>
  );
};

VerticalDottedLine.defaultProps = {
  isTopClipped: false,
  isBottomClipped: false,
};

export default VerticalDottedLine;
