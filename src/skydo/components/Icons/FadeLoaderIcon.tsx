import { CommonIconProps } from "./types";

const BLADES = [
  "M8 1.33203V3.9987",
  "M8 12V14.6667",
  "M3.28711 3.28711L5.17378 5.17378",
  "M10.8262 10.8281L12.7128 12.7148",
  "M1.33398 8H4.00065",
  "M12 8H14.6667",
  "M3.28711 12.7148L5.17378 10.8281",
  "M10.8262 5.17378L12.7128 3.28711",
];

const FadeLoaderIcon = ({ width = 12, height = 12, stroke, className }: CommonIconProps) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {BLADES.map((d, index) => (
        <path
          key={d}
          d={d}
          stroke={stroke}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={"animate-loaderFade"}
          style={{ animationDelay: `${index * -125}ms` }}
        />
      ))}
    </svg>
  );
};

export default FadeLoaderIcon;
