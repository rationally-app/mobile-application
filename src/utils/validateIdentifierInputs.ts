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
  for (const {
    value,
    validationRegex,
    textInputType,
    isOptional,
  } of identifierInputs) {
    if (isOptional && (!value || isNaN(Number(value)))) {
      return true;
    }

    if (textInputType === "NUMBER" && isNaN(Number(value))) {
      throw new Error(ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT);
    }
    if (!value) {
      if (textInputType === "SINGLE_CHOICE") {
        throw new Error(ERROR_MESSAGE.MISSING_WAIVER_INPUT);
      } else if (textInputType === "PAYMENT_RECEIPT") {
        throw new Error(ERROR_MESSAGE.INVALID_PAYMENT_RECEIPT_NUMBER);
      }
      throw new Error(ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT);
    }

    if (
      textInputType === "PAYMENT_RECEIPT" &&
      !isMatchRegex(
        value,
        validationRegex ? validationRegex : defaultPaymentReceiptValidationRegex
      )
    ) {
      throw new Error(ERROR_MESSAGE.INVALID_PAYMENT_RECEIPT_NUMBER);
    } else if (
      textInputType === "PHONE_NUMBER" &&
      !isMatchRegex(
        value,
        validationRegex ? validationRegex : defaultPhoneNumberValidationRegex
      )
    ) {
      throw new Error(ERROR_MESSAGE.INVALID_PHONE_AND_COUNTRY_CODE);
    } else if (!isMatchRegex(value, validationRegex)) {
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
