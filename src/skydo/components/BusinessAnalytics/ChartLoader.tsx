import classnames from "classnames";

interface Props {
  containerClass?: string;
}

const ChartLoader = (props: Props) => {
  return (
    <div className={classnames("relative w-full bg-white rounded-lg overflow-hidden rounded-lg", props.containerClass)}>
      <div className="animate-pulse flex flex-row justify-between gap-2">
        <div className="rounded flex-1 h-60 bg-black-200"></div>
      </div>
    </div>
  );
};

export default ChartLoader;
