const CzechFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8242_9782)">
        <path d="M8.02349 7.99438L8.03707 8.00344L0.342712 12.7819H15.5235V7.99438H8.02349Z" fill="#ED1028" />
        <path d="M15.5234 3.21997H0.292969V3.2245L8.02347 7.9939H15.5234V3.21997Z" fill="white" />
        <path d="M0.292969 3.22485V12.7818H0.342691L8.03705 8.00331L0.292969 3.22485Z" fill="#0039A8" />
      </g>
      <defs>
        <clipPath id="clip0_8242_9782">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.292969 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

CzechFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default CzechFlagIcon;
