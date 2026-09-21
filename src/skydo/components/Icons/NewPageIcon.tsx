interface Props {
  onClick?: () => void;
  containerClass?: string;
  height?: number;
  width?: number;
}

const NewPageIcon = (props: Props) => {
  const { onClick, containerClass, height = 16, width = 16 } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" className={containerClass} onClick={onClick}>
      <g clipPath="url(#clip0_818_17027)">
        <path
          d="M7.33317 1.33203H3.99984C3.64622 1.33203 3.30708 1.47251 3.05703 1.72256C2.80698 1.9726 2.6665 2.31174 2.6665 2.66536V13.332C2.6665 13.6857 2.80698 14.0248 3.05703 14.2748C3.30708 14.5249 3.64622 14.6654 3.99984 14.6654H11.9998C12.3535 14.6654 12.6926 14.5249 12.9426 14.2748C13.1927 14.0248 13.3332 13.6857 13.3332 13.332V7.33203"
          stroke="#276EF1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10 5.33464L14.6667 0.667969"
          stroke="#276EF1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.6665 4.66797V0.667969H10.6665"
          stroke="#276EF1"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_818_17027">
          <rect width="16" height="16" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default NewPageIcon;
