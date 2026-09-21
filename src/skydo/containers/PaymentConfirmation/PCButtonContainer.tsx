/**
 * @author Raj Sheth
 * created: 19/10/23
 */

import React, { FC } from "react";
import PCButton from "../../components/PaymentConfirmation/PCButton";
import { Transaction } from "../../types";

interface Props {
  transaction: Transaction | null | undefined;
}

const PCButtonContainer: FC<Props> = (props) => {
  return <PCButton transaction={props.transaction} />;
};

export default PCButtonContainer;
