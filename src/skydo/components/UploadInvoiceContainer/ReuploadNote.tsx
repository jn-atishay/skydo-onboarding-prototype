import React, { useContext, useState } from "react";
import classNames from "classnames";
import Typography from "../AtomicComponents/Typography";
import Tooltip from "../AtomicComponents/Tooltip";
import { TOOLTIP_POSITION, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import AppContext from "../../context/AppContext";
import ChevronRightIcon from "../Icons/ChevronRightIcon";
import InfoCircleIcon from "../Icons/InfoCircleIcon";

export interface NoteSegment {
  text: string;
  bold?: boolean;
  weight?: "medium" | "semibold" | "bold";
}

interface Props {
  segments: NoteSegment[];
  descriptionSegments?: NoteSegment[];
  /** Guidance lines: a tooltip on desktop, an expandable box after the description on mobile */
  guidanceLines?: NoteSegment[][];
  isMobile?: boolean;
}

const boldSegmentClasses = (weight: NoteSegment["weight"]) => {
  if (weight === "medium") return "!font-medium !text-black-600";
  if (weight === "bold") return "!font-bold !text-black-700";
  return "!font-bold !text-black-600";
};

// Title is 14px and description 12px on both platforms, so the responsive Typography sizes are
// pinned with explicit font-size tokens rather than letting them scale at the md breakpoint.
const segmentProps = (segment: NoteSegment, sizeClasses: string, colorClasses?: string) => ({
  text: segment.text,
  type: TYPOGRAPHY_TYPES.PARA,
  size: TYPOGRAPHY_SIZES.SMALL,
  fontWeight: segment.bold ? undefined : 400,
  textClasses: classNames(
    sizeClasses,
    colorClasses ?? (segment.bold ? boldSegmentClasses(segment.weight) : "!text-black-600"),
    colorClasses && segment.bold ? "!font-bold" : ""
  ),
});

const SegmentedLine = ({
  segments,
  sizeClasses,
  colorClasses,
  children,
}: {
  segments: NoteSegment[];
  sizeClasses: string;
  colorClasses?: string;
  children?: JSX.Element | null;
}) => {
  const [firstSegment, ...restSegments] = segments;
  return (
    <Typography {...segmentProps(firstSegment, sizeClasses, colorClasses)}>
      {[
        ...restSegments.map((segment, index) => (
          <Typography key={index} {...segmentProps(segment, sizeClasses, colorClasses)} />
        )),
        ...(children ? [<React.Fragment key={"trailing"}>{children}</React.Fragment>] : []),
      ]}
    </Typography>
  );
};

// A single line reads as a sentence; two or more read as bullets.
const GuidanceLines = ({
  lines,
  sizeClasses,
  colorClasses,
}: {
  lines: NoteSegment[][];
  sizeClasses: string;
  colorClasses?: string;
}) => {
  if (lines.length === 1) {
    return <SegmentedLine segments={lines[0]} sizeClasses={sizeClasses} colorClasses={colorClasses} />;
  }
  return (
    // The list carries the text's line height so wrapped lines do not inherit the page default
    <ul className={classNames("flex flex-col gap-2 list-disc pl-4 text-left", sizeClasses)}>
      {lines.map((line, index) => (
        <li key={index}>
          <SegmentedLine segments={line} sizeClasses={sizeClasses} colorClasses={colorClasses} />
        </li>
      ))}
    </ul>
  );
};

const ReuploadNote = ({ segments, descriptionSegments, guidanceLines, isMobile = false }: Props) => {
  const { theme } = useContext(AppContext);
  const [isGuidanceExpanded, setIsGuidanceExpanded] = useState(false);
  const hasGuidance = Boolean(guidanceLines?.length);
  const hasMultipleGuidanceLines = (guidanceLines?.length ?? 0) > 1;

  const guidanceTooltip = guidanceLines ? (
    <Tooltip
      tooltipText={
        <GuidanceLines lines={guidanceLines} sizeClasses={"!text-paraxsmall !leading-5"} colorClasses={"!text-white"} />
      }
      position={TOOLTIP_POSITION.TOP}
      tooltipTheme={"dark"}
      arrow={true}
      // Arrow always points at the icon, so shift the box to put the arrow 25% in
      popperOptions={{ modifiers: { offset: { offset: "25%p" } } }}
      // Inline 20px-tall trigger so the icon centres on the text line it trails
      style={{ display: "inline-flex", alignItems: "center", height: "20px", verticalAlign: "top", marginLeft: "4px" }}
    >
      <InfoCircleIcon stroke={theme.hexColors.black[600]} />
    </Tooltip>
  ) : null;

  const guidanceToggle = (
    <span
      className={"inline-flex items-center h-5 align-top ml-1 cursor-pointer"}
      onClick={() => setIsGuidanceExpanded((isExpanded) => !isExpanded)}
    >
      <Typography
        text={isGuidanceExpanded ? Locale.reuploadNoteSeeLess : Locale.reuploadNoteSeeMore}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.SMALL}
        fontWeight={700}
        textClasses={"!text-navyblue-400 underline !text-paraxsmall !leading-5 whitespace-nowrap"}
      />
      <ChevronRightIcon
        stroke={theme.hexColors.navyblue[400]}
        className={isGuidanceExpanded ? "-rotate-90" : "rotate-90"}
      />
    </span>
  );

  return (
    <div className={"flex flex-col gap-2.5"}>
      <div className={"flex flex-row items-start gap-2"}>
        <div className={"flex items-center justify-center w-4 h-4 my-0.5 rounded-full bg-yellow-50 shrink-0"}>
          <div className={"w-1.5 h-1.5 rounded-full bg-yellow-400"} />
        </div>
        <div className={"flex flex-col flex-1"}>
          <SegmentedLine segments={segments} sizeClasses={"!text-parasmall !leading-5"} />
          {descriptionSegments?.length ? (
            <SegmentedLine segments={descriptionSegments} sizeClasses={"!text-paraxsmall !leading-5"}>
              {hasGuidance ? (isMobile ? guidanceToggle : guidanceTooltip) : null}
            </SegmentedLine>
          ) : null}
        </div>
      </div>
      {isMobile && isGuidanceExpanded && guidanceLines ? (
        // One sentence sits indented under the text column; bullets take the full row width
        <div
          className={classNames(
            "rounded-8px bg-black-50",
            hasMultipleGuidanceLines ? "p-2" : "ml-6 px-2 py-1 leading-5"
          )}
        >
          <GuidanceLines
            lines={guidanceLines}
            sizeClasses={hasMultipleGuidanceLines ? "!text-paraxsmall !leading-4" : "!text-paraxsmall !leading-5"}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ReuploadNote;
