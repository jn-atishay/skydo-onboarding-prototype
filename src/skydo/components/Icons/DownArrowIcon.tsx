const DownArrowIcon = ({
  stroke,
  width,
  height,
  strokeWidth,
  className,
  pathClassName,
  onClick,
}: {
  stroke?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: string;
  pathClassName?: string;
  onClick?: () => void;
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className} onClick={onClick}>
      <path
        className={pathClassName}
        d="M6 9L12 15L18 9"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

DownArrowIcon.defaultProps = {
  stroke: "#0A2540",
  width: 24,
  height: 24,
  strokeWidth: 2,
};

export default DownArrowIcon;
