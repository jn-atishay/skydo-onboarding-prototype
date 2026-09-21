import React, { FC } from "react";

interface MessageIconProps {}

const MessageIcon: FC<MessageIconProps> = (props) => {
  return (
    <svg
      width="54"
      height="54"
      viewBox="0 0 54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={"shrink-0"}
    >
      <path
        d="M6.75 33.75C6.75 34.9435 7.22411 36.0881 8.06802 36.932C8.91193 37.7759 10.0565 38.25 11.25 38.25H38.25L47.25 47.25V11.25C47.25 10.0565 46.7759 8.91193 45.932 8.06802C45.0881 7.22411 43.9435 6.75 42.75 6.75H11.25C10.0565 6.75 8.91193 7.22411 8.06802 8.06802C7.22411 8.91193 6.75 10.0565 6.75 11.25V33.75Z"
        fill="#283C8B"
        stroke="#283C8B"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="15.75" cy="22.5" r="2.8125" fill="white" />
      <circle cx="27" cy="22.5" r="2.8125" fill="white" />
      <circle cx="38.25" cy="22.5" r="2.8125" fill="white" />
    </svg>
  );
};

export default MessageIcon;
