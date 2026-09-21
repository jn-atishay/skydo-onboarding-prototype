import { IconProps } from "./DownloadIcon";
import React from "react";

interface Props extends IconProps {
  isSelected?: boolean;
}

const LaptopIcon: React.FC<Props> = ({
  isSelected = false,
  width = 48,
  height = 36,
  stroke = "#0A2540",
  className,
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 48 36" fill="none">
      <path
        d="M3.7334 3.42008C3.7334 2.04683 4.84664 0.933594 6.21988 0.933594H41.2469C42.6202 0.933594 43.7334 2.04683 43.7334 3.42008V29.7336H3.7334V3.42008Z"
        fill={isSelected ? "white" : "#283C8B"}
      />
      <path
        d="M0 29.7334H48V33.1136C48 34.4868 46.8868 35.6001 45.5135 35.6001H2.48648C1.11324 35.6001 0 34.4868 0 33.1136V29.7334Z"
        fill={isSelected ? "white" : "#5671D2"}
      />
      <path
        d="M17.4053 29.7334H30.335C30.335 30.832 29.4444 31.7226 28.3458 31.7226H19.3945C18.2959 31.7226 17.4053 30.832 17.4053 29.7334Z"
        fill={isSelected ? "white" : "#283C8B"}
      />
      <rect
        x="6.3999"
        y="4.13379"
        width="34.6667"
        height="22.9333"
        // fill={"white"}
        fill="#5671D2"
      />
    </svg>
  );
};

export default LaptopIcon;
