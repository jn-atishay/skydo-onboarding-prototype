interface Props {
  width?: number;
  height?: number;
  stroke?: string;
}
const ArrowGlyphDownIcon = (props: Props) => {
  const { width = 24, height = 24, stroke = "#0A2540" } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <path
        d="M5.12283 9.97619L10.8615 16.6713C11.4006 17.3003 12.3476 17.3731 12.9766 16.834C13.0349 16.784 13.0893 16.7296 13.1393 16.6713L18.8779 9.97619C19.4171 9.3472 19.3442 8.40025 18.7152 7.86112C18.4434 7.62809 18.0971 7.5 17.7391 7.5L6.26172 7.5C5.43329 7.5 4.76172 8.17157 4.76172 9C4.76172 9.35807 4.88981 9.70432 5.12283 9.97619Z"
        fill={stroke}
      />
    </svg>
  );
};

export default ArrowGlyphDownIcon;
