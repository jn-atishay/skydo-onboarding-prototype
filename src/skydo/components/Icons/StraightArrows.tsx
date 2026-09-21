import { ArrowDirection, ArrowIconProps, getRotateClass } from "./ArrowIconSmall";

export const StraightArrows = ({
  width = 16,
  height = 16,
  stroke = "#25282B",
  direction = ArrowDirection.LEFT,
}: ArrowIconProps) => {
  return (
    <div className={getRotateClass(direction)}>
      <svg width={width} height={height} viewBox="0 0 16 16" fill="none">
        <path d="M14 8L2 8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path
          d="M6.9998 13L2 8L6.9999 3"
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
};
