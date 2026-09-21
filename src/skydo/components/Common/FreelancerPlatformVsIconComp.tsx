import Typography from "../AtomicComponents/Typography";
import { FREELANCER_PLATFORM_CODE } from "../../constants/dashboardConstants";
import ToptalLogo from "../Icons/ToptalLogo";
import FreelancerLogo from "../Icons/FreelancerLogo";
import UpworkLogo from "../Icons/UpworkLogo";
import DeelLogo from "../Icons/DeelLogo";
import LaptopIcon from "../Icons/LaptopIcon";
import AmazonLogo from "../Icons/AmazonLogo";

const FreelancerPlatformVsIconComp = ({
  platform,
  isSelected = false,
  height,
  width,
}: {
  platform: string;
  isSelected?: boolean;
  height?: number;
  width?: number;
}) => {
  switch (platform) {
    case FREELANCER_PLATFORM_CODE.TOPTAL:
      return <ToptalLogo isSelected={isSelected} height={height} width={width} />;
    case FREELANCER_PLATFORM_CODE.FREELANCER:
      return <FreelancerLogo isSelected={isSelected} height={height} width={width} />;
    case FREELANCER_PLATFORM_CODE.UPWORK:
      return <UpworkLogo isSelected={isSelected} height={height} width={width} />;
    case FREELANCER_PLATFORM_CODE.DEEL:
      return <DeelLogo isSelected={isSelected} height={height} width={width} />;
    case FREELANCER_PLATFORM_CODE.OTHERS:
      return <LaptopIcon isSelected={isSelected} width={24} height={18} />;
    case FREELANCER_PLATFORM_CODE.AMAZON:
      return <AmazonLogo isSelected={isSelected} height={height} width={width} />;
    default:
      return <Typography text={platform} />;
  }
};

export default FreelancerPlatformVsIconComp;
