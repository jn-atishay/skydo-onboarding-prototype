import beCall from "./beCall";
import { BFF_ROUTES } from "./beRoutes";
import { ALLOWED_METHODS } from "../constants/apiConstants";

export type UrlValidationResult = { isValid: boolean; errorMessage?: string; errorDump?: string };

const validateWebUrl = async (url: string): Promise<UrlValidationResult | undefined> => {
  let urlToCheck = url;
  try {
    const resp: any = await beCall({
      url: BFF_ROUTES.VALIDATE_URL,
      method: ALLOWED_METHODS.POST,
      body: {
        urlToCheck,
      },
    });
    return resp?.data;
  } catch (e: any) {
    return { isValid: false, errorMessage: e?.message, errorDump: String(e) };
  }
};

export default validateWebUrl;
