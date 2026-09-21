import { useEffect } from 'react';
import { useBannerContext, BackgroundConfig } from '../context/BannerContext';

interface UseBannerConfigProps {
  backgroundConfig?: BackgroundConfig | null;
}

export const useBannerConfig = ({ backgroundConfig }: UseBannerConfigProps) => {
  const { setBackgroundConfig, clearConfigs } = useBannerContext();

  // Callers pass inline object literals, so identity changes every render.
  // Compare by serialized value to keep the effect from looping.
  const bgKey = JSON.stringify(backgroundConfig ?? null);

  useEffect(() => {
    setBackgroundConfig(backgroundConfig || null);

    return () => {
      setBackgroundConfig(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bgKey, setBackgroundConfig]);

  return { setBackgroundConfig, clearConfigs };
};
