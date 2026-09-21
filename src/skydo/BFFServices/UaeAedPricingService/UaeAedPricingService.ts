import beCall from "../../util/beCall";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import BE_ROUTES, { BFF_ROUTES } from "../../util/beRoutes";
import fetch from "../fetch";
import { NextApiRequest, NextApiResponse } from "next";

const UAE_AED_PRICING_ENDPOINTS = {
  BANNER_CHECK_STATUS: BFF_ROUTES.UAE_BANNER_CHECK_STATUS,
  BANNER_DISMISS: BFF_ROUTES.UAE_BANNER_DISMISS,
};

export interface UaeBannerStatus {
  hasDismissedBanner: boolean;
}

export interface UaeBannerDismissResponse {
  success: boolean;
}

export const checkUaeBannerStatus = async (): Promise<UaeBannerStatus> => {
  try {
    const response = await beCall({
      url: UAE_AED_PRICING_ENDPOINTS.BANNER_CHECK_STATUS,
      method: ALLOWED_METHODS.GET,
    });

    const data = response as any;

    return {
      hasDismissedBanner: data?.hasDismissedBanner ?? false,
    };
  } catch (error) {
    console.error("Error checking UAE banner status:", error);
    return {
      hasDismissedBanner: false,
    };
  }
};

export const dismissUaeBanner = async (): Promise<UaeBannerDismissResponse> => {
  try {
    const response = await beCall({
      url: UAE_AED_PRICING_ENDPOINTS.BANNER_DISMISS,
      method: ALLOWED_METHODS.POST,
    });

    return {
      success: response?.success ?? false,
    };
  } catch (error) {
    console.error("Error dismissing UAE banner:", error);
    return {
      success: false,
    };
  }
};

// UAE Glomo Pay Merchant Creation Types
export interface GlomoPayMerchantCreateRequest {
  expectedCurrency: string;
  estimatedMonthlyVolume: string;
  expectedPaymentTimeline: string;
  currentUaeClientPayMethod: string;
}

export interface GlomoPayMerchantDto {
  id?: string;
  status?: string;
}

export interface GlomoPayVirtualAccountDto {
  accountNumber?: string;
  routingNumber?: string;
  bankName?: string;
}

export interface GlomoPayMerchantCreateResponse {
  success: boolean;
  merchant?: GlomoPayMerchantDto;
  virtualAccount?: GlomoPayVirtualAccountDto;
  message?: string;
}

export const createGlomoPayMerchant = async (
  req: NextApiRequest,
  res: NextApiResponse,
  data: GlomoPayMerchantCreateRequest
): Promise<GlomoPayMerchantCreateResponse> => {
  try {
    const response = await fetch(req, res, {
      url: BE_ROUTES.UAE_GLOMO_PAY_MERCHANT_CREATE,
      method: ALLOWED_METHODS.POST,
      body: data,
    });

    const data_response = response as any;

    return {
      success: data_response?.success ?? false,
      merchant: data_response?.merchant,
      virtualAccount: data_response?.virtualAccount,
      message: data_response?.message,
    };
  } catch (error) {
    console.error("Error creating Glomo Pay merchant:", error);
    throw new Error("Failed to create UAE account. Please try again.");
  }
};
