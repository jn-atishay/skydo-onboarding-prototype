import Locale from "./locale/en";

export const isEmail = (email: string) => {
  if (!email || !email.trim()) return false;
  const formattedEmail = email.trim();
  return String(formattedEmail)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

/**
 * Useful for <ReactMultiEmail />
 */
export const isLastEmailValid = (lastEmail: String, emails: string[]): string | null => {
  let newLastEmail = lastEmail.trim() as string;
  const lastChar = lastEmail.charAt(lastEmail.length - 1);
  newLastEmail = lastChar === "," || lastChar === ";" ? newLastEmail.slice(0, -1) : newLastEmail;
  if (!newLastEmail && emails.length === 0) {
    return Locale.requiredField;
  }
  if (newLastEmail && !isEmail(newLastEmail)) {
    return Locale.invalidEmail;
  }
  return null;
};
