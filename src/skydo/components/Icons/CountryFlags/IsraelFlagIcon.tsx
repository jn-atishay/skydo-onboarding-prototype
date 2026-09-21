const IsraelFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0.292969 3.24487 15.2304 9.51223"
      preserveAspectRatio="xMidYMid meet"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_8242_9742)">
        <path d="M15.5234 3.24487H0.292969V12.7571H15.5234V3.24487Z" fill="white" />
        <path d="M15.5234 4.05151H0.292969V5.3147H15.5234V4.05151Z" fill="#0234B9" />
        <path d="M15.5234 10.689H0.292969V11.9521H15.5234V10.689Z" fill="#0234B9" />
        <path
          d="M9.16257 7.99817L9.79189 6.91156H8.53777L7.90845 5.82495L7.27913 6.91156H6.02502L6.65434 7.99817L6.02502 9.08475H7.27913L7.90845 10.1714L8.53777 9.08475H9.79189L9.16257 7.99817ZM9.33009 7.17869L9.00864 7.73103L8.68718 7.17869H9.32556H9.33009ZM8.8547 7.99817L8.37932 8.81764H7.43307L6.95769 7.99817L7.43307 7.17869H8.37932L8.8547 7.99817ZM7.90845 6.35922L8.22991 6.91156H7.59153L7.91299 6.35922H7.90845ZM6.48682 7.17869H7.1252L6.80375 7.73103L6.4823 7.17869H6.48682ZM6.48682 8.82217L6.80828 8.26981L7.12973 8.82217H6.49136H6.48682ZM7.90845 9.64165L7.58701 9.08928H8.22538L7.90393 9.64165H7.90845ZM9.00864 8.26527L9.33009 8.81764H8.69171L9.01316 8.26527H9.00864Z"
          fill="#0234B9"
        />
      </g>
      <defs>
        <clipPath id="clip0_8242_9742">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.292969 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

IsraelFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default IsraelFlagIcon;
