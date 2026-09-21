//May 2024

import { CSSProperties, ReactNode } from "react";
import classNames from "classnames";

interface Props {
  children: ReactNode | ReactNode[];
  className?: string;
  style?: CSSProperties;
}

const Card = (props: Props) => {
  return (
    <div className={classNames("bg-white rounded-10px px-6 py-8", props.className)} style={props.style}>
      {props.children}
    </div>
  );
};

export default Card;
