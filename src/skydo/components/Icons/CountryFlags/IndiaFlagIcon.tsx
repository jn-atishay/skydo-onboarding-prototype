interface Props {
  width?: number;
  height?: number;
}
const IndiaFlagIcon = (props: Props) => {
  const { width, height } = props;
  return (
    <svg width={width} height={height} viewBox="1.83333 5.33334 29.3333 21.3333" preserveAspectRatio="xMidYMid meet" fill="none">
      <rect x="1.83333" y="5.33334" width="29.3333" height="21.3333" fill="white" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.83333 12.4445H31.1667V5.33334H1.83333V12.4445Z"
        fill="#FFA44A"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.83333 26.6667H31.1667V19.5556H1.83333V26.6667Z"
        fill="#1A9F0B"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.4999 18.1334C17.657 18.1334 18.5951 17.1782 18.5951 16C18.5951 14.8218 17.657 13.8667 16.4999 13.8667C15.3427 13.8667 14.4046 14.8218 14.4046 16C14.4046 17.1782 15.3427 18.1334 16.4999 18.1334Z"
        fill="#181A93"
        fillOpacity="0.15"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M19.2937 16C19.2937 17.5709 18.0429 18.8444 16.5 18.8444C14.9571 18.8444 13.7064 17.5709 13.7064 16C13.7064 14.429 14.9571 13.1555 16.5 13.1555C18.0429 13.1555 19.2937 14.429 19.2937 16ZM18.5953 16C18.5953 17.1782 17.6572 18.1333 16.5 18.1333C15.3429 18.1333 14.4048 17.1782 14.4048 16C14.4048 14.8218 15.3429 13.8667 16.5 13.8667C17.6572 13.8667 18.5953 14.8218 18.5953 16Z"
        fill="#181A93"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.4998 16.7111C16.8856 16.7111 17.1982 16.3927 17.1982 16C17.1982 15.6073 16.8856 15.2889 16.4998 15.2889C16.1141 15.2889 15.8014 15.6073 15.8014 16C15.8014 16.3927 16.1141 16.7111 16.4998 16.7111Z"
        fill="#181A93"
      />
    </svg>
  );
};

IndiaFlagIcon.defaultProps = {
  width: 33,
  height: 32,
};

export default IndiaFlagIcon;
