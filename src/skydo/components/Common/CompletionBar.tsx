//Jun 2023

import classnames from "classnames";
import { useEffect, useState } from "react";

interface Props {
  className?: string;
  successBarClass?: string;
  successBarWidthPercent: number;
}

const CompletionBar = (props: Props) => {
  const { className, successBarClass, successBarWidthPercent } = props;
  const [completion, setCompletion] = useState(0);
  useEffect(() => {
    setCompletion(successBarWidthPercent);
  }, [successBarWidthPercent]);
  return (
    <div className={classnames("w-full h-2 rounded-10px bg-blue-50 overflow-hidden", className)}>
      <div
        className={classnames("h-full bg-green-400 rounded-10px ease-linear duration-500", successBarClass)}
        style={{ width: `${completion}%` }}
      ></div>
    </div>
  );
};

export default CompletionBar;
