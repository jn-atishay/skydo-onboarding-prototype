const CompletedIcon = ({ containerClass }: { containerClass?: string }) => {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className={containerClass}>
      <rect width="32" height="32" fill="white" />
      <rect x="6" y="4" width="12" height="18" fill="#1AA06B" />
      <path d="M18 4H32L27 13L32 22H18V4Z" fill="#1AA06B" />
      <rect x="3" y="2" width="3" height="28" fill="#CFD7DF" />
      <path
        d="M20.5665 10.5555L15.511 15.6111L13.213 13.3131"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default CompletedIcon;
