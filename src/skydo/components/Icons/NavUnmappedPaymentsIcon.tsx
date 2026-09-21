import { CommonIconProps } from "./types";

const NavUnmappedPaymentsIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <rect
        x="2"
        y="6.40002"
        width="13"
        height="9.6"
        rx="1.76599"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 4H11.5H14.468C16.4187 4 18 5.58132 18 7.53198V8.8V14.08"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.65954 13.12C9.71038 13.12 10.5622 12.2604 10.5622 11.2C10.5622 10.1396 9.71038 9.28003 8.65954 9.28003C7.60871 9.28003 6.75684 10.1396 6.75684 11.2C6.75684 12.2604 7.60871 13.12 8.65954 13.12Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default NavUnmappedPaymentsIcon;
