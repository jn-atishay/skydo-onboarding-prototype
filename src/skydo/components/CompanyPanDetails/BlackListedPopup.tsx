import React, { FC, useContext } from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import IncorrectPanIcon from "../Icons/IncorrectPanIcon";
import AuthHelper from "../../authentication/AuthHelper";
import Router from "next/router";
import Button from "../AtomicComponents/Button";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import AppContext from "../../context/AppContext";
import Popup from "../AtomicComponents/Popup";
import useArchiveOrBlacklistStore from "../../store/useArchiveOrBlacklistStore";
import useSkydoDetails from "../../util/customHooks/useSkydoDetails";

interface BlacklistedPopupProps {}

const BlackListedPopup: FC<BlacklistedPopupProps> = () => {
  const { theme } = useContext(AppContext);
  const { isArchiveOrBlacklistPopupOpen, setArchiveOrBlacklistPopup } = useArchiveOrBlacklistStore();
  const { skydoContact, skydoEmail } = useSkydoDetails();
  const onLogoutClick = async () => {
    await AuthHelper.logout();
  };

  const renderBlackListedPopup = () => (
    <div className={"flex flex-col gap-6 md:px-6"}>
      <div className={"flex flex-col gap-4 md:gap-6"}>
        <div className={"flex justify-end md:hidden"}>
          <div
            onClick={() => {
              setArchiveOrBlacklistPopup(false);
            }}
          >
            <CrossIcon stroke={theme.hexColors.black[500]} />
          </div>
        </div>
        <div className={"flex flex-col justify-between items-center"}>
          <IncorrectPanIcon />
          <Typography
            text={Locale.accountCanNotBeCreated}
            type={TYPOGRAPHY_TYPES.HEADING}
            size={TYPOGRAPHY_SIZES.SMALL}
            fontWeight={"bold"}
          />
        </div>
        <Typography
          text={Locale.blackListedPart1}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!text-center"}
        />
        <Typography
          text={Locale.blackListedPart2}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!text-center"}
        />
      </div>
      <div className={"border-b border-black-400"} />
      <div className={"flex flex-col gap-6 md:gap-4"}>
        <Button
          title={Locale.logout}
          buttonClass={"!w-full"}
          onButtonClick={() => {
            onLogoutClick();
          }}
        />
      </div>
      <div className={"hidden md:flex bg-blue-50 px-10 py-4 -mx-6"}>
        <Typography
          text={Locale.assistanceTextGeneric
            .replace("{{SkydoContact}}", skydoContact)
            .replace("{{SkydoEmail}}", skydoEmail)}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 text-center"}
        />
      </div>
    </div>
  );

  const outsideCLick = () => {
    setArchiveOrBlacklistPopup(false);
    Router.reload();
  };

  return (
    <Popup
      renderContent={renderBlackListedPopup}
      open={isArchiveOrBlacklistPopupOpen}
      outsideClick={() => outsideCLick()}
      containerClass={"!pb-0 !px-0 !w-[448px]"}
    />
  );
};

export default BlackListedPopup;
