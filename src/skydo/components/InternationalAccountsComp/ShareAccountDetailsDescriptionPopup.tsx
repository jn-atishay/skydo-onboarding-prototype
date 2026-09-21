import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Button from "../AtomicComponents/Button";
import Image from "next/image";
import { JSX } from "@babel/types";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import { SHARE_DETAILS_STATE } from "../../constants/publicBankAccountCardConstants";
import classNames from "classnames";
import useInternationalAccountsEventsInfo from "../../util/customHooks/useInternationalAccountsEventsInfo";
import { LOCATION_CODE } from "../../constants/dashboardConstants";

interface Props {
  link: string;
  confirmingLogo?: boolean;
  renderCTAs?: () => JSX.Element;
  setShareDetailsState: (shareDetailsState: string) => void;
  logoImageUrl?: string;
  businessName: string;
  previewImage: string;
  isFileUploadLoading?: boolean;
  previewLocation?: string;
}

const ShareAccountDetailsDescriptionPopup = (props: Props) => {
  const {
    link,
    confirmingLogo,
    renderCTAs,
    setShareDetailsState,
    logoImageUrl,
    businessName,
    previewImage,
    isFileUploadLoading,
    previewLocation,
  } = props;
  const logoExists = !!logoImageUrl;
  const isRowSharePreview = previewLocation === LOCATION_CODE.ROW;
  const showAddLogoStrip = !confirmingLogo && !logoExists && !isFileUploadLoading;
  const squareBottomWhenRowAddLogoStrip = isRowSharePreview && showAddLogoStrip;
  const analytics = useAnalytics();
  const eventProps = useInternationalAccountsEventsInfo();

  return (
    <>
      <div className={"flex-1 overflow-auto"}>
        <div className={"rounded-t-10px bg-blue-50 mt-6"}>
          {!confirmingLogo ? (
            <div className={"flex flex-row justify-center"}>
              <Typography
                text={Locale.thisIsClientSeeText}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"py-3 mr-1"}
              />
              <Typography
                text={Locale.previewFullPageText}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"py-3 !text-blue-400 cursor-pointer mr-1"}
                onTextClick={() => {
                  analytics?.trackAsync(Events.INTERNATIONAL_ACCOUNTS_SHARE_PREVIEW_CLICK, { ...eventProps });
                  window.open(link, "_blank", "noopener noreferrer");
                }}
              />
              {logoExists ? (
                <Typography
                  text={Locale.editLogoText}
                  type={TYPOGRAPHY_TYPES.LABEL}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"py-3 !text-blue-400 cursor-pointer"}
                  onTextClick={() => {
                    setShareDetailsState(SHARE_DETAILS_STATE.UPLOAD_PAGE);
                    analytics?.trackAsync(Events.EDIT_LOGO_CLICK, {
                      location: "international_accounts_share",
                      ...eventProps,
                    });
                  }}
                />
              ) : null}
            </div>
          ) : (
            <div className={"flex justify-center"}>
              <Typography
                text={Locale.previewLogoTextBeforeConfirm}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"py-3"}
              />
            </div>
          )}
        </div>

        <div className={"bg-black-50 pt-7"}>
          <div
            className={classNames("flex flex-col shadow-headerShadow", {
              "overflow-hidden rounded-b-lg": isRowSharePreview && !squareBottomWhenRowAddLogoStrip,
            })}
          >
            <div className={"rounded-t-10px bg-white py-4"}>
              <div className={"flex flex-row ml-4"}>
                {logoImageUrl && (
                  <div className={"mr-2.5"}>
                    <div className="h-[32px]">
                      <img src={logoImageUrl} alt="Icon" className="object-contain w-full h-full" />
                    </div>
                  </div>
                )}
                <div className={"flex flex-col"}>
                  <Typography text={businessName} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.SMALL} />
                  <Typography
                    text={"Bank account details"}
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.X_X_SMALL}
                  />
                </div>
              </div>
            </div>
            <hr className={"border-black-400"} />
            <div
              className={classNames("w-full h-[161px] relative bg-white", {
                "!h-[302px]": confirmingLogo,
              })}
            >
              <Image src={previewImage} layout={"fill"} objectFit={"contain"} />
            </div>
          </div>
        </div>

        {showAddLogoStrip ? (
          <div className={"rounded-b-lg bg-yellow-200 px-2"}>
            <div className={"flex flex-row justify-center py-2 items-center"}>
              <Typography
                text={Locale.addLogoText}
                type={TYPOGRAPHY_TYPES.LABEL}
                size={TYPOGRAPHY_SIZES.SMALL}
                textClasses={"mr-2 flex-3"}
              />
              <Button
                title={Locale.addLogoButtonText}
                size={BUTTON_SIZES.SMALL}
                onButtonClick={() => {
                  setShareDetailsState(SHARE_DETAILS_STATE.UPLOAD_PAGE);
                  analytics?.trackAsync(Events.LOGO_UPLOAD_CLICK, {
                    location: "international_accounts_share",
                    ...eventProps,
                  });
                }}
                buttonClass={"flex-1"}
              />
            </div>
          </div>
        ) : null}
      </div>
      {renderCTAs ? renderCTAs() : null}
    </>
  );
};
export default ShareAccountDetailsDescriptionPopup;
