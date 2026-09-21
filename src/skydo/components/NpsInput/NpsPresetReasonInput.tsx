import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import useNpsStore from "../../store/useNpsStore";
import classNames from "classnames";
import useAnalytics from "../../analytics/useAnalytics";

const NpsPresetReasonInput = () => {
  const { presetReasons, selectPresetReason, selectedPresetReasons } = useNpsStore();
  const analytics = useAnalytics();
  if (presetReasons.length == 0) return null;

  return (
    <div>
      <div className={"flex flex-col space-y-4"}>
        <Typography
          text={"Choose your reasons"}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          fontWeight={"600"}
        />
        <div className={"flex flex-wrap gap-4"}>
          {presetReasons.map((reason) => {
            const isReasonSelected = selectedPresetReasons.includes(reason);
            return (
              <div
                key={reason}
                className={classNames("border-2 border-black-400 px-4 pb-[2px] rounded-20px cursor-pointer", {
                  "!border-blue-300 bg-blue-50": isReasonSelected,
                })}
                onClick={() => selectPresetReason(reason, analytics)}
              >
                <Typography
                  text={reason}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  fontWeight={"600"}
                  textClasses={classNames("!text-black-500", {
                    "!text-blue-300": isReasonSelected,
                  })}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NpsPresetReasonInput;
