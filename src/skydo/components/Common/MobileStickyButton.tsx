import { BUTTON_TYPES } from "../../constants/atomicConstants";
import Button from "../AtomicComponents/Button";

const MobileStickyButton = ({
  isLoading,
  title,
  onButtonClick,
  isDisabled,
  secondaryButtonTitle,
  secondaryButtonOnClick,
  secondaryButtonDisabled,
  secondaryButtonLoading
}: {
  isLoading?: boolean;
  title: string;
  onButtonClick: () => void;
  isDisabled?: boolean;
  secondaryButtonTitle?: string;
  secondaryButtonOnClick?: () => void;
  secondaryButtonDisabled?: boolean;
  secondaryButtonLoading?: boolean;
}) => {
  return (
    <div className={"hide_for_desktop_flex fixed z-10 bottom-0 left-0 right-0 p-4 bg-white flex-col gap-2"}>
      <Button
        isLoading={isLoading}
        title={title}
        onButtonClick={onButtonClick}
        buttonClass={"!flex !flex-1 flex-row justify-center !w-full"}
        isDisabled={isDisabled}
      />
      {secondaryButtonTitle ? (
        <Button
          isLoading={secondaryButtonLoading}
          title={secondaryButtonTitle}
          type={BUTTON_TYPES.SECONDARY}
          onButtonClick={secondaryButtonOnClick}
          buttonClass={"!flex !flex-1 flex-row justify-center !w-full"}
          isDisabled={secondaryButtonDisabled}
        />
      ) : null}
    </div>
  );
};

export default MobileStickyButton;
