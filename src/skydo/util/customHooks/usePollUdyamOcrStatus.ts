/**
 * @author Raj Sheth
 * created: 25/04/24
 */

import useUdyamOcrStore from "../../store/useUdyamOcrStore";
import useInterval from "../../hooks/useInterval";
import { TaskStatus } from "../../types/UdyamOcr";

const usePollUdyamOcrStatus = () => {
  const { fetchUdyamStatus, status, isPolling } = useUdyamOcrStore();
  const intervalRef = useInterval(
    () => {
      if (status !== TaskStatus.IN_PROGRESS) {
        window.clearInterval(intervalRef.current);
      }
      fetchUdyamStatus();
    },
    isPolling && status === TaskStatus.IN_PROGRESS ? 3000 : null
  );
};

export default usePollUdyamOcrStatus;
