import { validateAndCleanNric } from "./validateNric";
import { validateAndCleanRegexInput } from "./validateInputWithRegex";
import { EnvVersionError } from "../services/envVersion";

export const validateAndCleanId = (
  inputId: string,
  idValidation?: string | undefined,
  idRegex?: string | undefined
): string => {
  let id: string;
  switch (idValidation) {
    case "NRIC":
      if (idRegex)
        throw new EnvVersionError(
          "Encountered an issue obtaining environment information. We've noted this down and are looking into it!"
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
