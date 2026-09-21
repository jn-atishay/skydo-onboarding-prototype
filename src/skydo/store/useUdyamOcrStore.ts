import log from "./logger";
import { create, zustandDevtools } from "./index";
import beCall from "../util/beCall";
import { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { TaskStatus, TaskType, UdyamTasks } from "../types/UdyamOcr";

interface UdyamStore {
  isPopupVisible: boolean;
  isPolling: boolean;
  steps: UdyamTasks;
  status: TaskStatus;
  setIsPolling: (x: boolean) => void;
  setPopupVisible: (x: boolean) => void;
  fetchUdyamStatus: () => void;
  submitUdyamOcrJob: () => void;
  reset: () => void;
}

const getEmptyTasks = (): UdyamTasks => {
  return [
    {
      type: TaskType.UDYAM_OCR,
      status: TaskStatus.IN_PROGRESS,
      errorReason: undefined,
    },
    {
      type: TaskType.BIZ_DETAILS,
      status: TaskStatus.NOT_STARTED,
      errorReason: undefined,
    },
    {
      type: TaskType.NAME_MATCH,
      status: TaskStatus.NOT_STARTED,
      errorReason: undefined,
    },
  ];
};

const useUdyamOcrStore = create<UdyamStore>()(
  zustandDevtools(
    log((set: (arg0: (state: any) => any) => void, get: () => UdyamStore) => ({
      isPopupVisible: false,
      isPolling: false,
      steps: getEmptyTasks(),
      status: TaskStatus.NOT_STARTED,
      setIsPolling: (x: boolean) => set((state) => ({ ...state, isPolling: x })),
      setPopupVisible: (x: boolean) => set((state) => ({ ...state, isPopupVisible: x })),
      submitUdyamOcrJob: async () => {
        try {
          await beCall({
            url: BFF_ROUTES.SUBMIT_UDYAM_OCR,
            method: ALLOWED_METHODS.POST,
          });
        } catch (e: any) {
          console.log("Error", e);
        }
      },
      fetchUdyamStatus: async () => {
        try {
          const response: any = await beCall({
            url: BFF_ROUTES.FETCH_UDYAM_OCR_STATUS,
            method: ALLOWED_METHODS.GET,
          });
          set((state) => ({
            ...state,
            steps: response.data.steps,
            status: response.data.status,
            isPopupVisible: [TaskStatus.ERROR, TaskStatus.IN_PROGRESS].includes(response.data.status),
          }));
        } catch (e: any) {
          console.log("Error", e);
          set((state) => ({
            ...state,
            status: TaskStatus.ERROR,
            errorReason: "Something went wrong",
          }));
        }
      },
      reset: () => {
        set((state) => {
          return {
            ...state,
            isPopupVisible: true,
            steps: getEmptyTasks(),
            status: TaskStatus.IN_PROGRESS,
          };
        });
      },
    }))
  )
);

export default useUdyamOcrStore;
