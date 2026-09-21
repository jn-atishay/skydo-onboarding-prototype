import * as React from "react";

interface Props {
  height?: number | string;
  width?: number | string;
  backgroundColor?: string;
  strokeColor?: string;
}

const LinkedinIconDarkMode = ({ height = 32, width = 32, backgroundColor = "#0A2540", strokeColor = "#A0BFF8" }: Props) => (
  <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x={0} y={0} width={32} height={32} rx={16} fill={backgroundColor} />
    {/* "n" arch — source viewBox 0 0 9.33333 10, positioned at inset-1/4 with 33.33%/8.33%/12.5%/41.67% inner inset */}
    <path
      d="M4.66667 0.666667C5.72753 0.666667 6.74495 1.08809 7.49509 1.83824C8.24524 2.58839 8.66667 3.6058 8.66667 4.66667V9.33333H6V4.66667C6 4.31304 5.85952 3.97391 5.60948 3.72386C5.35943 3.47381 5.02029 3.33333 4.66667 3.33333C4.31304 3.33333 3.97391 3.47381 3.72386 3.72386C3.47381 3.97391 3.33333 4.31304 3.33333 4.66667V9.33333H0.666667V4.66667C0.666667 3.6058 1.08809 2.58839 1.83824 1.83824C2.58839 1.08809 3.6058 0.666667 4.66667 0.666667Z"
      stroke={strokeColor}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(14 12.67)"
    />
    {/* "i" vertical bar — source viewBox 0 0 4 9.33333 */}
    <path
      d="M3.33333 0.666667H0.666667V8.66667H3.33333V0.666667Z"
      stroke={strokeColor}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(8.67 13.33)"
    />
    {/* "i" dot — source viewBox 0 0 4 4 */}
    <path
      d="M2 3.33333C2.73638 3.33333 3.33333 2.73638 3.33333 2C3.33333 1.26362 2.73638 0.666667 2 0.666667C1.26362 0.666667 0.666667 1.26362 0.666667 2C0.666667 2.73638 1.26362 3.33333 2 3.33333Z"
      stroke={strokeColor}
      strokeWidth="1.33333"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(8.67 8.67)"
    />
  </svg>
);

export default LinkedinIconDarkMode;
