interface Props {
  graph1Fill?: string;
  graph2Fill?: string;
  graph3Fill?: string;
  graph4Fill?: string;
  lineStroke?: string;
  width?: number;
  height?: number;
}

const GraphEmptyState = (props: Props) => {
  const { graph1Fill, graph2Fill, graph3Fill, graph4Fill, lineStroke, width, height } = props;
  return (
    <svg width={width} height={height} viewBox="0 0 64 64" fill="none">
      <rect x="7.72974" y="41.6711" width="9.78359" height="18.062" rx="2.13333" fill={graph1Fill} />
      <rect x="20.5237" y="33.769" width="9.78359" height="25.9642" rx="2.13333" fill={graph2Fill} />
      <rect x="33.3176" y="21.3513" width="9.78359" height="38.3818" rx="2.13333" fill={graph3Fill} />
      <rect x="46.1116" y="33.769" width="9.78359" height="25.9642" rx="2.13333" fill={graph4Fill} />
      <path
        d="M7.82288 28.0152L15.8931 34.1334L36.8066 10.4401C37.6434 9.49201 39.1586 9.62295 39.8204 10.7006L49.465 26.4051L56.8895 19.6429"
        stroke={lineStroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M50.4889 17.7778L57.345 18.7573C57.6953 18.8073 57.9556 19.1074 57.9556 19.4612V26.3112"
        stroke={lineStroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};

GraphEmptyState.defaultProps = {
  graph1Fill: "#334DB3",
  graph2Fill: "#5671D2",
  graph3Fill: "#A0BFF8",
  graph4Fill: "#A0BFF8",
  lineStroke: "#334DB3",
  width: 64,
  height: 64,
};

export default GraphEmptyState;
