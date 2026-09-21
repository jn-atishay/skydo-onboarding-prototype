import { NextApiRequest, NextApiResponse } from "next";
import { generateHeaders } from "./helpers";
import { api } from "../pages/api/route";

type fetchOptions = {
  url: string;
  method: string;
  body?: any;
  server?: string;
};
/**
 * @description Fetches data from BE
 * @param req
 * @param res
 * @param options - url, method, body, server
 * @returns Promise<ResponseWrapper>
 */
const fetch = async (req: NextApiRequest, res: NextApiResponse, options: fetchOptions) => {
  const headers = generateHeaders(req);
  const server = options.server || req.headers?.["x-server"];
  const apiResponse = await api({
    url: options.url,
    method: options.method,
    headers,
    data: options.body,
    server,
  });
  return apiResponse.data;
};

export default fetch;
