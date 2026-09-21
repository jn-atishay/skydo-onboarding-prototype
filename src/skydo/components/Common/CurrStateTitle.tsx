import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classNames from "classnames";

const CurrStateTitle = ({
  containerClass = "",
  title,
  subTitle,
  icon,
  subTitleClass,
}: {
  containerClass?: string;
  title: string | JSX.Element;
  subTitle: string | JSX.Element;
  icon?: () => any;
  subTitleClass?: string;
}) => {
  return (
    <div className={`mb-6 ${containerClass}`}>
      <Typography
        text={title}
        type={TYPOGRAPHY_TYPES.HEADING}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses={classNames("mb-0.5 block hide_for_mob")}
      />
      <div className={"flex-row items-center hide_for_desktop_flex space-x-4 mb-4"}>
        <div className={"bg-black-700 p-2 rounded-10px"}>{icon ? icon() : null}</div>
        <Typography text={title} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />
      </div>
      <Typography
        text={subTitle}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.MEDIUM}
        textClasses={classNames("block", subTitleClass || "!text-black-500")}
      />
    </div>
  );
};

export default CurrStateTitle;
