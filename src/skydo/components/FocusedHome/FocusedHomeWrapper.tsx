import classNames from "classnames";
import { useEffect, useRef } from "react";

interface Props {
  children?: React.ReactElement | string | number | null;
  isSelected?: boolean;
  disableScroll?: boolean;
  disableShadow?: boolean;
}

const FocusedHomeWrapper = (props: Props) => {
  const { children, isSelected, disableScroll = false, disableShadow = false } = props;
  const refForScroll = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSelected && refForScroll.current && !disableScroll) {
      refForScroll.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isSelected]);

  return (
    <div
      className={classNames("flex flex-row bg-white rounded-10px p-6", {
        "shadow-headerShadow": isSelected && !disableShadow
      })}
      ref={refForScroll}
    >
      {children}
    </div>
  );
};

export default FocusedHomeWrapper;
