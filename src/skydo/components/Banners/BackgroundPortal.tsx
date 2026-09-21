import React, { useEffect } from "react";
import { useBannerContext } from "../../context/BannerContext";

interface BackgroundPortalProps {
  containerId: string;
}

export const BackgroundPortal: React.FC<BackgroundPortalProps> = ({ containerId }) => {
  const { backgroundConfig } = useBannerContext();
  
  useEffect(() => {
    const container = document.getElementById(containerId);
    const originalClassName = container?.className;
    if (!container) return;

    if (backgroundConfig?.className) {
      container.classList.add(...backgroundConfig.className.split(' '));
    }

    return () => {
      if (backgroundConfig?.className) {
        container.classList.remove(...backgroundConfig.className.split(' '));
        if(originalClassName) {
          container.classList.add(...originalClassName.split(' '));
        }
      }
    };
  }, [backgroundConfig, containerId]);

  return null; // This component doesn't render anything
}; 