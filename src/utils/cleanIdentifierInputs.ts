import { IdentifierInput } from "../types";

export const cleanIdentifierInputs = (
  input: IdentifierInput[]
): IdentifierInput[] => {
  for (const identifierInput of input) {
    identifierInput.value = identifierInput.value.trim();
  }
  return input;
};
