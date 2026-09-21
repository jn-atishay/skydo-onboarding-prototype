import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classnames from "classnames";

interface Props {
  title: string;
  titleClass?: string;
  containerClass?: string;
  rightCTAs?: () => void;
  renderSubtitle?: () => JSX.Element | null;
}

const PageHeader = (props: Props) => {
  const { title, titleClass, containerClass, rightCTAs, renderSubtitle } = props;
  //span elements doesn't take margin vertically
  return (
    // @ts-ignore
    <div className={classnames("flex mb-6 justify-between", containerClass)}>
      <div className={"flex flex-row items-center gap-6"}>
        <Typography
          text={title}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={titleClass ? titleClass : ""}
        />
        {renderSubtitle ? renderSubtitle() : null}
      </div>
      {rightCTAs ? (rightCTAs() as unknown as React.ReactNode) : null}
    </div>
  );
};

export default PageHeader;
