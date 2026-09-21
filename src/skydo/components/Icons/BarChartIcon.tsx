import { CommonIconProps } from "./types";

const BarChartIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M14.7534 14.2493V7" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14.2418V2.67871" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.26916 14.2402V9" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 17.5H10L16 17.5" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
};

export default BarChartIcon;
