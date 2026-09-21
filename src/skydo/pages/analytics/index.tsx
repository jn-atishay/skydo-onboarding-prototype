import BusinessAnalyticsPage from "./business";
import withAuth from "../../authentication/WithAuth";

const Analytics = () => {
  return <BusinessAnalyticsPage />;
};

export default withAuth(Analytics);
