import { IdentifierInput } from "../types";
import { fullPhoneNumberValidator } from "./validatePhoneNumbers";

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
    if (!value) {
      throw new Error(
        `Please enter ${
          identifierInputs.length === 1 ? "" : "unique "
        }details to checkout`
      );
    }
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

  if (
    !isUniqueList(
      identifierInputs.map(identifierInput => identifierInput.value)
    )
  ) {
    throw new Error(
      `Please enter ${
        identifierInputs.length === 1 ? "" : "unique "
      }details to checkout`
    );
  }

  return true;
};
