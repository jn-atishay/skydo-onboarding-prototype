interface Props {
  width?: number;
  height?: number;
  stroke?: string;
}

const RefreshIcon = ({ width = 16, height = 16, stroke = "#425466" }: Props) => {
  return (
    <svg width={width} height={height} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0.666504 2.66699V6.66699H4.6665"
        stroke={stroke}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M2.33984 9.99964C2.7721 11.2266 3.59139 12.2798 4.67427 13.0006C5.75716 13.7214 7.04496 14.0707 8.34365 13.996C9.64234 13.9212 10.8816 13.4264 11.8746 12.5861C12.8676 11.7459 13.5607 10.6056 13.8493 9.33722C14.138 8.06881 14.0066 6.74094 13.4749 5.55371C12.9433 4.36647 12.0402 3.38417 10.9017 2.75482C9.76327 2.12546 8.45111 1.88315 7.16296 2.06438C5.87481 2.24562 4.68045 2.84059 3.75984 3.75964L0.666504 6.66631"
        stroke={stroke}
        strokeWidth="1.33333"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
export default RefreshIcon;
