import { parseCookies } from "nookies";
import UAParser from "ua-parser-js";

export const getCleanUTM = () => {
  const cookie = parseCookies();
  const cleanUtm: { source?: string; medium?: string; content?: string; term?: string; name?: string } = {};
  try {
    if (cookie?.utm) {
      const utm = JSON.parse(cookie.utm);
      if (utm.utmSource) {
        cleanUtm.source = utm.utmSource;
      }
      if (utm.utmMedium) {
        cleanUtm.medium = utm.utmMedium;
      }
      if (utm.utmContent) {
        cleanUtm.content = utm.utmContent;
      }
      if (utm.utmTerm) {
        cleanUtm.term = utm.utmTerm;
      }
      if (utm.utmCampaign) {
        cleanUtm.name = utm.utmCampaign;
      }
    }
  } catch (e) {
    console.log("utm parsing error");
  }

  return cleanUtm;
};

export const getUAParserResult = () => {
  const parser = new UAParser();
  return parser?.getResult() || {};
};
