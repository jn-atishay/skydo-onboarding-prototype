import React from "react";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import {AnimationLoader} from "./AnimationLoader";
import Locale from "../../util/locale/en";

const VkycPageLoader: React.FC = () => {
  return (
    <div className="w-full">
      <div
        className="relative w-full bg-white rounded-10px mx-auto min-h-[260px] sm:min-h-[320px]"
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 px-4">
          {/* <div className="w-full max-w-[640px] flex items-center justify-center"> */}
            <div className="scale-95 sm:scale-110 md:scale-125 lg:scale-150">
              <AnimationLoader 
                src="/lottie_loader.json" 
                animation={true}
                width="346px" 
                height="148px"
              />
            </div>
          {/* </div> */}

        <div className="w-full flex items-center justify-center mt-2">
          <Typography
            text={Locale.initialisingVideoKyc}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            fontWeight="bold"
            textClasses="text-center text-black-700 px-2"
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default VkycPageLoader;
 