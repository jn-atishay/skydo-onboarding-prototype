import { NextApiRequest, NextApiResponse } from "next";
import { exceptionHandler } from "../../pages/api/route";
import getClientIpAddr from "../helpers";
import doRateLimiting from "../../ratelimiter/ratelimiter";

type middlewareHandler = (req: NextApiRequest, res: NextApiResponse) => Promise<void>;
/*
@name withMiddleware123
@description - This is a wrapper function for any API handler function, which will handle the error and exception handling.
@params - handler: middlewareHandler, reqMethod: string
 */
const withMiddleware = (handler: middlewareHandler, reqMethod: string) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== reqMethod) {
      res.setHeader("Allow", [reqMethod]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      console.error("Method Not Allowed");
      return;
    }

    const identifier = getClientIpAddr(req);
    const isReqAllowed = await doRateLimiting(identifier.ipAddress);
    if (!isReqAllowed) {
      res.status(429).json("Too many requests. Please try again in a few minutes.");
      return;
    }

    res.setHeader("Access-Control-Allow-Origin", process.env.NEXT_PUBLIC_FE_BASE_URL as string);

    try {
      await handler(req, res);
    } catch (err) {
      console.error(err);
      exceptionHandler(err, res);
    }
  };
};

export default withMiddleware;
