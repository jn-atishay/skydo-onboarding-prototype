import { LoginRecoveryProps } from "../../types/Login";
import Button from "../AtomicComponents/Button";
import Typography from "../AtomicComponents/Typography";
import { BUTTON_SIZES } from "../../constants/atomicConstants";
import Locale from "../../util/locale/en";

const LoginRecovery = ({ message, action, loading, onRetry, onChangeEmail }: LoginRecoveryProps) => (
  <div className="flex flex-col gap-4" role="status" aria-live="polite">
    {!loading && (
      <div className="rounded-10px bg-red-50 p-4">
        <Typography text={message} textClasses="!text-red-500" />
      </div>
    )}
    <Button
      title={loading ? Locale.loginOpening : action}
      loadingTitle={Locale.loginOpeningAction}
      isLoading={loading}
      onButtonClick={onRetry}
      size={BUTTON_SIZES.LARGE}
      buttonClass="!w-full justify-center"
    />
    {onChangeEmail && (
      <Button
        title={Locale.loginChangeEmail}
        onButtonClick={onChangeEmail}
        isDisabled={loading}
        size={BUTTON_SIZES.LARGE}
      />
    )}
    {!loading && <Typography text={Locale.loginSupportPhone} />}
  </div>
);
export default LoginRecovery;
