interface Props {
  stroke?: string;
  fill?: string;
  circleStroke?: string;
  width?: number;
  height?: number;
  className?: string;
}

const ExcalmationIcon = (props: Props) => {
  const { width = 17, height = 16, className } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 17 16"
      fill={props.fill ? props.fill : "none"}
      className={className}
    >
      <circle
        cx="8.5"
        cy="8"
        r="6"
        stroke={props.circleStroke || props.stroke || "#FFC043"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 5.33398V8.66732"
        stroke={props.stroke ? props.stroke : "#FFC043"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 10.668H8.50667"
        stroke={props.stroke ? props.stroke : "#FFC043"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ExcalmationIcon;
