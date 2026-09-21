import { CommonIconProps } from "./types";

const VerticalLineIcon = (props: CommonIconProps) => {
  const { width = 2, height = 22, className = "", stroke = "#A0BFF8" } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 2 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path d="M1 1L0.999999 21" stroke={stroke} strokeLinecap="round" />
    </svg>
  );
};

export default VerticalLineIcon;
