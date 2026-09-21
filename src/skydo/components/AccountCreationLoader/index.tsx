import Image from "next/image";
import { useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import useUserData from "../../store/useUserData";
import ImageLoader from "./ImageLoader";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import LoadingState from "./LoadingState";

const QUERY = gql`
  query {
    exporterUser {
      exporter {
        onBoardingState
      }
    }
  }
`;

const AccountCreationLoader = () => {
  const { data, stopPolling, startPolling, loading, error } = useQuery(QUERY, { pollInterval: 5000 });
  const { userState, setUserState } = useUserData((state) => ({
    userState: state.userState,
    setUserState: state.setUserState,
  }));
  const [pollCount, updatePollCount] = useState(1);

  useEffect(() => {
    startPolling(5000);
  }, []);

  useEffect(() => {
    updatePollCount(pollCount + 1);
    if (data) {
      const status = data.exporterUser?.exporter?.onBoardingState;
      if (userState !== status) {
        stopPolling();
        setUserState(status);
      }
    }
    if (pollCount > 24) {
      stopPolling();
    }
  }, [data]);

  return <LoadingState />;
};

export default AccountCreationLoader;
