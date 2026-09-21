import { CommonIconProps } from "./types";

const UsersIcon = ({ isSelected = false, width = 20, height = 20, className, stroke }: CommonIconProps) => {
  const resolvedStroke = stroke ?? (isSelected ? "#283C8B" : "#0A2540");
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M15.0909 11.6667C16.6975 11.6667 18 12.9601 18 14.5556V16H16.5455M12.9091 8.68678C14.1638 8.36604 15.0909 7.23499 15.0909 5.88888C15.0909 4.54278 14.1638 3.4117 12.9091 3.09101M10.7273 5.88889C10.7273 7.48438 9.4248 8.77778 7.81818 8.77778C6.21153 8.77778 4.90909 7.48438 4.90909 5.88889C4.90909 4.2934 6.21153 3 7.81818 3C9.4248 3 10.7273 4.2934 10.7273 5.88889ZM4.90909 11.6667H10.7273C12.3339 11.6667 13.6364 12.9601 13.6364 14.5556V16H2V14.5556C2 12.9601 3.30244 11.6667 4.90909 11.6667Z"
        stroke={resolvedStroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default UsersIcon;
