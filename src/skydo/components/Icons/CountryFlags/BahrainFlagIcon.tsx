const BahrainFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8348_5255)">
        <path d="M15.6003 3.22168H0.369934V12.7794H15.6003V3.22168Z" fill="#CE1126" />
        <path d="M0.807678 3.22168V8.02789V12.7794H4.66997V8.02789V3.22168H0.807678Z" fill="white" />
        <path
          d="M7.1186 4.17473L5.8783 4.65352L4.638 5.13231V4.17473V3.22168L5.8783 3.69591L7.1186 4.17473Z"
          fill="white"
        />
        <path
          d="M7.1186 6.08608L5.8783 6.5649L4.638 7.04369V6.08608V5.13306L5.8783 5.61185L7.1186 6.08608Z"
          fill="white"
        />
        <path
          d="M7.1186 8.00104L5.8783 8.47983L4.638 8.95409V8.00104V7.04346L5.8783 7.52225L7.1186 8.00104Z"
          fill="white"
        />
        <path
          d="M7.1186 9.91144L5.8783 10.3902L4.638 10.8691V9.91144V8.95386L5.8783 9.43265L7.1186 9.91144Z"
          fill="white"
        />
        <path
          d="M7.1186 11.8226L5.8783 12.3014L4.638 12.7803V11.8226V10.8696L5.8783 11.3484L7.1186 11.8226Z"
          fill="white"
        />
      </g>
      <defs>
        <clipPath id="clip0_8348_5255">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.369934 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

BahrainFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default BahrainFlagIcon;
