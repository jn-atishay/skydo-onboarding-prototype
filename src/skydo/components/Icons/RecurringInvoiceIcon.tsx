import { CommonIconProps } from "./types";

const RecurringInvoiceIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M3 4.66528V8.66634H6.81818"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.9998 15.3347V11.3336H13.1816"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.4027 7.99947C15.08 7.04375 14.5314 6.18927 13.8083 5.51577C13.0852 4.84227 12.2111 4.3717 11.2674 4.14797C10.3238 3.92424 9.34151 3.95464 8.41214 4.23633C7.48278 4.51803 6.63665 5.04184 5.95272 5.75889L3 8.66632M17 11.3337L14.0473 14.2411C13.3633 14.9582 12.5172 15.482 11.5878 15.7637C10.6585 16.0454 9.67615 16.0758 8.73254 15.852C7.78893 15.6283 6.91478 15.1577 6.19166 14.4842C5.46854 13.8107 4.92001 12.9563 4.59727 12.0005"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RecurringInvoiceIcon;
