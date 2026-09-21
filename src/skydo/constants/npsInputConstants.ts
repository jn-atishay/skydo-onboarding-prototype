export enum NpsInputSource {
  POP_UP = "POP_UP",
  TRANSACTION_TRACKER = "TRANSACTION_TRACKER",
  PUBLIC_PAGE = "PUBLIC_PAGE",
}

export interface FetchNpsDataResponse {
  showNps: boolean;
}

export enum ScoreRange {
  NA = "NA",
  LOW = "LOW",
  MID = "MID",
  HIGH = "HIGH",
}

export const getScoreRange = (score: number): ScoreRange => {
  if (score == 0) return ScoreRange.NA;
  if (score <= 6) return ScoreRange.LOW;
  if (score <= 8) return ScoreRange.MID;
  return ScoreRange.HIGH;
};

export const scoreRangeToPresetReasons: Record<ScoreRange, string[]> = {
  [ScoreRange.NA]: [],
  [ScoreRange.LOW]: ["Delayed payments", "Expensive for me", "Too much documentation required"],
  [ScoreRange.MID]: ["Delayed payments", "Expensive for me", "Too much documentation required"],
  [ScoreRange.HIGH]: [],
};

export const scoreRangeToSubjectiveQuestion: Record<ScoreRange, string> = {
  [ScoreRange.NA]: "",
  [ScoreRange.LOW]: "We’re sorry. How can we improve?",
  [ScoreRange.MID]: "Oh! What can we do to be better?",
  [ScoreRange.HIGH]: "",
};

export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
