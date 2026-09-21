const AccountIcon = ({
  width,
  height,
  isSelected,
  containerClass,
  defaultStroke,
}: {
  isSelected?: boolean;
  containerClass?: string;
  width?: number;
  height?: number;
  defaultStroke?: string;
}) => {
  if (isSelected)
    return (
      <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={containerClass}>
        <path
          d="M19.1052 16.9746H5C4.44772 16.9746 4 17.4223 4 17.9746V20.0009C4 20.5532 4.44771 21.0009 5 21.0009H19.1052C19.6575 21.0009 20.1052 20.5532 20.1052 20.0009V17.9746C20.1052 17.4223 19.6575 16.9746 19.1052 16.9746Z"
          fill="#283C8B"
          stroke="#283C8B"
          strokeWidth="1.5"
        />
        <path
          d="M19.1052 8.6842H5C4.44772 8.6842 4 8.23648 4 7.6842V6.72708C4 6.33278 4.23171 5.97528 4.59163 5.81426L11.5943 2.6815C11.8526 2.56595 12.1477 2.56523 12.4066 2.67953L19.5092 5.81574C19.8715 5.97572 20.1052 6.33447 20.1052 6.73053V7.6842C20.1052 8.23648 19.6575 8.6842 19.1052 8.6842Z"
          fill="#283C8B"
          stroke="#283C8B"
          strokeWidth="1.5"
        />
        <path d="M6.13232 8.92188V17.2113" stroke="#283C8B" strokeWidth="1.5" />
        <path d="M12.0527 8.92188V17.2113" stroke="#283C8B" strokeWidth="1.5" />
        <path d="M18.2114 8.92188V17.2113" stroke="#283C8B" strokeWidth="1.5" />
      </svg>
    );

  return (
    <svg width={width} height={height} viewBox="0 0 24 24" fill="none" className={containerClass}>
      <path
        d="M19.1052 16.9746H5C4.44772 16.9746 4 17.4223 4 17.9746V20.0009C4 20.5532 4.44771 21.0009 5 21.0009H19.1052C19.6575 21.0009 20.1052 20.5532 20.1052 20.0009V17.9746C20.1052 17.4223 19.6575 16.9746 19.1052 16.9746Z"
        stroke={defaultStroke}
        strokeWidth="1.5"
      />
      <path
        d="M19.1052 8.6842H5C4.44772 8.6842 4 8.23648 4 7.6842V6.72708C4 6.33278 4.23171 5.97528 4.59163 5.81426L11.5943 2.6815C11.8526 2.56595 12.1477 2.56523 12.4066 2.67953L19.5092 5.81574C19.8715 5.97572 20.1052 6.33447 20.1052 6.73053V7.6842C20.1052 8.23648 19.6575 8.6842 19.1052 8.6842Z"
        stroke={defaultStroke}
        strokeWidth="1.5"
      />
      <path d="M6.13232 8.92188V17.2113" stroke={defaultStroke} strokeWidth="1.5" />
      <path d="M12.0527 8.92188V17.2113" stroke={defaultStroke} strokeWidth="1.5" />
      <path d="M18.2114 8.92188V17.2113" stroke={defaultStroke} strokeWidth="1.5" />
    </svg>
  );
};

AccountIcon.defaultProps = {
  width: 24,
  height: 24,
  defaultStroke: "#0A2540",
};

export default AccountIcon;
