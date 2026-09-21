export const BUTTON_TYPES = {
  PRIMARY: "primary",
  SECONDARY: "secondary",
  TERTIARY: "tertiary",
};

export const BUTTON_SIZES = {
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
  X_SMALL: "x_small",
};

export const TYPOGRAPHY_TYPES = {
  PARA: "paragraph",
  HEADING: "heading",
  LABEL: "label",
  DISPLAY: "display",
};

export const TYPOGRAPHY_SIZES = {
  X_LARGE: "xLarge",
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
  X_SMALL: "xSmall",
  X_X_SMALL: "xxSmall",
  X_X_X_SMALL: "xxxSmall",
} as const;

export const TOOLTIP_POSITION = {
  TOP: "top",
  BOTTOM: "bottom",
  LEFT: "left",
  RIGHT: "right",
};

export const TOAST_TYPES: { INFO: string; ERROR: string; SUCCESS: string } = {
  INFO: "info",
  ERROR: "error",
  SUCCESS: "success",
};

export const INPUT_TYPES = {
  LARGE: "large",
  MEDIUM: "medium",
  SMALL: "small",
  X_SMALL: "x_small",
};

export enum INPUT_TEXT_VARIANTS {
  TEXT = "text",
  TEXT_AREA = "textarea",
}

export const DEFAULT_OTP_LENGTH = 6;

export const CURRENCY_HTML_CODE = {
  INR: <span>&#8377;</span>,
  USD: <span>&#36;</span>,
};

export const masterAcceptedMimeTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

export const textBasedMimeTypes = ["text/plain", "text/csv"];

export const previewableExtensions = ["jpeg", "jpg", "png", "pdf"];

export const previewableMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

export const acceptedMimeTypes = ["image/jpeg", "image/png", "application/pdf"];

export const acceptedMimeTypesForPdf = ["application/pdf"];

export const acceptedMimeTypesForContract = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

export const acceptedMimeTypesForText = ["text/plain"];

export const acceptedMimeTypesForImage = ["image/jpeg", "image/png"];

export const TrianglePointingDirection = {
  UP: "up", // pointing up (default)
  DOWN: "down", // pointing down
  LEFT: "left", // pointing left
  RIGHT: "right", // pointing right
};

export enum PopupContentCase {
  EMAIL = "email",
  UPLOAD_LOGO = "uploadLogo",
  CONFIRM_LOGO = "confirmLogo",
}

export enum BadgeTypes {
  Full = "full",
  Outline = "outline",
}

export enum BadgeSizes {
  Small = "small",
  Medium = "medium",
  X_Small = "x_small",
}

export enum CalendarPosition {
  TOP = "top",
  BOTTOM = "bottom",
}

export const TABS_SIZES = {
  LARGE: "large",
  SMALL: "small",
} as const;

export const OptionSizes = {
  SMALL: "small",
  MEDIUM: "medium",
  LARGE: "large",
} as const;

export const OptionStates = {
  Inactive: "inactive",
  Active: "active",
  Disabled: "disabled",
  Hover: "hover",
} as const;

export const DropdownSizes = {
  Small: "small",
  Medium: "medium",
  Large: "large",
  x_small: "x_small",
} as const;

export const SearchDropdownSizes = {
  Small: "small",
  Medium: "medium",
} as const;

export const DESKTOP_MIN_WIDTH = 768;
