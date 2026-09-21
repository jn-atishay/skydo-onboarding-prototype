import { CommonIconProps } from "./types";

const MoneyIcon = ({ width = 24, height = 24, className, stroke = "#0A2540" }: CommonIconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className}>
      <rect
        x="1"
        y="7"
        width="19"
        height="12"
        rx="2"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4 4H19C21.2091 4 23 5.79086 23 8V16"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11 16C12.6569 16 14 14.6569 14 13C14 11.3431 12.6569 10 11 10C9.34315 10 8 11.3431 8 13C8 14.6569 9.34315 16 11 16Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default MoneyIcon;
