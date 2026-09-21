import { CommonIconProps } from "../types";

const NetherlandsFlagIcon = ({ width = 40, height = 40 }: CommonIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="1 7.65041 38 25.3333"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8973_19969)">
        <path d="M39 7.65041H1V32.9837H39V7.65041Z" fill="#21468B" />
        <path d="M39 7.65041H1V24.5393H39V7.65041Z" fill="white" />
        <path d="M39 7.65041H1V16.0949H39V7.65041Z" fill="#AE1C28" />
      </g>
      <defs>
        <clipPath id="clip0_8973_19969">
          <rect width="38" height="25.3333" fill="white" transform="translate(1 7.65041)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default NetherlandsFlagIcon;
