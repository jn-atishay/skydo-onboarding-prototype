import log from "./logger";
import { create, zustandDevtools } from "./index";
import { ActivationRewardDto, CashbackReasonType } from "../types";

interface RefundableDetails {
  isRefundablePageTopVisible: boolean;
  importerBusinessName: string;
  isRefunded: boolean;
  refundReason: string;
  cashbackReason?: CashbackReasonType;
  setRefundPageTopStatus: (values: RefundableDetailsState) => void;
  refundMetadata?: ActivationRewardDto;
}

export type RefundableDetailsState = {
  isRefundablePageTopVisible: boolean;
  importerBusinessName: string;
  isRefunded: boolean;
  refundReason: string;
  cashbackReason?: CashbackReasonType;
  refundMetadata?: ActivationRewardDto;
};

const useCashbackStore = create<RefundableDetails>()(
  zustandDevtools(
    log((set: any) => ({
      isRefundablePageTopVisible: false,
      importerBusinessName: "",
      isRefunded: false,
      refundReason: "",
      cashbackReason: undefined,
      refundMetadata: undefined,
      setRefundPageTopStatus: (values: RefundableDetailsState) => {
        set((store: RefundableDetails) => ({ ...store, ...values }));
      },
    }))
  )
);

export default useCashbackStore;
