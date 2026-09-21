type Props = {
  stroke?: string;
  className?: string;
  width?: number;
  height?: number;
};
const AddIcon = (props: Props) => {
  const { stroke = "#8898AA", className, width = 16, height = 16 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" className={className}>
      <path d="M8 3.33203V12.6654" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.33301 8H12.6663" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default AddIcon;
