import { CommonIconProps } from "./types";

const CheckBadgeIcon = ({ width = 12, height = 12, className }: CommonIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 13.2 13.2" fill="none" className={className}>
      <circle cx="6.6" cy="6.6" r="6" fill="#276EF1" stroke="#276EF1" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M9.75143 4.59902L5.75143 8.59902L3.93325 6.78084"
        fill="#276EF1"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CheckBadgeIcon;
