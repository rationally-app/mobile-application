import { validate } from "@rationally-app/nric-validator";
import { ERROR_MESSAGE } from "../context/alert";

export const validateAndCleanNric = (inputNric: string): string => {
  const cleanedInputNric = inputNric.trim().slice(0, 9).toUpperCase();
  const isNricValid = validate(cleanedInputNric);
  if (!isNricValid) {
    throw new Error(ERROR_MESSAGE.INVALID_ID);
  }
  return cleanedInputNric;
};
