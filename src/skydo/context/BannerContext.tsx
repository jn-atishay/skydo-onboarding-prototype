import React, { createContext, ReactNode, useContext, useState } from "react";

export interface BackgroundConfig {
  className?: string;
}

export interface RibbonConfig {
  id: string;
  text: string;
  className?: string;
}

interface BannerContextType {
  backgroundConfig: BackgroundConfig | null;
  ribbonConfig: RibbonConfig | null;
  setBackgroundConfig: (config: BackgroundConfig | null) => void;
  setRibbonConfig: (config: RibbonConfig | null) => void;
  clearConfigs: () => void;
  hasCarouselDots: boolean;
  setHasCarouselDots: (value: boolean) => void;
}

const BannerContext = createContext<BannerContextType | undefined>(undefined);

interface BannerProviderProps {
  children: ReactNode;
}

export const BannerProvider: React.FC<BannerProviderProps> = ({ children }) => {
  const [backgroundConfig, setBackgroundConfig] = useState<BackgroundConfig | null>(null);
  const [ribbonConfig, setRibbonConfig] = useState<RibbonConfig | null>(null);
  const [hasCarouselDots, setHasCarouselDots] = useState(false);

  const clearConfigs = () => {
    setBackgroundConfig(null);
    setRibbonConfig(null);
  };

  const value: BannerContextType = {
    backgroundConfig,
    ribbonConfig,
    setBackgroundConfig,
    setRibbonConfig,
    clearConfigs,
    hasCarouselDots,
    setHasCarouselDots,
  };

  return (
    <BannerContext.Provider value={value}>
      {children}
    </BannerContext.Provider>
  );
};

export const useBannerContext = (): BannerContextType => {
  const context = useContext(BannerContext);
  if (context === undefined) {
    throw new Error('useBannerContext must be used within a BannerProvider');
  }
  return context;
}; 