interface Props {
  width?: number;
  height?: number;
}

const FullTickIconWithCircles = (props: Props) => {
  const { width = 134, height = 134 } = props;

  return (
    <svg width={width} height={height} viewBox="0 0 134 134" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle opacity="0.2" cx="67" cy="67" r="67" fill="#1AA06B" />
      <circle opacity="0.2" cx="67" cy="67" r="50" fill="#1AA06B" />
      <circle
        cx="67"
        cy="67"
        r="30"
        fill="#1AA06B"
        stroke="#1AA06B"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M82.7574 57L62.7574 77L53.6665 67.9091"
        stroke="white"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default FullTickIconWithCircles;
