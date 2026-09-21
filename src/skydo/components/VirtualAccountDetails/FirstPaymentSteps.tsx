import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import {
  BUTTON_SIZES,
  TABS_SIZES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import UserStateIcon from "../Common/UserStateIcon";
import classNames from "classnames";
import classnames from "classnames";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../../context/AppContext";
import useToastMessages from "../../store/toastMessages";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";
import {
  ACCOUNTS_TYPE,
  ALLOWED_FREELANCER_PLATFORMS,
  ALLOWED_IMPORTER_LOCATION,
  FREELANCER_PLATFORM_CODE,
  LOCATION_CODE,
  LOCATION_CURRENCY_DETAILS_MAP,
} from "../../constants/dashboardConstants";
import DropdownArrow from "../Common/DropdownArrow";
import FE_ROUTES from "../../util/feRoutes";
import ImporterLocationVsIconComp from "../Common/ImporterLocationVsIconComp";
import AccountIcon from "../Icons/AccountIcon";
import GlobeIcon from "../Icons/GlobeIcon";
import SampleTracker from "../SampleTracker";
import { useRouter } from "next/router";
import RightArrowIcon from "../Icons/RightArrowIcon";
import UploadInvoiceButton from "../../containers/UploadInvoiceContainer/UploadInvoiceButton";
import Tabs from "../AtomicComponents/Tabs";
import Deelicon from "../Icons/DeelIcon";
import UpworkIcon from "../Icons/UpworkIcon";
import FreelancerIcon from "../Icons/FreelancerIcon";
import ToptalIconLarge from "../Icons/ToptalIconLarge";
import { INDIVIDUAL_BUSINESSES } from "../../constants/onboarding";
import useUserData from "../../store/useUserData";
import PdfPreviewPopup from "../Common/RenderPdf/PdfPreviewPopup";
import useBannersStore from "../../store/useBannersStore";
import AmazonIcon from "../Icons/AmazonIcon";

interface PaymentStepsProps {
  renderHeader: string | (() => JSX.Element);
  renderBody?: () => JSX.Element;
  renderSubtitle?: string | (() => JSX.Element) | null;
  index: number;
  isLast?: boolean;
  isOpen?: boolean;
}

interface LocationCardProps {
  location: string;
}

const LocationCard: React.FC<LocationCardProps> = (props: LocationCardProps) => {
  const { location } = props;
  const { theme } = useContext(AppContext);
  const router = useRouter();
  const onCardClick = () => router.push(`${FE_ROUTES.INTERNATIONAL_ACCOUNTS}?location=${location}`);
  return (
    <div
      className={
        "flex p-4 pl-6 shadow-headerShadow border border-white rounded-10px min-w-[279px] cursor-pointer hover:shadow-white hover:border hover:border-blue-400"
      }
      onClick={onCardClick}
    >
      <ImporterLocationVsIconComp location={location} width={40} height={40} />
      <div className={"ml-3"}>
        <Typography
          text={LOCATION_CURRENCY_DETAILS_MAP[location as keyof typeof LOCATION_CURRENCY_DETAILS_MAP].displayHeader}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!text-blue-400 block"}
        />
        {location == LOCATION_CODE.ROW ? null : (
          <div className={"flex items-center mt-0.5"}>
            <AccountIcon width={16} height={16} defaultStroke={theme.hexColors.black[500]} containerClass={"inline"} />
            <Typography
              text={Locale.localCurrencyAccount.replace(
                ":currency",
                LOCATION_CURRENCY_DETAILS_MAP[location as keyof typeof LOCATION_CURRENCY_DETAILS_MAP].currency
              )}
              size={TYPOGRAPHY_SIZES.SMALL}
              textClasses={"!text-black-500 ml-1"}
            />
          </div>
        )}
        <div className={"flex items-center"}>
          <GlobeIcon width={16} height={16} stroke={theme.hexColors.black[500]} containerClass={"inline"} />
          <Typography text={Locale.swiftAccount} size={TYPOGRAPHY_SIZES.SMALL} textClasses={"!text-black-500 ml-1"} />
        </div>
      </div>
    </div>
  );
};

const FREELANCER_ICON_MAP = {
  [FREELANCER_PLATFORM_CODE.DEEL]: <Deelicon width={83} height={30} />,
  // [FREELANCER_PLATFORM_CODE.REMOTE]: <RemoteIcon height={30} width={155} />,
  [FREELANCER_PLATFORM_CODE.UPWORK]: <UpworkIcon height={30} width={100} />,
  [FREELANCER_PLATFORM_CODE.FREELANCER]: <FreelancerIcon />,
  [FREELANCER_PLATFORM_CODE.TOPTAL]: <ToptalIconLarge />,
  [FREELANCER_PLATFORM_CODE.AMAZON]: <AmazonIcon height={32} width={102} />,
};

const PlatformCard = (props: { platform: string }) => {
  const { platform } = props;
  const router = useRouter();
  const onCardClick = () =>
    router.push(FE_ROUTES.PLATFORM_WITHDRAWALS_DETAILS.replace("[platform]", platform.toLowerCase()));
  return (
    <div
      className={
        "items-center justify-center flex shadow-headerShadow border border-white rounded-10px cursor-pointer hover:shadow-white hover:border hover:border-blue-400 min-w-[155px] h-[94px]"
      }
      onClick={onCardClick}
    >
      {FREELANCER_ICON_MAP[platform]}
    </div>
  );
};

const PaymentSteps = (props: PaymentStepsProps) => {
  const { renderHeader, renderSubtitle, renderBody, index, isLast } = props;

  return (
    <div className={classnames("pl-32 pr-24 flex flex-row")}>
      <div
        className={classNames("relative flex flex-col", {
          "border-l-2 border-black-400 pb-12 border-dashed w-full": !isLast,
        })}
      >
        <UserStateIcon isCurrentState={true} containerClass={"!bg-black-700 !top-0 !p-0 w-13 h-13 shadow-stateIcon"}>
          <div className={"flex flex-col items-center justify-center"}>
            <Typography text={Locale.step} size={TYPOGRAPHY_SIZES.X_SMALL} textClasses={"!text-white"} />
            <Typography
              text={index + 1}
              size={TYPOGRAPHY_SIZES.LARGE}
              textClasses={"!text-white -mt-1"}
              type={TYPOGRAPHY_TYPES.LABEL}
            />
          </div>
        </UserStateIcon>
        <div className={"flex flex-col ml-16"}>
          {renderHeader ? (
            <div>
              {typeof renderHeader === "string" ? (
                <Typography text={renderHeader} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.LARGE} />
              ) : (
                renderHeader()
              )}
            </div>
          ) : null}
          {renderSubtitle ? (
            <div className={"mt-0.5"}>
              {typeof renderSubtitle === "string" ? (
                <Typography
                  text={renderSubtitle}
                  type={TYPOGRAPHY_TYPES.PARA}
                  size={TYPOGRAPHY_SIZES.SMALL}
                  textClasses={"!text-black-500"}
                />
              ) : (
                renderSubtitle()
              )}
            </div>
          ) : null}
          {renderBody ? <div className={"mt-4 mb-2"}>{renderBody()}</div> : null}
        </div>
      </div>
    </div>
  );
};

