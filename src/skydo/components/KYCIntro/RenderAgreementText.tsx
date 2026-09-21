//Jan 2024
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES } from "../../constants/atomicConstants";
import React from "react";

interface Props {
  tncClick: () => void;
  ppClick: () => void;
}

const RenderAgreementText = (props: Props) => {
  const { tncClick, ppClick } = props;
  return (
    <span className={"mt-3"}>
      <Typography text={Locale.iAgree} size={TYPOGRAPHY_SIZES.X_X_SMALL} textClasses={"!text-black-500"} />
      <a href="https://www.skydo.com/terms-of-use" rel="noopener noreferrer" target="_blank">
        <Typography
          text={Locale.terms}
          size={TYPOGRAPHY_SIZES.X_X_SMALL}
          textClasses={"!text-blue-400 mx-0.5 cursor-pointer"}
          onTextClick={tncClick}
        />
      </a>
      <Typography text={Locale.and} size={TYPOGRAPHY_SIZES.X_X_SMALL} textClasses={"!text-black-500"} />
      <a href="https://www.skydo.com/privacy-policy" rel="noopener noreferrer" target="_blank">
        <Typography
          text={Locale.policy}
          size={TYPOGRAPHY_SIZES.X_X_SMALL}
          textClasses={"!text-blue-400 mx-0.5 cursor-pointer"}
          onTextClick={ppClick}
        />
      </a>
    </span>
  );
};
export default RenderAgreementText;
