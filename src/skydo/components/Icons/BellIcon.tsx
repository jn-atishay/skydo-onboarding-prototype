interface Props {
  width?: number;
  height?: number;
  strokeColor?: string;
  strokeWidth?: number;
}

const BellIcon = ({ width = 16, height = 16, strokeColor = "#0A2540", strokeWidth = 1.5 }) => {
  return (
    <svg width={width} height={height} viewBox="0 0 17 16" fill="none">
      <path
        d="M12.3 5.33325C12.3 4.27239 11.8786 3.25497 11.1285 2.50482C10.3783 1.75468 9.36091 1.33325 8.30005 1.33325C7.23918 1.33325 6.22177 1.75468 5.47162 2.50482C4.72148 3.25497 4.30005 4.27239 4.30005 5.33325C4.30005 9.99992 2.30005 11.3333 2.30005 11.3333H14.3C14.3 11.3333 12.3 9.99992 12.3 5.33325Z"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.45315 14C9.33594 14.2021 9.16771 14.3698 8.9653 14.4864C8.76289 14.6029 8.5334 14.6643 8.29982 14.6643C8.06623 14.6643 7.83674 14.6029 7.63433 14.4864C7.43192 14.3698 7.26369 14.2021 7.14648 14"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BellIcon;
