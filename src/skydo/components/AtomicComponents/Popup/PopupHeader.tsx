import classNames from "classnames";
import classnames from "classnames";
import Typography from "../Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import CrossIcon from "../ToastMessages/CrossIcon";
import React, { ReactElement, useContext } from "react";
import AppContext from "../../../context/AppContext";

interface Props {
  title?: string | ReactElement;
  subtitle?: string;
  closeIconClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
  headerClass?: string;
  className?: string;
  disableCrossIcon?: boolean;
}

export const getPopupTitle = (title: string) => {
  return <Typography text={title} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.X_SMALL} />;
};

const PopupHeader = (props: Props) => {
  const { title, subtitle, closeIconClick, headerClass, disableCrossIcon } = props;
  const { theme } = useContext(AppContext);

  return (
    <div className={classnames("flex flex-col mb-6 gap-x-4", props.className)}>
      <div>
        <div className={classNames("flex flex-row justify-between", headerClass)}>
          {typeof title === "string" ? getPopupTitle(title) : title}
          {disableCrossIcon ? null : (
            <div
              className={"cursor-pointer"}
              onClick={(e: React.MouseEvent<HTMLInputElement>) => (closeIconClick ? closeIconClick(e) : () => {})}
            >
              <CrossIcon stroke={theme.hexColors.black[500]} />
            </div>
          )}
        </div>
      </div>
      <div className={"mt-1"}>
        {subtitle ? (
          <Typography
            text={subtitle}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontColor={theme.hexColors.black[500]}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PopupHeader;
