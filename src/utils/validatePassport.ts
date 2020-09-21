import { ERROR_MESSAGE } from "../context/alert";

const validate = (inputPassport: string): boolean => {
  const passportRegex = "^[A-Za-z]{1,3}-[a-zA-Z0-9]{8,11}$";
  return inputPassport.match(passportRegex) !== null;
};

export const validateAndCleanPassport = (inputPassport: string): string => {
  const cleanedInputPassport = inputPassport.trim().toUpperCase();
  const isPassportValid = validate(cleanedInputPassport);
  if (!isPassportValid) {
    throw new Error(ERROR_MESSAGE.INVALID_ID);
  }
  return cleanedInputPassport;
};
