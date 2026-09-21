/**
 * @author Raj Sheth
 * created: 27/11/23
 */

import { ApiFuncParams } from "../index";
import { SANCTION_CATEGORY } from "../../constants/onboarding";

export type DeclarationData = {
  declarationType: keyof typeof SANCTION_CATEGORY;
  userResponse: string; // Yes/No
};

export interface PostDeclarationDataReq extends ApiFuncParams {
  declarationDataList: DeclarationData[];
}

export type PostDeclarationDataFunc = (req: PostDeclarationDataReq) => Promise<any>;
