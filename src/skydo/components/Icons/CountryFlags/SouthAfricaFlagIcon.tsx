const SouthAfricaFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8242_7622)">
        <path d="M15.6149 3.25806H0.384766V12.7436H15.6149V3.25806Z" fill="#DB2E2E" />
        <path
          d="M15.6149 6.33567V9.94579L9.58153 9.92323H9.57702H9.25211L4.54542 12.7391H0.384766V3.25806H3.85499L9.01294 6.24994L15.6149 6.33567Z"
          fill="#248E31"
        />
        <path d="M15.6151 5.74001V6.66961H9.0447L3.37683 3.25806H5.33531L9.45987 5.74001H15.6151Z" fill="white" />
        <path d="M4.91998 8.06415L0.384766 11.0921V5.22119L4.91998 8.06415Z" fill="#28292B" />
        <path
          d="M15.6145 9.7749V12.7397H4.95563L9.57658 9.92383H9.58108L9.73451 9.82905L15.6145 9.7749Z"
          fill="#2E4593"
        />
        <path d="M15.6155 9.40918V10.3388H9.4603L5.47563 12.7395H3.51715L9.04513 9.40918H15.6155Z" fill="white" />
        <path
          d="M6.18803 8.01932L0.384766 11.5708V10.3839L4.25662 8.0148L0.384766 5.62311V4.43628L6.18803 8.01932Z"
          fill="#FFF915"
        />
      </g>
      <defs>
        <clipPath id="clip0_8242_7622">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.384766 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

SouthAfricaFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default SouthAfricaFlagIcon;
