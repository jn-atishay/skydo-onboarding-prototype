type Props = {
  containerClass?: string;
  stroke?: string;
  width?: number;
  height?: number;
  strokeWidth?: number;
};
const LongRightArrow = ({ containerClass, stroke = "#8898AA", width = 24, height = 24, strokeWidth = 2 }: Props) => {
  return (
    <svg width={width} height={height} viewBox="0 0 25 24" fill="none" className={containerClass}>
      <path d="M4.5 12H20.5" stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M13.8333 5.33398L20.4997 12.0007L13.8331 18.6673"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LongRightArrow;
