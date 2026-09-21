import { StoreApi } from "zustand";
import { create, zustandDevtools } from "./index";
import log from "./logger";
import { BFF_ROUTES } from "../util/beRoutes";
import beCall from "../util/beCall";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { FetchCountryListResponse } from "../gqlQueries/InvoiceRelated";


interface CountryState {
  countryList: {
    name: string;
    code2Alpha: string;
    countryCode: string
  }[];
  isCountryListLoading: boolean;
  hasCountryListFailed: boolean;
}

interface CountryStore extends CountryState {
  fetchCountryList: () => void;
}

const useCountriesStore = create<CountryStore>()(
  zustandDevtools(
    log((set: StoreApi<CountryStore>["setState"], get: () => CountryStore) => ({
      countryList: [],
      isCountryListLoading: false,
      hasCountryListFailed: false,
      fetchCountryList: async () => {
        set({ isCountryListLoading: true, hasCountryListFailed: false });
        try {
          const response = (await beCall({
            url: BFF_ROUTES.FETCH_COUNTRIES,
            method: ALLOWED_METHODS.GET,
          })) as { data: FetchCountryListResponse };
          set({ countryList: response.data?.countries || [], isCountryListLoading: false });
        } catch (e) {
          set({ isCountryListLoading: false, hasCountryListFailed: true });
        }
      },
    }))
  )
);

export default useCountriesStore;
