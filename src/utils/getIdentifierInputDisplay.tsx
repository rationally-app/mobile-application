import { IdentifierInput } from "../types";

const processIdentifierInputValue = (
  identifierInput: IdentifierInput
): string => {
  return identifierInput.textInputType === "PHONE_NUMBER"
    ? `****${identifierInput.value.slice(identifierInput.value.length - 4)}`
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
