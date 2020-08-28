import { validateAndCleanNric } from "./validateNric";
import { validateAndCleanRegexInput } from "./validateInputWithRegex";
import { EnvVersionError } from "../services/envVersion";

export const validateAndCleanId = (
  inputId: string,
  idValidation: string | undefined,
  idRegex?: string | undefined
): string => {
  let id: string;
  if (!idValidation)
    throw new EnvVersionError(
      "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists."
    );
  switch (idValidation) {
    case "NRIC":
      if (idRegex)
        throw new EnvVersionError(
          "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists."
        );
      id = validateAndCleanNric(inputId);
      break;
    case "REGEX":
      id = validateAndCleanRegexInput(inputId, idRegex);
      break;
    default:
      // Remove validation
      id = inputId;
  }
  return id;
};
