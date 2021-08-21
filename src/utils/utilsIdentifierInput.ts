import { IdentifierInput } from "../types";

export const cleanIdentifierInput = (
  identifierInput: IdentifierInput
): void => {
  identifierInput.value = identifierInput.value.trim();
};

export const tagOptionalIdentifierInput = (
  identifierInput: IdentifierInput,
  category: string,
  optionalIdentifierLabels: string[]
): void => {
  if (
    optionalIdentifierLabels.includes(`${category}.${identifierInput.label}`)
  ) {
    identifierInput.isOptional = true;
  }
};
