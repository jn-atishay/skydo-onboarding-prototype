const DenmarkFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg width={width} height={height} viewBox="0.421875 3.22437 15.230425 9.55323" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8242_9799)">
        <mask
          id="mask0_8242_9799"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="3"
          width="16"
          height="10"
        >
          <path d="M15.6523 3.22437H0.421875V12.7776H15.6523V3.22437Z" fill="white" />
        </mask>
        <g mask="url(#mask0_8242_9799)">
          <path d="M15.6523 3.22437H0.421875V12.7776H15.6523V3.22437Z" fill="#BE003A" />
          <path d="M7.49872 3.22437H5.72943V12.7776H7.49872V3.22437Z" fill="white" />
          <path d="M15.6523 7.11768H0.421875V8.88696H15.6523V7.11768Z" fill="white" />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_8242_9799">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.421875 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

DenmarkFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default DenmarkFlagIcon;
