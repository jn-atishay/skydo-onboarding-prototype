import Typography from "../AtomicComponents/Typography";
import Locale from "../../util/locale/en";
import { useEffect, useState } from "react";
import classNames from "classnames";

const TIME_TO_RESEND = 59;

interface Props {
  onResendOTPClick: () => void;
  containerClass?: string;
  timeToResend?: number;
  tabIndex?: number;
}

const ResendOtp = (props: Props) => {
  const { onResendOTPClick, containerClass, timeToResend, tabIndex } = props;
  const [timer, setTimer] = useState(timeToResend || TIME_TO_RESEND);

  useEffect(() => {
    if (timer > 0) {
      setTimeout(() => {
        setTimer(timer - 1);
      }, 1000);
    }
  }, [timer]);

  const onResendClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (timer <= 0) {
      onResendOTPClick();
      setTimer(TIME_TO_RESEND);
    }
    e.preventDefault();
    e.stopPropagation();
  };

  const mins = Math.floor(timer / 60);
  const formattedMins = mins < 10 ? `0${mins}` : mins;

  const seconds = timer % 60;
  const formatedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return (
    <div
      tabIndex={tabIndex}
      className={classNames(
        {
          "cursor-pointer": timer <= 0,
        },
        containerClass
      )}
      onClick={onResendClick}
    >
      {timer > 0 ? (
        <>
          <Typography text={Locale.resendOtpText} textClasses={"!text-black-600"} />
          <Typography text={formattedMins} textClasses={"!text-black-600 ml-1"} />:
          <Typography text={formatedSeconds} textClasses={"!text-black-600"} />
        </>
      ) : (
        <Typography text={Locale.resendOtp} textClasses={"!text-blue-400"} />
      )}
    </div>
  );
};

ResendOtp.defaultProps = {
  onResendOTPClick: () => {},
  tabIndex: 0,
};

export default ResendOtp;