interface Props {
  containerClass?: string;
  manualVerificationPending?: boolean;
}

const FirstPaymentSteps = (props: Props) => {
  const { containerClass, manualVerificationPending } = props;
  const { theme } = useContext(AppContext);
  const { addToast } = useToastMessages((state) => ({ addToast: state.addToast }));
  const analytics = useAnalytics();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [isSampleTrackerOpen, setIsSampleTrackerOpen] = useState<boolean>(false);
  const router = useRouter();
  const { businessType } = useUserData();
  const isIndividualBusiness = INDIVIDUAL_BUSINESSES.includes(businessType);
  const [selectedOption, setSelectedOption] = useState(
    isIndividualBusiness ? ACCOUNTS_TYPE.PLATFORM : ACCOUNTS_TYPE.LOCATION
  );
  const { bannerList } = useBannersStore();
  const isHidden = bannerList?.some((b) => b === "ONBOARDING" || b === "TEST_TRANSACTION");

  useEffect(() => {
    if (isHidden) {
      setIsOpen(false);
    }
  }, [isHidden]);

  const [viewPDF, setViewPDF] = useState(false);

  const onCopyInvoiceEmailClick = () => {
    navigator?.clipboard
      ?.writeText(Locale.sendInvoiceEmail)
      .then(() => {
        addToast({
          type: TOAST_TYPES.SUCCESS,
          id: "success_copied",
          body: Locale.copied,
          time: 2000,
        });
      })
      .catch(() => console.log("Error copying"))
      .finally(() => {
        analytics?.trackAsync(Events.COPY_INVOICE_EMAIL_CLICK);
      });
  };

  const renderSendInvoiceBody = () => {
    return (
      <>
        <div
          className={classNames("flex items-center gap-4 mt-2", {
            "mb-4": selectedOption === ACCOUNTS_TYPE.PLATFORM,
          })}
        >
          <UploadInvoiceButton buttonSize={BUTTON_SIZES.MEDIUM} />
          <Typography
            text={Locale.or}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.SMALL}
            textClasses={"!text-black-500"}
          />
          <div className={"h-12 px-2.5 py-4 flex flex-row items-center rounded-10px border border-black-400 w-fit"}>
            <Typography text={Locale.sendInvoiceEmail} type={TYPOGRAPHY_TYPES.LABEL} size={TYPOGRAPHY_SIZES.MEDIUM} />
            <Typography
              text={Locale.copy}
              onTextClick={onCopyInvoiceEmailClick}
              type={TYPOGRAPHY_TYPES.LABEL}
              textClasses={"!text-blue-400 !ml-14 cursor-pointer"}
              size={TYPOGRAPHY_SIZES.MEDIUM}
            />
          </div>
        </div>
        {selectedOption === ACCOUNTS_TYPE.PLATFORM && (
          <Typography
            onTextClick={() => {
              setViewPDF(true);
            }}
            text={Locale.viewReceiptSample}
            textClasses={"cursor-pointer text-blue-400"}
          />
        )}
      </>
    );
  };

  const renderLocationCards = () => {
    if (selectedOption === ACCOUNTS_TYPE.PLATFORM) {
      return (
        <div className={"flex flex-row flex-wrap gap-4"}>
          {ALLOWED_FREELANCER_PLATFORMS.filter((platformCode) => platformCode !== FREELANCER_PLATFORM_CODE.OTHERS).map(
            (platform) => (
              <PlatformCard key={`PlatformCard${platform}`} platform={platform} />
            )
          )}
        </div>
      );
    }

    const allowedLocations = ALLOWED_IMPORTER_LOCATION;
    
    return (
      <div className={"flex flex-row flex-wrap gap-4"}>
        {allowedLocations.map((location) => (
          <LocationCard key={`LocationCard${location}`} location={location} />
        ))}
      </div>
    );
  };

  const onViewTrackerClick = () => setIsSampleTrackerOpen(true);

  const renderSampleTrackerCTA = () => (
    <Typography
      text={Locale.viewSampleTracker}
      type={TYPOGRAPHY_TYPES.LABEL}
      size={TYPOGRAPHY_SIZES.MEDIUM}
      onTextClick={onViewTrackerClick}
      textClasses={"!text-blue-400 cursor-pointer"}
    />
  );

  const renderStep1Header = () => {
    const isPlatform = selectedOption === ACCOUNTS_TYPE.PLATFORM;
    return (
      <div className={"flex_row_item_center justify-between"}>
        <Typography
          text={isPlatform ? Locale.welcomeStep1TitlePlatform : Locale.welcomeStep1Title}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.LARGE}
        />
        <div
          className={"flex items-center cursor-pointer"}
          onClick={() => router.push(isPlatform ? FE_ROUTES.PLATFORM_WITHDRAWALS : FE_ROUTES.INTERNATIONAL_ACCOUNTS)}
        >
          <Typography
            text={Locale.viewAll}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!text-blue-400 !mr-1"}
          />
          <RightArrowIcon width={16} height={16} stroke={theme.hexColors.blue[400]} />
        </div>
      </div>
    );
  };

  const howItWorksMap = [
    {
      header: renderStep1Header,
      body: renderLocationCards,
    },
    {
      header:
        selectedOption === ACCOUNTS_TYPE.PLATFORM
          ? Locale.invoiceEmailFirstPaymentPlatform
          : Locale.invoiceEmailFirstPayment,
      renderSubtitle: selectedOption === ACCOUNTS_TYPE.PLATFORM ? null : Locale.invoiceEmailFirstPaymentSubtitle,
      body: renderSendInvoiceBody,
    },
    {
      header: Locale.firaAndReceiptTrackingHeader,
      body: renderSampleTrackerCTA,
    },
  ];

  const isBodyVisible = isOpen;

  const onHeaderClick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={classnames(
        "flex flex-col bg-white rounded-10px",
        {
          "pb-20": isBodyVisible,
        },
        containerClass
      )}
    >
      <div
        className={classnames("flex flex-row justify-between items-center cursor-pointer p-6")}
        onClick={onHeaderClick}
      >
        <div className={"flex flex-row"}>
          <div className={"w-1 h-7 bg-green-400 mr-3"} />
          <Typography
            text={manualVerificationPending ? Locale.howItWorksNewPostKYC : Locale.howItWorksNew}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={""}
          />
        </div>
        <DropdownArrow isOpen={isOpen} />
      </div>
      {isBodyVisible && (
        <>
          <hr className={"border-black-400 mb-10"} />
          <Tabs
            containerClass={"mb-10 mx-26"}
            size={TABS_SIZES.LARGE}
            options={[
              { heading: Locale.directlyFromClients, subText: Locale.directlyFromClientsSubText },
              { heading: Locale.integrateWithPlatform, subText: Locale.integrateWithPlatformSubtext },
            ]}
            selected={selectedOption}
            setSelected={setSelectedOption}
          />
          {howItWorksMap.map((accordion, index) => {
            const { header, body, renderSubtitle } = accordion;
            const isLast = index === howItWorksMap.length - 1;
            return (
              <PaymentSteps
                key={index}
                renderHeader={header}
                index={index}
                isLast={isLast}
                renderBody={body}
                renderSubtitle={renderSubtitle}
              />
            );
          })}
        </>
      )}
      <SampleTracker isOpen={isSampleTrackerOpen} closePopup={() => setIsSampleTrackerOpen(false)} />
      <PdfPreviewPopup
        showPreview={viewPDF}
        closePreview={() => {
          setViewPDF(false);
        }}
        url={"/sampleFreelancerReceipt.pdf"}
      />
    </div>
  );
};

export default FirstPaymentSteps;
