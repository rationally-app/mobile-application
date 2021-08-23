import { IdentifierInput } from "../types";

/**
 * Trim the leading and trailing whitespace from identifierInput value
 */
export const cleanIdentifierInput = (
  identifierInput: IdentifierInput
): void => {
  identifierInput.value = identifierInput.value.trim();
};

/**
 * Check whether identifierInput is optional by comparing the category.label to a
 * pre-stored optional identifiers from policies
 */
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
