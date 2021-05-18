import { validateAndCleanNric } from "./validateNric";
import { validateAndCleanRegexInput } from "./validateInputWithRegex";
import { CampaignConfigError } from "../services/campaignConfig";
import { ERROR_MESSAGE } from "../context/alert";
import { validateAndCleanPassport } from "./validatePassport";
import { validateEmailAddress } from "./validateEmailAddress";

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
    case "PASSPORT":
      id = validateAndCleanPassport(inputId);
      break;
    case "REGEX":
    case "UIN":
      if (!idRegex) {
        throw new CampaignConfigError(ERROR_MESSAGE.CAMPAIGN_CONFIG_ERROR);
      }
      id = validateAndCleanRegexInput(inputId, idRegex);
      break;
    case "EMAIL":
      id = validateEmailAddress(inputId);
      break;
    default:
      // Remove validation
      id = inputId;
  }
  return id;
};
