import { useEffect, useState } from "react";
import useDocInputStore from "../../store/useDocInputStore";
import useToastMessages from "../../store/toastMessages";
import {
  BUTTON_TYPES,
  TOAST_TYPES,
  TYPOGRAPHY_SIZES,
  TYPOGRAPHY_TYPES,
} from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";
import TextInput from "../AtomicComponents/TextInput";
import Button from "../AtomicComponents/Button";
import Typography from "../AtomicComponents/Typography";
import useAnalytics from "../../analytics/useAnalytics";
import { Events } from "../../analytics/EventConstants";
import IecErrorNote, { IEC_ERROR_CODES } from "../../containers/IecErrorNote";

interface IecProps {
  exporterIec?: IecDto;
  refetchData: () => void;
  onFileUploaded: (status: boolean) => void;
  handleSubmitIEC?: () => void;
  isOptional?: boolean;
  /** Notifies parent of current IEC input value (for validation: must be empty or verified) */
  onIecChange?: (value: string) => void;
}

export type IecDto = {
  ieCode: string;
  verifiedBy: string;
};

const getIecErrorMessages = (errorType: string) => {
  switch (errorType) {
    case IEC_ERROR_CODES.NO_RECORD_FOUND:
      return Locale.iecIsInvalid;
    case IEC_ERROR_CODES.IEC_DEACTIVATED:
      return Locale.iecIsDeactivated;
    case IEC_ERROR_CODES.IEC_NAME_MISMATCH:
      return Locale.businessNameDoesNotMatchWithIec;
    default:
      return Locale.iecValidation;
  }
};

const IECInput = (props: IecProps) => {
  const { exporterIec, refetchData, onFileUploaded, handleSubmitIEC, isOptional, onIecChange } = props;
  const [iec, setIec] = useState<string | undefined>(exporterIec?.ieCode);
  const [isLoading, setLoading] = useState(false);
  const { verifyIec, iecErrorType, setIecErrorType } = useDocInputStore();
  const { addToast } = useToastMessages();
  const analytics = useAnalytics();

  useEffect(() => {
    setIec(exporterIec?.ieCode);
    onIecChange?.(exporterIec?.ieCode ?? "");
  }, [exporterIec?.ieCode]);

  useEffect(() => {
    setIecErrorType("");
    return () => {
      setIecErrorType("");
    };
  }, []);

  const verifyIecCode = async () => {
    if (!(iec && iec.trim())) {
      addToast({
        id: "iec_t",
        type: TOAST_TYPES.ERROR,
        body: Locale.iecRequired,
      });
      return;
    }
    setLoading(true);
    analytics.trackAsync(Events.IEC_VERIFICATION.IEC_VERIFICATION_ATTEMPTED);
    const response = await verifyIec(iec as string);
    if (response.success) {
      refetchData();
      handleSubmitIEC && handleSubmitIEC();
      onFileUploaded(true);
      addToast({
        id: "iec_success",
        type: TOAST_TYPES.SUCCESS,
        body: Locale.iecVerifiedSuccessfully,
      });
      analytics.trackAsync(Events.IEC_VERIFICATION.IEC_VERIFICATION_SUCCESS);
    } else {
      if (response.message === IEC_ERROR_CODES.NO_RECORD_FOUND) {
        setIecErrorType(IEC_ERROR_CODES.NO_RECORD_FOUND);
        analytics.trackAsync(Events.IEC_VERIFICATION.IEC_VERIFICATION_FAILURE, {
          errorType: IEC_ERROR_CODES.NO_RECORD_FOUND,
        });
      } else if (response.message === IEC_ERROR_CODES.IEC_DEACTIVATED) {
        setIecErrorType(IEC_ERROR_CODES.IEC_DEACTIVATED);
        analytics.trackAsync(Events.IEC_VERIFICATION.IEC_VERIFICATION_FAILURE, {
          errorType: IEC_ERROR_CODES.IEC_DEACTIVATED,
        });
      } else if (response.message === IEC_ERROR_CODES.IEC_NAME_MISMATCH) {
        setIecErrorType(IEC_ERROR_CODES.IEC_NAME_MISMATCH);
        analytics.trackAsync(Events.IEC_VERIFICATION.IEC_VERIFICATION_FAILURE, {
          errorType: IEC_ERROR_CODES.IEC_NAME_MISMATCH,
        });
      } else {
        analytics.trackAsync(Events.IEC_VERIFICATION.IEC_VERIFICATION_FAILURE, {
          errorType: IEC_ERROR_CODES.API_ERROR,
        });
        setIecErrorType(IEC_ERROR_CODES.API_ERROR);
      }
    }
    setLoading(false);
  };

  const isVerified = !!exporterIec?.ieCode;

  return (
    <div className={"flex flex-col gap-6 w-full"}>
      <div className={"flex flex-col gap-2 w-full"}>
        <div className={"flex flex-row items-end gap-4 w-full"}>
          <TextInput
            isDisabled={isVerified}
            label={isOptional ? `${Locale.iecInputLabelOptional} ${Locale.optional}` : Locale.iecInputLabel}
            isLabelRequired={!isOptional}
            value={iec}
            onChange={(value) => {
              setIec(value);
              setIecErrorType("");
              onIecChange?.(value ?? "");
            }}
            inputClass={"flex-1"}
            isError={!!iecErrorType}
          />
          <Button
            type={
              isVerified ? BUTTON_TYPES.PRIMARY : isOptional ? BUTTON_TYPES.SECONDARY : BUTTON_TYPES.PRIMARY
            }
            title={isVerified ? Locale.verified : Locale.verify}
            isLoading={isLoading}
            onButtonClick={() => {
              if (isVerified) return;
              verifyIecCode();
            }}
            buttonClass={isVerified ? "!bg-green-50" : "ml-3"}
            textClasses={isVerified ? "!text-green-400" : ""}
          />
        </div>
        {!iecErrorType ? null : (
          <Typography
            text={getIecErrorMessages(iecErrorType)}
            type={TYPOGRAPHY_TYPES.PARA}
            size={TYPOGRAPHY_SIZES.X_SMALL}
            textClasses={"!text-red-400"}
          />
        )}
      </div>
      <IecErrorNote className={"md:hidden"} />
    </div>
  );
};

export default IECInput;
