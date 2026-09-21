import { useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import UBOFormVkyc from "./UBOFormVkyc";

const FETCH_DIRECTOR_DETAILS = gql`
  query FETCH_DIRECTOR_DETAILS {
    exporterUser {
      fullName
      registeredName
      phoneNumber
      panNumber
      isDirector
      maskedAadhaar
      exporter {
        businessLegalName
        correspondentName
        verificationStatus {
          verificationStep
          isVerified
        }
        ubo {
          fullName
        }
      }
      exporterUserKyc {
        kycDocList {
          docType
          preSignedUrl
        }
      }
    }
    defaultAadhaarVendor
  }
`;

const getPanUrlFromExporterDocs = (
  kycDocList: {
    preSignedUrl: string;
    docType: string;
  }[] = []
) => {
  for (let i = 0; i < kycDocList.length; ++i) {
    const doc = kycDocList[i];
    if (doc.docType === "PERSONAL_PAN") {
      return doc.preSignedUrl;
    }
  }
  return "";
};

const UBODetailsVkyc = () => {
  const analytics = useAnalytics();

  useEffect(() => {
    analytics?.trackAsync(Events.PERSONAL_SCREEN_LOAD);
  }, [analytics]);

  const { data, refetch } = useQuery(FETCH_DIRECTOR_DETAILS, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  const exporterUserDetails = data?.exporterUser || {};
  const defaultAadhaarVendor = data?.defaultAadhaarVendor || "";
  const exporterUserPanUrl = getPanUrlFromExporterDocs(exporterUserDetails?.exporterUserKyc?.kycDocList);

  return (
    <div className={"flex flex-row flex-1"}>
      <UBOFormVkyc
        exporterUserDetails={exporterUserDetails}
        defaultAadhaarVendor={defaultAadhaarVendor}
        exporterUserPanUrl={exporterUserPanUrl}
        reFetchDirectorDetails={refetch}
      />
    </div>
  );
};

export default UBODetailsVkyc;
