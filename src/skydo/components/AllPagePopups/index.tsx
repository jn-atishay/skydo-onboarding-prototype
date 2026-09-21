import { isPreKycWalkthroughVisible } from "../../util/preKycWalkthroughUtils";
import React, { useContext, useEffect, useState } from "react";
import { UserDetailsContext } from "../DashboardContainer";
import AppTourDonePopup from "./AppTourDonePopup";
import { useTour } from "@reactour/tour";
import AppTourStartPopup from "./AppTourStartPopup";
import AppTourExitConfirmationPopup from "./AppTourExitConfirmationPopup";
import EInvoicingPopupContainer from "../EInvoicingPopupContainer";
import useEInvoicingStore from "../../store/useEInvoicingStore";
import useZohoSyncStore from "../../store/useZohoSyncStore";
import ZohoSyncPopUp from "../ZohoSyncPopUp";
import { useRouter } from "next/router";
import PurposeCode from "../PurposeCode";
import ShareDetailsPopup from "../InternationalAccountsComp/ShareDetailsPopup";
import useInternationalAccountsStore from "../../store/useInternationalAccountsStore";
import dynamic from "next/dynamic";
import FiraNpsPopUp from "../FiraNpsPopUp";

const SampleEinvoicePopup = dynamic(() => import("../EInvoicingPopupContainer/SampleEinvoicePopup"), { ssr: false });
const PreKycWalkthroughCta = dynamic(() => import("../AppTour/PreKycWalkthroughCta"), { ssr: false });

const AllPagePopups = () => {
  const { exporterDetails } = useContext(UserDetailsContext);
  const { isOpen } = useTour();
  const [isClientSide, setClientSide] = useState<boolean>(false);
  const [openPCPopup, setPCPopup] = useState<boolean>(false);
  const { isPopupVisible, showSampleEInvoice } = useEInvoicingStore();
  const { isPopupVisible: showZohoSyncPopUp, evaluateQuery } = useZohoSyncStore();
  const { fetchData } = useInternationalAccountsStore();
  const router = useRouter();

  useEffect(() => {
    setClientSide(true);
    fetchData();
  }, []);

  useEffect(() => {
    evaluateQuery(Object.keys(router.query));
  }, [router.query]);

  useEffect(() => {
    if (router.query.openPurposeCodePopup) {
      setPCPopup(true);
    } else {
      setPCPopup(false);
    }
  }, [router.query.openPurposeCodePopup]);

  return isClientSide ? (
    <>
      {!isOpen && isPreKycWalkthroughVisible(exporterDetails.onBoardingState) ? <PreKycWalkthroughCta /> : null}

      <AppTourDonePopup />
      <AppTourStartPopup />
      <AppTourExitConfirmationPopup />
      {showSampleEInvoice ? <SampleEinvoicePopup /> : null}
      {isPopupVisible ? <EInvoicingPopupContainer /> : null}
      {showZohoSyncPopUp ? <ZohoSyncPopUp /> : null}
      {openPCPopup ? <PurposeCode openPCPopup={openPCPopup} /> : null}
      <ShareDetailsPopup />
      <FiraNpsPopUp />
    </>
  ) : null;
};

export default AllPagePopups;
