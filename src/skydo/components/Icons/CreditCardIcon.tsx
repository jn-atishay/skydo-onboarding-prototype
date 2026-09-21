const CreditCardIcon = ({
  stroke,
  height = 24,
  width = 24,
  containerClass,
}: {
  stroke: string;
  height?: number;
  width?: number;
  containerClass?: string;
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={containerClass}>
      <path
        d="M21 4H3C1.89543 4 1 4.89543 1 6V18C1 19.1046 1.89543 20 3 20H21C22.1046 20 23 19.1046 23 18V6C23 4.89543 22.1046 4 21 4Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M1 10H23" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

CreditCardIcon.defaultProps = {
  stroke: "#0A2540",
};

export default CreditCardIcon;
