import { CommonIconProps } from "./types";

const ShieldLineIcon = ({ width = 32, height = 33, stroke = "#0A2540", className }: CommonIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 32 33"
      fill="none"
      className={className}
    >
      <path
        d="M15.9999 29.5368C15.9999 29.5368 26.6666 24.2035 26.6666 16.2035V6.87012L15.9999 2.87012L5.33325 6.87012V16.2035C5.33325 24.2035 15.9999 29.5368 15.9999 29.5368Z"
        stroke={stroke}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ShieldLineIcon;
