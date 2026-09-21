import React, { FC } from "react";

interface TickIconProps {}

const TickIcon: FC<TickIconProps> = (props) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.0005 6L9.00049 17L4.00049 12"
        stroke="#1AA06B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TickIcon;
