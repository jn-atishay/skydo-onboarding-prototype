import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { RibbonConfig, useBannerContext } from "../../context/BannerContext";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classNames from "classnames";

interface RibbonPortalProps {
  containerId: string;
}

const RibbonContent: React.FC<{ config: RibbonConfig }> = ({ config }) => {
  const getRibbonClasses = (config: RibbonConfig) => {
    const fallbackClasses = config.className || "absolute top-16 -left-6 transform -rotate-[35deg] origin-top-left";
    const defaultStyle = "z-10 bg-green-300 text-white px-6 w-fit text-center shadow-md";

    return classNames(
      fallbackClasses,
      defaultStyle,
    );
  };


  return (
    <div 
      className={getRibbonClasses(config)}
    >
      <Typography
        text={config.text}
        textClasses="!text-white"
        size={TYPOGRAPHY_SIZES.X_X_SMALL}
        type={TYPOGRAPHY_TYPES.PARA}
        fontWeight={600}
      />
    </div>
  );
};

export const RibbonPortal: React.FC<RibbonPortalProps> = ({ containerId }) => {
  const { ribbonConfig } = useBannerContext();
  const [container, setContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const element = document.getElementById(containerId);
    if (element) {
      const originalPosition = element.style.position;
      element.style.position = 'relative';
      setContainer(element);

      // Cleanup function to restore original position
      return () => {
        element.style.position = originalPosition;
      };
    }
  }, [containerId]);

  if (!ribbonConfig || !container) {
    return null;
  }

  return createPortal(
    <RibbonContent config={ribbonConfig} />,
    container
  );
}; 