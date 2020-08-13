import { IdentifierInput } from "../types";
import { fullPhoneNumberValidator } from "./validatePhoneNumbers";
import { ERROR_MESSAGE } from "../context/alert";

const isMatchRegex = (text: string, regex?: string): boolean => {
  if (!regex) {
    return true;
  }
  return new RegExp(regex).test(text);
};

const isUniqueList = (list: string[]): boolean =>
  new Set(list).size === list.length;

export const validateIdentifierInputs = (
  identifierInputs: IdentifierInput[]
): boolean => {
  for (const { value, validationRegex, textInputType } of identifierInputs) {
    if (!value && textInputType === "PHONE_NUMBER") {
      throw new Error(ERROR_MESSAGE.MISSING_POD_INPUT);
    }
    if (!value) {
      throw new Error(ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT);
    }
    if (textInputType === "NUMBER" && isNaN(Number(value))) {
      throw new Error(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    }
    if (!isMatchRegex(value, validationRegex)) {
      throw new Error(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    }
    if (textInputType === "PHONE_NUMBER" && !fullPhoneNumberValidator(value)) {
      throw new Error(ERROR_MESSAGE.INVALID_PHONE_NUMBER);
    }
  }

  if (
    !isUniqueList(
      identifierInputs.map(identifierInput => identifierInput.value)
    )
  ) {
    throw new Error(ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT);
  }

  return true;
};
