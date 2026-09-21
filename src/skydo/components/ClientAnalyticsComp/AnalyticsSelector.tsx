import SubNavBar, { SubNavBarItem } from "../Common/SubNavBar";
import Locale from "../../util/locale/en";
import PieChartIcon from "../Icons/PieChartIcon";
import FE_ROUTES from "../../util/feRoutes";
import MultiUsersIcon from "../Icons/MultiUsersIcon";
import AddIcon from "../Icons/AddIcon";
import FileTextIcon from "../Icons/FileTextIcon";
import { SUGGESTION_POPUP_TYPES } from "../BusinessAnalytics/constants";
import React, { useContext, useState } from "react";
import AppContext from "../../context/AppContext";
import { useRouter } from "next/router";
import SuggestionPopupContent from "../BusinessAnalytics/SuggestionPopupContent";
import Popup from "../AtomicComponents/Popup";

const AnalyticsSelector = () => {
  const { theme } = useContext(AppContext);
  const router = useRouter();
  const [suggestionPopupType, setSuggestionPopupType] = useState("");
  const subNavBarList: SubNavBarItem[] = [
    {
      headerText: Locale.analyticsHeader,
    },
    {
      label: Locale.businessOverview,
      icon: (isSelected) => <PieChartIcon stroke={isSelected ? theme.hexColors.white : theme.hexColors.black[600]} />,
      isSelectedFun: () => [FE_ROUTES.BUSINESS_ANALYTICS, FE_ROUTES.ANALYTICS].includes(router.pathname),
      onRowClick: () => router.push(FE_ROUTES.BUSINESS_ANALYTICS),
    },
    {
      label: Locale.clientOverview,
      icon: (isSelected) => <MultiUsersIcon stroke={isSelected ? theme.hexColors.white : theme.hexColors.black[600]} />,
      isSelectedFun: () => [FE_ROUTES.CLIENT_LEVEL_ANALYTICS].includes(router.pathname),
      onRowClick: () => router.push(FE_ROUTES.CLIENT_LEVEL_ANALYTICS),
    },
    {
      label: Locale.reportsTitle,
      icon: (isSelected) => <FileTextIcon stroke={isSelected ? theme.hexColors.white : theme.hexColors.black[600]} />,
      isSelectedFun: () => [FE_ROUTES.REPORTS].includes(router.pathname),
      onRowClick: () => router.push(FE_ROUTES.REPORTS),
      showNewBadge: true,
      isBadgeAfterLabel: true,
      badgeTitle: Locale.new,
    },
    {
      label: Locale.whatToAdd,
      icon: () => <AddIcon />,
      onRowClick: () => setSuggestionPopupType(SUGGESTION_POPUP_TYPES.NAV_BAR_ANALYTICS),
    },
  ];

  const onCloseSuggestionPopup = () => setSuggestionPopupType("");
  return (
    <div>
      <SubNavBar subNavBarList={subNavBarList} containerClass={"min-w-[295px]"} />
      <Popup
        renderContent={() => (
          <SuggestionPopupContent closePopup={onCloseSuggestionPopup} popupType={suggestionPopupType} />
        )}
        open={!!suggestionPopupType}
        closeIconClick={onCloseSuggestionPopup}
        isCommonHeader={true}
        title={Locale.shareFeedback}
        isDashboardPopup={true}
        outsideClick={onCloseSuggestionPopup}
      />
    </div>
  );
};

export default AnalyticsSelector;
