import { useState, useEffect, useContext, useRef } from 'react';
import useAnalytics from '../analytics/useAnalytics';
import { Events } from '../analytics/EventConstants';
import useToastMessages from '../store/toastMessages';
import { TOAST_TYPES } from '../constants/atomicConstants';
import Locale from '../util/locale/en';
import { UserDetailsContext } from '../components/DashboardContainer';

interface UseUaeAedPricingPopupProps {
  selectedCurrency?: string;
  selectedLocation?: string;
  source: string; // e.g., 'invoice_bank_details', 'international_accounts', 'mobile_home'
  hasUaeLocalAccount?: boolean; // Whether UAE local account exists (defaults to true for backward compatibility)
}

interface UseUaeAedPricingPopupReturn {
  showUaeAedPricingPopup: boolean;
  isUaeAedPricingLoading: boolean;
  handleUaeAedPricingAccept: () => Promise<void>;
  handleUaeAedPricingClose: () => void;
}

/**
 * Custom hook to manage UAE AED pricing popup state and logic
 * Reusable across different components that need to show the pricing popup
 */
export const useUaeAedPricingPopup = ({
  selectedCurrency,
  selectedLocation,
  source,
  hasUaeLocalAccount = true,
}: UseUaeAedPricingPopupProps): UseUaeAedPricingPopupReturn => {
  const { refetchUserDetails } = useContext(UserDetailsContext);
  const analytics = useAnalytics();
  const { addToast } = useToastMessages();

  const [showUaeAedPricingPopup, setShowUaeAedPricingPopup] = useState(false);
  const [isUaeAedPricingLoading, setIsUaeAedPricingLoading] = useState(false);

  const hasShownPopupRef = useRef(false);
  useEffect(() => {
    const shouldShow = false;

    if (shouldShow && !hasShownPopupRef.current) {
      // Show popup and track that we've shown it
      hasShownPopupRef.current = true;
      setShowUaeAedPricingPopup(true);
      analytics.trackAsync(Events.UAE_AED_PRICING_POPUP_SHOWN, {
        source,
        currency: selectedCurrency,
        location: selectedLocation,
      });
    } else if (!shouldShow && showUaeAedPricingPopup) {
      setShowUaeAedPricingPopup(false);
    }
  }, [hasUaeLocalAccount, selectedCurrency]);

  const handleUaeAedPricingAccept = async () => {
    if (isUaeAedPricingLoading) return;

    try {
      setShowUaeAedPricingPopup(false);
      setIsUaeAedPricingLoading(true);

      // Refetch in background
      refetchUserDetails();
    } catch (error) {
      console.error('Error updating UAE AED pricing popup state:', error);
      addToast({
        type: TOAST_TYPES.ERROR,
        body: Locale.dataUpdateFailed,
        id: 'uaeAedPricingError',
      });
    } finally {
      setIsUaeAedPricingLoading(false);
    }
  };

  const handleUaeAedPricingClose = () => {
    setShowUaeAedPricingPopup(false);
    analytics.trackAsync(Events.UAE_AED_PRICING_POPUP_CLOSED, {
      source,
      currency: selectedCurrency,
      location: selectedLocation,
    });
  };

  return {
    showUaeAedPricingPopup,
    isUaeAedPricingLoading,
    handleUaeAedPricingAccept,
    handleUaeAedPricingClose,
  };
};

