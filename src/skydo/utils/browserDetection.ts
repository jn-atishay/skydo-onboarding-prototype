/**
 * Browser Detection Utilities
 * Detects Safari and iOS browsers for Veem SDK compatibility
 */

export const detectBrowser = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return {
      isSafari: false,
      isIOS: false,
      isChrome: false,
      isFirefox: false,
      isMobile: false,
      userAgent: ''
    };
  }

  const userAgent = navigator.userAgent;

  // Safari detection (excludes Chrome and Android browsers)
  const isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  
  // iOS detection (iPhone, iPad, iPod)
  const isIOS = /iPad|iPhone|iPod/.test(userAgent);
  
  // Chrome detection
  const isChrome = /Chrome/.test(userAgent) && !/Edge/.test(userAgent);
  
  // Firefox detection
  const isFirefox = /Firefox/.test(userAgent);
  
  // Mobile detection
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

  return {
    isSafari,
    isIOS,
    isChrome,
    isFirefox,
    isMobile,
    userAgent
  };
};

export const isVeemSDKSupported = () => {
  // Veem SDK now works on all browsers and operating systems
  return true;
};

export const getUnsupportedReason = () => {
  const { isSafari, isIOS, isMobile } = detectBrowser();
  
  if (isIOS) {
    return {
      title: 'Card payments are unavailable',
      subtitle: 'Apologies for the inconvenience.',
      isDesktopSuggested: true
    };
  }
  
  if (isSafari) {
    return {
      title: 'Card payments are unavailable',
      subtitle: 'Apologies for the inconvenience.',
      isDesktopSuggested: false
    };
  }
  
  return {
    title: 'Card payments are unavailable',
    subtitle: 'Apologies for the inconvenience.',
    isDesktopSuggested: false
  };
};