import { IdentifierInput } from "../types";
import { fullPhoneNumberValidator } from "./validatePhoneNumbers";
import { ERROR_MESSAGE } from "../context/alert";

const defaultPhoneNumberValidationRegex = "^\\+[0-9]*$";
const defaultPaymentReceiptValidationRegex = "^[a-zA-Z0-9]{1,20}$";

/**
 * Currently there is no indicator of whether an identifier is optional or not.
 *
 * Reason being, getQuota does not return the boolean whether an identifier was optional.
 *
 * As a temporary measure, we compare the label with '(optional)' to
 * check whether an identifier is optional.
 */
const isOptional = (text: string): boolean => text.slice(-10) === "(optional)";

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
    if (isOptional(label) && !value) {
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
