import React from 'react';
import { BackgroundPortal } from './BackgroundPortal';
import { RibbonPortal } from './RibbonPortal';

interface BannerPortalsProps {
  containerId: string;
  enableBackground?: boolean;
  enableRibbon?: boolean;
}

export const BannerPortals: React.FC<BannerPortalsProps> = ({ 
  containerId, 
  enableBackground = true, 
  enableRibbon = true 
}) => {
  return (
    <>
      {enableBackground && <BackgroundPortal containerId={containerId} />}
      {enableRibbon && <RibbonPortal containerId={containerId} />}
    </>
  );
}; 