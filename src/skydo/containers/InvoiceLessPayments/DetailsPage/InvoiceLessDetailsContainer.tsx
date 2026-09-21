import useMobileVersionHook from "../../../components/Common/useMobileVersionHook";
import InvoiceLessDetails from "./InvoiceLessDetails";
import RecentPaymentDetailsMobile from "../../RecentPaymentsMobile/RecentPaymentDetailsMobile";

const InvoiceLessDetailsContainer = () => {

  const { isMobile } = useMobileVersionHook();

  if(isMobile == false)
    return <InvoiceLessDetails/>

  if(isMobile == true)
    return <RecentPaymentDetailsMobile/>

  return null
}

export default InvoiceLessDetailsContainer;