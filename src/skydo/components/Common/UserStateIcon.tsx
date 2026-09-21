import React from "react";
import classNames from "classnames";

interface Props {
  isCurrentState?: boolean;
  isStateDone?: boolean;
  children?: React.ReactElement | string | number | null;
  containerClass?: string;
  styles?: any;
  containerClassObject?: { [key: string]: boolean };
}

const UserStateIcon = ({
  isCurrentState,
  isStateDone,
  children,
  containerClass,
  styles,
  containerClassObject,
}: Props) => {
  return (
    <div
      className={classNames(
        "z-10 absolute rounded-10px flex left-0 items-center justify-center p-4 -translate-x-2/4",
        {
          "bg-green-400": isStateDone,
          "top-7": !isCurrentState,
          "top-10 bg-black-700": isCurrentState,
          "!shadow-stateIcon bg-white": !isStateDone,
        },
        containerClass,
        containerClassObject
      )}
      style={styles}
    >
      {children}
    </div>
  );
};

export default UserStateIcon;
