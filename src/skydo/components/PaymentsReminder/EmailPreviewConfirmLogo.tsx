import React from "react";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Typography from "../AtomicComponents/Typography";
import classnames from "classnames";

interface Props {
  renderBody: (() => JSX.Element) | undefined;
  className?: string;
  avoidFixedHeight?: boolean;
  heading: string;
}

const EmailPreviewConfirmLogo: React.FC<Props> = (props) => {
  return (
    <div className={classnames({}, props.className)}>
      <div className={"flex flex-col bg-blue-50 justify-center items-center py-3 rounded-t-10px"}>
        <Typography text={props.heading} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} />
      </div>
      <div className={"flex flex-col bg-black-50 items-center rounded-b-10px"}>
        {props.renderBody && props.renderBody()}
      </div>
    </div>
  );
};

export default EmailPreviewConfirmLogo;
