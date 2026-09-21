import NpsInput from "./index";
import { NpsInputSource, sleep } from "../../constants/npsInputConstants";
import React, { useEffect, useRef } from "react";
import useNpsStore from "../../store/useNpsStore";
import useUserData from "../../store/useUserData";

const TransactionTrackerNps = () => {
  const { fetchNpsData, showNps } = useNpsStore();
  const ref = useRef<HTMLDivElement>(null);
  const { loggedInUserEmail } = useUserData();

  const scrollCallback = async () => {
    await sleep(0);
    ref?.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  useEffect(() => {
    fetchNpsData();
  }, []);

  if (!showNps) return null;

  return (
    <div ref={ref}>
      <div className={"w-full h-[1px] bg-black-400 my-6"}></div>
      <NpsInput source={NpsInputSource.TRANSACTION_TRACKER} scrollCallback={scrollCallback} email={loggedInUserEmail} />
    </div>
  );
};

export default TransactionTrackerNps;
