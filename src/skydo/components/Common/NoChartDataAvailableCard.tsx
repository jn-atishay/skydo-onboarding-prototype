import GraphEmptyState from "../Icons/GraphEmptyState";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import { useContext } from "react";
import AppContext from "../../context/AppContext";

interface Props {
  width?: number;
  height?: number;
  showSubtext?: boolean;
}

const NoChartDataAvailableCard = (props: Props) => {
  const { theme } = useContext(AppContext);
  return (
    <div className={"flex-1 flex flex-col items-center justify-center p-4"}>
      <GraphEmptyState
        width={props.width}
        height={props.height}
        graph1Fill={theme.hexColors.black[400]}
        graph2Fill={theme.hexColors.black[400]}
        graph3Fill={theme.hexColors.black[400]}
        graph4Fill={theme.hexColors.black[400]}
        lineStroke={theme.hexColors.black[500]}
      />
      <Typography
        text={Locale.noDataAvailable}
        type={TYPOGRAPHY_TYPES.LABEL}
        size={TYPOGRAPHY_SIZES.LARGE}
        textClasses={"block mt-2 mb-2"}
      />
      {props.showSubtext ? (
        <Typography
          text={Locale.noDataSubtext}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500"}
        />
      ) : null}
    </div>
  );
};

NoChartDataAvailableCard.defaultProps = {
  width: 91,
  height: 90,
  showSubtext: true,
};

export default NoChartDataAvailableCard;
