import React, { FC } from "react";

export interface VkycIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const WifiIcon: FC<VkycIconProps> = (props) => {
  const { width = 60, height = 60, className = "" } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 60 60" fill="none" className={className}>
      <path
        d="M13.0645 31.3312C17.8465 27.3481 23.8732 25.167 30.0967 25.167C36.3202 25.167 42.347 27.3481 47.129 31.3312"
        stroke="#334DB3"
        strokeWidth="4.83871"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.40332 22.7423C11.4737 16.51 20.575 13.0713 30.0001 13.0713C39.4252 13.0713 48.5265 16.51 55.5969 22.7423"
        stroke="#5671D2"
        strokeWidth="4.83871"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.6055 39.9432C24.0616 38.1982 26.9998 37.2607 30.0127 37.2607C33.0256 37.2607 35.9638 38.1982 38.42 39.9432"
        stroke="#283C8B"
        strokeWidth="4.83871"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 49.3545H30.0242"
        stroke="#0A2540"
        strokeWidth="4.83871"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default WifiIcon;
