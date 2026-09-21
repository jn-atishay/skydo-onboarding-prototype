import { CommonIconProps } from "../types";

const ItalyFlagIcon = ({ width = 40, height = 40 }: CommonIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="1 7.33333 38 25.3333"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8973_19968)">
        <path d="M39 7.33331H1V32.6666H39V7.33331Z" fill="#009246" />
        <path d="M39 7.33334H13.6667V32.6667H39V7.33334Z" fill="white" />
        <path d="M38.9991 7.33334H26.3324V32.6667H38.9991V7.33334Z" fill="#CE2B37" />
      </g>
      <defs>
        <clipPath id="clip0_8973_19968">
          <rect width="38" height="25.3333" fill="white" transform="translate(1 7.33333)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ItalyFlagIcon;
