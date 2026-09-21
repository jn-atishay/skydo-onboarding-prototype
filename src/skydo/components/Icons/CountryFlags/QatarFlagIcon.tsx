const QatarFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg width={width} height={height} viewBox="0.384766 3.18872 15.230434 9.62428" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8242_7612)">
        <mask
          id="mask0_8242_7612"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="3"
          width="16"
          height="10"
        >
          <path d="M15.6152 3.18872H0.384766V12.813H15.6152V3.18872Z" fill="white" />
        </mask>
        <g mask="url(#mask0_8242_7612)">
          <path
            d="M5.30347 3.18872L7.05541 3.72113L5.30347 4.25809L7.05541 4.79049L5.30347 5.32745L7.05541 5.86441L5.30347 6.39681L7.05541 6.92922L5.30347 7.46617L7.05541 7.99859L5.30347 8.53554L7.05541 9.06795L5.30347 9.60491L7.05541 10.1373L5.30347 10.6743L7.05541 11.2067L5.30347 11.7436L7.05541 12.2806L5.30347 12.813H15.6149V3.18872H5.30347Z"
            fill="#681840"
          />
          <path
            d="M0.384766 3.18872V12.813H5.30384L7.05578 12.2806L5.30384 11.7436L7.05578 11.2067L5.30384 10.6743L7.05578 10.1373L5.30384 9.60491L7.05578 9.06795L5.30384 8.53554L7.05578 7.99859L5.30384 7.46617L7.05578 6.92922L5.30384 6.39681L7.05578 5.86441L5.30384 5.32745L7.05578 4.79049L5.30384 4.25809L7.05578 3.72113L5.30384 3.18872H0.384766Z"
            fill="white"
          />
        </g>
      </g>
      <defs>
        <clipPath id="clip0_8242_7612">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.384766 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

QatarFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default QatarFlagIcon;
