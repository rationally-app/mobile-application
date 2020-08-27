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
      "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists."
    );
  // set ID to all uppercase to remove case sensitivity
  const id = inputId.toUpperCase();

  const isValid = validate(id, idRegex);
  if (!isValid)
    throw new Error("Please check that the ID is in the correct format");

  return id;
};
