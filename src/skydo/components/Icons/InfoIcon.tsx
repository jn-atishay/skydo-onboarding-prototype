const InfoIcon = ({
  width,
  height,
  isLarge = false,
  containerClass,
  onClick,
}: {
  width?: number;
  height?: number;
  isLarge?: boolean;
  containerClass?: string;
  onClick?: () => void;
}) => {
  if (isLarge) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle cx="16" cy="16" r="12" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 10.6667V17.3334" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M16 21.3335H16.0133" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  if(width && height) {
    return (
      <svg width={width} height={height} viewBox="0 0 16 16" fill="none" className={containerClass} onClick={onClick}>
        <g clipPath="url(#clip0_665_39789)">
          <path
            d="M8.00065 14.6666C11.6825 14.6666 14.6673 11.6819 14.6673 7.99998C14.6673 4.31808 11.6825 1.33331 8.00065 1.33331C4.31875 1.33331 1.33398 4.31808 1.33398 7.99998C1.33398 11.6819 4.31875 14.6666 8.00065 14.6666Z"
            stroke="#8898AA"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M6.06055 6.00001C6.21728 5.55446 6.52665 5.17875 6.93385 4.93944C7.34105 4.70012 7.81981 4.61264 8.28533 4.69249C8.75085 4.77234 9.17309 5.01436 9.47726 5.3757C9.78144 5.73703 9.94792 6.19436 9.94721 6.66668C9.94721 8.00001 7.94721 8.66668 7.94721 8.66668"
            stroke="#8898AA"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M8 11.3333H8.00667" stroke="#8898AA" strokeLinecap="round" strokeLinejoin="round" />
        </g>
        <defs>
          <clipPath id="clip0_665_39789">
            <rect width="16" height="16" fill="white" />
          </clipPath>
        </defs>
      </svg>
    );
  }

  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={containerClass} onClick={onClick}>
      <g clipPath="url(#clip0_665_39789)">
        <path
          d="M8.00065 14.6666C11.6825 14.6666 14.6673 11.6819 14.6673 7.99998C14.6673 4.31808 11.6825 1.33331 8.00065 1.33331C4.31875 1.33331 1.33398 4.31808 1.33398 7.99998C1.33398 11.6819 4.31875 14.6666 8.00065 14.6666Z"
          stroke="#8898AA"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.06055 6.00001C6.21728 5.55446 6.52665 5.17875 6.93385 4.93944C7.34105 4.70012 7.81981 4.61264 8.28533 4.69249C8.75085 4.77234 9.17309 5.01436 9.47726 5.3757C9.78144 5.73703 9.94792 6.19436 9.94721 6.66668C9.94721 8.00001 7.94721 8.66668 7.94721 8.66668"
          stroke="#8898AA"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8 11.3333H8.00667" stroke="#8898AA" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_665_39789">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default InfoIcon;
