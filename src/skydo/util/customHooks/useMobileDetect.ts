/**
 * @author Raj Sheth
 * created: 17/04/24
 */

import { useEffect, useState } from "react";
import { getMobileDetect } from "../functions";

interface Return {
  isMobile: boolean;
}

const useMobileDetect = (): Return => {
  const [isMobileFlag, setIsMobileFlag] = useState(false);

  useEffect(() => {
    const { isMobile } = getMobileDetect(navigator.userAgent);
    setIsMobileFlag(isMobile());
  }, []);

  return {
    isMobile: isMobileFlag,
  };
};

export default useMobileDetect;
