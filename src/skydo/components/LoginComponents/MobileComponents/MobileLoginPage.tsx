import EmailLoginFlowMobile from "./EmailLoginFlowMobile";
import classnames from "classnames";

interface MobileLoginPageProps {
  className?: string;
  preFilledEmail?: string;
  isEmailDisabled?: boolean;
  platformName?: string;
  isReferred?: boolean;
}

const MobileLoginPage = ({ className, preFilledEmail, isEmailDisabled, platformName, isReferred }: MobileLoginPageProps) => {
  return (
    <>
      <div className={classnames("flex flex-col", className)}>
        <EmailLoginFlowMobile
          preFilledEmail={preFilledEmail}
          isEmailDisabled={isEmailDisabled}
          platformName={platformName}
          isReferred={isReferred}
        />
      </div>
    </>
  );
};

export default MobileLoginPage;
