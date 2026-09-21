const WarningInfoIcon = ({
                           width,
                           height,
                           isSmall = false,
                           isLarge = false,
                           isXLarge = false,
                           containerClass,
                           onClick,
                           color,
                           fillColor,
                         }: {
  width?: number;
  height?: number;
  isSmall?: boolean;
  isLarge?: boolean;
  isXLarge?: boolean;
  containerClass?: string;
  onClick?: () => void;
  color?: string;
  fillColor?: string;
}) => {
  if (isSmall) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 20 20"
        fill="none"
        className={containerClass}
        onClick={onClick}
      >
        {/* Red circle */}
        <circle
          cx="10"
          cy="10"
          r="9"
          fill={fillColor ?? "#E11900"}
          stroke={fillColor ?? "#E11900"}
          strokeWidth="2"
        />
        {/* Vertical exclamation line */}
        <line
          x1="10"
          y1="6"
          x2="10"
          y2="12"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Dot at bottom */}
        <circle cx="10" cy="14" r="1" fill="white" />
      </svg>
    );
  }


  if (isLarge) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={containerClass} onClick={onClick}>
        <circle
          cx="16"
          cy="16"
          r="16"
          fill={fillColor ?? "none"}
          stroke={fillColor ? "none" : color ?? "#0A2540"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 10.6667V17.3334"
          stroke={fillColor ? "#FFFFFF" : color ?? "#0A2540"}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M16 21.3335H16.0133"
          stroke={fillColor ? "#FFFFFF" : color ?? "#0A2540"}
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (isXLarge) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="44"
        height="44"
        viewBox="0 0 44 44"
        fill="none"
        className={containerClass}
        onClick={onClick}
      >
        <circle
          cx="22"
          cy="22"
          r="19.5"
          fill="#FFC043"
          stroke="#FFC043"
          strokeWidth="3.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 12V26"
          stroke="white"
          strokeWidth="3.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M22 32H22.02"
          stroke="white"
          strokeWidth="3.66667"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  // Default / medium size
  return (
    <svg
      width={width ?? 16}
      height={height ?? 16}
      viewBox="0 0 16 16"
      fill="none"
      className={containerClass}
      onClick={onClick}
    >
      <circle
        cx="8"
        cy="8"
        r="7"
        fill={fillColor ?? "none"}
        stroke={fillColor ? "none" : color ?? "#8898AA"}
        strokeWidth="1.5"
      />
      <path
        d="M8 5V9"
        stroke={fillColor ? "#FFFFFF" : color ?? "#8898AA"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8 11H8.01"
        stroke={fillColor ? "#FFFFFF" : color ?? "#8898AA"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default WarningInfoIcon;
