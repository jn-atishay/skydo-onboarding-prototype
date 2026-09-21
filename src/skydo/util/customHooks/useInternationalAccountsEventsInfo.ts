import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import { useRouter } from "next/router";
import JSHelpers from "../../components/AtomicComponents/JSHelpers";

const useInternationalAccountsEventsInfo = () => {
  const { showNewUI } = useInternationalAccountsStore();
  const router = useRouter();

  return {
    version: showNewUI ? 1 : 0,
    country: (JSHelpers.getKeyValueFromNextQueryParams("location", router.query) || "").toUpperCase(),
    currency: (JSHelpers.getKeyValueFromNextQueryParams("currency", router.query) || "").toUpperCase(),
  };
};

export default useInternationalAccountsEventsInfo;
