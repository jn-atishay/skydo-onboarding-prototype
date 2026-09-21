import React from "react";

interface UaeFlagIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const UaeFlagIcon: React.FC<UaeFlagIconProps> = ({ width = 40, height = 40, className = "" }) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 30"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* UAE Flag representation */}
      <rect width="40" height="30" rx="4" fill="white" />
      
      {/* Green stripe (top) */}
      <rect y="0" width="40" height="10" fill="#00732F" />
      
      {/* White stripe (middle) */}
      <rect y="10" width="40" height="10" fill="white" />
      
      {/* Black stripe (bottom) */}
      <rect y="20" width="40" height="10" fill="#000000" />
      
      {/* Red vertical stripe (left) */}
      <rect x="0" y="0" width="10" height="30" fill="#FF0000" />
    </svg>
  );
};

export default UaeFlagIcon;

