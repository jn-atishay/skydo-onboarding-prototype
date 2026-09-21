interface Props {
  width?: number;
  height?: number;
}

const MobileNavCloseIcon = (props: Props) => {

  const width = props.width || 24;
  const height = props.height || 24;

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.9497 7.05078L7.05021 16.9503" stroke="#25282B" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M7.0498 7.05078L16.9493 16.9503" stroke="#25282B" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

export default MobileNavCloseIcon;