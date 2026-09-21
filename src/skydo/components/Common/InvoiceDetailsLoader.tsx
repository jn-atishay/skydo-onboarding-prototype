import LoadingChip from "./Loaders/LoadingChip";
import React from "react";
import FxConversionCalculationLoader from "./Loaders/FxConversionCalculationLoader";

const InvoiceDetailsLoader = () => {
  return (
    <div className={"flex flex-row"}>
      <div className={"flex flex-col w-1/2"}>
        <div className={"flex flex-col rounded-10px w-full h-[246px] bg-white mb-4"}>
          <div className={"flex flex-col mx-6 mt-11"}>
            <div className={"animate-pulse rounded-10px w-1/2 h-5 bg-black-50"}></div>
            <div className={"flex flex-row justify-between mt-13"}>
              <div className={"animate-pulse rounded-10px w-1/5 h-5 bg-black-50"}></div>
              <div className={"animate-pulse rounded-10px w-2/5 h-5 bg-black-50"}></div>
            </div>
            <div className={"flex flex-row justify-between mt-14"}>
              <div className={"animate-pulse rounded-10px w-full h-8 bg-black-50"}></div>
              <div className={"animate-pulse rounded-10px w-full h-8 bg-black-50 mx-4"}></div>
              <div className={"animate-pulse rounded-10px w-full h-8 bg-black-50"}></div>
            </div>
          </div>
        </div>
        <div className={"flex flex-col rounded-10px w-full h-[315px] bg-white mb-4"}>
          <div className={"flex flex-col mx-6 mt-20"}>
            <div className={"flex flex-row"}>
              <div className={"animate-pulse rounded-10px w-full h-5 bg-black-50"}></div>
              <div className={"animate-pulse rounded-10px w-full h-5 bg-black-50 mx-10"}></div>
              <div className={"animate-pulse rounded-10px w-full h-5 bg-black-50"}></div>
            </div>
            <div className={"flex flex-row mt-6"}>
              <div className={"animate-pulse rounded-10px w-full h-5 bg-black-50"}></div>
              <div className={"animate-pulse rounded-10px w-full h-5 bg-black-50 mx-10"}></div>
              <div className={"animate-pulse rounded-10px w-full h-5 bg-black-50"}></div>
            </div>
            <div className={"animate-pulse rounded-10px w-[125px] h-[125px] bg-black-50 mt-6"}></div>
          </div>
        </div>
      </div>

      <div className={"flex flex-col w-1/2 bg-white rounded-10px ml-4"}>
        <div className={"flex flex-col p-6"}>
          <div className={"animate-pulse rounded-10px h-[68px] bg-black-50 mt-6"}></div>
          <div className={"flex flex-col mt-8"}>
            <div className={"animate-pulse rounded-10px h-5 w-2/3 bg-black-50"}></div>
            <div className={"animate-pulse rounded-10px h-3 w-1/5 bg-black-50 mt-6"}></div>
          </div>
          <div className={"flex flex-col mt-8"}>
            <div className={"animate-pulse rounded-10px h-5 w-2/3 bg-black-50"}></div>
            <div className={"animate-pulse rounded-10px h-3 w-1/5 bg-black-50 mt-6"}></div>
          </div>
          <div className={"flex flex-col mt-8"}>
            <div className={"animate-pulse rounded-10px h-5 w-2/3 bg-black-50"}></div>
            <div className={"animate-pulse rounded-10px h-3 w-1/5 bg-black-50 mt-6"}></div>
          </div>
          <div className={"flex flex-col mt-8"}>
            <div className={"animate-pulse rounded-10px h-5 w-2/3 bg-black-50"}></div>
            <div className={"animate-pulse rounded-10px h-3 w-1/5 bg-black-50 mt-6"}></div>
          </div>
        </div>

        <FxConversionCalculationLoader />

        <div className={"flex flex-col mt-8 p-6"}>
          <div className={"animate-pulse rounded-10px h-5 w-2/3 bg-black-50"}></div>
          <div className={"animate-pulse rounded-10px h-3 w-1/5 bg-black-50 mt-6"}></div>
        </div>
      </div>
    </div>
  );
};

export default InvoiceDetailsLoader;
