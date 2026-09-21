import classNames from "classnames";
import { useContext } from "react";
import Typography from "../AtomicComponents/Typography";
import ExclamationIcon from "../Icons/ExclamationIcon";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import AppContext from "../../context/AppContext";

/** `publicAccount` — public share link / account card. `shareEmailPreview` — international accounts “Share via email” preview. */
export type PublicRestOfWorldRemarkBannerVariant = "publicAccount" | "shareEmailPreview";

export interface PublicRestOfWorldRemarkBannerProps {
  /** When true, only bottom corners are rounded (banner sits under a card or preview image). */
  roundedBottomOnly?: boolean;
  /** When another block sits directly below, omit bottom radius so it meets flush (e.g. add-logo strip). */
  squareBottom?: boolean;
  /** Flatten top corners so the banner meets a block above with no gap (e.g. email account card). */
  squareTop?: boolean;
  /**
   * Layout and typography for the surface where the banner appears.
   * @see https://www.figma.com/design/9pShiFkPjZcxfZkwG3NRHK/Rest-of-the-world-account----Changes — share email preview
   */
  variant?: PublicRestOfWorldRemarkBannerVariant;
  className?: string;
}

const PublicRestOfWorldRemarkBanner = ({
  roundedBottomOnly = true,
  squareBottom = false,
  squareTop = false,
  className,
  variant = "publicAccount",
}: PublicRestOfWorldRemarkBannerProps) => {
  const { theme } = useContext(AppContext);
  const isShareEmailPreview = variant === "shareEmailPreview";
  const baseText = isShareEmailPreview
    ? "!text-neutral-700 !text-xs !leading-none !tracking-normal"
    : "!text-neutral-700 !text-base !leading-5 !tracking-normal";
  const boldWeight = "!font-bold";
  const bodyWeight = isShareEmailPreview ? "!font-normal" : "!font-light";

  const radiusClass = squareBottom
    ? ""
    : roundedBottomOnly
    ? classNames("rounded-b-10px", squareTop && "rounded-t-none")
    : classNames("rounded-10px", squareTop && "rounded-t-none");

  return (
    <div
      className={classNames(
        "bg-alert-200",
        isShareEmailPreview
          ? "flex w-full items-center justify-center px-6 py-2"
          : "flex flex-row items-center gap-2.5 px-6 py-4",
        radiusClass,
        className
      )}
    >
      {!isShareEmailPreview ? (
        <ExclamationIcon width={24} height={24} className="shrink-0" fillcolor={theme?.hexColors?.yellow?.[400]} />
      ) : null}
      <div className={classNames(isShareEmailPreview ? "inline-block max-w-full text-left" : "flex-1")}>
        <Typography
          text={Locale.intAccountPage.publicRowTransferRemarkImportant}
          type={TYPOGRAPHY_TYPES.PARA}
          size={isShareEmailPreview ? TYPOGRAPHY_SIZES.X_SMALL : TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={classNames(baseText, boldWeight)}
        >
          <Typography
            text={` ${Locale.intAccountPage.publicRowTransferRemarkBody}`}
            type={TYPOGRAPHY_TYPES.PARA}
            size={isShareEmailPreview ? TYPOGRAPHY_SIZES.X_SMALL : TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={classNames(baseText, bodyWeight)}
          >
            <Typography
              text={Locale.intAccountPage.publicRowTransferRemarkQuoted}
              type={TYPOGRAPHY_TYPES.PARA}
              size={isShareEmailPreview ? TYPOGRAPHY_SIZES.X_SMALL : TYPOGRAPHY_SIZES.MEDIUM}
              textClasses={classNames(baseText, boldWeight)}
            />
          </Typography>
        </Typography>
      </div>
    </div>
  );
};

export default PublicRestOfWorldRemarkBanner;
