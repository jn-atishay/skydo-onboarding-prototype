import { CommonIconProps } from "./types";

const DollarCircleIcon = ({ stroke, width = 20, height = 20, className = "" }: CommonIconProps) => (
  <svg
    width={width}
    height={height}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="10" cy="10" r="9" stroke={stroke} strokeWidth="1.4" />
    <path d="M10 4.5V15.5" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    <path
      d="M12.8 7.9C12.8 6.6 11.55 5.55 10 5.55C8.45 5.55 7.2 6.6 7.2 7.9C7.2 9.2 8.45 10.25 10 10.25C11.55 10.25 12.8 11.3 12.8 12.6C12.8 13.9 11.55 14.95 10 14.95C8.45 14.95 7.2 13.9 7.2 12.6"
      stroke={stroke}
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

export default DollarCircleIcon;
