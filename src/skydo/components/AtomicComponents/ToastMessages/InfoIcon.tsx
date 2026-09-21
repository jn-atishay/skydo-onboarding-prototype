const InfoIcon = ({
  stroke = "#276EF1",
  className = "",
  strokeWidth = 2,
  width = 20,
  height = 20,
}: {
  stroke?: string;
  className?: string;
  strokeWidth?: number;
  width?: number;
  height?: number;
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <g clipPath="url(#clip0_671_40575)">
        <path
          d="M9.99935 18.3333C14.6017 18.3333 18.3327 14.6023 18.3327 9.99996C18.3327 5.39759 14.6017 1.66663 9.99935 1.66663C5.39698 1.66663 1.66602 5.39759 1.66602 9.99996C1.66602 14.6023 5.39698 18.3333 9.99935 18.3333Z"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 13.3333V10"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 6.66663H10.0083"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_671_40575">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default InfoIcon;
