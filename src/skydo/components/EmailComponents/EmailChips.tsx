/**
 * @author Raj Sheth
 * created: 19/10/23
 */

import React, { FC } from "react";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";

interface Props {
  email: string;
  customIdx: number;
  removeEmail: (index: number) => void;
}

const EmailChips: FC<Props> = (props) => {
  const { email, customIdx, removeEmail } = props;

  return (
    <div className={"px-2 bg-blue-50 rounded flex_row_item_center mr-1 m-1 w-fit h-6 self-center"}>
      <Typography text={email} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!mr-1"} />
      <div className={"cursor-pointer"} onClick={() => removeEmail(customIdx)}>
        <CrossIcon isSmall={true} />
      </div>
    </div>
  );
};

export default EmailChips;
