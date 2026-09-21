import React, { useState } from 'react';
import Typography from '../AtomicComponents/Typography';
import { TYPOGRAPHY_TYPES, TYPOGRAPHY_SIZES, BUTTON_SIZES, BUTTON_TYPES, INPUT_TYPES } from '../../constants/atomicConstants';
import Button from '../AtomicComponents/Button';
import TextInput from '../AtomicComponents/TextInput';
import Popup from '../AtomicComponents/Popup';
import BottomSheet from '../AtomicComponents/BottomSheet';
import Locale from '../../util/locale/en';

interface PasswordProtectedPopupProps {
  onSubmit: (password: string) => Promise<string | void>;
  onClose: () => void;
  open: boolean;
}

const PasswordProtectedPopup: React.FC<PasswordProtectedPopupProps> = ({ onSubmit, onClose, open }) => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!password) {
      setError('Please enter a password');
      return;
    }
    
    setIsLoading(true);
    try {
      const errorMessage = await onSubmit(password);
      if (errorMessage) {
        setError(errorMessage);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    return (
      <div className="md:w-[450px]">
        <div className="flex flex-col gap-6">
          {/* Password Input */}
          <TextInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(value) => {
              setPassword(value);
              setError('');
            }}
            isError={!!error}
            footerText={error}
            size={INPUT_TYPES.SMALL}
          />
          {/* Buttons */}
        </div>
      </div>
    );
  };

  const renderCTAs = () => {
    return <div className="flex gap-2 mt-10">
    <Button
      title={Locale.tryAnotherStatement}
      size={BUTTON_SIZES.SMALL}
      type={BUTTON_TYPES.SECONDARY}
      onButtonClick={onClose}
    />
    <Button
      title={Locale.continueButton}
      size={BUTTON_SIZES.SMALL}
      type={BUTTON_TYPES.PRIMARY}
      onButtonClick={handleSubmit}
      isLoading={isLoading}
    />
  </div>
  }

  return (
    <div>
        <div className='hide_for_mob'>
    <Popup 
      title={Locale.enterPasswordToUnlockBankStatement} 
      isCommonHeader={true} 
      closeIconClick={onClose} 
      disableCrossIcon={true} 
      renderContent={renderContent} 
      open={open} 
      outsideClick={onClose} 
      isMobilePopup={true} 
      containerClass="w-full" 
      renderCTAs={renderCTAs}
    />
    </div>
    <div className='hide_for_desktop'>
        <BottomSheet isOpen={open} onClose={onClose} title={Locale.enterPasswordToUnlockBankStatement} withCloseIcon={false}>
            {renderContent()}
            {renderCTAs()}
        </BottomSheet>
    </div>
    </div>
  );
};

export default PasswordProtectedPopup;