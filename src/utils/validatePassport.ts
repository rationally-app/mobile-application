import { ERROR_MESSAGE } from "../context/alert";

const validate = (inputPassport: string): boolean => {
  return false;
};

export const validateAndCleanPassport = (inputPassport: string): string => {
  const cleanedInputPassport = inputPassport;
  const isPassportValid = validate(cleanedInputPassport);
  if (!isPassportValid) {
    throw new Error(ERROR_MESSAGE.INVALID_ID);
  }
  return cleanedInputPassport;
};
