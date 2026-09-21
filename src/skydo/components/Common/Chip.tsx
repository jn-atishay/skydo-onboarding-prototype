import classnames from "classnames";

interface Props {
  containerClass?: string;
  children?: JSX.Element;
  bgColor?: string;
}
const Chip = (props: Props) => {
  const { containerClass, bgColor } = props;
  return (
    <div
      className={classnames("px-2 py-1 rounded-30px bg-black-100 h-fit", containerClass)}
      style={{ backgroundColor: bgColor }}
    >
      {props.children}
    </div>
  );
};

export default Chip;
