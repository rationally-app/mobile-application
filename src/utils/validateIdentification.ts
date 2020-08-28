import { validateAndCleanNric } from "./validateNric";
import { validateAndCleanRegexInput } from "./validateInputWithRegex";
import { CampaignConfigError } from "../services/campaignConfig";
import { ERROR_MESSAGE } from "../context/alert";

export const validateAndCleanId = (
  inputId: string,
  idValidation: string,
  idRegex?: string
): string => {
  let id: string;
  switch (idValidation) {
    case "NRIC":
      id = validateAndCleanNric(inputId);
      break;
    case "REGEX":
      if (!idRegex) {
        throw new CampaignConfigError(ERROR_MESSAGE.ENV_VERSION_ERROR);
      }
      id = validateAndCleanRegexInput(inputId, idRegex);
      break;
    default:
      // Remove validation
      id = inputId;
  }
  return id;
};
