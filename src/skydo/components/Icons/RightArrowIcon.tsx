const RightArrowIcon = ({
  stroke,
  width,
  height,
  className = "",
  onClick,
}: {
  stroke?: string;
  width?: number;
  height?: number;
  onClick?: () => void;
  className?: string;
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className} onClick={onClick}>
      <path d="M4.16666 10H15.8333" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10 4.1665L15.8333 9.99984L10 15.8332"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

RightArrowIcon.defaultProps = {
  stroke: "white",
  width: 20,
  height: 20,
};

export default RightArrowIcon;
