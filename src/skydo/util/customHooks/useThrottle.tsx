import { useCallback, useRef } from "react";

const useThrottle = (callback: (...args: any[]) => void, delay: number) => {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const throttledCallback = useCallback(
    (...args: any[]) => {
      if (!timeoutRef.current) {
        callback(...args);
        timeoutRef.current = setTimeout(() => {
          timeoutRef.current = null;
        }, delay);
      }
    },
    [callback, delay]
  );

  return throttledCallback;
};

export default useThrottle;
