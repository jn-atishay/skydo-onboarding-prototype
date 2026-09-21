import SummaryCardLoader from "../Common/Loaders/SummaryCardLoader";

const BannerLoader = () => {
  return (
    <div className={"flex flex-col"}>
      <div className={"flex flex-row flex-1 w-full rounded-10px h-6 bg-white mb-6"}>
        <SummaryCardLoader />
        <SummaryCardLoader />
        <SummaryCardLoader />
      </div>
    </div>
  );
};

export default BannerLoader;
