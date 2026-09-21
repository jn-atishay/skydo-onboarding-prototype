interface Props {
  width?: number;
  height?: number;
  fill?: string;
}

const EqualIcon = (props: Props) => {
  const { width = 20, height = 20, fill = "#CFD7DF" } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9.5" fill={fill} stroke={fill} />
      <path d="M6.11111 8.33334H13.8889" stroke="#0A2540" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.11111 11.1111H13.8889" stroke="#0A2540" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default EqualIcon;
