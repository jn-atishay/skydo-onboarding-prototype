/**
 * @author Raj Sheth
 * created: 16/10/23
 */

import log from "./logger";
import { create, zustandDevtools } from "./index";
import beCall from "../util/beCall";
import BE_ROUTES, { BFF_ROUTES } from "../util/beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";
import { exporterLogoAndDescriptionQuery } from "../util/queries";
import { ApiFuncParams } from "../types";

interface ConfirmLogoReq extends ApiFuncParams {}

type ConfirmLogoFunc = (req: ConfirmLogoReq) => void;

interface EditLogoState {
  logoUrl: string;
  globalImageUrl: string;
  file: File | null;
}

interface EditLogoStore extends EditLogoState {
  setLogoUrl: (imageUrl: string) => void;
  setGlobalImageUrl: (imageUrl: string) => void;
  setFile: (file: File | null) => void;
  fetchAndSetLogoUrl: () => void;
  uploadLogo: (onSuccess?: (data: any) => void, onError?: (data: any) => void) => void;
  /**
   * whatever is the current logoUrl, set it as globalImageUrl and upload to backend
   */
  confirmLogo: ConfirmLogoFunc;
}

const useEditLogoStore = create<EditLogoStore>()(
  zustandDevtools(
    log((set: (arg0: (state: any) => any) => void, get: () => EditLogoStore) => ({
      logoUrl: "",
      globalImageUrl: "",
      file: null,

      setFile: (file: File | null) => {
        set((state) => ({
          ...state,
          file,
        }));
      },
      setLogoUrl: (logoUrl: string) => {
        set((state) => ({
          ...state,
          logoUrl,
        }));
      },
      setGlobalImageUrl: (globalImageUrl: string) => {
        set((state) => ({
          ...state,
          globalImageUrl,
        }));
      },

      fetchAndSetLogoUrl: async () => {
        await beCall({
          path: BE_ROUTES.GRAPH_QL,
          method: ALLOWED_METHODS.POST,
          body: {
            query: exporterLogoAndDescriptionQuery,
            variables: {},
            operationName: "fetchExporterLogoAndDescription",
          },
          onSuccess: (response: any) => {
            const data = response.data;
            if (data) {
              const logoUrl = data.exporterUser.exporter.businessDescription?.logoUrl;
              set((state) => ({
                ...state,
                logoUrl,
                globalImageUrl: logoUrl,
              }));
            }
          },
        });
      },

      uploadLogo: async (onSuccess?: (data: any) => void, onError?: (data: any) => void) => {
        const formData = new FormData();
        formData.append("companyLogo", get().file as File);
        void beCall({
          path: BE_ROUTES.UPDATE_COMPANY_LOGO,
          method: ALLOWED_METHODS.POST,
          body: formData,
          url: BFF_ROUTES.FILE_UPLOAD,
          onSuccess: onSuccess,
          onError: onError,
        });
      },

      confirmLogo: (req: ConfirmLogoReq) => {
        get().uploadLogo(
          (success: any) => {
            get().fetchAndSetLogoUrl();
            get().setLogoUrl(get().logoUrl);
            req.onSuccess && req.onSuccess(success);
          },
          (error: any) => {
            get().setLogoUrl(get().globalImageUrl);

            req.onError && req.onError(error);
          }
        );
      },
    }))
  )
);

export default useEditLogoStore;
