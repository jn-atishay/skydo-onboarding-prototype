import styles from "./index.module.css";
import classNames from "classnames";
import { TrianglePointingDirectionType } from "../../types/atomicComponentTypes";
import { TrianglePointingDirection } from "../../constants/atomicConstants";

/*
 * Triangle component using css
 */

interface Props {
  containerClass?: string;
  isSmall?: boolean;
  isCustom?: boolean;
  isLarge?: boolean;
  pointingDirection: TrianglePointingDirectionType;
  isBlack?: boolean;
}

const Triangle = (props: Props) => {
  const { containerClass, isSmall, isLarge, isCustom, isBlack } = props;
  return (
    <div
      className={classNames(
        styles["triangle"],
        { [styles["triangle--small"]]: isSmall },
        { [styles["triangle--large"]]: isLarge },
        { [styles["triangle--small--custom"]]: isCustom },
        { [styles["triangle--small--black"]]: isBlack },
        containerClass
      )}
    />
  );
};

Triangle.defaultProps = {
  isSmall: true,
  pointingDirection: TrianglePointingDirection.UP,
};

export default Triangle;
