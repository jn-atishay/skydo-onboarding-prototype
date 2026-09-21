/**
 * @author Raj Sheth
 * created: 10/07/23
 */

import React, { FC, useEffect } from "react";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Image from "next/image";

interface LoginFooterProps {}

export const BackgroundImage = () => {
  return (
    <div className="fixed top-0 left-0 w-full h-full -z-1">
      <Image src="/bg-image-login.png" layout="fill" objectFit="cover" />
    </div>
  );
};

const LoginFooter: FC<LoginFooterProps> = (props) => {
  const analytics = useAnalytics();
  const ppClick = async () => {
    analytics?.trackAsync(Events.PP_CLICK, {
      page: "login",
    });
  };

  return (
    <div className={"flex mt-8 justify-between p-1"}>
      <a href="https://www.skydo.com/privacy-policy" rel="noopener noreferrer" target="_blank">
        <Typography
          text={Locale.policy}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500"}
          onTextClick={ppClick}
        />
      </a>
      <Typography
        text={Locale.copyright.replace(":year", String(new Date().getFullYear()))}
        type={TYPOGRAPHY_TYPES.PARA}
        size={TYPOGRAPHY_SIZES.SMALL}
        textClasses={"!text-black-500 pt-1"}
      />
    </div>
  );
};

export default LoginFooter;
