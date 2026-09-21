export const createLoginAttemptId = (): string => {
  try {
    if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  } catch {
    // Analytics correlation must not depend on browser crypto availability.
  }
  return `login-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
};
