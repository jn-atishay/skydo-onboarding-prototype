import log from "./logger";
import { PurposeCodeList } from "../types";
import { create, zustandDevtools } from "./index";

interface PCListDetails {
  purposeCodeList: PurposeCodeList;
  iecVerified: boolean;
  hdfcBankAccount: boolean;
  isAmazonUser: boolean | undefined;
  totalUnsettledFunds : number | undefined;
  /** Shipping method from backend (CSB4, CSB5) – used to pre-select in Amazon purpose code popup */
  shippingMethod: string | undefined;
  setPurposeCodeList: (list: PurposeCodeList) => void;
  setIecAndAmazonAndHdfcBankAccount: (iecVerified: boolean, isAmazonUser: boolean, hdfcBankAccount: boolean, totalUnsettledFunds: number) => void;
  setShippingMethod: (shippingMethod: string | undefined) => void;
}

const usePurposeCodeList = create<PCListDetails>()(
  zustandDevtools(
    log((set: any) => ({
      purposeCodeList: [],
      iecVerified: false,
      hdfcBankAccount: false,
      isAmazonUser: undefined,
      totalUnsettledFunds: 0,
      shippingMethod: undefined,
      setPurposeCodeList: (list: PurposeCodeList) => {
        set((store: PCListDetails) => ({ ...store, purposeCodeList: [...list] }));
      },
      setIecAndAmazonAndHdfcBankAccount: (iecVerified: boolean, isAmazonUser: boolean, hdfcBankAccount: boolean,totalUnsettledFunds:number) => {
        set((store: PCListDetails) => ({ ...store, iecVerified: iecVerified, isAmazonUser: isAmazonUser, hdfcBankAccount: hdfcBankAccount ,totalUnsettledFunds: totalUnsettledFunds}));
      },
      setShippingMethod: (shippingMethod: string | undefined) => {
        set((store: PCListDetails) => ({ ...store, shippingMethod }));
      },
    }))
  )
);

export default usePurposeCodeList;
