import axios, { AxiosError } from "axios";
import { ResponseWrapper } from "../authentication/api/AuthApiDto";
import { AUTH_BASE_URL, BE_BASE_URL } from "../config";
import AuthHelper from "../authentication/AuthHelper";
import { SERVICES } from "../constants/apiConstants";
import * as Sentry from "@sentry/nextjs";

type Params = Object;

type configDetails = {
  path?: string;
  /**
   * IMPORTANT: if you want to pass body, you MUST pass `method: 'POST'`
   */
  body?: object;
  params?: Params;
  headers?: object;
  method?: string;
  onSuccess?: (data: any) => void;
  onError?: (data: any) => void;
  url?: string;
  server?: string;
  ssr?: boolean;
  manageToken?: boolean;
  redirect?: boolean;
  timeout?: number;
};

/**
@name fetchData
@description to fetch data from backend
@param {string} url - used for call from client to the BFF service in url, default is /api/route,
@param {string} path - goes as query-param used as url in bffServices for fetching data from alpha
@returns Promise<ResponseWrapper<T>>
 */

export const fetchData = async <T>(config: configDetails): Promise<ResponseWrapper<T>> => {
  let url = config.url;
  if (config.ssr) {
    if (config.server == "AUTH") {
      url = AUTH_BASE_URL + "/" + config.path;
    } else {
      url = BE_BASE_URL + "/" + config.path;
    }
  } else {
    url = url || "/api/route";
  }
  const options = {
    url: url,
    timeout: config.timeout,
    method: config.method,
    headers: {
      "x-server": config.server || process.env.NEXT_PUBLIC_BE_BASE_URL,
      "x-secret-key": process.env.NEXT_PUBLIC_MERCHANT_KEY,
      // TODO - x-server is of type Services
      ...config.headers,
    },
    params: {
      path: config.path,
      ...(config.manageToken ? { manageToken: config.manageToken } : {}),
      ...config.params,
    },
    data: config.body,
  };
  try {
    const response = await axios<ResponseWrapper<T>>(options);
    if (config.onSuccess) {
      config.onSuccess(response.data);
    }
    //todo - find permanent way of handling error
    // if (response.data.success) {
    //     throw response;
    // }
    return response.data;
  } catch (e) {
    // @ts-ignore
    return handleError(e, config);
  }
};

const handleError = (error: unknown, config: configDetails) => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;
    // if it's an axios response with 403 (HTTP_FORBIDDEN) and  it's not a usage of fetchData on server side
    if (
      axiosError.response?.status === 403 &&
      config?.redirect !== false &&
      !config.ssr &&
      config.server !== SERVICES.CHALLAN &&
      // @ts-ignore
      config.headers?.["x-server"] !== SERVICES.CHALLAN
    ) {
      Sentry.captureMessage("user_logged_out_session_expired", {
        level: "info",
        extra: {
          url: config.url,
          method: config.method,
          params: config.params,
        },
      });
      void AuthHelper.logoutWithRedirect(window.location.pathname);
      return axiosError;
    }
  }
  if (config.onError) {
    config.onError(error);
  }
  return error;
};

/**
@name beCall
@description to fetch data from backend
@params path: goes as queryparam used as url in bffServices for fetching data from alpha
@params url: used for call from client to the service in url, default is /api/route
 */
const beCall = async <T>(config: configDetails | configDetails[]): Promise<ResponseWrapper<unknown>> => {
  if (Array.isArray(config)) {
    const promises = config.map((apiDetails: configDetails) => fetchData(apiDetails));
    // @ts-ignore
    return await Promise.all(promises);
  }
  return await fetchData(config as configDetails);
};

export default beCall;
