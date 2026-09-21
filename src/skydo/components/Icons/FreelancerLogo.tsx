import React, { FC } from "react";

interface FreelancerLogoProps {
  isSelected?: boolean;
  height?: number;
  width?: number;
}

const FreelancerLogo: FC<FreelancerLogoProps> = (props) => {
  const { isSelected = false, height = 32, width = 32 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M13.7588 9.75744L0.432617 9.01624L9.11751 18.3298L13.7588 9.75744ZM7.09181 8.764L13.2388 9.20251L5.62105 6.22217L7.09181 8.764ZM14.7871 9.20251L18.0624 6.22217L20.2705 9.38878L14.7871 9.20251ZM14.4185 9.79237L9.59484 18.6985L13.9761 23.5182L18.9045 18.9197L20.2666 10.0873L14.4185 9.79237ZM9.85484 20.0955L7.53421 29.7777L13.5686 24.0344L9.85484 20.0955ZM18.7609 6.36963L21.1165 9.38878L32.0483 6.36963H18.7609Z"
        fill={isSelected ? "white" : "#29B2FE"}
      />
    </svg>
  );
};

export default FreelancerLogo;
