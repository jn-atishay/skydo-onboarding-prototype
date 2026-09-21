const SingaporeFlagIcon = ({is24X24, width, height}: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
      <svg width={width} height={height} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M1 20H39V34H1V20Z" fill="#F6F9FC"/>
        <path d="M1 6H39V20H1V6Z" fill="#ED2939"/>
        <path
            d="M9 18C11.7614 18 14 15.7614 14 13C14 10.2386 11.7614 8 9 8C6.23858 8 4 10.2386 4 13C4 15.7614 6.23858 18 9 18Z"
            fill="white"/>
        <path
            d="M11 18C13.7614 18 16 15.7614 16 13C16 10.2386 13.7614 8 11 8C8.23858 8 6 10.2386 6 13C6 15.7614 8.23858 18 11 18Z"
            fill="#ED2939"/>
        <path d="M15.2487 11.5678L12.8682 11.5678L14.794 12.9669L14.0584 10.703L13.3228 12.9669L15.2487 11.5678Z"
              fill="white"/>
        <path d="M12.5211 10.132L10.1407 10.132L12.0665 11.5312L11.3309 9.26722L10.5953 11.5311L12.5211 10.132Z"
              fill="white"/>
        <path d="M9.08006 16.0492L11.0059 14.6501L8.62544 14.6501L10.5513 16.0492L9.81566 13.7853L9.08006 16.0492Z"
              fill="white"/>
        <path d="M13.7939 16.0492L13.0583 13.7853L12.3227 16.0492L14.2486 14.65L11.8681 14.65L13.7939 16.0492Z"
              fill="white"/>
        <path d="M7.62659 11.5677L9.5524 12.9669L8.8168 10.703L8.08121 12.9669L10.007 11.5677L7.62659 11.5677Z"
              fill="white"/>
      </svg>


  );
};

SingaporeFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default SingaporeFlagIcon;
