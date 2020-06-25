import { IdentifierInput } from "../types";
import { fullPhoneNumberValidator } from "./validatePhoneNumbers";

const isMatchRegex = (text: string, regex?: string): boolean => {
  if (!regex) {
    return true;
  }
  return new RegExp(regex).test(text);
};

export const validateIdentifierInputs = (
  identifierInputs: IdentifierInput[]
): boolean => {
  for (const { value, validationRegex, textInputType } of identifierInputs) {
    if (textInputType === "NUMBER" && isNaN(Number(value))) {
      throw new Error("Invalid details");
    }
    if (!isMatchRegex(value, validationRegex)) {
      throw new Error("Invalid details");
    }
    if (textInputType === "PHONE_NUMBER" && !fullPhoneNumberValidator(value)) {
      throw new Error("Invalid contact number");
    }
  }
  return true;
};
