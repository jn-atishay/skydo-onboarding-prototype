//Nov 2023

import classNames from "classnames";
import classnames from "classnames";
import PageTopContainer from "../PageTopContainer";
import React from "react";
import { useTour } from "@reactour/tour";
import { DASHBOARD_CONTAINER_STYLE_MAP } from "../../util/feRoutes";
import { useRouter } from "next/router";

interface Props {
  isCollapsed: boolean;
  isLoadingContainerData: boolean;
  isMounted: boolean;
  isSubNavInsideContainer: boolean;
  children: React.ReactElement;
}

const ContentBody = (props: Props) => {
  const {
    isCollapsed: isGlobalCollapsed,
    isSubNavInsideContainer,
    isLoadingContainerData,
    children,
    isMounted,
  } = props;
  const { isOpen } = useTour();
  const router = useRouter();
  const isCollapsed = isGlobalCollapsed && !isOpen;
  return (
    <div
      className={classNames("flex-1 flex flex-col bg-black-50 ml-[14.25rem] ease-linear duration-300", {
        "!ml-[4.5rem]": isCollapsed,
      })}
      style={{ width: isCollapsed ? `calc(100% - 4.5rem)` : `calc(100% - 14.25rem)` }}
    >
      {isMounted ? <PageTopContainer isLoading={isLoadingContainerData} /> : null}
      <div
        className={classnames(
          "min-w-[800px] max-w-[1600px] p-6 w-full bg-black-50 mx-auto h-full",
          {
            "!p-0 !max-w-none": isSubNavInsideContainer,
          },
          DASHBOARD_CONTAINER_STYLE_MAP[router.pathname]?.content
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default ContentBody;
