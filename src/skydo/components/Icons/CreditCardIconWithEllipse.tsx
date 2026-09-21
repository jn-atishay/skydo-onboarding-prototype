const CreditCardIconWithEllipse = ({
  isSelected = false,
  bgStrokeColor = "#D4E2FC",
  width = "48",
  height = "48",
}: {
  isSelected?: boolean;
  bgStrokeColor?: string;
  width?: string;
  height?: string;
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill={isSelected ? "#0A2540" : bgStrokeColor} />
      <path
        d="M33 16H15C13.8954 16 13 16.8954 13 18V30C13 31.1046 13.8954 32 15 32H33C34.1046 32 35 31.1046 35 30V18C35 16.8954 34.1046 16 33 16Z"
        stroke={isSelected ? "white" : "#0A2540"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 22H35"
        stroke={isSelected ? "white" : "#0A2540"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CreditCardIconWithEllipse;
