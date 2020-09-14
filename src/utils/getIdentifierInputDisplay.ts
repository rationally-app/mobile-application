import { IdentifierInput } from "../types";

const processIdentifierInputValue = (
  identifierInput: IdentifierInput
): string => {
  return identifierInput.value;
};

export const getIdentifierInputDisplay = (
  identifierInputs: IdentifierInput[]
): string => {
  const filteredInputs = identifierInputs.filter(
    identifierInput => !!identifierInput.value
  );

  return filteredInputs
    .map(input => processIdentifierInputValue(input))
    .join("\n");
};
