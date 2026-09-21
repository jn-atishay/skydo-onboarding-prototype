import React, { useContext } from "react";
import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import AppContext from "../../context/AppContext";
import UploadIcon from "../Icons/UploadIcon";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import UpdateRequiredBadge from "./UpdateRequiredBadge";
import ReuploadNote from "./ReuploadNote";
import { ServiceDescriptionPurposeCodeDto, ServiceDescriptionRowVariant } from "../../types/Invoice";
import {
  countryNoteDescriptionSegments,
  getBusinessLegalNameDescriptionSegments,
  getReuploadNoteSegments,
  getServiceDescriptionGuidanceLines,
  serviceDescriptionNoteDescriptionSegments,
} from "./reuploadNoteSegments";

interface Props {
  isMobile: boolean;
  isCountryMissing: boolean;
  isCountryConfidenceLow: boolean;
  hasBusinessLegalNameIssue: boolean;
  serviceDescriptionVariant: ServiceDescriptionRowVariant | null;
  serviceDescriptionPurposeCode: ServiceDescriptionPurposeCodeDto | null;
  knownNames: string[];
  isPersonalIdentity: boolean;
  onReuploadClick: () => void;
  onCloseClick: () => void;
  onProceedClick: () => void;
}

const ReuploadPromptPanel = ({
  isMobile,
  isCountryMissing,
  isCountryConfidenceLow,
  hasBusinessLegalNameIssue,
  serviceDescriptionVariant,
  serviceDescriptionPurposeCode,
  knownNames,
  isPersonalIdentity,
  onReuploadClick,
  onCloseClick,
  onProceedClick,
}: Props) => {
  const { theme } = useContext(AppContext);

  // Missing and low-confidence are surfaced identically: nothing is blocked either way, so both are
  // an error the exporter should look at rather than one error and one softer nudge.
  const hasCountryIssue = isCountryMissing || isCountryConfidenceLow;
  const notes = [
    hasCountryIssue && (
      <ReuploadNote
        key={"country"}
        segments={getReuploadNoteSegments("country")}
        descriptionSegments={countryNoteDescriptionSegments}
      />
    ),
    hasBusinessLegalNameIssue && (
      <ReuploadNote
        key={"bln"}
        segments={getReuploadNoteSegments("bln", { isPersonalIdentity })}
        descriptionSegments={knownNames.length ? getBusinessLegalNameDescriptionSegments(knownNames) : undefined}
      />
    ),
    serviceDescriptionVariant && (
      <ReuploadNote
        key={"service"}
        segments={getReuploadNoteSegments("service")}
        descriptionSegments={serviceDescriptionNoteDescriptionSegments[serviceDescriptionVariant]}
        guidanceLines={getServiceDescriptionGuidanceLines(serviceDescriptionVariant, serviceDescriptionPurposeCode)}
        isMobile={isMobile}
      />
    ),
  ].filter(Boolean);
  const errorsCount = notes.length;

  return (
    // Desktop: content sits 32px inside the pane (24px pane padding + 8px here), while the close
    // icon is pulled back out to the 24px line so it lines up with the confirm-details header's
    // cross instead of jumping when the exporter proceeds. Mobile keeps the cross in the badge row.
    <div className={classNames("flex flex-col h-full", { "relative p-2": !isMobile })}>
      {!isMobile && (
        <div className={"absolute -top-2 -right-2 cursor-pointer"} onClick={onCloseClick}>
          <CrossIcon stroke={theme.hexColors.black[500]} />
        </div>
      )}
      <UpdateRequiredBadge updatesCount={errorsCount} shouldShowCloseIcon={isMobile} onCloseClick={onCloseClick} />
      <div className={"flex flex-col gap-1 mt-4"}>
        <Typography
          text={Locale.detailsNotFoundHeading}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.X_SMALL}
        />
        <Typography
          text={Locale.detailsNotFoundSubheading}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-500"}
        />
      </div>
      <div className={"flex flex-col gap-2.5 mt-6"}>
        {notes.map((note, index) => (
          <React.Fragment key={index}>
            {index > 0 && <div className={"w-full border-t border-dashed border-black-350"} />}
            {note}
          </React.Fragment>
        ))}
      </div>
      <div className={"flex flex-col gap-1 mt-8"}>
        <Button
          title={Locale.uploadInvoice}
          type={BUTTON_TYPES.PRIMARY}
          size={BUTTON_SIZES.MEDIUM}
          leftIcon={() => <UploadIcon height={20} width={20} stroke={theme.hexColors.white} strokeWidth={2.5} />}
          onButtonClick={onReuploadClick}
          buttonClass={"!flex flex-row justify-center !w-full"}
          // Without this the label's wrapper takes flex-1 and centres itself in the leftover width,
          // pushing it away from the icon; design has the two as a centred pair 8px apart.
          textWrapperClass={"!flex-none"}
        />
        <Typography
          text={Locale.typeOfInvoiceAllowedText}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          textClasses={"!text-black-500 !text-center !text-paraxsmall !leading-5"}
        />
      </div>
      {/* Pinned to the bottom of the pane on desktop; on mobile the sheet grows so it simply follows */}
      <div className={"flex flex-col gap-3 mt-8 md:mt-auto"}>
        <div className={"w-full h-px bg-black-350"} />
        <Typography
          text={Locale.ignoreWarningsNote}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-600 !text-paraxsmall !leading-5"}
        >
          <Typography
            text={Locale.ignoreWarningsCta}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={700}
            textClasses={"!text-blue-400 cursor-pointer !text-paraxsmall !leading-5"}
            onTextClick={onProceedClick}
          />
        </Typography>
      </div>
    </div>
  );
};

export default ReuploadPromptPanel;
