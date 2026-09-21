import { CommonIconProps } from "./types";

const NavAccountIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M16.4302 14H3.50011C2.94783 14 2.50011 14.4477 2.50011 15V16.5C2.50011 17.0523 2.94783 17.5 3.50011 17.5H10.5L16.4268 17.5196C16.9804 17.5215 17.4302 17.0732 17.4302 16.5196V15.5V15C17.4302 14.4477 16.9824 14 16.4302 14Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path
        d="M15.4567 7.68132H3.96327C3.41098 7.68132 2.96327 7.2336 2.96327 6.68132V6.15943C2.96327 5.75865 3.20254 5.39658 3.57124 5.23947L9.59039 2.6745C9.85106 2.56342 10.1466 2.56814 10.4036 2.68749L15.8779 5.22975C16.2309 5.39368 16.4567 5.74752 16.4567 6.13672V6.68132C16.4567 7.2336 16.009 7.68132 15.4567 7.68132Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path d="M5 8L5 14" stroke={stroke} strokeWidth="1.5" />
      <path d="M10 8L10 14" stroke={stroke} strokeWidth="1.5" />
      <path d="M15 8V14" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
};

export default NavAccountIcon;
