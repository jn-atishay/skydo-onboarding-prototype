import React from "react";
import SidebarWidget from "../ReferralCampaigns/surfaces/SidebarWidget";

interface ReferralWidgetProps {
  isCollapsed: boolean;
}

const ReferralWidget = ({ isCollapsed }: ReferralWidgetProps) => {
  return <SidebarWidget isCollapsed={isCollapsed} />;
};

export default ReferralWidget;
