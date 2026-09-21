import classnames from "classnames";
import React from "react";

interface Props {
  containerClass: string | { [key: string]: boolean };
  children: JSX.Element | null;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const IconContainer = (props: Props) => {
  const { containerClass, children, onClick } = props;
  return (
    <div
      className={classnames("flex justify-center items-center rounded-full h-12 w-12", containerClass)}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

IconContainer.defaultProps = {
  containerClass: "bg-blue-50",
};

export default IconContainer;
