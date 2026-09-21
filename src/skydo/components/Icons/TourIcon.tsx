//Nov 2023

import Image from "next/image";
import React from "react";
import classnames from "classnames";

interface Props {
  width?: number;
  height?: number;
  className?: string;
}

const TourIcon = (props: Props) => {
  const { width = 62, height = 62, className } = props;
  return (
    <div className={classnames("relative", className)} style={{ width: width, height: height }}>
      <div className={"absolute"} style={{ width: width, height: height }}>
        <Image src="/tutorial_girl.png" layout="fill" objectFit="cover" alt={""} />
      </div>
    </div>
  );
};

export default TourIcon;
