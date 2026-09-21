const SwitzerlandFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0.384766 0.385742 15.2304 15.2304"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8242_7573)">
        <path d="M15.6151 3.14844H0.182129V12.8535H15.6151V3.14844Z" fill="#F62717" />
        <path
          d="M10.885 7.10732H8.7971V4.98706H7.0002V7.10732H4.91229V8.92731H7.0002V11.0429H8.7971V8.92731H10.885V7.10732Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_8242_7573">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.384766 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

SwitzerlandFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default SwitzerlandFlagIcon;
