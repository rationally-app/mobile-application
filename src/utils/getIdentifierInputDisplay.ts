import { IdentifierInput } from "../types";

const maskString = (str: string, numVisible: number): string => {
  return str.slice(-numVisible).padStart(str.length, "*");
};

const processIdentifierInputValue = (
  identifierInput: IdentifierInput
): string => {
  return identifierInput.textInputType === "PHONE_NUMBER"
    ? maskString(identifierInput.value, 4)
    : identifierInput.value;
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
