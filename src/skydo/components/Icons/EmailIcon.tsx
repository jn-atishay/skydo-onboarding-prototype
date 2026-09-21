const EmailIcon = ({
  fill = "#EEF3FE",
  width = 32,
  height = 32,
  stroke = "#283C8B",
  className = "",
}: {
  fill?: string;
  width?: number;
  height?: number;
  stroke?: string;
  className?: string;
}) => {
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none" className={className}>
      <rect width="32" height="32" rx="16" fill={fill} className={"group-hover:fill-white"} />
      <path
        d="M10.6666 10.6665H21.3333C22.0666 10.6665 22.6666 11.2665 22.6666 11.9998V19.9998C22.6666 20.7332 22.0666 21.3332 21.3333 21.3332H10.6666C9.93325 21.3332 9.33325 20.7332 9.33325 19.9998V11.9998C9.33325 11.2665 9.93325 10.6665 10.6666 10.6665Z"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M22.6666 12L15.9999 16.6667L9.33325 12" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default EmailIcon;
