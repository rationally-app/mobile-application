import { IdentifierInput } from "../types";
import { isValid } from "date-fns";
import { isMatch } from "lodash";

const isMatchRegex = (text: string, regex?: string): boolean => {
  if (!regex) {
    return true;
  }
  return new RegExp(regex).test(text);
};

export const validateIdentifiers = (
  identifierInputs: IdentifierInput[]
): boolean => {
  for (const { value, validationRegex, textInputType } of identifierInputs) {
    if (textInputType === "NUMBER" && isNaN(Number(value))) {
      return false;
    }
    if (!isMatchRegex(value, validationRegex)) {
      return false;
    }
  }
  return true;
};
