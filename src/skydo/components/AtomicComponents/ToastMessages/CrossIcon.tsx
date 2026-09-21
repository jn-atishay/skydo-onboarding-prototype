const CrossIcon = ({
  width,
  height,
  stroke,
  isSmall,
  is24X24,
  onClick,
  className,
  fill,
}: {
  stroke?: string;
  isSmall?: boolean;
  is24X24?: boolean;
  width?: number;
  height?: number;
  onClick?: () => void;
  className?: string;
  fill?: string;
}) => {
  if (isSmall)
    return (
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8.47485 3.52539L3.52511 8.47514"
          stroke="#25282B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M3.5249 3.52539L8.47465 8.47514"
          stroke="#25282B"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  if (is24X24)
    return (
      <svg width="24" height="25" viewBox="0 0 24 25" fill="none" onClick={onClick}>
        <path
          d="M16.9497 8.04883L7.05021 17.9483"
          stroke="#E11900"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.0498 8.04834L16.9493 17.9478"
          stroke="#E11900"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );

  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill={"none"} onClick={onClick} className={className}>
      <rect width={width} height={height} rx="12" fill={fill || "none"} />
      <path d="M15 5L5 15" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 5L15 15" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

CrossIcon.defaultProps = {
  stroke: "#8898AA",
  width: 20,
  height: 20,
};

export default CrossIcon;
