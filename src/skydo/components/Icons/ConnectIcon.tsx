interface Props {
  isVertical?: boolean;
}

const ConnectIcon = (props: Props) => {
  const { isVertical } = props;

  if (isVertical)
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_285_11720)">
          <path d="M7 18L12 23L17 18" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 6L12 1L17 6" stroke="#0A2540" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <line
            x1="12"
            y1="8"
            x2="12"
            y2="7"
            stroke="#0A2540"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="13"
            x2="12"
            y2="12"
            stroke="#0A2540"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="12"
            y1="18"
            x2="12"
            y2="17"
            stroke="#0A2540"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
        <defs>
          <clipPath id="clip0_285_11720">
            <rect width="24" height="24" fill="white" transform="translate(24) rotate(90)" />
          </clipPath>
        </defs>
      </svg>
    );

  return (
    <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_250_12187)">
        <path
          d="M18.384 17L23.384 12L18.384 7"
          stroke="#0A2540"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.38403 17L1.38403 12L6.38403 7"
          stroke="#0A2540"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="8.38403"
          y1="12"
          x2="7.38403"
          y2="12"
          stroke="#0A2540"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="13.384"
          y1="12"
          x2="12.384"
          y2="12"
          stroke="#0A2540"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line
          x1="18.384"
          y1="12"
          x2="17.384"
          y2="12"
          stroke="#0A2540"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_250_12187">
          <rect width="24" height="24" fill="white" transform="translate(0.384033)" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default ConnectIcon;
