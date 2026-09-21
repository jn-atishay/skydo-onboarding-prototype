const NorwayFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8242_7599)">
        <mask
          id="mask0_8242_7599"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="3"
          width="16"
          height="10"
        >
          <path d="M15.915 3.23315H0.68457V12.7686H15.915V3.23315Z" fill="white" />
        </mask>
        <g mask="url(#mask0_8242_7599)">
          <path d="M15.915 3.23315H0.68457V12.7686H15.915V3.23315Z" fill="#DC1C37" />
          <path d="M6.64215 3.23315H4.2583V12.7686H6.64215V3.23315Z" fill="white" />
          <path d="M15.915 6.81177H0.68457V9.19564H15.915V6.81177Z" fill="white" />
          <path d="M6.04508 3.23315H4.85541V12.7686H6.04508V3.23315Z" fill="#192967" />
          <path d="M15.915 7.40869H0.68457V8.59836H15.915V7.40869Z" fill="#192967" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_8242_7599">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.68457 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

NorwayFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default NorwayFlagIcon;
