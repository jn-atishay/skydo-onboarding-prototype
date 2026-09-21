import { CommonIconProps } from "./types";

const XCircleIcon = (props: CommonIconProps) => {
  const { className = "", stroke = "#8898AA", height = 20, width = 20 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={className}>
      <circle cx="12" cy="12" r="9" stroke={stroke} strokeWidth="2" />
      <path
        d="M15 9L9 15M9 9L15 15"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default XCircleIcon;
