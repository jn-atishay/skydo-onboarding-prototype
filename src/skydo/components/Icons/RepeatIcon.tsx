//Oct 2023

interface Props {
  className?: string;
  stroke?: string;
}

const RepeatIcon = (props: Props) => {
  const { stroke = "#0A2540" } = props;
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      className={props.className}
    >
      <path
        d="M11.3335 1.66797L14.0002 4.33464L11.3335 7.0013"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2 8.33203V6.9987C2 6.29145 2.28095 5.61318 2.78105 5.11308C3.28115 4.61298 3.95942 4.33203 4.66667 4.33203H14"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.66667 16.3333L2 13.6667L4.66667 11"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 9.66797V11.0013C14 11.7085 13.719 12.3868 13.219 12.8869C12.7189 13.387 12.0406 13.668 11.3333 13.668H2"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default RepeatIcon;
