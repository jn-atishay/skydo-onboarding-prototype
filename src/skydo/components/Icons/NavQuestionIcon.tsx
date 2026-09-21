import { CommonIconProps } from "./types";

const NavQuestionIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M10 17.5C14.1421 17.5 17.5 14.1421 17.5 10C17.5 5.85786 14.1421 2.5 10 2.5C5.85786 2.5 2.5 5.85786 2.5 10C2.5 14.1421 5.85786 17.5 10 17.5Z"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.81738 7.74994C7.99371 7.24869 8.34175 6.82602 8.79985 6.55679C9.25795 6.28756 9.79655 6.18914 10.3203 6.27897C10.844 6.3688 11.319 6.64108 11.6612 7.04758C12.0034 7.45409 12.1907 7.96858 12.1899 8.49994C12.1899 9.99994 9.93988 10.7499 9.93988 10.7499"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 13.75H10.0075" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default NavQuestionIcon;
