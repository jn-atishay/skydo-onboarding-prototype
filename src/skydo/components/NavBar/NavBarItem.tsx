import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { useEffect, useRef, useState } from "react";
import { SubNavBarItemDto } from "../../types/DashboardContainer";
import SubNavBarItem from "./SubNavBarItem";
import ArrowGlyphIconContainer from "../Common/ArrowGlyphIconContainer";
import Link from "next/link";
import { NAV_ACTIVE_ATTRIBUTE } from "../../constants/navBarConstants";

interface Props {
  title: string;
  subtitle?: string;
  icon: (isSelected: boolean) => JSX.Element;
  isSelected: boolean;
  onClick?: () => void;
  subNavItems?: SubNavBarItemDto[];
  isSubNavOpen?: () => boolean;
  renderTitle?: (isSelected: boolean) => JSX.Element;
  SubNavComponent?: (props: any) => JSX.Element;
  renderSubNavFooter?: () => JSX.Element | null;
  isCollapsed: boolean;
  appTourId?: string;
  className?: string;
  href: string;
  // Render the expand arrow even when there are currently no sub-items (e.g. the
  // Unmapped Payments item with zero payments). The arrow stays closed and clicking
  // never expands it while empty; once sub-items exist it behaves normally.
  alwaysShowSubNavArrow?: boolean;
}

const NavBarItem = (props: Props) => {
  const {
    title,
    subtitle,
    icon,
    isSelected,
    onClick,
    subNavItems,
    isSubNavOpen,
    renderTitle,
    SubNavComponent,
    renderSubNavFooter,
    isCollapsed,
    appTourId,
    className,
    href,
    alwaysShowSubNavArrow,
  } = props;
  const navItemRef = useRef<HTMLDivElement | null>(null);

  const defaultSubNavValue = isSubNavOpen ? isSubNavOpen() : false;

  const [isSubNavOpenInside, setIsSubNavOpen] = useState(defaultSubNavValue);

  useEffect(() => {
    setIsSubNavOpen(defaultSubNavValue);
  }, [defaultSubNavValue]);

  const onKeydown = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      onNavClick();
    }
  };
  useEffect(() => {
    navItemRef.current?.addEventListener("keydown", onKeydown);
    return () => {
      navItemRef.current?.removeEventListener("keydown", onKeydown);
    };
  }, []);

  // While collapsed the sub-nav does not render, so a parent whose child would have been
  // the selected row takes over the active appearance, and has to carry the active marker
  // too or NavBar's reveal has nothing left to find.
  const isActiveRow = isSelected || (isCollapsed && isSubNavOpenInside);

  // The sidebar list scrolls, so the active row can sit outside the visible area. Keyed on
  // isActiveRow rather than isSelected: navigating straight into a nested route while the
  // rail is already collapsed makes this row active without any resize to piggyback on.
  useEffect(() => {
    if (isActiveRow) {
      navItemRef.current?.scrollIntoView({ block: "nearest" });
    }
  }, [isActiveRow]);

  const onNavClick = () => {
    // setIsSubNavOpen(!isSubNavOpenInside);
    onClick && onClick();
  };

  const hasSubNavItems = !!subNavItems && subNavItems.length > 0;
  const isSubNav = hasSubNavItems || !!SubNavComponent || !!alwaysShowSubNavArrow;
  // The arrow only points down / the list only opens when there is actually something
  // to expand — so an empty item shows the arrow but never rotates it.
  const isSubNavExpanded = isSubNavOpenInside && (hasSubNavItems || !!SubNavComponent);

  return (
    <div>
      <Link href={href} onClick={(e) => e.preventDefault()}>
        <a>
          <div
            ref={navItemRef}
            tabIndex={0}
            className={classNames(
              // scroll-mb-10 matches the bottom fade's height so scrollIntoView stops short of it
              "flex flex-row items-center cursor-pointer w-full hover:!bg-black-50 mb-0.5 px-3 py-2 rounded-10px relative z-1 scroll-mb-10",
              { "bg-blue-50": isActiveRow },
              { "pl-0": isSubNav },
              { "!items-start": !!subtitle },
              className
            )}
            onClick={onNavClick}
            data-tour={appTourId}
            {...{ [NAV_ACTIVE_ATTRIBUTE]: isActiveRow ? "true" : undefined }}
          >
            {isSubNav ? (
              <ArrowGlyphIconContainer isOpen={isSubNavExpanded} width={8} height={8} containerClass={"mr-1"} />
            ) : null}
            {icon(isActiveRow)}
            <div className={"truncate"}>
              {renderTitle ? (
                renderTitle(isSelected)
              ) : (
                <div className={"flex flex-col gap-2"}>
                  <Typography
                    text={title}
                    type={TYPOGRAPHY_TYPES.LABEL}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    textClasses={isSelected ? "!text-navyblue-500 ml-3" : "ml-3"}
                  />
                  {subtitle && !isCollapsed ? (
                    <Typography
                      text={subtitle}
                      type={TYPOGRAPHY_TYPES.PARA}
                      size={TYPOGRAPHY_SIZES.X_X_SMALL}
                      textClasses={"!text-black-500 ml-3"}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </a>
      </Link>
      {!isCollapsed && SubNavComponent && isSubNavOpenInside ? (
        <SubNavComponent isSubNavOpenInside={isSubNavOpenInside} />
      ) : null}
      {!isCollapsed && hasSubNavItems && isSubNavOpenInside ? (
        <div className={"space-y-0.5"}>
          {subNavItems.map((subNavItem, index) => (
            <SubNavBarItem key={`${subNavItem.id}${index}`} {...subNavItem} />
          ))}
        </div>
      ) : null}
      {!isCollapsed && isSubNavOpenInside && renderSubNavFooter ? renderSubNavFooter() : null}
    </div>
  );
};
export default NavBarItem;
