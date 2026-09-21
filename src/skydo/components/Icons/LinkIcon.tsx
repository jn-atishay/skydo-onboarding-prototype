import { CommonIconProps } from "./types";

const LinkIcon = (props: CommonIconProps) => {
  const { className = "", stroke = "#0A2540", height = 16, width = 16, isSelected = false } = props;
  const strokeColor = isSelected ? "#283C8B" : stroke;
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" className={className}>
      <g clipPath="url(#clip0_496_8356)">
        <path
          d="M6.6665 8.66599C6.95281 9.04874 7.31808 9.36545 7.73754 9.59462C8.157 9.82379 8.62084 9.96007 9.0976 9.99421C9.57437 10.0284 10.0529 9.95957 10.5007 9.79251C10.9486 9.62546 11.3552 9.36404 11.6932 9.02599L13.6932 7.02599C14.3004 6.39732 14.6363 5.55531 14.6288 4.68132C14.6212 3.80733 14.2706 2.97129 13.6526 2.35326C13.0345 1.73524 12.1985 1.38467 11.3245 1.37708C10.4505 1.36948 9.60851 1.70547 8.97984 2.31266L7.83317 3.45266"
          stroke={strokeColor}
          strokeWidth="1.0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M9.33347 7.33283C9.04716 6.95008 8.68189 6.63338 8.26243 6.40421C7.84297 6.17503 7.37913 6.03875 6.90237 6.00461C6.4256 5.97047 5.94707 6.03925 5.49924 6.20631C5.0514 6.37337 4.64472 6.63479 4.3068 6.97283L2.3068 8.97283C1.69961 9.60151 1.36363 10.4435 1.37122 11.3175C1.37881 12.1915 1.72938 13.0275 2.3474 13.6456C2.96543 14.2636 3.80147 14.6142 4.67546 14.6217C5.54945 14.6293 6.39146 14.2934 7.02013 13.6862L8.16013 12.5462"
          stroke={strokeColor}
          strokeWidth="1.0"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_496_8356">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default LinkIcon;
