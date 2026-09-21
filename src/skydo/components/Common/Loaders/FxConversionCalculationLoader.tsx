import LoadingChip from "./LoadingChip";
import React from "react";

const FxConversionCalculationLoader = () => {
  return (
    <div className={"animate-pulse bg-white px-6 flex-1 rounded-10px"}>
      <LoadingChip containerClass={"w-1/5 h-4 mb-6"} />
      <div className={"bg-black-50 p-6 flex flex-col mt-4"}>
        <div className={"flex flex-row justify-between"}>
          <LoadingChip containerClass={"w-1/5 !bg-black-100 h-3"} />
          <LoadingChip containerClass={"w-1/6 !bg-black-100 h-3"} />
        </div>
        <div className={"flex flex-row justify-between mt-5"}>
          <LoadingChip containerClass={"w-1/2 !bg-black-100 h-3"} />
          <LoadingChip containerClass={"w-1/6 !bg-black-100 h-3"} />
        </div>
        <LoadingChip containerClass={"w-1/4 !bg-black-100 h-5 mt-2"} />
        <hr className={"w-full border-t border-black-400 my-4"} />
        <div className={"flex flex-row justify-between"}>
          <LoadingChip containerClass={"w-1/5 !bg-black-100 h-3"} />
          <LoadingChip containerClass={"w-1/6 !bg-black-100 h-3"} />
        </div>
        <div className={"flex flex-row justify-between mt-5"}>
          <LoadingChip containerClass={"w-1/5 !bg-black-100 h-3"} />
          <LoadingChip containerClass={"w-1/6 !bg-black-100 h-3"} />
        </div>
        <div className={"w-full bg-white p-4 mt-3"}>
          <div className={"flex flex-row justify-between"}>
            <LoadingChip containerClass={"w-1/5 !bg-black-100 h-3"} />
            <LoadingChip containerClass={"w-1/6 !bg-black-100 h-3"} />
          </div>
          <div className={"flex flex-row justify-between mt-3"}>
            <LoadingChip containerClass={"w-1/6 !bg-black-100 h-3"} />
            <LoadingChip containerClass={"w-1/12 !bg-black-100 h-3"} />
          </div>
          <div className={"flex flex-row justify-between mt-3"}>
            <LoadingChip containerClass={"w-1/3 !bg-black-100 h-3"} />
            <LoadingChip containerClass={"w-1/4 !bg-black-100 h-3"} />
          </div>
        </div>
        <hr className={"w-full border-t border-black-400 my-4"} />
        <div className={"flex flex-row justify-between"}>
          <LoadingChip containerClass={"w-1/3 !bg-black-100 h-3"} />
          <LoadingChip containerClass={"w-1/4 !bg-black-100 h-3"} />
        </div>
      </div>
    </div>
  );
};

export default FxConversionCalculationLoader;
