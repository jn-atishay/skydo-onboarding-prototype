import classnames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";

interface Props {
  icon: React.ReactNode;
  text: string;
  textClasses?: string;
  containerClass?: string;
}

const IconTextChip = (props: Props) => {
  const { icon, text, textClasses, containerClass } = props;

  return (
    <div className={classnames("flex items-center gap-1 px-2 py-1 w-fit", containerClass)}>
      {icon}
      <Typography
        text={text}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={classnames("!text-para2xsmall", textClasses)}
      />
    </div>
  );
};

export default IconTextChip;