// Jan 2026

interface Props {
  className?: string;
  width?: number;
  height?: number;
}

const InstantSettlementIcon = (props: Props) => {
  const { className, width = 53, height = 53 } = props;
  
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 53 53"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <circle
        cx={26.2908}
        cy={26.2908}
        r={26.2908}
        fill="url(#paint0_linear_9258_52949)"
      />
      <path
        d="M30.1066 11.2717L20.3253 11.1587L15.96 27.9046H24.2764L20.3253 44.1944L36.6225 21.2096H27.4437L30.1066 11.2717Z"
        fill="url(#paint1_linear_9258_52949)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_9258_52949"
          x1={26.2908}
          y1={55.6037}
          x2={26.2908}
          y2={-15.1784}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#2255CF" />
          <stop offset={0.521831} stopColor="#5489FB" />
          <stop offset={1} stopColor="#A0C0FA" />
        </linearGradient>
        <linearGradient
          id="paint1_linear_9258_52949"
          x1={26.2912}
          y1={11.1587}
          x2={26.2912}
          y2={44.1944}
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#DFEAFF" />
          <stop offset={1} stopColor="#4989FF" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default InstantSettlementIcon;
