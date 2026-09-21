const RomaniaFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8242_9584)">
        <mask
          id="mask0_8242_9584"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="3"
          width="16"
          height="10"
        >
          <path d="M15.4688 3.28369H0.238281V12.7179H15.4688V3.28369Z" fill="white" />
        </mask>
        <g mask="url(#mask0_8242_9584)">
          <path d="M5.3151 3.28369H0.238281V12.7179H5.3151V3.28369Z" fill="#1C2A7D" />
          <path d="M10.3917 3.28369H5.31482V12.7179H10.3917V3.28369Z" fill="#F3D02F" />
          <path d="M15.469 3.28369H10.3922V12.7179H15.469V3.28369Z" fill="#BC0030" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_8242_9584">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.238281 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

RomaniaFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default RomaniaFlagIcon;
