import { useEffect, useState } from "react";

/**
 * SSR-safe: always starts `false` (matches server render), then updates to the real
 * match once mounted. Never defaults to `true` for any query, so two complementary
 * queries (e.g. "min-width" and "max-width") can't both resolve truthy on first paint.
 */
export const useMediaQuery = (query: string): boolean => {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    setMatches(media.matches);
    const handleChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [query]);

  return matches;
};
