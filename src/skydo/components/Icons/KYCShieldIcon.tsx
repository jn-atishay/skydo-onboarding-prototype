import { CommonIconProps } from "./types";

const KYCShieldIcon = ({ width = 48, height = 48, className }: CommonIconProps) => {
  return <svg width={width} height={height} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M12.9655 4.24377H34.6801C35.147 5.59965 35.9344 7.26224 37.066 8.66109C38.2565 10.1328 39.9479 11.4427 42.1262 11.5963C42.5988 15.9749 42.2967 22.3951 39.9646 28.5671C37.4794 35.1443 32.7085 41.4056 24.1003 44.6979C17.1837 42.823 4.01918 33.8458 5.33566 11.5193C6.65727 11.3799 8.23864 10.9409 9.63488 9.98659C11.3175 8.83652 12.6548 6.98511 12.9655 4.24377Z" fill="#5671D2" stroke="#283C8B" strokeWidth="2.48753"/>
    <path d="M29.9499 19.8438L22.7329 27.0511L19.4524 23.775" stroke="white" strokeWidth="2.9363" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>

};

export default KYCShieldIcon;
