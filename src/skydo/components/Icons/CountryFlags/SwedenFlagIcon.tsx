const SwedenFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0.238281 3.28198 15.2304 9.43352"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8242_9595)">
        <path d="M15.4688 3.28198H0.238281V12.7155H15.4688V3.28198Z" fill="#005195" />
        <path
          d="M15.4688 7.06261H8.06056V3.28198H5.83269V7.06261H0.238281V8.95742H5.83269V12.72H8.06056V8.95742H15.4688V7.06261Z"
          fill="#FFCB00"
        />
      </g>
      <defs>
        <clipPath id="clip0_8242_9595">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.238281 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

SwedenFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default SwedenFlagIcon;
