import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import React from "react";
import useNpsStore from "../../store/useNpsStore";
import { getScoreRange, NpsInputSource, ScoreRange } from "../../constants/npsInputConstants";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  scrollCallback: () => void;
  npsScoreInputContainerClass?: string;
  hideHeader?: boolean;
  source: NpsInputSource;
}

const NpsScoreInput = (props: Props) => {
  const { scrollCallback, npsScoreInputContainerClass, hideHeader, source } = props;
  const { npsScore, setNpsScore } = useNpsStore();
  const possibleScores = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const analytics = useAnalytics();
  const scoreRange = getScoreRange(npsScore);

  return (
    <div className={classNames("flex flex-col space-y-4", npsScoreInputContainerClass, {})}>
      {hideHeader ? null : (
        <Typography
          text={"🎉 Based on your experience so far, how likely are you to recommend Skydo to your friends?"}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          fontWeight={"700"}
        />
      )}
      <div className={"flex flex-col space-y-2"}>
        <div className={"flex flex-row gap-1"}>
          {possibleScores.map((score) => {
            const isBoxSelected = npsScore >= score;
            return (
              <div
                key={score}
                className={classNames("flex-1 border border-black-500 py-3 rounded cursor-pointer text-center", {
                  "bg-green-400": isBoxSelected && scoreRange == ScoreRange.HIGH,
                  "bg-yellow-400": isBoxSelected && scoreRange == ScoreRange.MID,
                  "bg-red-300": isBoxSelected && scoreRange == ScoreRange.LOW,
                  "border-0": isBoxSelected,
                })}
                onClick={() => {
                  analytics?.trackAsync(Events.NPS_SCORE_SELECTED, { source: source, score: score });
                  setNpsScore(score, scrollCallback);
                }}
              >
                <Typography
                  text={score}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.MEDIUM}
                  fontWeight={"700"}
                  textClasses={classNames("text-black-400", {
                    "text-white": isBoxSelected,
                  })}
                />
              </div>
            );
          })}
        </div>
        <div className={"flex flex-row justify-between"}>
          <Typography
            text={"🤧 Not likely"}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
          <Typography
            text={"Most likely 🤩"}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
        </div>
      </div>
    </div>
  );
};

export default NpsScoreInput;
