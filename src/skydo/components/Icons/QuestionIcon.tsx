interface Props {
  height?: number;
  width?: number;
  stroke?: string;
}

const QuestionIcon = (props: Props) => {
  const { height = 17, width = 16, stroke = "#8898AA" } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_285_11753)">
        <path
          d="M8.89518 14.6673C12.5771 14.6673 15.5618 11.6825 15.5618 8.00065C15.5618 4.31875 12.5771 1.33398 8.89518 1.33398C5.21328 1.33398 2.22852 4.31875 2.22852 8.00065C2.22852 11.6825 5.21328 14.6673 8.89518 14.6673Z"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.95508 6.00038C7.11181 5.55482 7.42118 5.17912 7.82838 4.9398C8.23558 4.70049 8.71434 4.61301 9.17986 4.69285C9.64538 4.7727 10.0676 5.01473 10.3718 5.37606C10.676 5.7374 10.8424 6.19473 10.8417 6.66705C10.8417 8.00038 8.84174 8.66705 8.84174 8.66705"
          stroke={stroke}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M8.89502 11.334H8.90169" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <defs>
        <clipPath id="clip0_285_11753">
          <rect width="16" height="16" fill="white" transform="translate(0.89502)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default QuestionIcon;
