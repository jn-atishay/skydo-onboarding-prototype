import React, { FC } from "react";

interface BankIconWIthEllipseProps {
  isSelected?: boolean;
  bgStrokeColor?: string;
  width?: string;
  height?: string;
}

const BankIconWIthEllipse: FC<BankIconWIthEllipseProps> = ({ isSelected = false, bgStrokeColor = "#D4E2FC", width = "48", height = "48" }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="24" cy="24" r="24" fill={isSelected ? "#0A2540" : bgStrokeColor} />
      <path
        d="M32 29.5542H16.1052C15.5529 29.5542 15.1052 30.0019 15.1052 30.5542V33.0279C15.1052 33.5802 15.5529 34.0279 16.1052 34.0279H32C32.5523 34.0279 33 33.5802 33 33.0279V30.5542C33 30.0019 32.5523 29.5542 32 29.5542Z"
        stroke={isSelected ? "white" : "#0A2540"}
        strokeWidth="1.5"
      />
      <path
        d="M32 20.3435H16.1052C15.5529 20.3435 15.1052 19.8958 15.1052 19.3435V18.0969C15.1052 17.7026 15.3369 17.3451 15.6969 17.1841L23.5884 13.6537C23.8467 13.5381 24.1419 13.5374 24.4007 13.6517L32.4039 17.1856C32.7662 17.3456 33 17.7043 33 18.1004V19.3435C33 19.8958 32.5523 20.3435 32 20.3435Z"
        stroke={isSelected ? "white" : "#0A2540"}
        strokeWidth="1.5"
      />
      <path d="M17.475 20.6069V29.8175" stroke={isSelected ? "white" : "#0A2540"} strokeWidth="1.5" />
      <path d="M24.0526 20.6069V29.8175" stroke={isSelected ? "white" : "#0A2540"} strokeWidth="1.5" />
      <path d="M30.8953 20.6069V29.8175" stroke={isSelected ? "white" : "#0A2540"} strokeWidth="1.5" />
    </svg>
  );
};

export default BankIconWIthEllipse;
