/**
 * @author Raj Sheth
 * created: 15/09/23
 */

import React, { FC, useContext } from "react";
import { TYPOGRAPHY_SIZES } from "../../../constants/atomicConstants";
import Notes from "./index";
import AppContext from "../../../context/AppContext";
import classNames from "classnames";

interface InfoNoteProps {
  text: string;
  containerClass?: string;
}

const InfoNote: FC<InfoNoteProps> = (props) => {
  const { theme } = useContext(AppContext);
  return (
    <Notes
      text={props.text}
      iconHeight={24}
      iconWidth={24}
      iconColor={theme.hexColors.blue[400]}
      className={classNames("!bg-blue-50 border-blue-200 border-[1px]", props.containerClass)}
      typographySize={TYPOGRAPHY_SIZES.X_SMALL}
      iconClassname={"rotate-180"}
    />
  );
};

export default InfoNote;
