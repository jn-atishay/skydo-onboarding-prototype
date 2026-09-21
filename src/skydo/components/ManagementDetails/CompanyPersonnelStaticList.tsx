import React from "react";
import Typography from "../AtomicComponents/Typography";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import classnames from "classnames";

type Props = {
  uboList: any[];
};

const CompanyPersonnelStaticList = (props: Props) => {
  const { uboList } = props;
  const renderUBOInput = ({ index, details }: { index: number; details: any; isDeleted?: boolean }) => {
    const { fullName, nationality, id, isDeleted, ownershipPercentage, pan } = details; //todo - verify with backend response
    if (isDeleted) return null;
    return (
      <div className={"flex flex-row mb-4"} key={index}>
        <Typography
          text={`${index + 1}.`}
          type={TYPOGRAPHY_TYPES.LABEL}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          textClasses={"!text-black-500 mr-4"}
        />
        <div
          className={classnames("flex-1", {
            "flex flex-row items-start gap-x-4": true,
          })}
        >
          <Typography
            text={fullName}
            type={TYPOGRAPHY_TYPES.LABEL}
            size={TYPOGRAPHY_SIZES.MEDIUM}
            textClasses={"!text-black-500 mr-4"}
          />
        </div>
      </div>
    );
  };

  return <>{uboList.map((ubo, index) => renderUBOInput({ index: index, details: ubo }))}</>;
};

export default CompanyPersonnelStaticList;
