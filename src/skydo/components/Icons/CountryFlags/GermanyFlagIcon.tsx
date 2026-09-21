import React, { FC } from "react";
import { CommonIconProps } from "../types";

const GermanyFlagIcon: FC<CommonIconProps> = ({height=24, width=24}) => {
  return (
    <svg width={width} height={height} viewBox="0.600098 5.40039 22.8 13.68" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_719_77478)">
        <path d="M23.4001 5.40039H0.600098V19.0804H23.4001V5.40039Z" fill="black" />
        <path d="M23.4001 9.95996H0.600098V19.08H23.4001V9.95996Z" fill="#DD0000" />
        <path d="M23.4001 14.5205H0.600098V19.0805H23.4001V14.5205Z" fill="#FFCE00" />
      </g>
      <defs>
        <clipPath id="clip0_719_77478">
          <rect width="22.8" height="13.68" fill="white" transform="translate(0.600098 5.40039)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default GermanyFlagIcon;
