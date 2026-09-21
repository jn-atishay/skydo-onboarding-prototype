/**
 * @author Raj Sheth
 * created: 23/04/24
 */

export enum TaskType {
  "UDYAM_OCR" = "UDYAM_OCR",
  "BIZ_DETAILS" = "BIZ_DETAILS",
  "NAME_MATCH" = "NAME_MATCH",
}

export const INVALID_DOC = "INVALID_DOC";

export enum TaskStatus {
  "NOT_STARTED" = "NOT_STARTED",
  "IN_PROGRESS" = "IN_PROGRESS",
  "SUCCESS" = "SUCCESS",
  // could be with error where we dont want user to retry
  "COMPLETE" = "COMPLETE",
  "ERROR" = "ERROR",
}

export interface UdyamOcrTask {
  type: TaskType;
  status: TaskStatus;
  errorReason?: string;
  data?: any;
}

export type UdyamTasks = UdyamOcrTask[];
