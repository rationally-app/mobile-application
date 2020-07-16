import { EnvVersionError } from "../services/envVersion";

export const validate = (id: string, idRegex: string): boolean => {
  return id.match(idRegex) !== null;
};

export const validateAndCleanId = (
  inputId: string,
  idRegex: string | undefined
): string => {
  console.log("regex:", idRegex);
  if (!idRegex)
    throw new EnvVersionError(
      "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
    );
  const isValid = validate(inputId, idRegex);
  if (!isValid)
    throw new Error(
      "Please check that the identification is in the correct format"
    );
  const cleanedId = inputId.match(idRegex)?.[0].toUpperCase();
  if (!cleanedId)
    throw new Error(
      "Please check that the identification is in the correct format"
    );
  return cleanedId;
};
