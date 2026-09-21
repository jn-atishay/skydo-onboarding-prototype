import { CommonIconProps } from "./types";

const ChevronRightIcon = ({ stroke = "#0A2540", width = 16, height = 16, className = "" }: CommonIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M6 12L10 8L6 4" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default ChevronRightIcon;
