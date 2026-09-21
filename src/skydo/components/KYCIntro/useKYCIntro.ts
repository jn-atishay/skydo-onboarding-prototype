/**
 * @author Raj Sheth
 * created: 22/01/24
 */

import { useEffect, useState } from "react";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import beCall from "../../util/beCall";
import BE_ROUTES from "../../util/beRoutes";
import { gql, useQuery } from "@apollo/client";
import useOnboardingStore from "../../store/useOnboardingStore";

interface Return {
  isLoading: boolean;
  tncClick: () => void;
  ppClick: () => void;
  onGetStartedClick: (utmVal?: string) => void;
  utmPresent: boolean;
}

const FETCH_LEAD_UTM_STATUS = gql`
  query {
    exporterUser {
      exporter {
        exporterLeadUtmAttributes {
          utmSource
          utmMedium
          utmCampaign
        }
        campaignsForWhichToAskUtmSource
      }
    }
  }
`;

const useKYCIntro = (): Return => {
  const { data, refetch } = useQuery(FETCH_LEAD_UTM_STATUS);
  const [isLoading, setLoading] = useState(false);
  const [utmPresent, setUtmPresent] = useState(false);
  const [utmValue, setUtmValue] = useState("");
  const { fetchExporterUserDetails: refetchUserState } = useOnboardingStore();
  const analytics = useAnalytics();

  useEffect(() => {
    if (data) {
      const utmSource = data.exporterUser?.exporter?.exporterLeadUtmAttributes?.utmSource;
      const utmCampaign = data.exporterUser?.exporter?.exporterLeadUtmAttributes?.utmCampaign;
      const campaignsForWhichToAskUtmSource = data.exporterUser?.exporter?.campaignsForWhichToAskUtmSource || [];
      const forceAskUtmSource =
        Array.isArray(campaignsForWhichToAskUtmSource) && campaignsForWhichToAskUtmSource.includes(utmCampaign);
      if (utmSource && !forceAskUtmSource) {
        setUtmPresent(true);
        setUtmValue(utmSource);
      }
    }
  }, [data]);

  const tncClick = async () => {
    analytics?.trackAsync(Events.TNC_CLICK);
  };

  const ppClick = async () => {
    analytics?.trackAsync(Events.PP_CLICK);
  };

  const onGetStartedClick = async (utmVal?: string) => {
    setLoading(true);
    try {
      const response = await beCall({
        path: BE_ROUTES.T_C_ACCEPT,
        params: {
          isUserDetailsRequired: true,
        },
        body: {
          userResponse: utmVal,
        },
        method: "POST",
      });
      analytics?.trackAsync(Events.TNC_CONSENT_SUBMIT, { success: response.success });
      analytics?.identifyTraitsAsync({ utmSource: utmVal || utmValue });
      setLoading(false);
      if (response.success) {
        refetchUserState();
      } else {
        throw response;
      }
    } catch (e) {
      setLoading(false);
      console.log("error", e);
    }
  };

  return {
    isLoading,
    tncClick,
    ppClick,
    onGetStartedClick,
    utmPresent,
  };
};

export default useKYCIntro;
