import { CommonIconProps } from "./types";

const NavHomeIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M3.77783 7.52441V16C3.77783 16.5523 4.22555 17 4.77783 17H10H15.2223C15.7746 17 16.2223 16.5523 16.2223 16V7.52441"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M2 9.03137L9.51911 2.57286C9.90051 2.24526 10.4658 2.25178 10.8396 2.58809L18 9.03137"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M8.22217 16.9999V13.0444C8.22217 12.4921 8.66988 12.0444 9.22217 12.0444H10.7777C11.33 12.0444 11.7777 12.4921 11.7777 13.0444V16.9999"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default NavHomeIcon;
