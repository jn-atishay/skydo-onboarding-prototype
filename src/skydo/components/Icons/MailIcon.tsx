interface Props {
  stroke?: string;
  width?: number;
  height?: number;
  className?: string;
  strokeWidth?: number;
}
const MailIcon = (props: Props) => {
  const { stroke = "#0A2540", width = 24, height = 24, strokeWidth = 1 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={props.className}>
      <path
        d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
      <path
        d="M22 6L12 13L2 6"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={strokeWidth}
      />
    </svg>
  );
};

export default MailIcon;
