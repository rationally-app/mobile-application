import { IdentifierInput } from "../types";
import { fullPhoneNumberValidator } from "./validatePhoneNumbers";
import { ERROR_MESSAGE } from "../context/alert";

const defaultPhoneNumberValidationRegex = "^\\+[0-9]*$";
const defaultPaymentReceiptValidationRegex = "^[a-zA-Z0-9]{1,20}$";

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
    const trimmedValue = value.trim();
    if (textInputType === "SINGLE_CHOICE" && !value) {
      throw new Error(ERROR_MESSAGE.MISSING_WAIVER_INPUT);
    }
    if (textInputType !== "PAYMENT_RECEIPT" && !value) {
      throw new Error(ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT);
    }
    if (textInputType === "NUMBER" && isNaN(Number(value))) {
      throw new Error(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    }
    if (
      textInputType === "PAYMENT_RECEIPT" &&
      !isMatchRegex(
        trimmedValue,
        validationRegex ? validationRegex : defaultPaymentReceiptValidationRegex
      )
    ) {
      throw new Error(ERROR_MESSAGE.INVALID_PAYMENT_RECEIPT_NUMBER);
    }
    if (
      textInputType === "PHONE_NUMBER" &&
      !isMatchRegex(
        trimmedValue,
        validationRegex ? validationRegex : defaultPhoneNumberValidationRegex
      )
    ) {
      throw new Error(ERROR_MESSAGE.INVALID_PHONE_AND_COUNTRY_CODE);
    }
    if (!isMatchRegex(trimmedValue, validationRegex)) {
      throw new Error(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    }
    if (
      textInputType === "PHONE_NUMBER" &&
      !fullPhoneNumberValidator(trimmedValue)
    ) {
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
