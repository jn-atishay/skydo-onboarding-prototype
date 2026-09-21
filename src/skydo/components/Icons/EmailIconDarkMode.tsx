import * as React from "react";

interface Props {
  height?: number | string;
  width?: number | string;
  backgroundColor?: string;
  strokeColor?: string;
}

const EmailIconDarkMode = ({ height = 32, width = 32, backgroundColor = "#0A2540", strokeColor = "#A0BFF8" }: Props) => (
  <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x={0} y={0} width={32} height={32} rx={16} fill={backgroundColor} />
    {/* Envelope body — source viewBox 0 0 14.8333 12.1667, positioned at inset-1/4 with 16.67%/8.33% inner inset */}
    <path
      d="M2.08333 0.75H12.75C13.4833 0.75 14.0833 1.35 14.0833 2.08333V10.0833C14.0833 10.8167 13.4833 11.4167 12.75 11.4167H2.08333C1.35 11.4167 0.75 10.8167 0.75 10.0833V2.08333C0.75 1.35 1.35 0.75 2.08333 0.75Z"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(8.58 9.92)"
    />
    {/* V-fold — source viewBox 0 0 14.8335 6.16673 */}
    <path
      d="M14.0834 0.750064L7.41673 5.41673L0.750064 0.750064"
      stroke={strokeColor}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(8.58 11.25)"
    />
  </svg>
);
export default EmailIconDarkMode;
