import { CommonIconProps } from "./types";

const NavInstaLinksIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10.954 8.62659C9.24917 7.38794 6.77257 7.89026 5.42244 9.74855L4.44458 11.0945C3.09444 12.9528 3.38202 15.4634 5.08688 16.702C6.79175 17.9407 9.26834 17.4384 10.6185 15.5801L10.8629 15.2436M8.99831 11.3184C10.7032 12.5571 13.1798 12.0547 14.5299 10.1964L15.5078 8.85053C16.8579 6.99223 16.5703 4.48162 14.8655 3.24296C13.1606 2.00431 10.684 2.50664 9.33387 4.36493L9.0894 4.70141"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default NavInstaLinksIcon;
