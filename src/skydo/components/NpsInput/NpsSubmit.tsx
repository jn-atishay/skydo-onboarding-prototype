import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, BUTTON_TYPES } from "../../constants/atomicConstants";
import React from "react";
import useNpsStore from "../../store/useNpsStore";
import { getScoreRange, NpsInputSource, ScoreRange } from "../../constants/npsInputConstants";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import classNames from "classnames";

interface Props {
  email: string;
  source: NpsInputSource;
  postNpsSubmit?: () => void;
}

const NpsSubmit = (props: Props) => {
  const { email, source, postNpsSubmit } = props;
  const { submitNpsResponse, npsScore, selectedPresetReasons, subjectiveResponse } = useNpsStore();
  const scoreRange = getScoreRange(npsScore);
  const analytics = useAnalytics();

  if (scoreRange == ScoreRange.NA) return null;

  return (
    <div
      className={classNames("flex flex-row justify-end", {
        "w-full": source == NpsInputSource.PUBLIC_PAGE,
      })}
    >
      <Button
        title={"Submit"}
        buttonClass={classNames("", {
          "!w-full": source == NpsInputSource.PUBLIC_PAGE,
        })}
        type={BUTTON_TYPES.PRIMARY}
        size={source == NpsInputSource.PUBLIC_PAGE ? BUTTON_SIZES.MEDIUM : BUTTON_SIZES.SMALL}
        onButtonClick={() => {
          submitNpsResponse(email);
          analytics?.trackAsync(Events.NPS_SUBMITTED, {
            source: source,
            response: selectedPresetReasons.length != 0 && subjectiveResponse.length != 0,
            score: npsScore,
          });
          postNpsSubmit && postNpsSubmit();
        }}
      />
    </div>
  );
};

export default NpsSubmit;
