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

  let identifierInputDisplay = "";

  if (filteredInputs.length === 1) {
    identifierInputDisplay = processIdentifierInputValue(filteredInputs[0]);
  } else if (filteredInputs.length > 1) {
    identifierInputDisplay = `${processIdentifierInputValue(
      filteredInputs[0]
    )} — ${processIdentifierInputValue(
      filteredInputs[filteredInputs.length - 1]
    )}`;
  }

  return identifierInputDisplay;
};
