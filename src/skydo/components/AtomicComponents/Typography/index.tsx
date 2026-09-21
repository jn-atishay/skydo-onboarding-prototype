import classNames from "classnames";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../../constants/atomicConstants";
import { useEffect, useRef } from "react";

interface TypographyProps {
  text: any;
  type: string;
  size: string;
  fontWeight?: string | number;
  fontColor?: string;
  textProps?: { [key: string]: string };
  textClasses?: string;
  onTextClick: () => void;
  hoverVal?: string;
  children?: JSX.Element | JSX.Element[] | null;
  typographyProps?: { [key: string]: string };
}

interface TypographyTypeMap {
  [key: string]: any;
}

/**
 * how to read?
 * tailwind is a mobile first design system.
 *
 * sm = 640px
 * screen sizes >= 640 it will apply `paraxlarge`
 * screen sizes < 640 it will apply `paralarge`
 *
 * Read more: https://tailwindcss.com/docs/responsive-design#targeting-mobile-screens
 */
export const typeMap: TypographyTypeMap = {
  display: {
    large: `displaymedium md:displaylarge`,
    medium: `displaysmall md:displaymedium`,
    small: `displayxsmall md:displaysmall`,
    xSmall: `headingxlarge md:displayxsmall`,
  },
  heading: {
    xLarge: `headinglarge md:headingxlarge`,
    large: `headingmedium md:headinglarge`,
    medium: `headingsmall md:headingmedium`,
    small: `headingxsmall md:headingsmall`,
    xSmall: `heading2xsmall md:headingxsmall`,
    xxSmall: `heading2xsmall md:heading2xsmall`,
  },
  label: {
    large: `labelmedium md:labellarge`,
    medium: `labelsmall md:labelmedium`,
    small: `labelxsmall md:labelsmall`,
    xSmall: `labelxsmall md:labelxsmall`,
  },
  paragraph: {
    xLarge: `paralarge md:paraxlarge`,
    large: `paramedium md:paralarge`,
    medium: `parasmall md:paramedium`,
    small: `paraxsmall md:parasmall`,
    xSmall: `para2xsmall md:paraxsmall`,
    xxSmall: `para3xsmall md:para2xsmall`,
    xxxSmall: `para3xsmall md:para3xsmall`,
  },
};

const getStyles = (styleProps: { fontWeight?: string | number; fontColor?: string }) => {
  const { fontWeight, fontColor } = styleProps;
  return {
    ...(fontWeight ? { fontWeight } : {}),
    color: fontColor,
  };
};

export const getTypeMapClassnames = (type: string, size: string) => {
  if (typeMap[type][size]) return typeMap[type][size];
  return "";
};

/*
fontWeight and color are configurable for any typography type
to apply any css pass it in textProps it will be applied as style to text span wrapper
 */

/*
1. Always add ! in textClasses if you are changing the text color
 */

const Typography = (props: TypographyProps) => {
  const {
    text,
    type,
    size,
    textProps = {},
    fontWeight,
    fontColor,
    textClasses,
    onTextClick,
    children,
    typographyProps,
  } = props;
  const textStyle = getStyles({ fontWeight, fontColor });
  const spanRef = useRef<HTMLSpanElement | null>(null);

  useEffect(() => {
    if (spanRef.current) {
      if (spanRef.current.offsetWidth < spanRef.current.scrollWidth) {
        spanRef.current.title = text;
      }
    }
  }, []);

  return (
    <span
      ref={spanRef}
      style={{ ...textStyle, ...textProps }}
      className={classNames("text-black-700", textClasses, getTypeMapClassnames(type, size))}
      onClick={onTextClick}
      {...typographyProps}
    >
      {text}
      {children}
    </span>
  );
};

Typography.defaultProps = {
  size: TYPOGRAPHY_SIZES.MEDIUM,
  type: TYPOGRAPHY_TYPES.PARA,
  onTextClick: () => {},
};

export default Typography;
