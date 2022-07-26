import { ERROR_MESSAGE } from "../context/alert";

const EMAIL_CODE_REGEX = /^[0-9a-zA-Z]+([0-9a-zA-Z]*[-._+])*[0-9a-zA-Z]+@[0-9a-zA-Z]+([-.][0-9a-zA-Z]+)*([0-9a-zA-Z]*[.])[a-zA-Z]{2,6}$/;

export const validateEmailAddress = (emailAddress: string): string => {
  const result = emailAddress.trim().match(EMAIL_CODE_REGEX);
  if (!result) throw new Error(ERROR_MESSAGE.INVALID_EMAIL_ADDRESS);
  return emailAddress;
};
