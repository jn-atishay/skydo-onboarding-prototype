import { fetchData } from "../../util/beCall";
import { ALLOWED_METHODS } from "../../constants/apiConstants";
import { ResponseWrapper } from "../../authentication/api/AuthApiDto";
import BE_ROUTES from "../../util/beRoutes";

export interface PaymentMethodFeedbackRequest {
  paymentMethods: string[];
  additionalFeedback?: string;
}

export interface PaymentMethodFeedbackResponse {
  success: boolean;
  message?: string;
}

export const submitPaymentMethodFeedback = async (
  request: PaymentMethodFeedbackRequest
): Promise<ResponseWrapper<PaymentMethodFeedbackResponse>> => {
  return await fetchData<PaymentMethodFeedbackResponse>({
    path: BE_ROUTES.PAYMENT_METHOD_FEEDBACK,
    method: ALLOWED_METHODS.POST,
    body: request,
  });
};