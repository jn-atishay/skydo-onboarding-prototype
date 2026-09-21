const HungaryFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0.421875 3.22998 15.2304 9.54182"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8242_9810)">
        <path d="M15.6523 3.22998H0.421875V12.7718H15.6523V3.22998Z" fill="black" />
        <path d="M15.6523 3.22998H0.421875V12.7718H15.6523V3.22998Z" fill="#BC0030" />
        <path d="M15.6523 6.40967H0.421875V12.7678H15.6523V6.40967Z" fill="white" />
        <path d="M15.6523 9.59204H0.421875V12.7711H15.6523V9.59204Z" fill="#3D9348" />
      </g>
      <defs>
        <clipPath id="clip0_8242_9810">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.421875 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

HungaryFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default HungaryFlagIcon;
