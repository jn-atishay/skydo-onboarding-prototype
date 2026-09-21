import React, { FC } from "react";
import { VkycIconProps } from "./WifiIcon";

const LightBulbIcon: FC<VkycIconProps> = (props) => {
  const { width = 68, height = 68, className = "" } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 68 69" fill="none" className={className}>
      <path
        d="M21.2086 29.0345C14.5209 37.9794 21.7103 53.2776 34.9184 52.7761C47.207 53.2776 54.8143 37.9794 48.1266 29.0345C44.4484 24.7711 43.0273 21.0928 42.6929 15.9934L41.6897 16.2442L35.6708 16.2442L34.7513 16.2442L33.6644 16.2442L26.308 16.2442C25.9736 21.3436 24.8868 24.7711 21.2086 29.0345Z"
        fill="#FFC043"
      />
      <path d="M62.8743 22.7725L54.5147 27.4539" stroke="#5671D2" strokeWidth="2.0122" strokeLinecap="round" />
      <path d="M66.4341 37.7275L57.0713 37.7275" stroke="#5671D2" strokeWidth="2.0122" strokeLinecap="round" />
      <path d="M62.5881 52.1904L54.2285 47.509" stroke="#5671D2" strokeWidth="2.0122" strokeLinecap="round" />
      <path d="M52.7454 62.2217L47.3952 54.5308" stroke="#5671D2" strokeWidth="2.0122" strokeLinecap="round" />
      <path d="M40.7803 67.3467L38.9412 57.6494" stroke="#5671D2" strokeWidth="2.01219" strokeLinecap="round" />
      <path
        d="M35.7183 30.3486C35.7026 30.3286 35.6869 30.3085 35.671 30.2882L35.671 16.1603M35.7183 30.3486C38.1568 33.4588 39.0947 34.0407 39.9344 32.8797C40.9611 31.1395 37.6095 30.5246 35.7183 30.3486ZM35.7183 30.3486C35.2478 30.3048 34.8677 30.2882 34.6678 30.2882C33.6647 30.2882 28.1191 30.7066 29.4013 32.8797C30.2464 34.0482 31.191 33.4513 33.6647 30.2882L33.6647 16.1603"
        stroke="#997328"
        strokeWidth="0.86237"
        strokeLinecap="round"
      />
      <path d="M5.47754 22.4961L13.8371 27.1775" stroke="#5671D2" strokeWidth="2.0122" strokeLinecap="round" />
      <path d="M1.91772 37.4512L11.2805 37.4512" stroke="#5671D2" strokeWidth="2.0122" strokeLinecap="round" />
      <path d="M5.76343 51.9141L14.123 47.2326" stroke="#5671D2" strokeWidth="2.0122" strokeLinecap="round" />
      <path d="M15.6064 61.9453L20.9566 54.2544" stroke="#5671D2" strokeWidth="2.0122" strokeLinecap="round" />
      <path d="M27.5718 67.0703L29.4109 57.3731" stroke="#5671D2" strokeWidth="2.0122" strokeLinecap="round" />
      <path
        d="M33.497 16.1602L26.1406 16.1602L35.5034 16.1602L41.5223 16.1602C43.1202 16.142 43.5286 13.4015 41.5223 13.4015L27.4782 13.4015C25.7226 13.4015 25.7226 10.6428 27.4782 10.6428L40.5191 10.6428C42.5254 10.6428 42.2746 8.05124 40.5191 8.05124L29.2337 8.05124C27.6453 8.05124 27.4782 5.12535 29.2337 5.12535L38.5964 5.12535C36.6737 3.6206 36.9004 1.07938 34.8105 1.07938C33.1627 1.07938 32.3862 1.61427 32.3862 2.75132"
        stroke="#283C8B"
        strokeWidth="1.43728"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default LightBulbIcon;
