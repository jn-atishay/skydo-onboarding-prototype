import { CommonIconProps } from "./types";

interface CrossIconFXProps extends CommonIconProps {
  fill?: string;
}

const CrossIconFX = ({ fill = "#CFD7DF", stroke = "#0A2540", width = 20, height = 20 }: CrossIconFXProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9.5" fill={fill} stroke={fill} />
      <path d="M13.3334 6.66669L6.66669 13.3334" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.66669 6.66669L13.3334 13.3334" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default CrossIconFX;
