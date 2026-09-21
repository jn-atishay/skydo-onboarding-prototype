//Jul 2023

import classnames from "classnames";
import classNames from "classnames";
import UserStateIcon from "./UserStateIcon";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React from "react";
import JSHelpers from "../AtomicComponents/JSHelpers";

interface Props {
  renderHeader?: string | (() => JSX.Element);
  renderBody?: () => JSX.Element;
  renderSubtitle?: string | (() => JSX.Element);
  index: number;
  isLast?: boolean;
  isOpen?: boolean;
  renderIcon?: () => JSX.Element;
  renderStateIcon?: () => JSX.Element;
}

const StepWiseDetails = (props: Props) => {
  const { renderHeader, renderSubtitle, renderBody, index, isLast, renderIcon, renderStateIcon } = props;

  return (
    <div className={classnames("pl-4 flex flex-row")}>
      {JSHelpers.isFunction(renderIcon) ? <div className={"shrink-0 mb-12"}>{renderIcon()}</div> : null}
      <div
        className={classNames("relative flex flex-col ml-6.5", {
          "border-l border-black-600 pb-12": !isLast,
        })}
      >
        {JSHelpers.isFunction(renderStateIcon) ? (
          renderStateIcon()
        ) : (
          <UserStateIcon
            isCurrentState={true}
            isStateDone={true}
            containerClass={"!bg-black-600 !p-0 !top-0 h-4 w-4 !rounded-none"}
          >
            {undefined}
          </UserStateIcon>
        )}

        <div className={"flex flex-col ml-7"}>
          <Typography
            text={Locale.stepCount.replace(":step", String(index + 1))}
            type={TYPOGRAPHY_TYPES.LABEL}
            textClasses={"!text-black-500"}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
          {renderHeader ? (
            <div className={"mt-2 mb-2"}>
              {typeof renderHeader === "string" ? (
                <Typography
                  text={renderHeader}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight={"700"}
                />
              ) : (
                renderHeader()
              )}
            </div>
          ) : null}
          {renderSubtitle ? (
            <div className={"mb-2"}>
              {typeof renderSubtitle === "string" ? (
                <Typography
                  text={renderSubtitle}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-500"}
                />
              ) : (
                renderSubtitle()
              )}
            </div>
          ) : null}
          {renderBody ? <div className={"mt-2 mb-2"}>{renderBody()}</div> : null}
        </div>
      </div>
    </div>
  );
};

export default StepWiseDetails;
