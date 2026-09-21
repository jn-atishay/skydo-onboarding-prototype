const PolandFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0.384766 3.11816 15.2304 9.76554"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8242_7523)">
        <path d="M15.6151 3.11816H0.168884V12.8837H15.6151V3.11816Z" fill="white" />
        <path d="M15.6151 7.99854H0.168884V12.879H15.6151V7.99854Z" fill="#C22623" />
      </g>
      <defs>
        <clipPath id="clip0_8242_7523">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.384766 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

PolandFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};
export default PolandFlagIcon;
