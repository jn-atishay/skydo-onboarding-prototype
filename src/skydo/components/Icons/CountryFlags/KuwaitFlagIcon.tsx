const KuwaitFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0.68457 3.27661 15.2304 9.44849"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8242_7591)">
        <path d="M15.915 3.27661H0.68457V6.4714H15.915V3.27661Z" fill="#007934" />
        <path d="M15.915 6.40308H0.68457V9.59787H15.915V6.40308Z" fill="white" />
        <path d="M15.915 9.53027H0.68457V12.7251H15.915V9.53027Z" fill="#D52B1E" />
        <path
          d="M5.50179 6.38527L4.41134 5.6598L0.896606 3.31665V8.00294V12.6847L4.41134 10.3416L5.50179 9.61611V6.38527Z"
          fill="black"
        />
      </g>
      <defs>
        <clipPath id="clip0_8242_7591">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.68457 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

KuwaitFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default KuwaitFlagIcon;
