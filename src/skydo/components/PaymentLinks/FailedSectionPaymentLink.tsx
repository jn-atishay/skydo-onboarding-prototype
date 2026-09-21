import React from "react";
import { useRouter } from "next/router";
import { FailureReasonDto } from "./PaymentLinksList";
import Typography from "../AtomicComponents/Typography";
import Button from "../AtomicComponents/Button";
import { BUTTON_SIZES, BUTTON_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import FE_ROUTES from "../../util/feRoutes";
import ExclamationIcon from "../Icons/ExclamationIcon";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";

interface FailedSectionPaymentLinkProps {
  failureReason?: FailureReasonDto;
  settlementReference?: string;
  isMobile?: boolean;
  showPaymentLinkButton?: boolean;
  source?: string;
}

const FailedSectionPaymentLink = (props: FailedSectionPaymentLinkProps) => {
  const { failureReason, settlementReference, isMobile, showPaymentLinkButton = true } = props;
  const router = useRouter();
  const analytics = useAnalytics();

  if (!failureReason && !isMobile) {
    return null;
  }

  const handleCreateInstaLink = () => {
    analytics.trackAsync(Events.PAYPAL.CREATE_PAYMENT_LINK_CTA_CLICKED, { source: props.source })
    router.push(FE_ROUTES.CREATE_PAYMENT_LINK);
  };

  if(isMobile) {
    return (
      <div className="flex flex-col py-3.5 px-4 bg-orange-50 rounded-10px">
        {/* Payment status: Failed */}
        <div className="flex flex-row gap-1 items-center">
          <Typography
            text="Payment status:"
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
          />
          <Typography
            text="Failed"
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses="!text-red-400"
            fontWeight="700"
          />
        </div>

         {/*Reason */}
        <div className="mt-2">
          {failureReason ? (
            failureReason.title ? (
              <div className="flex flex-col">
                <div className="flex flex-row items-start gap-1">
                  <Typography
                    text="Reason:"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                  />
                  <Typography
                    text={failureReason.title}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.SMALL}
                    fontWeight="700"
                  />
                </div>
                <Typography
                  text={failureReason.text}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                />
              </div>
            ) : (
              <div>
                <span className="text-xs">
                  <span>Reason: </span>
                  <span>{failureReason.text}</span>
                </span>
              </div>
            )
          ) : (
            <div>
              <span className="text-xs">
                <span>Reason: </span>
                <span>{"{}"}</span>
              </span>
            </div>
          )}
        </div>

        {/* Settlement reference */}
        {settlementReference && (
          <div className="flex flex-row gap-1 items-center mt-4">
            <Typography
              text="Settlement reference:"
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              textClasses="!text-black-500"
              fontWeight="600"
            />
            <Typography
              text={settlementReference}
              type={TYPOGRAPHY_TYPES.LABEL}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              fontWeight="600"
            />
          </div>
        )}

        {/* HR Line */}
        <hr className="border-t border-gray-200 my-3" />

        {/* Info message */}
        <div className="flex flex-row items-start gap-2">
          <ExclamationIcon width={20} height={20} type="outline" className="pt-2"/>
          <div>
            <span className="text-xs">
              <span>Please log in on your desktop at </span>
              <a href="https://dashboard.skydo.com" className="text-black underline">dashboard.skydo.com</a>
              <span> to create a new link and retry</span>
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-6 bg-orange-50 rounded-[10px] border border-orange-200">
      {/* Status: Failed */}
      <div className="flex flex-row justify-between">
        <div className="flex flex-row gap-1 items-center">
        <Typography
          text={settlementReference ? "Payment status:" : "Status:"}
          type={TYPOGRAPHY_TYPES.PARA}
          size={settlementReference ? TYPOGRAPHY_SIZES.MEDIUM : TYPOGRAPHY_SIZES.SMALL}
        />
        <Typography
          text={"Failed"}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={settlementReference ? TYPOGRAPHY_SIZES.MEDIUM : TYPOGRAPHY_SIZES.SMALL}
          textClasses="!text-red-400"
        />
        </div>
        {settlementReference && <div className="flex flex-col items-end gap-1">
          <Typography
            text="Settlement reference"
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses="!text-black-500"
          />
          <Typography
            text={settlementReference}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses="!text-black-700"
            fontWeight="600"
          />
        </div>}
      </div>

      {/* Reason */}
      {failureReason ? (
        failureReason.title ? (
          <div className="flex flex-col gap-1">
            <div className="flex flex-row items-start gap-1">
              <Typography
                text="Reason:"
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
              />
              <Typography
                text={failureReason.title}
                type={TYPOGRAPHY_TYPES.PARA}
                size={TYPOGRAPHY_SIZES.SMALL}
                fontWeight="700"
              />
            </div>
            <Typography
              text={failureReason.text}
              type={TYPOGRAPHY_TYPES.PARA}
              size={TYPOGRAPHY_SIZES.SMALL}
            />
          </div>
        ) : (
          <div>
            <span className="text-sm">
              <span>Reason: </span>
              <span>{failureReason.text}</span>
            </span>
          </div>
        )
      ) : (
        <div>
          <span className="text-sm">
            <span>Reason: </span>
            <span>{"{}"}</span>
          </span>
        </div>
      )}

      {/* Create InstaLink Button */}
      {showPaymentLinkButton && <Button
        title="Create InstaLink"
        type={BUTTON_TYPES.PRIMARY}
        size={BUTTON_SIZES.SMALL}
        onButtonClick={handleCreateInstaLink}
      />}
    </div>
  );
};

export default FailedSectionPaymentLink;