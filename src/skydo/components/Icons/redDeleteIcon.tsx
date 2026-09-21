import React from "react";

interface Props {
  onClick?: () => void;
  className?: string;
  strokeColor?: string;
  width?: number;
  height?: number;
}

const RedDeleteIcon = (props: Props) => {
  const { onClick, className, strokeColor = "#E11900", width = 16, height = 16 } = props;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={onClick}
      className={className}
    >
      <path
        d="M2 4H3.33333H14"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5.3335 3.99967V2.66634C5.3335 2.31272 5.47397 1.97358 5.72402 1.72353C5.97407 1.47348 6.31321 1.33301 6.66683 1.33301H9.3335C9.68712 1.33301 10.0263 1.47348 10.2763 1.72353C10.5264 1.97358 10.6668 2.31272 10.6668 2.66634V3.99967M12.6668 3.99967V13.333C12.6668 13.6866 12.5264 14.0258 12.2763 14.2758C12.0263 14.5259 11.6871 14.6663 11.3335 14.6663H4.66683C4.31321 14.6663 3.97407 14.5259 3.72402 14.2758C3.47397 14.0258 3.3335 13.6866 3.3335 13.333V3.99967H12.6668Z"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.6665 7.33301V11.333"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.3335 7.33301V11.333"
        stroke={strokeColor}
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RedDeleteIcon;
