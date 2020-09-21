import { ERROR_MESSAGE } from "../context/alert";

const validate = (inputPassport: string): boolean => {
  const passportRegex1 = "^[A-Za-z]{1,3}-[a-zA-Z0-9]{9}$";
  const passportRegex2 = "^[A-Za-z]{1,3}-[a-zA-Z]{1}[ ]{1}[a-zA-Z0-9]{9}$";
  return (
    inputPassport.match(passportRegex1) !== null ||
    inputPassport.match(passportRegex2) != null
  );
};

export const validateAndCleanPassport = (inputPassport: string): string => {
  const cleanedInputPassport = inputPassport.trim().toUpperCase();
  const isPassportValid = validate(cleanedInputPassport);
  if (!isPassportValid) {
    throw new Error(ERROR_MESSAGE.INVALID_ID);
  }
  return cleanedInputPassport;
};
