interface Props {
  width?: number;
  height?: number;
  stroke?: string;
}
const TickWithOuterIcon = (props: Props) => {
  const { width = 125, height = 124, stroke = "#0A2540" } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 125 124" fill="none" xmlns="http://www.w3.org/2000/svg">
      <ellipse opacity="0.2" cx="62.0831" cy="62" rx="62.0831" ry="62" fill="#1FBB80" />
      <ellipse opacity="0.2" cx="62.084" cy="62" rx="47.7871" ry="47.7232" fill="#1FBB80" />
      <ellipse cx="62.2944" cy="62.2484" rx="34.2943" ry="34.2484" fill="#1FBB80" />
      <path
        d="M72.7032 54L58.0168 68.6667L51.3412 62"
        stroke="white"
        strokeWidth="3.21849"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TickWithOuterIcon;
