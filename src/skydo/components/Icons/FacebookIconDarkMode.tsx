import * as React from "react";

interface Props {
  height?: number | string;
  width?: number | string;
  backgroundColor?: string;
  strokeColor?: string;
}

const FacebookIconDarkMode = ({ height = 32, width = 32, backgroundColor = "#0A2540", strokeColor = "#A0BFF8" }: Props) => (
  <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x={0} y={0} width={32} height={32} rx={16} fill={backgroundColor} />
    {/* Facebook "f" — source viewBox 0 0 8.66667 14.6667, positioned at left-[21.88%] right-[28.13%] top-1/4 bottom-1/4 with inner 29.17%/25%/8.33%/8.33% inset */}
    <path
      d="M8 0.666667H6C5.11595 0.666667 4.2681 1.01786 3.64298 1.64298C3.01786 2.2681 2.66667 3.11595 2.66667 4V6H0.666667V8.66667H2.66667V14H5.33333V8.66667H7.33333L8 6H5.33333V4C5.33333 3.82319 5.40357 3.65362 5.5286 3.5286C5.65362 3.40357 5.82319 3.33333 6 3.33333H8V0.666667Z"
      stroke={strokeColor}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(11 8.67)"
    />
  </svg>
);

export default FacebookIconDarkMode;
