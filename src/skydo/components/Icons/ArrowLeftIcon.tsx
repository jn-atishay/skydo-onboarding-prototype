interface Props {
  stroke?: string;
  className?: string;
  onClick?: () => void;
}
const ArrowLeftIcon = ({ stroke = "#8898AA", className, onClick }: Props) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className} onClick={onClick}>
      <path d="M21 12L3 12" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M10.4997 19.5L3 12L10.4998 4.5"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default ArrowLeftIcon;
