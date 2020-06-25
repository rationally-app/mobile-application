import { IdentifierInput } from "../types";

export const validateIdentifiers = (
  identifierInputs: IdentifierInput[]
): boolean =>
  !identifierInputs.find(
    ({ validationRegex, value }) =>
      validationRegex && !new RegExp(validationRegex).test(value)
  );
