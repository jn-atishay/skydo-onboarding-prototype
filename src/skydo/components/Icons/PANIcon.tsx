import React, { FC } from "react";
import { VkycIconProps } from "./WifiIcon";

const PANIcon: FC<VkycIconProps> = (props) => {
  const { width = 84, height = 60, className = "" } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 84 60" fill="none" className={className}>
      <g filter="url(#filter0_d_222_8705)">
        <rect x="8.50073" y="6.21484" width="67.3144" height="43.5222" rx="4.74081" fill="#5671D2" />
      </g>
      <rect opacity="0.4" x="14.2534" y="12.1123" width="34.0222" height="3.62903" rx="1.81452" fill="#283C8B" />
      <path
        opacity="0.4"
        d="M14.9964 43.866C15.0658 43.629 15.508 43.3446 15.669 43.163C16.1077 42.6681 16.5614 42.1677 16.9427 41.6251C17.5394 40.7759 17.849 39.8864 18.2808 38.9521C18.5739 38.3178 18.8507 37.6608 18.8604 36.9456C18.8621 36.8232 18.9088 36.1692 18.6672 36.1547C18.3469 36.1354 18.2833 36.8579 18.2808 37.0628C18.2622 38.6045 18.8046 40.0995 19.2325 41.5592C19.3555 41.9787 19.7908 43.3822 19.0464 43.4669C18.1559 43.5681 17.1687 42.9363 16.4168 42.5405C15.7966 42.2141 15.0326 41.7883 14.5492 41.2626C13.9916 40.6563 14.254 39.9189 15.0715 39.8492C15.9389 39.7752 16.8409 40.0465 17.7012 40.1422C18.6877 40.2519 19.6848 40.3754 20.6743 40.4387C22.4944 40.5552 24.3621 40.6201 26.1841 40.5376C27.5055 40.4778 28.8121 40.5706 30.1304 40.5706"
        stroke="#283C8B"
        strokeWidth="1.36089"
        strokeLinecap="round"
      />
      <rect opacity="0.4" x="14.2534" y="23.4531" width="20.4133" height="3.62903" rx="1.81452" fill="#283C8B" />
      <rect opacity="0.4" x="14.2534" y="29.3496" width="23.5887" height="3.62903" rx="1.81452" fill="#283C8B" />
      <rect x="50.9973" y="23.9062" width="19.0524" height="19.0524" rx="2.26815" fill="#A0BFF8" />
      <path
        d="M53.2654 42.9597C53.2654 39.2017 56.3118 36.1553 60.0698 36.1553H60.9771C64.7351 36.1553 67.7815 39.2017 67.7815 42.9597V42.9597H53.2654V42.9597Z"
        fill="#334DB3"
      />
      <rect x="58.397" y="34.0654" width="4.39883" height="5.31525" fill="#8898AA" />
      <rect x="57.1143" y="26.5508" width="6.78153" height="8.61437" rx="3.39076" fill="#CFD7DF" />
      <rect x="56.7483" y="25.2686" width="7.69795" height="5.13196" rx="2.56598" fill="#0A2540" />
      <rect x="56.7483" y="27.2852" width="1.09971" height="3.66569" rx="0.549853" fill="#0A2540" />
      <rect x="63.3464" y="27.2852" width="1.09971" height="3.66569" rx="0.549853" fill="#0A2540" />
      <path d="M60.5964 39.3814L58.397 36.8154V39.748H62.7958V36.8154L60.5964 39.3814Z" fill="#334DB3" />
      <rect x="60.0698" y="12.1123" width="9.97984" height="9.97984" rx="2.26815" fill="#FFC043" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M67.4233 14.9048C67.4233 15.2901 67.1767 15.6394 66.7767 15.8943C67.1767 16.1493 67.4233 16.4986 67.4233 16.8839C67.4233 17.3863 67.004 17.8274 66.3722 18.0781L67.282 20.4176H63.1826L64.0746 18.1238C63.3745 17.8835 62.8999 17.4183 62.8999 16.8839C62.8999 16.4986 63.1465 16.1493 63.5465 15.8943C63.1465 15.6394 62.8999 15.2901 62.8999 14.9048C62.8999 14.1241 63.9125 13.4912 65.1616 13.4912C66.4107 13.4912 67.4233 14.1241 67.4233 14.9048Z"
        fill="#997328"
        fillOpacity="0.3"
      />
      <defs>
        <filter
          id="filter0_d_222_8705"
          x="0.91543"
          y="0.525867"
          width="82.4851"
          height="58.6931"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1.89633" />
          <feGaussianBlur stdDeviation="3.79265" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_222_8705" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_222_8705" result="shape" />
        </filter>
      </defs>
    </svg>
  );
};

export default PANIcon;
