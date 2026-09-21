import { zustandDevtools } from "./index";
import log from "./logger";
import create, { StoreApi } from "zustand";
import { Exporter, ExporterUser } from "../types/Exporter/ExporterUser";

type ExporterAndExporterUserStore = {
  exporterUser?: Partial<ExporterUser>;
  exporter?: Partial<Exporter>;
  setExporterUserDetails: (data?: Partial<ExporterUser>) => void;
  setExporterDetails: (data?: Partial<Exporter>) => void;
};

const useExporterAndExporterUserStore = create<ExporterAndExporterUserStore>()(
  zustandDevtools(
    log((set: StoreApi<ExporterAndExporterUserStore>["setState"], get: () => ExporterAndExporterUserStore) => ({
      exporterUser: undefined,
      exporter: undefined,
      setExporterUserDetails: (data: Partial<ExporterUser>) => {
        set((state) => ({ ...state, exporterUser: { ...state.exporterUser, ...data } }));
      },
      setExporterDetails: (data: Partial<Exporter>) => {
        set((state) => ({ ...state, exporter: { ...state.exporter, ...data } }));
      },
    }))
  )
);

export default useExporterAndExporterUserStore;
