import { CommonIconProps } from "./types";

const PaidIcon = ({ stroke = "#0A2540", width = 24, height = 24 }: CommonIconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M20.04 5V1.8498C20.04 1.5362 19.6608 1.37915 19.4391 1.6009L17.6726 3.36744C17.5262 3.51381 17.2858 3.5029 17.1532 3.34389L15.4704 1.3245C15.3297 1.15562 15.0703 1.15562 14.9296 1.3245L13.2704 3.3155C13.1297 3.48438 12.8703 3.48438 12.7296 3.3155L11.0704 1.3245C10.9297 1.15562 10.6703 1.15562 10.5296 1.3245L8.87041 3.3155C8.72969 3.48438 8.47031 3.48438 8.32959 3.3155L6.7018 1.36216C6.55117 1.1814 6.26902 1.19647 6.1385 1.39225L4.87817 3.28274C4.75496 3.46756 4.49346 3.49346 4.33639 3.33639L2.6009 1.6009C2.37915 1.37915 2 1.53621 2 1.8498V22C2 22.5523 2.44772 23 3 23H19.04C19.5923 23 20.04 22.5523 20.04 22V20"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <g clipPath="url(#clip0_757_43388)">
        <path
          d="M23.1 12.3752V12.8812C23.0993 14.0672 22.7153 15.2213 22.0051 16.1712C21.295 17.1211 20.2968 17.8161 19.1594 18.1523C18.0221 18.4886 16.8065 18.4482 15.6939 18.0372C14.5814 17.6262 13.6315 16.8666 12.986 15.8716C12.3405 14.8766 12.0339 13.6996 12.1119 12.5162C12.1899 11.3327 12.6484 10.2062 13.419 9.30459C14.1896 8.403 15.231 7.77466 16.3879 7.51328C17.5448 7.2519 18.7551 7.37149 19.8385 7.8542"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M23.1 8.4812L17.6 13.9867L15.95 12.3367"
          stroke={stroke}
          strokeWidth="1.32"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <line x1="4.63965" y1="18.73" x2="13.4396" y2="18.73" stroke={stroke} strokeWidth="1.5" />
      <line x1="4.63965" y1="16.09" x2="8.15965" y2="16.09" stroke={stroke} strokeWidth="1.5" />
      <defs>
        <clipPath id="clip0_757_43388">
          <rect width="13.2" height="13.2" fill="white" transform="translate(11 6.28125)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default PaidIcon;
