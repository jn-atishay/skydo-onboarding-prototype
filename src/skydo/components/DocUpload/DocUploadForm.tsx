/**
 * @author Raj Sheth
 * created: 01/12/23
 */

import { useMemo } from "react";
import ExporterDocInput from "../CompanyPanDetails/ExporterDocInput";
import { gql, useQuery } from "@apollo/client";
import useUserData from "../../store/useUserData";
import { sortDocArray } from "./utils";

const FETCH_PAN_DETAILS = gql`
  query FetchCompanyPanDetails {
    exporterUser {
      exporter {
        businessLegalName
        businessType
        onBoardingState
        businessPAN
        isAmazonUser
        exporterKyc {
          kycDocList {
            docType
            preSignedUrl
          }
          iecDetails {
            ieCode
            verifiedBy
          }
        }
        businessDescription {
          website
          businessDescription
          websiteExist
          marketingActivity
          monthlyRevenue
        }
        exporterIndustry {
          industryId
          industryDescription
          industryInfoResponse
        }
        selectedExporterIndustry {
          industryType
        }
        gstList {
          id
          gstin
          entryType
          address
        }
        bankAccount {
          accountNumber
        }
      }
    }
    industry {
      id
      name
      riskCategory
      metadata {
        question
        subQuestion
        options {
          yes
          no
        }
      }
    }
    docTypeDescription {
      docType
      description
      docName
      businessType
      isMandatory
    }
  }
`;

const DocUploadForm = () => {

  const { setUserDetails } = useUserData();
  const onQueryComplete = (data: any) => {
    if (data) {
      const { businessType } = data.exporterUser?.exporter || {};
      setUserDetails({ businessType });
    }
  };
  const { data, refetch } = useQuery(FETCH_PAN_DETAILS, {
    onCompleted: onQueryComplete,
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
  });

  // Stable identity so ExporterDocInput's derived option lists — which drive selection resets —
  // are not recomputed, and their effects not re-run, on every render of this form.
  const docTypeMasterList = useMemo(() => sortDocArray(data?.docTypeDescription ?? []), [data?.docTypeDescription]);

  if (!data) {
    return <></>;
  }
  return (
    <ExporterDocInput
      exporterData={data?.exporterUser?.exporter}
      docTypeMasterList={docTypeMasterList}
      refetchData={refetch}
    />
  );
};

export default DocUploadForm;
