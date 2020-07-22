import { EnvVersionError } from "../services/envVersion";

export const validate = (id: string, idRegex: string): boolean => {
  return id.match(idRegex) !== null;
};

export const validateAndCleanRegexInput = (
  inputId: string,
  idRegex: string | undefined
): string => {
  if (!idRegex)
    throw new EnvVersionError(
      "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
    );
  const isValid = validate(inputId, idRegex);
  if (!isValid)
    throw new Error("Please check that the ID is in the correct format");
  const cleanedId = inputId.match(idRegex)?.[0].toUpperCase();
  if (!cleanedId)
    throw new Error("Please check that the ID is in the correct format");
  return cleanedId;
};
