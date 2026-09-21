import { CommonIconProps } from "./types";

const CloseLineIcon = ({ stroke = "#FFFFFF", width = 20, height = 20, className = "" }: CommonIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M15 5L5 15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M5 5L15 15" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default CloseLineIcon;
