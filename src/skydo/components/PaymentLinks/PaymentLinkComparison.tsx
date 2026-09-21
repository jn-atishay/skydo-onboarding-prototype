import { TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import Accordion from "../AtomicComponents/Accordion";
import Typography from "../AtomicComponents/Typography";
import Card from "../Common/Card";
import classNames from "classnames";
import BookIcon from "../Icons/BookIcon";

const PaymentLinkComparison = ({ className }: { className?: string }) => {
  const getAccordionTitle = () => {
    return (
      <div className={"flex flex-row space-x-4 items-center"}>
        <BookIcon />
        <Typography
          text={Locale.skydoAccVsLink.head}
          type={TYPOGRAPHY_TYPES.HEADING}
          size={TYPOGRAPHY_SIZES.X_SMALL}
          fontWeight={"700"}
        />
      </div>
    );
  };

  return (
    <Card className={classNames("w-full !p-0 flex flex-col border border-black-400", className)}>
      <Accordion
        titleEle={getAccordionTitle()}
        titleClasses={"p-6"}
        openTitleClasses={"border-b border-black-400"}
        isDefaultOpen={false}
      >
        <div className="overflow-x-auto p-6">
          <table className="min-w-full border-separate border-spacing-0">
            <thead>
              <tr className="bg-blue-50">
                <th className="text-left px-6 py-4 w-1/5"></th>
                <th className="text-left px-6 py-4 w-2/5 border-l border-black-100">
                  <Typography
                    text="Skydo US account transfer"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={700}
                  />
                </th>
                <th className="text-left px-6 py-4 w-2/5 border-l border-black-100">
                  <Typography
                    text="InstaLinks"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={700}
                    textClasses="!text-blue-500"
                  />
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-black-100 bg-black-50">
                <td className="px-6 py-4 align-top w-1/5">
                  <Typography
                    text="Payer experience"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={700}
                  />
                </td>
                <td className="px-6 py-4 border-l border-black-100 align-top w-2/5">
                  <Typography
                    text="Manual input required in their banking portal"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={400}
                  />
                </td>
                <td className="px-6 py-4 border-l border-black-100 align-top w-2/5">
                  <Typography
                    text="Easier to do, no manual inputs & account details required"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={400}
                    textClasses="!text-blue-500"
                  />
                </td>
              </tr>
              <tr className="border-t border-black-100 bg-black-50">
                <td className="px-6 py-4 align-top w-1/5">
                  <Typography
                    text="Pricing"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={700}
                  />
                </td>
                <td className="px-6 py-4 border-l border-black-100 align-top w-2/5">
                  <Typography
                    text={
                      <>
                        <span className="font-bold">$19</span> for under $2000
                        <br />
                        <span className="font-bold">$29</span> for under $10,000
                        <br />
                        <span className="font-bold">0.3%</span> for above $10,000
                      </>
                    }
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={400}
                  />
                </td>
                <td className="px-6 py-4 border-l border-black-100 align-top w-2/5">
                  <Typography
                    text={
                      <>
                        <span className="font-bold">2% pricing</span> (Minimum $9)
                        <br />
                        Cheaper for under $1000 payments compared to bank transfer
                      </>
                    }
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={400}
                    textClasses="!text-blue-500"
                  />
                </td>
              </tr>
              <tr className="border-t border-black-100 bg-black-50">
                <td className="px-6 py-4 align-top w-1/5">
                  <Typography
                    text="Settlement time"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={700}
                  />
                </td>
                <td className="px-6 py-4 border-l border-black-100 align-top w-2/5">
                  <Typography
                    text="1 business day; no instant payment confirmation"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={400}
                  />
                </td>
                <td className="px-6 py-4 border-l border-black-100 align-top w-2/5">
                  <Typography
                    text="6 business days; Instant payment confirmation"
                    type={TYPOGRAPHY_TYPES.PARA}
                    size={TYPOGRAPHY_SIZES.MEDIUM}
                    fontWeight={400}
                    textClasses="!text-blue-500"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Accordion>
    </Card>
  );
};

export default PaymentLinkComparison;
