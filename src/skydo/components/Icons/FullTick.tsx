/*
@params bgColor: background color of the circle and border
@params tickColor: color of the tick
@params fill: fill color of the circle excluding the border
 */
const FullTick = ({
  bgColor,
  tickColor,
  isSmall,
  className = "shrink-0",
  isLarge,
  fill,
  circleStroke,
  circleStrokeWidth,
  tickStrokeWidth,
  is30X30,
  width,
  height,
  strokeWidth,
}: {
  tickStrokeWidth?: string;
  circleStrokeWidth?: string;
  circleStroke?: string;
  fill?: string;
  bgColor: string;
  tickColor: string;
  isLarge?: boolean;
  isSmall?: boolean;
  className?: string;
  is30X30?: boolean;
  width?: number;
  height?: number;
  strokeWidth?: number;
}) => {
  if (isSmall) {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={className}>
        <circle
          cx="8"
          cy="8"
          r="6"
          fill={fill || bgColor}
          stroke={circleStroke || bgColor}
          strokeWidth={circleStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11.1514 6L7.15143 10L5.33325 8.18182"
          stroke={tickColor}
          strokeWidth={tickStrokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (isLarge) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
        <circle
          cx="16"
          cy="16"
          r="12"
          fill="#1AA06B"
          stroke="#1AA06B"
          strokeWidth="4.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22.3029 12L14.3029 20L10.6665 16.3636"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (is30X30) {
    return (
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none" className={className}>
        <circle cx="15" cy="15" r="15" fill={fill || "#F0F9F4"} />
        <path
          d="M22.879 10L12.879 20L8.3335 15.4545"
          stroke="#1AA06B"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className}>
      <circle
        cx="12"
        cy="12"
        r="9"
        fill={fill || bgColor}
        stroke={bgColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.7273 9L10.7273 15L8 12.2727"
        stroke={tickColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

FullTick.defaultProps = {
  bgColor: "#1AA06B",
  tickColor: "white",
  circleStrokeWidth: "2",
  width: 24,
  height: 24,
  strokeWidth: 2,
};

export default FullTick;
