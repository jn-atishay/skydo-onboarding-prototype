import React, { RefObject, useEffect } from "react";

const useOutsideClickFinder = (
  ref: RefObject<HTMLElement>,
  callback: (e: React.MouseEvent) => void,
  triggerInCapturingPhase?: boolean
) => {
  const handleClick = (e: MouseEvent) => {
    if (ref.current && !ref.current.contains(e.target as Node)) {
      callback(e as unknown as React.MouseEvent);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClick, { capture: triggerInCapturingPhase });
    return () => document.removeEventListener("click", handleClick, { capture: triggerInCapturingPhase });
  }, [ref]);
};

export default useOutsideClickFinder;
