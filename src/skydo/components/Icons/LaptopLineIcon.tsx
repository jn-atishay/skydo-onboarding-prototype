import { CommonIconProps } from "./types";

const LaptopLineIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M17 13V4.5C17 3.94772 16.5523 3.5 16 3.5H10H4.1875C3.63522 3.5 3.1875 3.94772 3.1875 4.5V13C3.1875 13.5523 3.63522 14 4.1875 14H10.5H16C16.5523 14 17 13.5523 17 13Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18 13.9999H2V14.9999C2 16.1044 2.89543 16.9999 4 16.9999H16C17.1046 16.9999 18 16.1044 18 14.9999V13.9999Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LaptopLineIcon;
