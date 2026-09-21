const CheckIcon = ({ className, stroke = "#1FBB80" }: { className?: string; stroke?: string }) => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M20 6L9 17L4 12" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export default CheckIcon;
