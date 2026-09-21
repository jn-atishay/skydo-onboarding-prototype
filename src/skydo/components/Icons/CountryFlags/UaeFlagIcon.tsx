const UaeFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  if (is24X24) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <g clipPath="url(#clip0_1397_11615)">
          <path d="M23.4004 9.39966V14.5996H6.13379V9.39966H23.4004Z" fill="#F7F7F7" />
          <path d="M23.4004 14.5988V19.7988H6.13379V14.5988H23.4004Z" fill="black" />
          <path d="M23.4004 4.19841V9.39844H6.13379V4.19841H23.4004Z" fill="#006F2E" />
          <path d="M6.13355 4.19883V19.7988H1.2002V4.19883H6.13355Z" fill="#F70000" />
        </g>
        <defs>
          <clipPath id="clip0_1397_11615">
            <rect width="22.2" height="15.6" fill="white" transform="translate(1.2002 4.19922)" />
          </clipPath>
        </defs>
      </svg>
    );
  }
  return (
    <svg width={width} height={height} viewBox="0 0 32 32" fill="none">
      <g clipPath="url(#clip0_1399_82512)">
        <path d="M31.1999 12.5335V19.4668H8.17773V12.5335H31.1999Z" fill="#F7F7F7" />
        <path d="M31.1999 19.467V26.4004H8.17773V19.467H31.1999Z" fill="black" />
        <path d="M31.1999 5.59983V12.5332H8.17773V5.59983H31.1999Z" fill="#006F2E" />
        <path d="M8.17791 5.60039V26.4004H1.6001V5.60039H8.17791Z" fill="#F70000" />
      </g>
      <defs>
        <clipPath id="clip0_1399_82512">
          <rect width="29.6" height="20.8" fill="white" transform="translate(1.6001 5.59961)" />
        </clipPath>
      </defs>
    </svg>
  );
};

UaeFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default UaeFlagIcon;
