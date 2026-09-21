export interface MobileInputPropsDto {
  goToNextStep: () => void;
  logOutPopUpVisible: boolean;
  setLogOutPopUpVisible: (visible: boolean) => void;
  mobile: string;
  setMobile: (mobile: string) => void;
  phoneError: string;
  setPhoneError: (error: string) => void;
  isLogoutLoading: boolean;
  setIsLogoutLoading: (loading: boolean) => void;
  isContinueLoading: boolean;
  setIsContinueLoading: (loading: boolean) => void;
  isReferred?: boolean;
}
