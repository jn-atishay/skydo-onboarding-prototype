import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import CheckIcon from "../Icons/CheckIcon";
import Button from "../AtomicComponents/Button";
import CrossIcon from "../AtomicComponents/ToastMessages/CrossIcon";
import useSkydoDetails from "../../util/customHooks/useSkydoDetails";

const Footer = ({ children }: { children?: React.ReactElement | React.ReactElement[] }) => {
  const { skydoContact, skydoEmail } = useSkydoDetails();
  return (
    <div className={"flex flex-1 flex-col items-center"}>
      {children}
      <div className={"flex flex-col px-10 py-4 mt-10 bg-blue-50"}>
        <Typography
          text={Locale.assistanceTextGeneric
            .replace("{{SkydoContact}}", skydoContact)
            .replace("{{SkydoEmail}}", skydoEmail)}
          type={TYPOGRAPHY_TYPES.PARA}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"!text-black-500 text-center"}
        />
      </div>
    </div>
  );
};

const UnsupportedPanPopup = ({ setUnsupportedPopup }: { setUnsupportedPopup: (val: boolean) => void }) => {
  const renderCompanyType = (title: string, isUnsupported?: boolean) => (
    <div className={"flex flex-row justify-start items-center mt-2"}>
      {isUnsupported ? <CrossIcon is24X24 /> : <CheckIcon />}
      <Typography text={title} textClasses={"ml-2"} />
    </div>
  );

  return (
    <div className={"flex flex-col"}>
      <div className={"flex flex-col px-10 overflow-y-scroll md:overflow-y-auto pb-[200px] md:pb-0"}>
        <Typography
          text={Locale.notSupportedPanPopup}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.SMALL}
          textClasses={"mb-4"}
        />
        {renderCompanyType(Locale.privateLtdCompany)}
        {renderCompanyType(Locale.llp)}
        {renderCompanyType(Locale.partnershipFirm)}
        {renderCompanyType(Locale.proprietorship)}
        {renderCompanyType(Locale.freelancer)}
        {renderCompanyType(Locale.huf)}
      </div>
      <div className={"hide_for_mob"}>
        <Footer>
          <hr className={"w-[80%] my-6 border-black-400"} />
          <div className={"w-full flex flex-col items-center"}>
            <Typography text={Locale.believeMistake} textClasses={"!mb-4"} />
            <Button
              onButtonClick={() => setUnsupportedPopup(false)}
              title={Locale.changePan}
              buttonClass={"!w-2/3"}
              textClasses={"!w-full flex justify-center"}
            />
          </div>
        </Footer>
      </div>
      <div className={"hide_for_desktop fixed bottom-0 left-0 right-0 bg-white"}>
        <Footer>
          <hr className={"w-[80%] mb-6 border-black-400"} />
          <div className={"w-full flex flex-col items-center"}>
            <Typography text={Locale.believeMistake} textClasses={"!mb-4"} />
            <Button
              onButtonClick={() => setUnsupportedPopup(false)}
              title={Locale.changePan}
              buttonClass={"!w-2/3"}
              textClasses={"!w-full flex justify-center"}
            />
          </div>
        </Footer>
      </div>
    </div>
  );
};

export default UnsupportedPanPopup;
