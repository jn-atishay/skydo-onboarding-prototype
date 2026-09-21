import React from "react";
import Image from "next/image";
import {
  BUTTON_SIZES,
  BUTTON_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import {
  NEW_IMPORTER_OFFER_BODY_SRC,
  NEW_IMPORTER_OFFER_CLIENT_CAP,
} from "../../constants/bannerConstants";
import Locale from "../../util/locale/en";
import { formatDateShortComma } from "../../util/formatters";
import { NewImporterOfferData } from "../../types/BannerTypes";
import Button from "../AtomicComponents/Button";
import Typography from "../AtomicComponents/Typography";
import CrossIconFX from "../Icons/CrossIconFX";
import CloseLineIcon from "../Icons/CloseLineIcon";
import OfferRibbonIcon from "../Icons/OfferRibbonIcon";

const BANNER_QUERY_CONTAINER: React.CSSProperties = {
  containerType: "inline-size",
} as React.CSSProperties;
const STRIP_SCALE: React.CSSProperties = { fontSize: "1cqw" };
const CTA_SCALE: React.CSSProperties = { fontSize: "1.37cqw" };
const STRIP_LABEL_PROPS = { fontSize: "0.945em", letterSpacing: "0.136em", lineHeight: "1.2" };
const STRIP_DATE_PROPS = { fontSize: "1.117em", lineHeight: "1.2" };
const STRIP_DOT_PROPS = { fontSize: "0.86em", lineHeight: "1.2" };
const NEAR_CAP_TEXT_PROPS = { fontSize: "1.203em", lineHeight: "1.2" };

interface ImporterExpandedBodyProps {
  offer: NewImporterOfferData;
  onShare: () => void;
  onSkip: () => void;
  topRightExtra?: React.ReactNode;
  plainDismiss?: boolean;
  priority?: boolean;
}

const ImporterExpandedBody = ({
  offer,
  onShare,
  onSkip,
  topRightExtra,
  plainDismiss,
  priority,
}: ImporterExpandedBodyProps) => {
  const { isExpiringSoon, isNearCap, expiryDate } = offer;
  const validTill = Locale.newImporterOfferValidTill.replace(
    ":date",
    formatDateShortComma(expiryDate)
  );

  const stripSegments = isNearCap
    ? [
        ...(isExpiringSoon ? [Locale.newImporterOfferEndingSoon] : []),
        Locale.newImporterOfferNearCap.replace(":cap", String(NEW_IMPORTER_OFFER_CLIENT_CAP)),
        validTill,
      ]
    : [isExpiringSoon ? Locale.newImporterOfferEndingSoon : Locale.newImporterOfferExclusive, validTill];

  const stripBody = isNearCap
    ? stripSegments.map((segment, index) => (
        <React.Fragment key={segment}>
          {index > 0 && (
            <Typography
              text="•"
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses="!text-black-700/40"
              textProps={NEAR_CAP_TEXT_PROPS}
            />
          )}
          <Typography
            text={segment}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={700}
            textClasses="whitespace-nowrap !text-black-700"
            textProps={NEAR_CAP_TEXT_PROPS}
          />
        </React.Fragment>
      ))
    : stripSegments.map((segment, index) => (
        <React.Fragment key={segment}>
          {index > 0 && (
            <Typography
              text="•"
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses="!text-white"
              textProps={STRIP_DOT_PROPS}
            />
          )}
          <Typography
            text={segment}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={index === 0 ? 800 : 700}
            textClasses="whitespace-nowrap !text-white"
            textProps={index === 0 ? STRIP_LABEL_PROPS : STRIP_DATE_PROPS}
          />
        </React.Fragment>
      ));

  return (
    <div
      className="relative w-full overflow-hidden rounded-10px aspect-[4/1]"
      style={BANNER_QUERY_CONTAINER}
    >
      <div className="absolute inset-0">
        <Image
          src={NEW_IMPORTER_OFFER_BODY_SRC}
          alt=""
          layout="fill"
          objectFit="cover"
          sizes="100vw"
          priority={priority}
        />
      </div>

      {isNearCap ? (
        <div
          className="absolute left-[16.15%] right-[16.15%] top-0 z-10 flex flex-row flex-wrap items-center justify-center gap-x-[0.86em] rounded-b-8px bg-yellow-400 px-[1em] py-[0.86em]"
          style={STRIP_SCALE}
        >
          {stripBody}
        </div>
      ) : (
        <div className="absolute left-[3.44%] top-0 z-10" style={STRIP_SCALE}>
          <div className="relative pb-[1.5em] pl-[1.1em] pr-[1.1em] pt-[0.97em]">
            <OfferRibbonIcon className="absolute inset-0 h-full w-full" />
            <div className="relative flex flex-row items-center gap-x-[0.5em]">{stripBody}</div>
          </div>
        </div>
      )}

      {plainDismiss ? (
        <div
          className="absolute right-[1.03em] top-[1.03em] z-20 flex flex-row items-center gap-x-[2.4em]"
          style={STRIP_SCALE}
        >
          {topRightExtra}
          <Button
            type={BUTTON_TYPES.TERTIARY}
            size={BUTTON_SIZES.X_SMALL}
            nativeType="button"
            onButtonClick={onSkip}
            buttonClass="!h-[2.75em] !w-[2.75em] !p-0 !bg-transparent hover:!bg-transparent focus:!bg-transparent"
            buttonProps={{ "aria-label": Locale.skip }}
            title={() => <CloseLineIcon stroke="#F6F9FC" width="2.06em" height="2.06em" />}
          />
        </div>
      ) : (
        <Button
          type={BUTTON_TYPES.TERTIARY}
          size={BUTTON_SIZES.X_SMALL}
          nativeType="button"
          onButtonClick={onSkip}
          buttonClass="!absolute top-3 right-3 z-20 !h-8 !w-8 !p-0 !bg-transparent hover:!bg-transparent focus:!bg-transparent"
          buttonProps={{ "aria-label": Locale.skip }}
          title={() => <CrossIconFX fill="#F0F3F7" />}
        />
      )}

      <div className="absolute left-[3.44%] top-[69.8%] z-10" style={CTA_SCALE}>
        <Button
          type={BUTTON_TYPES.SECONDARY}
          size={BUTTON_SIZES.MEDIUM}
          nativeType="button"
          onButtonClick={onShare}
          buttonClass="!h-auto !border-0 !rounded-[0.625em] !px-[1.5em] !py-[0.875em] shadow-sm"
          title={() => (
            <Typography
              text={Locale.newImporterOfferShareCta}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.MEDIUM}
              fontWeight={600}
              textClasses="!text-navyblue-500 whitespace-nowrap"
              textProps={{ fontSize: "1em", lineHeight: "1.25" }}
            />
          )}
        />
      </div>
    </div>
  );
};

export default ImporterExpandedBody;
