import classnames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React from "react";
import USdImageLoader from "./UsdImageLoader";

interface Props {
  containerClasses?: string;
  text: string;
}

const RefundableElement = (props: Props) => {
  const { containerClasses, text } = props;
  return (
    <div
      className={classnames(
        "inline-flex flex-row items-center h-5 bg-limegreen-50 rounded-40px space-x-1 px-2",
        containerClasses
      )}
    >
      <USdImageLoader />
      <Typography
        text={text}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.X_SMALL}
        textClasses="!text-limegreen-400"
      />
    </div>
  );
};

export default RefundableElement;
