import withAuth from "../../../authentication/WithAuth";
import InvoiceLessDetailsContainer
  from "../../../containers/InvoiceLessPayments/DetailsPage/InvoiceLessDetailsContainer";

const PayoutDetails = () => {

  return <InvoiceLessDetailsContainer/>
}

export default withAuth(PayoutDetails);