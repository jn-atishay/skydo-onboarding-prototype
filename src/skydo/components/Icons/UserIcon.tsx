const UserIcon = ({
  stroke,
  isSmall = false,
  isWithBgXL = false,
  isWithBg = false,
  containerClass,
}: {
  stroke: string;
  isSmall?: boolean;
  isWithBgXL?: boolean;
  isWithBg?: boolean;
  containerClass?: string;
}) => {
  if (isWithBgXL) {
    return (
      <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="28.5" cy="28.5" r="28.5" fill="#CFD7DF" />
        <mask
          id="mask0_2290_25347"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="57"
          height="57"
        >
          <circle cx="28.5" cy="28.5" r="28.5" fill="#CFD7DF" />
        </mask>
        <g mask="url(#mask0_2290_25347)">
          <circle cx="28.4368" cy="22.593" r="10.6243" fill="#F6F9FC" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M21.4102 33.5469C14.2062 36.3777 9.10645 43.3951 9.10645 51.6036C9.10645 62.3143 17.7892 70.9971 28.4999 70.9971C39.2107 70.9971 47.8934 62.3143 47.8934 51.6036C47.8934 43.3951 42.7937 36.3777 35.5898 33.5469C33.7093 35.2329 31.2244 36.2584 28.5 36.2584C25.7755 36.2584 23.2906 35.2329 21.4102 33.5469Z"
            fill="#F0F3F7"
          />
        </g>
      </svg>
    );
  }
  if (isWithBg) {
    return (
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="16" cy="16" r="16" fill="#CFD7DF" />
        <mask
          id="mask0_2290_25319"
          style={{ maskType: "alpha" }}
          maskUnits="userSpaceOnUse"
          x="0"
          y="0"
          width="32"
          height="32"
        >
          <circle cx="16" cy="16" r="16" fill="#CFD7DF" />
        </mask>
        <g mask="url(#mask0_2290_25319)">
          <circle cx="15.9645" cy="12.6832" r="5.9645" fill="#F6F9FC" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.0192 18.836C7.9751 20.4253 5.1123 24.3648 5.1123 28.9729C5.1123 34.9859 9.98684 39.8605 15.9999 39.8605C22.0129 39.8605 26.8875 34.9859 26.8875 28.9729C26.8875 24.3647 24.0246 20.4252 19.9805 18.8359C18.9247 19.7827 17.5295 20.3586 15.9998 20.3586C14.4701 20.3586 13.0749 19.7827 12.0192 18.836Z"
            fill="#F0F3F7"
          />
        </g>
      </svg>
    );
  }
  return isSmall ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M13.3334 14V12.6667C13.3334 11.9594 13.0525 11.2811 12.5524 10.781C12.0523 10.281 11.374 10 10.6667 10H5.33341C4.62617 10 3.94789 10.281 3.4478 10.781C2.9477 11.2811 2.66675 11.9594 2.66675 12.6667V14"
        stroke="#0A2540"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.99992 7.33333C9.47268 7.33333 10.6666 6.13943 10.6666 4.66667C10.6666 3.19391 9.47268 2 7.99992 2C6.52716 2 5.33325 3.19391 5.33325 4.66667C5.33325 6.13943 6.52716 7.33333 7.99992 7.33333Z"
        stroke="#0A2540"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ) : (
    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" className={containerClass}>
      <path
        d="M20 21.002V19.002C20 17.9411 19.5786 16.9237 18.8284 16.1735C18.0783 15.4234 17.0609 15.002 16 15.002H8C6.93913 15.002 5.92172 15.4234 5.17157 16.1735C4.42143 16.9237 4 17.9411 4 19.002V21.002"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 11.002C14.2091 11.002 16 9.21109 16 7.00195C16 4.79281 14.2091 3.00195 12 3.00195C9.79086 3.00195 8 4.79281 8 7.00195C8 9.21109 9.79086 11.002 12 11.002Z"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

UserIcon.defaultProps = {
  stroke: "#0A2540",
};

export default UserIcon;
