const ThailandFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8242_7633)">
        <path d="M0.384766 11.3181V12.7838H15.6152V11.3181V10.8716H0.384766V11.3181Z" fill="#FF1403" />
        <path d="M15.6152 4.62064V3.21802H0.384766V4.62064V5.13028H15.6152V4.62064Z" fill="#FF1403" />
        <path d="M0.384766 9.40072V10.871H15.6152V9.40072V8.95874H0.384766V9.40072Z" fill="white" />
        <path d="M15.6152 6.5325V5.12988H0.384766V6.5325V7.04666H15.6152V6.5325Z" fill="white" />
        <path d="M15.6152 6.47437H0.384766V9.52768H15.6152V6.47437Z" fill="#0029A3" />
      </g>
      <defs>
        <clipPath id="clip0_8242_7633">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.384766 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

ThailandFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default ThailandFlagIcon;
