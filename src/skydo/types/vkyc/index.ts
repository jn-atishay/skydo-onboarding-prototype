/**
 * @author Raj Sheth
 * created: 27/02/24
 */

/**
 *   {
 *       "id": "",
 *       "status": "LINK_CREATED",
 *       "referenceId": "7d5315de-4c34-4017-a256-31b9e361c322",
 *       "profileId": "490951cb-9805-43b8-9806-8945b6c640ac",
 *       "exporterId": 1213,
 *       "vkycLink": "https://capture.kyc.idfy.com/captures?t=Iz",
 *       "expiredAt": "2024-03-28T11:08:33.246+05:30",
 *       "isExpired": false,
 *       "daysRemaining": 30,
 *       "linkType": "WITH_AADHAAR"
 *   }
 */
export interface GenerateVKYCLinkResponse {
  status: BackendVKYCStatus;
  referenceId: string;
  profileId: string;
  exporterId: number;
  vkycLink: string;
  expiredAt: string;
  isExpired: boolean;
  daysRemaining: number;
  linkType: string;
}

export enum VKYCStatus {
  NOT_STARTED = "NOT_STARTED",
  PENDING = "PENDING",
  FAILED = "FAILED",
  APPROVED = "APPROVED",
}

export enum BackendVKYCStatus {
  AUDITOR_APPROVED = "AUDITOR_APPROVED",
  AUDITOR_REVIEW_REQUIRED = "AUDITOR_REVIEW_REQUIRED",
  AUDITOR_REJECTED = "AUDITOR_REJECTED",
}

export enum LinkType {
  WITH_AADHAAR = "WITH_AADHAAR",
}
