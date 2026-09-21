import { SubNavBarItemDto } from "../../types/DashboardContainer";
import { useRouter } from "next/router";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classnames from "classnames";
import { useEffect, useRef, useState } from "react";
import { SUB_NAV_BAR_REMOVAL_EVENT } from "../../constants/customeEvents";
import Link from "next/link";
import NavCountBadge from "./NavCountBadge";
import { NAV_ACTIVE_ATTRIBUTE } from "../../constants/navBarConstants";

interface Props extends SubNavBarItemDto {
  containerClass?: string;
  className?: string;
  titleSize?: string;
  titleType?: string;
  renderIcon?: (isSelected: boolean) => JSX.Element;
  appTourId?: string;
  itemClassName?: string;
  count?: number;
}

const SubNavBarItem = (props: Props) => {
  const {
    title,
    isSelectedFun,
    onClick,
    subTitle,
    id,
    isSuccessful,
    renderIcon = () => null,
    appTourId,
    itemClassName,
    href,
    count,
  } = props;
  const router = useRouter();
  const isSelected = isSelectedFun(router.asPath);
  const [isVisible, setIsVisible] = useState(false);
  const [isUnmounting, setUnmountAnimationFlag] = useState(false);
  const itemRef = useRef<HTMLDivElement | null>(null);
  //todo-handle for text and mapping overflow

  const onRemoveEvent = () => {
    setUnmountAnimationFlag(true);
  };

  useEffect(() => {
    setIsVisible(true);
    document.addEventListener(SUB_NAV_BAR_REMOVAL_EVENT.replace(":id", String(id)), onRemoveEvent);
    return () => {
      document.removeEventListener(SUB_NAV_BAR_REMOVAL_EVENT.replace(":id", String(id)), onRemoveEvent);
    };
  }, []);

  // The sidebar list scrolls, so the active item can sit outside the visible area.
  // Gated on isVisible so the entrance transform has settled and the offset is final.
  useEffect(() => {
    if (isSelected && isVisible) {
      itemRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isSelected, isVisible]);

  // The success/unmount state paints the row green, so its white text has to win over
  // the selected navy. Both are !important on colour, where the later-emitted utility
  // wins regardless of the order given here — so make the branches mutually exclusive
  // rather than relying on Tailwind's emission order.
  const isTerminalState = isUnmounting || isSuccessful;
  const rowTextClasses = classnames("truncate", {
    "!text-white !duration-1000": isTerminalState,
    "!text-navyblue-500": isSelected && !isTerminalState,
  });

  return (
    <div
      ref={itemRef}
      className={classnames(
        // scroll-mb-10 matches the bottom fade's height so scrollIntoView stops short of it
        "px-3 py-2 rounded-10px hover:bg-black-50 cursor-pointer translate-y-14 opacity-70 scroll-mb-10",
        {
          "bg-blue-50": isSelected,
          "!translate-y-0 !opacity-100": isVisible,
          "!-translate-x-80 !bg-green-400 !duration-700": isUnmounting,
          "!bg-green-400": isSuccessful,
        },
        props.containerClass,
        itemClassName
      )}
      onClick={onClick}
      data-tour={appTourId}
      {...{ [NAV_ACTIVE_ATTRIBUTE]: isSelected ? "true" : undefined }}
    >
      <Link href={href} passHref onClick={(e) => e.preventDefault()}>
        <a>
          <div
            className={classnames(
              "flex flex-col px-2 border-l-2",
              {
                "border-red-400": isSelected,
                "border-red-50": !isSelected,
                "border-green-300": isUnmounting || isSuccessful,
              },
              props.className
            )}
          >
            <div className={"flex_row_item_center"}>
              {renderIcon(isSelected)}
              <Typography
                text={title}
                size={props.titleSize || TYPOGRAPHY_SIZES.X_SMALL}
                type={props.titleType || TYPOGRAPHY_TYPES.PARA}
                textClasses={rowTextClasses}
              />
              {count ? (
                <NavCountBadge
                  count={count}
                  // -mr-2 cancels this row's inner px-2 so the badge lands on the same
                  // right edge as the top-level nav badges, which only clear the px-3.
                  className={"ml-auto -mr-2 h-5 w-5 bg-blue-100"}
                  textClasses={"!text-black-700"}
                />
              ) : null}
            </div>
            {subTitle ? (
              <Typography text={subTitle} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={rowTextClasses} />
            ) : null}
          </div>
        </a>
      </Link>
    </div>
  );
};

export default SubNavBarItem;
