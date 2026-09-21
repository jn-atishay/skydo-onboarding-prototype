import { create, zustandDevtools } from "./index";
import log from "./logger";
import { debounce } from "../util/functions";
import beCall from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import useToastMessages from "./toastMessages";
import { TOAST_TYPES } from "../constants/atomicConstants";
import Locale from "../util/locale/en";

interface HomeStateStore {
  homeState: HomeState;
  fetchHomeState: () => void;
  isLoading: boolean;
}

export enum HomeState {
  FOCUSED = "FOCUSED",
  CLASSIC = "CLASSIC",
  LOADING = "LOADING",
}

const initialState = {
  homeState: HomeState.LOADING,
  isLoading: true,
};

const useHomeStateStore = create<HomeStateStore>()(
  zustandDevtools(
    log((set: any, get: () => HomeStateStore) => ({
      ...initialState,
      fetchHomeState: debounce(
        async () => {
          let newHomeState = HomeState.CLASSIC;
          try {
            const res = await beCall<HomeState>({
              path: BE_ROUTES.FOCUSED_HOME_GET_HOME_STATE,
              method: ALLOWED_METHODS.GET,
            });
            const isError = !res.success;
            if (isError) {
              useToastMessages.getState().addToast({
                type: TOAST_TYPES.ERROR,
                body: Locale.wentWrongMessage,
                id: "HOME_STATE_FETCH",
              });
            } else {
              newHomeState = res.data as HomeState;
            }
          } catch (e) {
          } finally {
            set((store: HomeStateStore) => ({ ...store, homeState: newHomeState, isLoading: false }));
          }
        },
        500,
        {
          isLeading: true,
        }
      ),
    }))
  )
);

export default useHomeStateStore;
