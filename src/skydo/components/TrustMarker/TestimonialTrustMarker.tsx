/**
 * @author Raj Sheth
 * created: 01/12/23
 */

import React, { ReactElement, useContext } from "react";
import AppContext from "../../context/AppContext";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import FullTick from "../Icons/FullTick";
import classNames from "classnames";
import ToptalIcon from "../Icons/ToptalIcon";
import UpworkIcon from "../Icons/UpworkIcon";
import RemoteIcon from "../Icons/RemoteIcon";
import DeelIcon from "../Icons/DeelIcon";
import Founder1Icon from "../Icons/Founder1Icon";
import Founder2Icon from "../Icons/Founder2Icon";
import useUserData from "../../store/useUserData";
import { BUSSINESS_TYPES } from "../../constants/onboarding";
import Image from "next/image";

type Benefit =
  | {
      text: string;
    }
  | {
      jsx: () => ReactElement;
    };

type BenefitMap = { [key: string]: Benefit[] };
const individualBizBenefits: Benefit[] = [
  {
    text: Locale.liveFxRatesWithZeroMarginText,
  },
  {
    text: Locale.instantFira,
  },
  {
    jsx: () => (
      <div>
        <Typography
          text={Locale.compatibleWithTopPlatforms}
          textClasses={"ml-2 !text-black-600"}
          size={TYPOGRAPHY_SIZES.SMALL}
          type={TYPOGRAPHY_TYPES.PARA}
        />
        <div className={"flex flex-row items-center"}>
          <ToptalIcon />
          <UpworkIcon />
          <RemoteIcon />
          <DeelIcon />
        </div>
      </div>
    ),
  },
];
const defaultBenefits: Benefit[] = [
  {
    text: Locale.liveFxRatesWithZeroMarginText,
  },
  {
    text: Locale.instantFira,
  },
  {
    text: Locale.freeIntlAccounts,
  },
];

const BENEFITS: BenefitMap = {
  [BUSSINESS_TYPES.FREELANCER]: individualBizBenefits,
  [BUSSINESS_TYPES.PROPRIETORSHIP]: individualBizBenefits,
  [BUSSINESS_TYPES.PARTNERSHIP]: defaultBenefits,
};

const BenefitLine = ({ text, classes = "", jsx }: { text?: string; classes?: string; jsx?: () => ReactElement }) => {
  const { theme } = useContext(AppContext);

  return (
    <div className={classNames("flex flex-row", classes)}>
      <FullTick
        tickColor={theme.hexColors.green[400]}
        bgColor={theme.hexColors.green[400]}
        fill={theme.hexColors.black[100]}
        width={24}
        height={24}
      />
      {jsx && typeof jsx === "function" ? (
        jsx()
      ) : (
        <Typography
          text={text ? text : ""}
          textClasses={"ml-2 !text-black-600"}
          size={TYPOGRAPHY_SIZES.SMALL}
          type={TYPOGRAPHY_TYPES.PARA}
        />
      )}
    </div>
  );
};

interface Props {}

interface TestimonialData {
  reviewLine: string;
  founder: string;
  company: string;
}

export const TestimonialTrustMarkerMobile = () => {
  return (
    <div className={"flex flex-col rounded-10px bg-white px-4 pb-2 border-black-400 border"}>
      <div>
        <Typography
          text={Locale.testimonialLine2}
          textClasses={"!text-black-600"}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          type={TYPOGRAPHY_TYPES.PARA}
        />
      </div>
      <div className={"mt-1 ml-1 flex flex-row items-center"}>
        <div className={"relative w-8 h-8"}>
          <Image src={"/founderTwo.png"} layout={"fill"} objectFit={"contain"} />
        </div>
        <div className={"ml-3"}>
          <div className={"h-5"}>
            <Typography
              text={Locale.testimonialFounder2}
              textClasses={"!text-black-500"}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              type={TYPOGRAPHY_TYPES.PARA}
            />
          </div>
          <div className={"h-5"}>
            <Typography
              text={Locale.testimonialCompany2}
              textClasses={"!text-black-500"}
              size={TYPOGRAPHY_SIZES.X_SMALL}
              type={TYPOGRAPHY_TYPES.PARA}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const TestimonialTrustMarker = (props: Props) => {
  const { businessType } = useUserData();

  const testimonialData: TestimonialData =
    businessType === BUSSINESS_TYPES.FREELANCER
      ? {
          reviewLine: Locale.testimonialLine1,
          founder: Locale.testimonialFounder1,
          company: Locale.testimonialCompany1,
        }
      : {
          reviewLine: Locale.testimonialLine2,
          founder: Locale.testimonialFounder2,
          company: Locale.testimonialCompany2,
        };

  const benefitList = BENEFITS[businessType] || defaultBenefits;

  return (
    <div className={"flex flex-row w-full items-center justify-between py-10 -my-6 mb-6 px-24 bg-black-100"}>
      <div className={"flex flex-col"}>
        <Typography
          text={Locale.whyChooseSkydo}
          textClasses={"!text-black-600"}
          size={TYPOGRAPHY_SIZES.SMALL}
          type={TYPOGRAPHY_TYPES.PARA}
          fontWeight={"bold"}
        />
        <div className={"mt-4"}>
          {benefitList.map((benefit: Benefit, index) => (
            <BenefitLine {...benefit} key={index} classes={"mb-2"} />
          ))}
        </div>
      </div>
      <div className={"w-1/2 p-6 rounded-10px bg-white"}>
        <div>
          <Typography
            text={testimonialData.reviewLine}
            textClasses={"!text-black-600"}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
          />
        </div>
        <div className={"mt-3 ml-1 flex flex-row"}>
          {businessType === BUSSINESS_TYPES.FREELANCER ? <Founder1Icon /> : <Founder2Icon />}
          <div className={"ml-3"}>
            <div className={"h-5"}>
              <Typography
                text={testimonialData.founder}
                textClasses={"!text-black-500"}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
              />
            </div>
            <div className={"h-5"}>
              <Typography
                text={testimonialData.company}
                textClasses={"!text-black-500"}
                size={TYPOGRAPHY_SIZES.X_SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
