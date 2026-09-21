import {useEffect, useState} from "react";
import {DESKTOP_MIN_WIDTH} from "../../constants/atomicConstants";

const useMobileVersionHook = () => {

  const [isMobile, setIsMobile] = useState<boolean | null>(null);

  useEffect(() => {
    if (window.innerWidth >= DESKTOP_MIN_WIDTH) {
      setIsMobile(false);
    } else {
      setIsMobile(true);
    }
  }, []);

  return {isMobile}
}

export default useMobileVersionHook;