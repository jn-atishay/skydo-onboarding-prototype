import classnames from "classnames";

const Dot = ({ containerClass }: { containerClass?: string }) => {
  return <div className={classnames("w-2 h-2 rounded-full bg-green-400", containerClass)} />;
};

export default Dot;
