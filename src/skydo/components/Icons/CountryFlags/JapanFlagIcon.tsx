const JapanFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0.292969 3.19385 15.2304 9.61405"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8242_9776)">
        <path d="M15.5234 3.19385H0.292969V12.8079H15.5234V3.19385Z" fill="white" />
        <path
          d="M7.91061 10.6032C9.32619 10.6032 10.4738 9.43551 10.4738 7.99509C10.4738 6.55467 9.32619 5.38696 7.91061 5.38696C6.49502 5.38696 5.34747 6.55467 5.34747 7.99509C5.34747 9.43551 6.49502 10.6032 7.91061 10.6032Z"
          fill="#FF3F32"
        />
      </g>
      <defs>
        <clipPath id="clip0_8242_9776">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.292969 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

JapanFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default JapanFlagIcon;
