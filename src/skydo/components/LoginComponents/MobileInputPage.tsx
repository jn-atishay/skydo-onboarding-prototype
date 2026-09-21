/**
 * @author Raj Sheth
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import dynamic from "next/dynamic";
import Image from "next/image";
import ToastMessages from "../AtomicComponents/ToastMessages";
import SkydoLogoBig from "../Icons/SkydoLogoBig";
import MobileInputComp from "./MobileInputComp";
import LoginFooter, { BackgroundImage } from "./LoginFooter";
import MobileInputPageForMobile from "./MobileComponents/MobileInputPageForMobile";
import useReferralStore from "../../store/useReferralStore";
import { getReferralData } from "../../authentication/ReferralManagement";
const ReferralLoginLeftSection = dynamic(() => import("../ReferralLoginLeftSection"), { ssr: false });

const MobileInputPage = ({ refetchData }: { refetchData: () => void }) => {
  const router = useRouter();
  const { fetchReferrerDataViaCode } = useReferralStore();
  const [isReferred, setIsReferred] = useState(false);
  const [logOutPopUpVisible, setLogOutPopUpVisible] = useState(false);
  const [mobile, setMobile] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);
  const [isContinueLoading, setIsContinueLoading] = useState(false);

  useEffect(() => {
    fetchReferrerDataViaCode();
    const referralData = getReferralData(null);
    if (referralData?.referralCode) {
      setIsReferred(true);
    }
  }, []);

  const mobileInputForm = (
    <div>
      <MobileInputComp
        goToNextStep={() => {
          refetchData();
        }}
        logOutPopUpVisible={logOutPopUpVisible}
        setLogOutPopUpVisible={setLogOutPopUpVisible}
        mobile={mobile}
        setMobile={setMobile}
        phoneError={phoneError}
        setPhoneError={setPhoneError}
        isLogoutLoading={isLogoutLoading}
        setIsLogoutLoading={setIsLogoutLoading}
        isContinueLoading={isContinueLoading}
        setIsContinueLoading={setIsContinueLoading}
        isReferred={isReferred}
      />
      <LoginFooter />
    </div>
  );

  return (
    <>
      <MobileInputPageForMobile
        goToNextStep={() => {
          refetchData();
        }}
        logOutPopUpVisible={logOutPopUpVisible}
        setLogOutPopUpVisible={setLogOutPopUpVisible}
        mobile={mobile}
        setMobile={setMobile}
        phoneError={phoneError}
        setPhoneError={setPhoneError}
        isLogoutLoading={isLogoutLoading}
        setIsLogoutLoading={setIsLogoutLoading}
        isContinueLoading={isContinueLoading}
        setIsContinueLoading={setIsContinueLoading}
        isReferred={isReferred}
      />
      {isReferred ? (
        <div className={"hidden md:!flex flex-1 items-center h-full"}>
          <div className={"relative overflow-hidden basis-1/2 flex items-center justify-center h-full"}>
            <Image
              src={"/bg-image-referral-login.png"}
              layout={"fill"}
              objectFit={"cover"}
              className={"-z-1"}
              alt={""}
            />
            <ReferralLoginLeftSection />
          </div>
          <div className={"basis-1/2 bg-white flex items-center justify-center h-full"}>
            {mobileInputForm}
            <ToastMessages />
          </div>
        </div>
      ) : (
        <div className={"w-full justify-center flex-1 pt-13 py-12 hidden md:!flex"}>
          <BackgroundImage />
          <div className={"flex items-center"}>
            <div className={"flex items-center justify-center"}>
              <div className={"pr-40"}>
                <SkydoLogoBig />
              </div>
              {mobileInputForm}
            </div>
            <ToastMessages />
          </div>
        </div>
      )}
    </>
  );
};

export default MobileInputPage;
