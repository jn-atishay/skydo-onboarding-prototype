import { NextApiRequest, NextApiResponse } from "next";
import axios, { AxiosResponse } from "axios";
import {
  AUTH_BASE_URL,
  BE_BASE_URL,
  CHALLAN_BASE_URL,
  CMS_AUTH_KEY,
  CMS_BASE_URL,
  FX_AUTH_KEY,
  FX_BASE_URL,
} from "../../../config";
import { getAuthSession, setAuthSession } from "../../../authentication/TokenManagement";
import { INTERNAL_PATH_SEGMENT, SERVICES } from "../../../constants/apiConstants";
import getClientIpAddr, { generateHeaders, getBEPath, isBasicAuthRequest } from "../../../BFFServices/helpers";
import doRateLimiting from "../../../ratelimiter/ratelimiter";

export class BlockedPathError extends Error {}

export const api = async ({ url, method, headers, data, server }: any): Promise<AxiosResponse> => {
  if (url?.toLowerCase().includes(INTERNAL_PATH_SEGMENT)) {
    throw new BlockedPathError(`Blocked request to internal path: ${url}`);
  }
  let baseURL = BE_BASE_URL;
  if (server === SERVICES.AUTH) {
    baseURL = AUTH_BASE_URL;
    headers = {
      ...headers,
      "x-secret-key": process.env.NEXT_PUBLIC_MERCHANT_KEY as string,
    };
  } else if (server === SERVICES.CHALLAN) {
    baseURL = CHALLAN_BASE_URL;
  } else if (server === SERVICES.FX) {
    baseURL = FX_BASE_URL;
    headers = {
      ...headers,
      "authentication-key": FX_AUTH_KEY,
    };
  } else if (server === SERVICES.CMS) {
    baseURL = CMS_BASE_URL;
    headers = {
      ...headers,
      Authorization: `Bearer ${CMS_AUTH_KEY}`,
    };
  } else {
    headers = {
      ...headers,
      "x-secret-key": process.env.NEXT_PUBLIC_MERCHANT_KEY as string,
    };
  }

  // Process URL to ensure baseURL is always used
  let processedUrl = url.trim();
  if (url) {
    // If url is absolute (starts with http/https), extract only the path
    if (url.startsWith("http://") || url.startsWith("https://")) {
      try {
        const urlObj = new URL(url);
        processedUrl = urlObj.pathname + urlObj.search + urlObj.hash;
      } catch (error) {
        // If URL parsing fails, use as is
        processedUrl = url;
      }
    }
    // Remove leading slash to avoid double slashes when combining with baseURL
  }

  const options = {
    url: processedUrl,
    method,
    data: data || {},
    baseURL,
    headers,
  };
  if (process.env.NODE_ENV === "development") {
    const curl =
      `curl -X ${method.toUpperCase()} '${baseURL}/${processedUrl}'` +
      Object.keys(headers)
        .map((key) => ` -H '${key}: ${headers[key]}'`)
        .join("") +
      ` -d '${JSON.stringify(data || {})}'`;
    console.log(curl);
  }

  try {
    const response = await axios(options);
    return response;
  } catch (error) {
    throw error;
  }
};

const apiHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  const path = getBEPath(req.query);
  const isUserDetailsRequired = req.query?.isUserDetailsRequired;
  // console.log("path = ", path, req.headers);

  const identifier = getClientIpAddr(req);
  const isReqAllowed = await doRateLimiting(identifier.ipAddress);
  if (!isReqAllowed) {
    res.status(429).json("Too many requests. Please try again in a few minutes.");
    return;
  }

  res.setHeader("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_FE_BASE_URL as string);

  const headers = generateHeaders(req);
  const server = req.headers?.["x-server"];
  try {
    const clientInfo = getClientIpAddr(req);
    const newBody = {
      ...req.body,
      ...(isUserDetailsRequired
        ? {
            ipAddress: clientInfo.ipAddress?.toString(),
            deviceId: clientInfo.agent?.toString(),
            timestamp: Date.now(),
            signingDetails: {
              ipAddress: clientInfo.ipAddress?.toString(),
              deviceId: clientInfo.agent?.toString(),
              timestamp: Date.now(),
            },
          }
        : {}),
      ...(isBasicAuthRequest(path)
        ? {
            token: getAuthSession({ req: req }).token,
          }
        : {}),
    };
    const apiResponse = await api({
      url: path,
      method: req.method,
      headers,
      data: newBody,
      server,
    });
    if (req.query?.manageToken && apiResponse.data.success) {
      setAuthSession({ res }, apiResponse.data.data.token, apiResponse.data.data.expiryDate);
    }
    // const response = await apiResponse.json();
    return res.status(apiResponse.status).send(apiResponse.data);
  } catch (error) {
    return exceptionHandler(error, res);
  }
};

export const exceptionHandler = (error: unknown, res: NextApiResponse) => {
  if (error instanceof BlockedPathError) {
    return res.status(403).send("Forbidden");
  } else if (axios.isAxiosError(error)) {
    if (error.response) {
      // Request made and server responded
      // console.log(error.response.data);
      // console.log(error.response.status);
      // console.log(error.response.headers);
      return res.status(error.response.status).send(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // console.log(error.request);
      return res.status(204).end();
    } else {
      // Something happened in setting up the request that triggered an Error
      // console.log('Error', error.message);
      return res.status(500).send("Internal server error");
    }
  } else {
    // Something happened in setting up the request that triggered an Error
    // console.log('Error', error);
    return res.status(500).send("Internal server error");
  }
};

export default apiHandler;
