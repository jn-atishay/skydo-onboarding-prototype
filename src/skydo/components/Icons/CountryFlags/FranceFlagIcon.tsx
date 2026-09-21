import { CommonIconProps } from "../types";

const FranceFlagIcon = ({ width = 40, height = 40 }: CommonIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0.780273 7.26015 38 25.3333"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8973_19971)">
        <path d="M0.780273 7.26015H38.7803V32.5935H0.780273" fill="#CE1126" />
        <path d="M0.780273 7.26015H26.1136V32.5935H0.780273" fill="white" />
        <path d="M0.780273 7.26015H13.4469V32.5935H0.780273" fill="#002654" />
      </g>
      <defs>
        <clipPath id="clip0_8973_19971">
          <rect width="38" height="25.3333" fill="white" transform="translate(0.780273 7.26015)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default FranceFlagIcon;
