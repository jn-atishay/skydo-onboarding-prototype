import { CommonIconProps } from "./types";

const FileCheckIcon = ({ width = 14, height = 15, stroke = "#5671D2", className }: CommonIconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} viewBox="0 0 12 13" fill="none" className={className}>
      <path
        d="M4.78333 11.7833H1.98333C1.21013 11.7833 0.583328 11.1565 0.583333 10.3833L0.583387 1.98333C0.583392 1.21013 1.21019 0.583333 1.98339 0.583333H8.28354C9.05674 0.583333 9.68354 1.21013 9.68354 1.98333V5.83333M6.88355 9.8L8.16689 11.0833L10.9669 8.28322M3.03355 3.38333H7.23355M3.03355 5.48333H7.23355M3.03355 7.58333H5.13355"
        stroke={stroke}
        strokeWidth="1.16667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FileCheckIcon;
