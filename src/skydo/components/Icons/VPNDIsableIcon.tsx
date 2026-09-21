import { CommonIconProps } from "./types";

const VPNDisableIcon = ({ className }: CommonIconProps) => {
  return (
    <svg
      width="51"
      height="54"
      viewBox="0 0 51 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g clipPath="url(#clip0_42_2661)">
        <path
          d="M27.3466 51.9643C26.6716 52.3 25.6645 52.3 24.6537 51.9643C11.5359 46.9036 2.78589 34.0928 2.78589 19.9393V9.49285C2.78589 7.47142 4.46803 5.78571 6.48589 5.78571H45.5145C47.5323 5.78571 49.2145 7.47142 49.2145 9.49285V19.9428C49.2145 34.4357 40.4645 46.9071 27.3466 51.9607V51.9643Z"
          fill="#5671D2"
          stroke="#283C8B"
          strokeWidth="2.27273"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.7249 22.1285C14.3856 21.0213 19.357 18.8106 25.9927 18.8106C32.6284 18.8106 37.5999 21.0213 39.257 22.1285M17.5356 29.2249C18.9463 28.5178 22.607 27.1106 25.9927 27.1106C29.3713 27.1106 33.0356 28.5178 34.4463 29.2249M23.2213 36.4285C23.6856 36.1928 24.8856 35.732 25.9927 35.732C27.0999 35.732 28.2999 36.1963 28.7606 36.4249"
          stroke="white"
          strokeWidth="2.27273"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path d="M2 2L46 46" stroke="#0A2540" strokeWidth="3" strokeLinecap="round" />
      <defs>
        <clipPath id="clip0_42_2661">
          <rect width="50" height="50" fill="white" transform="translate(1 4)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default VPNDisableIcon;
