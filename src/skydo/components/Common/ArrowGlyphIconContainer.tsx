import classNames from "classnames";
import ArrowGlyphDownIcon from "../Icons/ArrowGlyphDownIcon";

interface Props {
  isOpen: boolean;
  containerClass?: string;
  width?: number;
  height?: number;
  stroke?: string;
}

const ArrowGlyphIconContainer = (props: Props) => {
  const { isOpen, containerClass, width, height, stroke } = props;
  return (
    <div
      className={classNames(
        "cursor-pointer ease-linear duration-150 h-fit",
        {
          "-rotate-90": !isOpen,
        },
        containerClass
      )}
    >
      <ArrowGlyphDownIcon {...{ width, height, stroke }} />
    </div>
  );
};

export default ArrowGlyphIconContainer;
