import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { ArrowDirection, ArrowIconSmallRotated } from "../Icons/ArrowIconSmall";
import { useRouter } from "next/router";
import classnames from "classnames";
import useMobileVersionHook from "./useMobileVersionHook";

interface Props {
  text: string;
  textRoute: string;
  subText: string;
  subSubText?: string;
  subTextRoute?: string;
  onTextClick?: () => void;
}

const Breadcrumb = (props: Props) => {
  const { text, textRoute, subText, subSubText, subTextRoute, onTextClick } = props;
  const {isMobile} = useMobileVersionHook();
  const router = useRouter();
  return (
    <div className={"flex_row_item_center mb-6"}>
      <div className={"flex_row_item_center cursor-pointer"} onClick={() => {
        if (onTextClick) {
          onTextClick();
        } else {
          router.push(textRoute);
        }
      }}>
        <Typography text={text} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"md:mr-2 mr-1 !text-black-500 md:!text-black-700"} />
        <ArrowIconSmallRotated direction={ArrowDirection.RIGHT} stroke={isMobile ? "#8898AA" : undefined} />
      </div>
      <div
        className={classnames("flex_row_item_center", { "cursor-pointer": subSubText })}
        onClick={() => {
          if (subTextRoute) {
            void router.push(subTextRoute);
          }
        }}
      >
        <Typography
          text={subText}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={`${subSubText ? "" : "!text-black-500"} md:ml-2 ml-1`}
        />
        {subSubText ? <ArrowIconSmallRotated direction={ArrowDirection.RIGHT} /> : null}
      </div>
      {subSubText ? (
        <Typography
          text={subSubText}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-500 ml-2"}
        />
      ) : null}
    </div>
  );
};

export default Breadcrumb;
