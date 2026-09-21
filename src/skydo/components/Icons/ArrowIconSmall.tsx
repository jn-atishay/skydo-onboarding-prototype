export enum ArrowDirection {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
  TOP = "TOP",
  BOTTOM = "BOTTOM",
}

export interface ArrowIconProps {
  stroke?: string;
  direction?: ArrowDirection;
  width?: number;
  height?: number;
}

export const getRotateClass = (direction: ArrowDirection) => {
  switch (direction) {
    case ArrowDirection.LEFT:
      return "";
    case ArrowDirection.RIGHT:
      return "rotate-180";
    case ArrowDirection.TOP:
      return "rotate-90";
    case ArrowDirection.BOTTOM:
      return "-rotate-90";
  }
};
/*
@description: glyphIcon for left right bottom top arrows
@name: LeftIcon RightIcon TopIcon BottomIcon
 */
export const ArrowIconSmallRotated = ({
  width = 16,
  height = 16,
  stroke = "#0A2540",
  direction = ArrowDirection.LEFT,
}: ArrowIconProps) => {
  return (
    <div className={getRotateClass(direction)}>
      <svg width={width} height={height} viewBox="0 0 16 16" fill="none">
        <path
          d="M6.66497 8L9.48766 10.8227C9.75699 11.092 9.75699 11.5287 9.48766 11.798C9.21833 12.0673 8.78167 12.0673 8.51234 11.798L5.202 8.48766C4.93267 8.21833 4.93267 7.78167 5.202 7.51234L8.51234 4.202C8.78167 3.93267 9.21833 3.93267 9.48766 4.202C9.75699 4.47132 9.75699 4.90799 9.48766 5.17732L6.66497 8Z"
          fill={stroke}
        />
      </svg>
    </div>
  );
};
