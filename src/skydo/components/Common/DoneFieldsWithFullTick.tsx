//Sep 2023

import { useContext } from "react";
import AppContext from "../../context/AppContext";
import FullTick from "../Icons/FullTick";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classNames from "classnames";

// @ts-ignore
const sizeTypes = Object.values(TYPOGRAPHY_SIZES) as const;
// @ts-ignore
const type = Object.values(TYPOGRAPHY_TYPES) as const;

interface Props {
  text: string;
  typoGraphySize?: (typeof sizeTypes)[number];
  typographyType?: (typeof type)[number];
  typographyChildren?: JSX.Element;
  textClasses?: string;
  iconWidth?: number;
  iconHeight?: number;
  tickColor?: string;
  bgColor?: string;
  circleStroke?: string;
  circleStrokeWidth?: string;
  tickStrokeWidth?: string;
  isSmall?: boolean;
  className?: string;
}

const DoneFieldsWithFullTick = (props: Props) => {
  const { theme } = useContext(AppContext);

  const {
    text,
    typographyChildren,
    typoGraphySize = TYPOGRAPHY_SIZES.X_SMALL,
    typographyType = TYPOGRAPHY_TYPES.PARA,
    textClasses,
    iconWidth,
    iconHeight,
    bgColor = theme.hexColors.green[100],
    tickColor = theme.hexColors.green[400],
    className,
  } = props;
  return (
    <div className={classNames("flex", className)}>
      <FullTick
        width={iconWidth}
        height={iconHeight}
        tickColor={tickColor}
        bgColor={bgColor}
        className={"mr-2 shrink-0"}
        circleStroke={props.circleStroke}
        circleStrokeWidth={props.circleStrokeWidth}
        tickStrokeWidth={props.tickStrokeWidth}
        isSmall={props.isSmall}
      />
      <Typography text={text} size={typoGraphySize} type={typographyType} textClasses={textClasses}>
        {typographyChildren}
      </Typography>
    </div>
  );
};

export default DoneFieldsWithFullTick;
