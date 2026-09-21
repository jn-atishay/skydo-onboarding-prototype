import useToastMessages from "../../../store/toastMessages";
import { TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import InfoIcon from "./InfoIcon";
import ErrorIcon from "./ErrorIcon";
import SuccessIcon from "./SuccessIcon";
import classNames from "classnames";
import Typography from "../Typography";
import CrossIcon from "./CrossIcon";

interface Props {
  isFixedComponent?: boolean;
}

const Icon = ({ type }: { type: string }) => {
  return type === TOAST_TYPES.INFO ? <InfoIcon /> : type === TOAST_TYPES.ERROR ? <ErrorIcon /> : <SuccessIcon />;
};

const ToastMessages = ({ isFixedComponent }: Props) => {
  const { messages, removeToast } = useToastMessages((store) => ({
    messages: store.messages,
    addToast: store.addToast,
    removeToast: store.removeToast,
  }));
  const messageIds = Object.keys(messages);

  const onCrossClick = (id: string | number) => {
    removeToast(id);
  };

  return (
    <>
      {messageIds.map((id) => {
        const { type, header, body, customClass } = messages[id];
        return (
          <div
            key={id}
            className={classNames(
              "flex flex-row p-1 md:p-4 rounded mx-auto",
              {
                "bg-red-50 border border-red-400": type === TOAST_TYPES.ERROR,
                "bg-green-50 border border-green-300 ": type === TOAST_TYPES.SUCCESS,
                "bg-blue-50 border border-blue-400": type === TOAST_TYPES.INFO,
                "z-[100002] fixed bottom-10 left-1/2 -translate-x-1/2":
                  !isFixedComponent,
                "w-full items-center": !!isFixedComponent,
              },
              customClass
            )}
          >
            <Icon type={type} />
            <div className={"flex flex-col flex-1 px-1.5 md:px-2.5"}>
              <Typography
                text={header}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.LARGE}
                textClasses={"labelsmall md:labellarge"}
              />
              <Typography
                text={body}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.MEDIUM}
                textClasses={"paraxsmall md:paramedium"}
              />
            </div>
            <div className={"flex cursor-pointer"} onClick={() => onCrossClick(id)}>
              <CrossIcon />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default ToastMessages;
