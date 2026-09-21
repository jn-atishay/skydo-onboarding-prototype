import React, { useEffect, useRef } from "react";
import NpsScoreInput from "./NpsScoreInput";
import NpsPresetReasonInput from "./NpsPresetReasonInput";
import NpsSubjectiveInput from "./NpsSubjectiveInput";
import NpsSubmit from "./NpsSubmit";
import useNpsStore from "../../store/useNpsStore";
import NpsThankYou from "./NpsThankYou";
import NpsReferralNudge from "./NpsReferralNudge";
import { NpsInputSource } from "../../constants/npsInputConstants";
import classNames from "classnames";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface Props {
  source: NpsInputSource;
  scrollCallback: () => void;
  identifier?: string;
  email: string;
  npsScoreInputContainerClass?: string;
  hideHeader?: boolean;
  hideThankYou?: boolean;
  postNpsSubmit?: () => void;
}

const NpsInput = (props: Props) => {
  const {
    source,
    scrollCallback,
    identifier,
    email,
    npsScoreInputContainerClass,
    hideHeader,
    hideThankYou,
    postNpsSubmit,
  } = props;
  const { npsSubmitted, npsSeen, setNpsSeen } = useNpsStore();
  const screenRef = useRef<HTMLDivElement>(null);
  const analytics = useAnalytics();

  useEffect(() => {
    analytics?.trackAsync(Events.NPS_DISPLAYED, { source: source });
  }, []);

  // TODO - Review Observing Code
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // The component is now in the viewport
          analytics?.trackAsync(Events.NPS_SEEN, { source: source });
          setNpsSeen();
          // @ts-ignore
          observer.unobserve(screenRef.current); // Stop observing after the first view if needed
        }
      },
      {
        root: null, // Observing within the viewport (browser window)
        threshold: 1, // Trigger when 100% of the element is visible
      }
    );

    if (screenRef.current) {
      observer.observe(screenRef.current); // Start observing the component
    }

    return () => {
      if (screenRef.current) {
        observer.unobserve(screenRef.current); // Clean up observer on unmount
      }
    };
  }, []);

  return (
    <div
      className={classNames("flex flex-col gap-6", {
        "!gap-8": source == NpsInputSource.PUBLIC_PAGE,
      })}
      ref={screenRef}
    >
      {!npsSubmitted ? (
        <>
          <NpsScoreInput
            scrollCallback={scrollCallback}
            npsScoreInputContainerClass={npsScoreInputContainerClass}
            hideHeader={hideHeader}
            source={source}
          />
          <NpsPresetReasonInput />
          <NpsSubjectiveInput source={source} />
          <NpsSubmit email={email} source={source} postNpsSubmit={postNpsSubmit} />
        </>
      ) : (
        <>
          {hideThankYou ? null : <NpsThankYou />}
          <NpsReferralNudge source={source} identifier={identifier} />
        </>
      )}
    </div>
  );
};

export default NpsInput;
