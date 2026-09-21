/**
 * @author Raj Sheth
 * created: 01/12/23
 */

import React, { useContext } from "react";
import AppContext from "../../context/AppContext";
import UserStateIcon from "../Common/UserStateIcon";
import FullTick from "../Icons/FullTick";
import LockedState from "../Common/LockedState";
import VerticalDottedLine from "../Common/VerticalDottedLine";
import Locale from "../../util/locale/en";
import { TestimonialTrustMarker } from "../TrustMarker/TestimonialTrustMarker";
import TrustMarker from "../TrustMarker";
import FileIcon from "../Icons/FileIcon";
import DocUploadForm from "./DocUploadForm";
import useUserData from "../../store/useUserData";
import { useIsDocUploadStateDone } from "../../util/onboardingUtil";
import classNames from "classnames";

const DocUpload = () => {
  const { theme } = useContext(AppContext);
  const { docUploadProps } = useUserData();
  const { isCurrentState, isStateDone } = useIsDocUploadStateDone();
  const preTitle = Locale.freelancerDocNeededTitle;
  const postTitle = Locale.bizDocsUploaded;

  if (!docUploadProps.isSectionVisible) {
    return null;
  }

  return (
    <div
      className={classNames("relative flex flex-col", {
        hide_for_mob: !isCurrentState,
      })}
    >
      <div className={"flex-1 md:px-29 md:py-10 flex items-center bg-white md:my-6 relative"}>
        <UserStateIcon isCurrentState={isCurrentState} isStateDone={isStateDone} containerClass={"hide_for_mob"}>
          <>
            {isStateDone ? <FullTick bgColor={theme.hexColors.white} tickColor={theme.hexColors.green[400]} /> : null}
            {isCurrentState ? <FileIcon width={24} height={24} stroke={theme.hexColors.white} /> : null}
            {!isStateDone && !isCurrentState ? <FileIcon width={24} height={24} /> : null}
          </>
        </UserStateIcon>
        {isCurrentState ? (
          <DocUploadForm />
        ) : (
          <LockedState isStateDone={isStateDone} text={isStateDone ? postTitle : preTitle} />
        )}
      </div>
      <div className={"hide_for_mob"}>
        <VerticalDottedLine isBottomClipped={true} />
        {!isCurrentState ? <TrustMarker isCurrentState={isCurrentState} /> : <TestimonialTrustMarker />}
      </div>
    </div>
  );
};

export default DocUpload;
