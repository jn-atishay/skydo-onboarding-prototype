import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import useAnalytics from "../../analytics/useAnalytics";
import { useEffect } from "react";
import { Events } from "../../analytics/EventConstants";
import dynamic from "next/dynamic";

const ImageLoader = dynamic(() => import("./ImageLoader"), { ssr: false });

const LoadingState = ({
  title = Locale.verifyingDetails,
  description = Locale.applicationSuccess,
}: {
  title?: string;
  description?: string;
}) => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics?.trackAsync(Events.FINAL_VERIFICATION_SCREEN_LOAD);
  }, [analytics]);

  return (
    <div className={"flex flex-col w-full h-full items-center justify-center px-6 md:px-0"}>
      {/*<Image src={}/>*/}
      <ImageLoader />
      <div className={"flex flex-col items-center mt-8"}>
        <Typography text={title} type={TYPOGRAPHY_TYPES.HEADING} size={TYPOGRAPHY_SIZES.SMALL} />
        <Typography text={description} textClasses={"!text-black-500 mt-4"} />
      </div>
    </div>
  );
};

export default LoadingState;
