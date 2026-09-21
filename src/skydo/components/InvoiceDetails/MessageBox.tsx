import InfoIcon from "../AtomicComponents/ToastMessages/InfoIcon";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classnames from "classnames";

interface Props {
  head?: string;
  message: string | JSX.Element | JSX.Element[];
  className?: string;
}

const MessageBox = (props: Props) => {
  return (
    <div
      className={classnames(
        "flex flex-row p-4 bg-blue-50 border border-blue-400 rounded overflow-hidden mt-6",
        props.className
      )}
    >
      <div className={"shrink-0"}>
        <InfoIcon />
      </div>
      <div className={"ml-4 flex flex-col"}>
        {props.head ? (
          <Typography text={props.head} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} />
        ) : null}
        <Typography text={props.message} textClasses={props.head ? "mt-1.5" : ""} size={TYPOGRAPHY_SIZES.SMALL} />
      </div>
    </div>
  );
};

export default MessageBox;
