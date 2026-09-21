import { BarChart } from "recharts";
import { useState } from "react";

interface Props {
  data: any[];
  layout?: "horizontal" | "vertical";
  children: (focusedBar: number | null) => JSX.Element | JSX.Element[];
  barCategoryGap?: string | number;
  margin?: { [key: string]: number };
}

const SkydoBarChart = (props: Props) => {
  const { children } = props;
  const [focusedBar, setFocusedBar] = useState<number | null>(null);

  const onBarChartHover = (state: any = {}) => {
    if (state.isTooltipActive) {
      setFocusedBar(state.activeTooltipIndex);
    } else {
      setFocusedBar(null);
    }
  };

  return (
    <BarChart onMouseMove={onBarChartHover} margin={{ top: 8, right: 0, left: 0, bottom: 0 }} {...props}>
      {children(focusedBar)}
    </BarChart>
  );
};

export default SkydoBarChart;
