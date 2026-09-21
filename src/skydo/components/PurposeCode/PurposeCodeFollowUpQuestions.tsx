import { useEffect, useState } from "react";
import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { BUTTON_SIZES, TOAST_TYPES, TYPOGRAPHY_SIZES, TYPOGRAPHY_TYPES } from "../../constants/atomicConstants";
import RadioButton from "../AtomicComponents/RadioButton";
import Notes from "../AtomicComponents/Notes";
import usePurposeCodeList from "../../store/usePurposeCodeList";
import TextInput from "../AtomicComponents/TextInput";
import Button from "../AtomicComponents/Button";
import useToastMessages from "../../store/toastMessages";
import useDocInputStore from "../../store/useDocInputStore";
import { Events } from "../../analytics/EventConstants";
import useAnalytics from "../../analytics/useAnalytics";

const SOFTEX_PURPOSE_CODES = ["P0802", "P0803", "P0804", "P0807"];
const SOFTEX_REQUIRED_PURPOSE_CODES = ["P0807"];
const SOFTEX_NOT_REQUIRED_PURPOSE_CODES = ["P0802", "P0803", "P0804"];

const PurposeCodeFollowUpQuestions = ({
  purposeCode,
  setOverrideCta,
  onSubmitClick,
  isSubmitLoading,
  setDropDownError,
}: {
  purposeCode: string;
  setOverrideCta: (override: boolean) => void;
  onSubmitClick: () => void;
  isSubmitLoading: boolean;
  setDropDownError: (error: boolean) => void;
}) => {
  const [fileForSoftex, setFileForSoftex] = useState<boolean | null>(null);
  const { iecVerified } = usePurposeCodeList();
  const { addToast } = useToastMessages();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [iec, setIec] = useState<string>("");
  const { verifyIec } = useDocInputStore();
  const [error, setError] = useState<string>("");
  const analytics = useAnalytics();

  useEffect(() => {
    if (SOFTEX_PURPOSE_CODES.includes(purposeCode)) {
      setOverrideCta(true);
    } else {
      setOverrideCta(false);
    }
  }, [purposeCode]);

  const verifyIecCode = async () => {
    if (!(iec && iec.trim())) {
      analytics.trackAsync(Events.PURPOSE_CODE_ERROR, {
        error: "iec_not_entered",
      });
      setError(Locale.iecRequired);
      return;
    }
    setIsLoading(true);

    const response = await verifyIec(iec as string);
    if (response.success) {
      onSubmitClick();
    } else {
      analytics.trackAsync(Events.PURPOSE_CODE_ERROR, {
        error: "iec_not_valid",
      });
      setError(Locale.iecValidation);
    }
    setIsLoading(false);
  };

  const onSubmit = () => {
    if (SOFTEX_PURPOSE_CODES.includes(purposeCode)) {
      if (fileForSoftex === null) {
        analytics.trackAsync(Events.PURPOSE_CODE_ERROR, {
          error: "file_for_softex_not_selected",
        });
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "pc_change_error",
          body: Locale.pleaseSelectAnOption,
        });
      } else if (SOFTEX_REQUIRED_PURPOSE_CODES.includes(purposeCode) && !fileForSoftex) {
        setDropDownError(true);
        analytics.trackAsync(Events.PURPOSE_CODE_ERROR, {
          error: "purpose_code_softex_mismatch",
          purposeCode: purposeCode,
          fileForSoftex: fileForSoftex,
        });
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "pc_change_error",
          body: Locale.changePurposeCodeToSoftexNotRequired,
        });
      } else if (SOFTEX_NOT_REQUIRED_PURPOSE_CODES.includes(purposeCode) && fileForSoftex) {
        setDropDownError(true);
        analytics.trackAsync(Events.PURPOSE_CODE_ERROR, {
          error: "purpose_code_softex_mismatch",
          purposeCode: purposeCode,
          fileForSoftex: fileForSoftex,
        });
        addToast({
          type: TOAST_TYPES.ERROR,
          id: "pc_change_error",
          body: Locale.changePurposeCodeToSoftexRequired,
        });
      } else if (SOFTEX_REQUIRED_PURPOSE_CODES.includes(purposeCode) && fileForSoftex && !iecVerified) {
        verifyIecCode();
      } else {
        onSubmitClick();
      }
    }
  };

  if (!SOFTEX_PURPOSE_CODES.includes(purposeCode)) {
    return null;
  }

  const onFileForSoftexChange = (value: boolean) => {
    analytics.trackAsync(Events.SOFTEX_FILING_ANSWER_SELECTED, {
      filingAnswer: value,
    });
    setFileForSoftex(value);
  };

  return (
    <div className={"flex flex-col gap-6"}>
      <div className={"flex flex-col gap-2"}>
        <Typography
          text={Locale.doYouFileSoftex}
          size={TYPOGRAPHY_SIZES.MEDIUM}
          type={TYPOGRAPHY_TYPES.PARA}
          textClasses={"!font-bold"}
        />
        <div className={"flex flex-col gap-5"}>
          <Typography
            text={Locale.doYouFileSoftexSubtext1Part1}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
          >
            <a
              href={"https://www.rbi.org.in/scripts/BS_FemaNotifications.aspx?Id=177"}
              target="_blank"
              rel="noreferrer"
            >
              <Typography
                text={Locale.doYouFileSoftexSubtext1Part2}
                size={TYPOGRAPHY_SIZES.SMALL}
                type={TYPOGRAPHY_TYPES.PARA}
                textClasses={"!text-blue-400 underline"}
              />
            </a>
            <Typography
              text={Locale.doYouFileSoftexSubtext1Part3}
              size={TYPOGRAPHY_SIZES.SMALL}
              type={TYPOGRAPHY_TYPES.PARA}
            />
          </Typography>
          <Typography
            text={Locale.doYouFileSoftexSubtext2}
            size={TYPOGRAPHY_SIZES.SMALL}
            type={TYPOGRAPHY_TYPES.PARA}
          />
        </div>
      </div>
      <RadioButton
        label={Locale.fileForSoftexAffirmative}
        checked={!!fileForSoftex}
        onChange={() => onFileForSoftexChange(true)}
        id={"yes"}
      />
      {SOFTEX_NOT_REQUIRED_PURPOSE_CODES.includes(purposeCode) && fileForSoftex ? (
        <Notes text={Locale.filingSoftexNote} iconHeight={24} iconWidth={24} className={"border border-yellow-200"} />
      ) : null}
      <RadioButton
        label={Locale.fileForSoftexNegative}
        checked={fileForSoftex === false}
        onChange={() => onFileForSoftexChange(false)}
        id={"no"}
      />
      {SOFTEX_REQUIRED_PURPOSE_CODES.includes(purposeCode) && fileForSoftex === false ? (
        <Notes
          text={Locale.notFilingSoftexNote}
          iconHeight={24}
          iconWidth={24}
          className={"border border-yellow-200"}
        />
      ) : null}
      {SOFTEX_REQUIRED_PURPOSE_CODES.includes(purposeCode) && fileForSoftex && !iecVerified ? (
        <TextInput
          label={Locale.iecInputLabel}
          value={iec}
          onChange={(value) => {
            setIec(value);
            setError("");
          }}
          isError={!!error}
          footerText={error}
        />
      ) : null}
      <Button
        title={
          SOFTEX_REQUIRED_PURPOSE_CODES.includes(purposeCode) && fileForSoftex && !iecVerified
            ? Locale.verifyAndSubmit
            : Locale.submit
        }
        size={BUTTON_SIZES.SMALL}
        onButtonClick={onSubmit}
        buttonClass={"self-end"}
        isLoading={isLoading || isSubmitLoading}
      />
    </div>
  );
};

export default PurposeCodeFollowUpQuestions;
