import classnames from "classnames";
import { CSSProperties } from "react";

interface Props {
  containerClass?: string;
  style?: CSSProperties;
}

const LoadingChip = (props: Props) => {
  const { containerClass } = props;
  return <div className={classnames("min-h-3 bg-black-50 rounded-30px", containerClass)} style={props.style}></div>;
};

export default LoadingChip;
