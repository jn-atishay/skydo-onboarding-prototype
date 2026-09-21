interface Props {
  stroke: string;
  width?: number;
  height?: number;
  containerClass?: string;
}

const GlobeIcon = (props: Props) => {
  const { stroke, width, height, containerClass } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 24 25" fill="none" className={containerClass}>
      <path
        d="M12 22.002C17.5228 22.002 22 17.5248 22 12.002C22 6.47911 17.5228 2.00195 12 2.00195C6.47715 2.00195 2 6.47911 2 12.002C2 17.5248 6.47715 22.002 12 22.002Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M2 12.002H22" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M12 2.00195C14.5013 4.74031 15.9228 8.29399 16 12.002C15.9228 15.7099 14.5013 19.2636 12 22.002C9.49872 19.2636 8.07725 15.7099 8 12.002C8.07725 8.29399 9.49872 4.74031 12 2.00195V2.00195Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

GlobeIcon.defaultProps = {
  stroke: "white",
  width: 24,
  height: 25,
};

export default GlobeIcon;
