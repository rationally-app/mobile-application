import { validateAndCleanNric } from "./validateNric";
import { validateAndCleanRegexInput } from "./validateInputWithRegex";
import { CampaignConfigError } from "../services/campaignConfig";
import { ERROR_MESSAGE } from "../context/alert";
import { validateAndCleanPassport } from "./validatePassport";

export const validateAndCleanId = (
  inputId: string,
  idValidation: string,
  idRegex?: string
): string => {
  let id: string;
  console.log(idValidation);
  switch (idValidation) {
    case "NRIC":
      id = validateAndCleanNric(inputId);
      break;
    case "PASSPORT":
      id = validateAndCleanPassport(inputId);
      break;
    case "REGEX":
      if (!idRegex) {
        throw new CampaignConfigError(ERROR_MESSAGE.CAMPAIGN_CONFIG_ERROR);
      }
      id = validateAndCleanRegexInput(inputId, idRegex);
      break;
    default:
      // Remove validation
      id = inputId;
  }
  return id;
};
