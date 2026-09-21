import useArchiveOrBlacklistStore from "../../store/useArchiveOrBlacklistStore";
import Layout from "./index";
import dynamic from "next/dynamic";

interface Props {
  children: React.ReactElement;
}

const BlackListedPopup = dynamic(() => import("../CompanyPanDetails/BlackListedPopup"), { ssr: false });
const GlobalContainer = (props: Props) => {
  const { isArchiveOrBlacklistPopupOpen } = useArchiveOrBlacklistStore();
  return (
    <Layout>
      <>
        {props.children}
        {isArchiveOrBlacklistPopupOpen ? <BlackListedPopup /> : null}
      </>
    </Layout>
  );
};

export default GlobalContainer;
