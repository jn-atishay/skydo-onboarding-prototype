interface FileIconProps {
  width?: number;
  height?: number;
  stroke?: string;
  strokeWidth?: string;
  containerClass?: string;
}

const FileIcon = (props: FileIconProps) => {
  const { width, height, stroke = "#0A2540", strokeWidth = "1.5", containerClass } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" className={containerClass}>
      <path
        d="M9.33335 1.3335H4.00002C3.6464 1.3335 3.30726 1.47397 3.05721 1.72402C2.80716 1.97407 2.66669 2.31321 2.66669 2.66683V13.3335C2.66669 13.6871 2.80716 14.0263 3.05721 14.2763C3.30726 14.5264 3.6464 14.6668 4.00002 14.6668H12C12.3536 14.6668 12.6928 14.5264 12.9428 14.2763C13.1929 14.0263 13.3334 13.6871 13.3334 13.3335V5.3335L9.33335 1.3335Z"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.33331 1.3335V5.3335H13.3333"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6666 8.6665H5.33331"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.6666 11.3335H5.33331"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.66665 6H5.99998H5.33331"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

FileIcon.defaultProps = {
  width: 16,
  height: 16,
};
export default FileIcon;
