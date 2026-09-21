const TurkeyFlagIcon = ({ is24X24, width, height }: { is24X24?: boolean; width?: number; height?: number }) => {
  return (
    <svg width={width} height={height} viewBox="0.238281 3.26953 15.230519 9.46277" preserveAspectRatio="xMidYMid meet" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_8242_9601)">
        <mask
          id="mask0_8242_9601"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="3"
          width="16"
          height="10"
        >
          <path d="M15.4688 3.26953H0.238281V12.7323H15.4688V3.26953Z" fill="white" />
        </mask>
        <g mask="url(#mask0_8242_9601)">
          <path d="M15.4688 3.26953H0.238281V12.7323H15.4688V3.26953Z" fill="#D00027" />
          <mask
            id="mask1_8242_9601"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="3"
            width="16"
            height="10"
          >
            <path d="M15.4688 3.26855H0.238281V12.7313H15.4688V3.26855Z" fill="white" />
          </mask>
          <g mask="url(#mask1_8242_9601)">
            <path
              d="M4.96974 5.63428C6.2765 5.63428 7.33542 6.6932 7.33542 7.99996C7.33542 9.30671 6.2765 10.3656 4.96974 10.3656C3.66299 10.3656 2.60406 9.30671 2.60406 7.99996C2.60406 6.6932 3.66299 5.63428 4.96974 5.63428Z"
              fill="white"
            />
            <path
              d="M5.56046 6.10742C6.60586 6.10742 7.45301 6.95457 7.45301 7.99997C7.45301 9.04538 6.60586 9.89252 5.56046 9.89252C4.51505 9.89252 3.66791 9.04538 3.66791 7.99997C3.66791 6.95457 4.51505 6.10742 5.56046 6.10742Z"
              fill="#D00027"
            />
            <path d="M6.96558 7.99929L8.09209 8.36428L8.27234 7.80103L6.96558 7.99929Z" fill="white" />
            <path d="M6.96558 8L8.09209 7.63501L8.27234 8.19827L6.96558 8Z" fill="white" />
            <path d="M7.78595 6.8728V8.0579H8.37624L7.78595 6.8728Z" fill="white" />
            <path d="M7.78595 6.8728L8.47987 7.8326L8.00223 8.17957L7.78595 6.8728Z" fill="white" />
            <path d="M7.78595 9.1261L8.47987 8.16631L8.00223 7.81934L7.78595 9.1261Z" fill="white" />
            <path d="M7.78595 9.1265V7.94141H8.37624L7.78595 9.1265Z" fill="white" />
            <path d="M9.10589 7.30615L7.98389 7.67114L8.16411 8.2344L9.10589 7.30615Z" fill="white" />
            <path d="M9.10649 7.30615L8.41257 8.26143L7.93042 7.91446L9.10649 7.30615Z" fill="white" />
            <path d="M9.10649 8.69856L8.41257 7.73877L7.93042 8.08574L9.10649 8.69856Z" fill="white" />
            <path d="M9.10589 8.69789L7.98389 8.32839L8.16411 7.76514L9.10589 8.69789Z" fill="white" />
          </g>
        </g>
      </g>
      <defs>
        <clipPath id="clip0_8242_9601">
          <rect width="15.2304" height="15.2304" fill="white" transform="translate(0.238281 0.385742)" />
        </clipPath>
      </defs>
    </svg>
  );
};

TurkeyFlagIcon.defaultProps = {
  width: 32,
  height: 32,
};

export default TurkeyFlagIcon;
