import { CommonIconProps } from "./types";

const EbrcIcon = ({ isSelected = false, width = 20, height = 20, className }: CommonIconProps) => {
  const stroke = isSelected ? "#283C8B" : "#0A2540";
  return (
    <svg width={width} height={height} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M15 7.82353V2.76826C15 2.44465 14.6357 2.25499 14.3706 2.44057L13.2834 3.2016C13.2537 3.2224 13.2151 3.22548 13.1824 3.20964L11.8255 2.55125C11.7972 2.53751 11.764 2.53791 11.736 2.55235L10.4548 3.21311C10.4276 3.22712 10.3955 3.22794 10.3677 3.21532L8.89415 2.54776C8.86837 2.53608 8.83885 2.53587 8.81291 2.54719L7.27991 3.21583C7.25175 3.22812 7.2195 3.22677 7.19245 3.21218L5.97725 2.55661C5.94602 2.53976 5.90819 2.54073 5.87786 2.55916L4.82049 3.20141C4.78659 3.222 4.74373 3.22061 4.71123 3.19786L3.62938 2.44057C3.36427 2.25499 3 2.44465 3 2.76826V16.2917C3 16.6829 3.31713 17 3.70833 17H9.5"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M5.79199 8.16663H10.042" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M12.167 8.16663L12.8753 8.16663" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path d="M5.79199 10.2916H9.33366" stroke={stroke} strokeWidth="1.2" strokeLinecap="round" />
      <path
        d="M14.5279 15.0557C15.924 15.0557 17.0557 13.924 17.0557 12.5279C17.0557 11.1318 15.924 10 14.5279 10C13.1318 10 12 11.1318 12 12.5279C12 13.924 13.1318 15.0557 14.5279 15.0557Z"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13.1596 14.655L12.7227 17.9448L14.5283 16.8615L16.3339 17.9448L15.8969 14.6514"
        stroke={stroke}
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default EbrcIcon;
