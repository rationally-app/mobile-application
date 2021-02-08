import { IdentifierInput } from "../types";
import { fullPhoneNumberValidator } from "./validatePhoneNumbers";
import { ERROR_MESSAGE } from "../context/alert";

const defaultPhoneNumberValidationRegex = "^\\+[0-9]*$";

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
  for (const {
    label,
    value,
    validationRegex,
    textInputType,
  } of identifierInputs) {
    //TODO: switch between different errors based on campaign config
    // TODO: can set the validation regex here once it's confirmed
    if (label === "Payment receipt number" && !value) {
      throw new Error(ERROR_MESSAGE.INVALID_PAYMENT_RECEIPT_NUMBER);
    }
    if (!value) {
      throw new Error(ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT);
    }
    if (textInputType === "NUMBER" && isNaN(Number(value))) {
      throw new Error(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    }
    if (
      textInputType === "PHONE_NUMBER" &&
      !isMatchRegex(
        value,
        validationRegex ? validationRegex : defaultPhoneNumberValidationRegex
      )
    ) {
      throw new Error(ERROR_MESSAGE.INVALID_PHONE_AND_COUNTRY_CODE);
    }
    if (!isMatchRegex(value, validationRegex)) {
      throw new Error(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    }
    if (textInputType === "PHONE_NUMBER" && !fullPhoneNumberValidator(value)) {
      throw new Error(ERROR_MESSAGE.INVALID_PHONE_AND_COUNTRY_CODE);
    }
  }

  if (
    !isUniqueList(
      identifierInputs.map((identifierInput) => identifierInput.value)
    )
  ) {
    throw new Error(ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT);
  }

  return true;
};
