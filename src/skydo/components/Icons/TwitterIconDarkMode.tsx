import * as React from "react";

interface Props {
  height?: number | string;
  width?: number | string;
  backgroundColor?: string;
  strokeColor?: string;
}

const TwitterIconDarkMode = ({ width = 32, height = 32, strokeColor = "#A0BFF8", backgroundColor = "#0A2540" }: Props) => (
  <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x={0} y={0} width={32} height={32} rx={16} fill={backgroundColor} />
    {/* Twitter/X logo — source viewBox 0 0 16 16, positioned at inset-1/4 */}
    <path
      d="M12.6 0.75H15.054L9.694 6.892L16 15.25H11.063L7.196 10.18L2.771 15.25H0.316L6.049 8.68L0 0.75H5.063L8.558 5.383L12.6 0.75ZM11.74 13.778H13.1L4.323 2.145H2.865L11.74 13.778Z"
      fill={strokeColor}
      transform="translate(8 8)"
    />
  </svg>
);
export default TwitterIconDarkMode;
