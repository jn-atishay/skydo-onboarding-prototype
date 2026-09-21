import { create, zustandDevtools } from "./index";
import log from "./logger";
import beCall from "../util/beCall";
import BE_ROUTES from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import {
  FetchNpsDataResponse,
  getScoreRange,
  ScoreRange,
  scoreRangeToPresetReasons,
  scoreRangeToSubjectiveQuestion,
} from "../constants/npsInputConstants";
import useToastMessages from "./toastMessages";
import { TOAST_TYPES } from "../constants/atomicConstants";
import Locale from "../util/locale/en";
import { Analytics } from "../analytics/useAnalytics";
import { Events } from "../analytics/EventConstants";

interface NpsStore {
  npsScore: number;
  presetReasons: string[];
  selectedPresetReasons: string[];
  subjectiveResponse: string;

  showNps: boolean;
  subjectiveQuestion: string;
  npsSubmitted: boolean;

  npsSeen: boolean;

  setNpsScore: (score: number, callback: () => void) => void;
  selectPresetReason: (reason: string, analytics: Analytics) => void;
  setSubjectiveResponse: (response: string) => void;
  resetNps: () => void;

  fetchNpsData: () => void;
  submitNpsResponse: (email: string) => void; // score, preset reasons, subjective response

  setNpsSeen: () => void;

  somethingWentWrong: () => void;
}

const initialState = {
  npsScore: 0,
  presetReasons: [],
  selectedPresetReasons: [],
  subjectiveResponse: "",
  showNps: false,
  subjectiveQuestion: "",
  npsSubmitted: false,
  npsSeen: false,
};

const useNpsStore = create<NpsStore>()(
  zustandDevtools(
    log((set: any, get: () => NpsStore) => ({
      ...initialState,
      fetchNpsData: async () => {
        try {
          const res = await beCall<FetchNpsDataResponse>({
            path: BE_ROUTES.NPS.FETCH_NPS_DATA,
            method: ALLOWED_METHODS.GET,
          });
          if (res.success) {
            const resData = res.data as FetchNpsDataResponse;
            set((store: NpsStore) => ({ ...store, showNps: resData.showNps }));
          } else {
            get().somethingWentWrong();
          }
        } catch (e) {
          get().somethingWentWrong();
        }
      },
      setNpsScore: (score: number, callback: () => void) => {
        const currentScore = get().npsScore;
        const currentScoreRange = getScoreRange(currentScore);
        const newScoreRange = getScoreRange(score);
        const resetOptions = currentScoreRange != newScoreRange;

        if (resetOptions) {
          set((store: NpsStore) => ({
            ...store,
            npsScore: score,
            presetReasons: scoreRangeToPresetReasons[newScoreRange],
            selectedPresetReasons: [],
            subjectiveResponse: "",
            subjectiveQuestion: scoreRangeToSubjectiveQuestion[newScoreRange],
          }));
        } else {
          set((store: NpsStore) => ({ ...store, npsScore: score }));
        }
        callback();
      },
      setSubjectiveResponse: (response: string) => {
        set((store: NpsStore) => ({ ...store, subjectiveResponse: response }));
      },
      selectPresetReason: (reason: string, analytics: Analytics) => {
        const currSelectedReasons = get().selectedPresetReasons;
        let newSelectedReasons: string[] = [];
        if (currSelectedReasons.includes(reason)) {
          newSelectedReasons = currSelectedReasons.filter((el) => el != reason);
        } else {
          analytics?.trackAsync(Events.REFERRAL_NPS_RESPONSE_FILLED);
          newSelectedReasons = [...currSelectedReasons, reason];
        }
        set((store: NpsStore) => ({ ...store, selectedPresetReasons: newSelectedReasons }));
      },
      submitNpsResponse: async (email: string) => {
        try {
          const res = await beCall({
            path: BE_ROUTES.NPS.SAVE_NPS_RESPONSE,
            method: ALLOWED_METHODS.POST,
            body: {
              response: get().npsScore,
              selectedResponse: get().selectedPresetReasons,
              subjectiveResponse: get().subjectiveResponse,
              email: email,
            },
          });
          if (!res.success) get().somethingWentWrong;
        } catch (e) {
          get().somethingWentWrong;
        }
        set((store: NpsStore) => ({ ...store, npsSubmitted: true, scrollDown: true }));
      },
      setNpsSeen: async () => {
        try {
          const res = await beCall({
            path: BE_ROUTES.NPS.MARK_SEEN,
            method: ALLOWED_METHODS.POST,
          });
          if (!res.success) get().somethingWentWrong;
        } catch (e) {
          get().somethingWentWrong;
        }
        set((store: NpsStore) => ({ ...store, npsSeen: true }));
      },
      resetNps: () => {
        set((store: NpsStore) => ({
          ...store,
          npsScore: 0,
          presetReasons: scoreRangeToPresetReasons[ScoreRange.NA],
          selectedPresetReasons: [],
          subjectiveResponse: "",
          subjectiveQuestion: scoreRangeToSubjectiveQuestion[ScoreRange.NA],
          scrollDown: false,
          npsSubmitted: false,
        }));
      },
      somethingWentWrong: () => {
        useToastMessages.getState().addToast({
          type: TOAST_TYPES.ERROR,
          id: "nps_error",
          body: Locale.wentWrongMessage,
        });
      },
    }))
  )
);

export default useNpsStore;
