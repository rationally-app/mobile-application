import { IdentifierInput } from "../types";

export const cleanIdentifierInputs = (
  input: IdentifierInput[],
  optionalIdentifier: string[]
): IdentifierInput[] => {
  for (const identifierInput of input) {
    identifierInput.value = identifierInput.value.trim();
    if (optionalIdentifier.includes(identifierInput.label)) {
      identifierInput.isOptional = true;
    }
  }
  return input;
};
