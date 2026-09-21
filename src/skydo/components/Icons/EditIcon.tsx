//Jul 2023

interface Props {
  onClick?: (event: any) => void;
  className?: string;
  stroke?: string;
  strokeWidth?: number;
  height?: number;
  width?: number;
}

const EditIcon = (props: Props) => {
  const { stroke = "#276EF1", strokeWidth = 2, height = 16, width = 16 } = props;
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onClick={props.onClick}
      className={props.className}
    >
      <g clipPath="url(#clip0_150_11109)">
        <path
          d="M11.3333 1.9976C11.5084 1.8225 11.7163 1.68361 11.9451 1.58885C12.1738 1.49409 12.419 1.44531 12.6666 1.44531C12.9143 1.44531 13.1595 1.49409 13.3882 1.58885C13.617 1.68361 13.8249 1.8225 14 1.9976C14.1751 2.17269 14.314 2.38056 14.4087 2.60934C14.5035 2.83811 14.5523 3.08331 14.5523 3.33093C14.5523 3.57855 14.5035 3.82375 14.4087 4.05253C14.314 4.2813 14.1751 4.48917 14 4.66426L4.99998 13.6643L1.33331 14.6643L2.33331 10.9976L11.3333 1.9976Z"
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_150_11109">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default EditIcon;
