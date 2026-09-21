import { CommonIconProps } from "./types";

const ShieldCheckIcon = ({ width = 14, height = 15, stroke = "#5671D2", className }: CommonIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 10 13" fill="none" className={className}>
      <path
        d="M3.38333 5.58546L4.43333 6.63546L6.53333 4.53546M0.583333 2.43546L3.84419 0.805036C4.43539 0.509433 5.13127 0.509432 5.72248 0.805036L8.98333 2.43546C8.98333 2.43546 8.98333 5.50146 8.98333 7.11846C8.98333 8.73546 7.4886 9.827 4.78333 11.5355C2.07807 9.827 0.583333 8.38546 0.583333 7.11846V2.43546Z"
        stroke={stroke}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ShieldCheckIcon;
