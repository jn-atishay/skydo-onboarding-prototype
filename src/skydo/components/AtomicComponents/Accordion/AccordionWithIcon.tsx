import { useEffect, useRef, useState } from "react";
import DropdownArrow from "../../Common/DropdownArrow";
import TagIcon from "../../Icons/TagIcon";
import Typography from "../Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import classNames from "classnames";

const AccordionWithIcon = ({
  title,
  children,
  onOpen,
  onClose,
  defaultOpen = false,
  openSignal,
}: {
  title: any;
  children: JSX.Element;
  onOpen?: () => void;
  onClose?: () => void;
  defaultOpen?: boolean;
  openSignal?: number;
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const lastSignal = useRef(openSignal);

  useEffect(() => {
    if (openSignal === undefined || openSignal === lastSignal.current) return;
    lastSignal.current = openSignal;
    setIsOpen((v) => {
      if (!v) onOpen?.();
      return true;
    });
  }, [openSignal, onOpen]);

  return (
    <div className={"bg-white rounded-10px border border-black-400"}>
      <div
        className={classNames("cursor-pointer p-6 flex flex-row items-center gap-6", {
          "border-b border-black-400": isOpen,
        })}
        onClick={() =>
          setIsOpen((v) => {
            if (v === false) {
              onOpen?.();
            } else {
              onClose?.();
            }
            return !v;
          })
        }
      >
        <TagIcon width={24} height={24} />
        <Typography
          text={title}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.LARGE}
          textClasses={"!font-bold flex-1"}
        />
        <DropdownArrow isOpen={isOpen} />
      </div>
      {isOpen && <div className={"p-6"}>{children}</div>}
    </div>
  );
};

export default AccordionWithIcon;
