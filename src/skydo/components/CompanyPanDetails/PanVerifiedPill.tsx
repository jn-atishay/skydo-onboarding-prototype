import { useContext } from "react";
import FullTick from "../Icons/FullTick";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import AppContext from "../../context/AppContext";

interface Props {
  businessPAN?: string;
  onEditClick: () => void;
}

const maskBusinessPan = (pan?: string) => (pan && pan.length === 10 ? `${pan.slice(0, 4)}XXXX${pan.slice(8)}` : pan);

const PanVerifiedPill = ({ businessPAN, onEditClick }: Props) => {
  const { theme } = useContext(AppContext);
  if (!businessPAN) return null;
  return (
    <div className={"shrink-0"}>
      <div className={"flex flex-row items-center gap-3 bg-green-50 rounded-100px pl-2 pr-3 py-1.5 whitespace-nowrap"}>
        <div className={"flex flex-row items-center gap-1.5"}>
          <FullTick bgColor={theme.hexColors.green[400]} tickColor={theme.hexColors.white} isSmall />
          <Typography
            text={`${Locale.pan}: ${maskBusinessPan(businessPAN)} `}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-black-700"}
          >
            <Typography
              text={Locale.panPillVerified}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses={"!text-green-400"}
            />
          </Typography>
        </div>
        <Typography
          text={Locale.edit}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-600 !font-normal cursor-pointer"}
          onTextClick={onEditClick}
        />
      </div>
    </div>
  );
};

export default PanVerifiedPill;
