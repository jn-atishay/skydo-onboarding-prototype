import React, { FC } from "react";
import { CommonIconProps } from "./types";

const BankIcon: FC<CommonIconProps> = ({ height = 23, width = 20, className, stroke = "#0A2540" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 20 23"
      fill="none"
      className={className}
    >
      <path
        d="M17.6667 17.5547H1.77197C1.21969 17.5547 0.771973 18.0024 0.771973 18.5547V21.0284C0.771973 21.5807 1.21969 22.0284 1.77197 22.0284H17.6667C18.219 22.0284 18.6667 21.5807 18.6667 21.0284V18.5547C18.6667 18.0024 18.219 17.5547 17.6667 17.5547Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path
        d="M17.6667 8.34402H1.77197C1.21969 8.34402 0.771973 7.8963 0.771973 7.34402V6.09741C0.771973 5.70311 1.00368 5.34562 1.36361 5.1846L9.25519 1.65416C9.51348 1.53861 9.80864 1.53789 10.0675 1.65219L18.0707 5.18607C18.433 5.34606 18.6667 5.7048 18.6667 6.10086V7.34402C18.6667 7.8963 18.219 8.34402 17.6667 8.34402Z"
        stroke={stroke}
        strokeWidth="1.5"
      />
      <path d="M3.1416 8.60547V17.816" stroke={stroke} strokeWidth="1.5" />
      <path d="M9.71924 8.60547V17.816" stroke={stroke} strokeWidth="1.5" />
      <path d="M16.562 8.60547V17.816" stroke={stroke} strokeWidth="1.5" />
    </svg>
  );
};

export default BankIcon;
