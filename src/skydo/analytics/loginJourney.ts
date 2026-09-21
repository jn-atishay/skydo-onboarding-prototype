import { LoginJourney } from "../types/Login";
import { LOGIN_JOURNEY_TTL_MS } from "../constants/loginConstants";
import { createLoginAttemptId } from "../util/loginAttemptId";
import { Analytics } from "./useAnalytics";

const KEY = "skydo_login_journey";
let current: LoginJourney | null = null;
const analyticsChallenges = new Map<string, string>();
export const getLoginJourney = (): LoginJourney | null => {
  if (current && Date.now() - current.startedAt < LOGIN_JOURNEY_TTL_MS) return current;
  current = null;
  try {
    const saved = JSON.parse(sessionStorage.getItem(KEY) || "null") as LoginJourney | null;
    if (
      saved &&
      /^[a-zA-Z0-9-]{8,64}$/.test(saved.id) &&
      saved.startedAt <= Date.now() &&
      Date.now() - saved.startedAt < LOGIN_JOURNEY_TTL_MS
    )
      current = saved;
  } catch {
    /* Storage can be unavailable in private browsing. */
  }
  return current;
};
export const adoptLoginJourney = (journey: LoginJourney): void => {
  if (current?.id !== journey.id) analyticsChallenges.clear();
  current = journey;
  try {
    sessionStorage.setItem(KEY, JSON.stringify(journey));
  } catch {
    /* Keep the journey in memory. */
  }
};
export const trackLogin = (
  analytics: Analytics | undefined,
  event: string,
  properties: Record<string, unknown> = {}
): void => {
  const journey = getLoginJourney();
  try {
    // Authentication challenge identifiers must never reach analytics destinations.
    const safeProperties = { ...properties };
    if (typeof properties.challenge_id === "string") {
      const challenge = properties.challenge_id;
      if (!analyticsChallenges.has(challenge)) analyticsChallenges.set(challenge, createLoginAttemptId());
      safeProperties.challenge_id = analyticsChallenges.get(challenge);
    }
    analytics?.trackAsync(event, {
      login_attempt_id: journey?.id,
      auth_method: journey?.method,
      origin_surface: journey?.origin,
      elapsed_ms: journey ? Date.now() - journey.startedAt : undefined,
      ...safeProperties,
    });
  } catch {
    /* Analytics must never prevent login or recovery. */
  }
};
export const startLoginJourney = (analytics: Analytics | undefined, method: string, restart = false): void => {
  if (!getLoginJourney() || getLoginJourney()?.method !== method || restart) {
    adoptLoginJourney({ id: createLoginAttemptId(), method, origin: "dashboard", startedAt: Date.now() });
    trackLogin(analytics, "login_attempt_started");
  }
};
export const clearLoginJourney = (): void => {
  analyticsChallenges.clear();
  current = null;
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* Storage is optional. */
  }
};
