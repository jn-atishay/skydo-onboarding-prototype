import React, { useContext } from "react";
import { UserDetailsContext } from "../DashboardContainer";
import NewBanner from "./NewBanner";
import OldBanner from "./OldBanner";
import { isOldUser } from "../../util/vkycUtils";

interface Props {}

const VideoKycBanner = (props: Props) => {
  const { exporterDetails } = useContext(UserDetailsContext);

  return (
    <div className={"flex flex-row items-center gap-6 h-full"}>
      {isOldUser(exporterDetails.tag) ? <OldBanner /> : <NewBanner />}
    </div>
  );
};

export default VideoKycBanner;
