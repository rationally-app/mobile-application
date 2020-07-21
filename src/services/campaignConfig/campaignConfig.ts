import { IS_MOCK } from "../../config";
import { CampaignConfig } from "../../types";
import { fetchWithValidator, ValidationError } from "../helpers";
import * as Sentry from "sentry-expo";

export class CampaignConfigError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CampaignConfigError";
  }
}

type ConfigHashes = {
  [config in keyof CampaignConfig]?: string;
};

const liveGetCampaignConfig = async (
  token: string,
  endpoint: string,
  configHashes: ConfigHashes
): Promise<CampaignConfig> => {
  try {
    const response = await fetchWithValidator(
      CampaignConfig,
      `${endpoint}/client-config`,
      {
        method: "POST",
        headers: {
          Authorization: token
        },
        body: JSON.stringify(configHashes)
      }
    );
    return response;
  } catch (e) {
    if (e instanceof ValidationError) {
      Sentry.captureException(e);
    }
    throw new CampaignConfigError(e.message);
  }
};

const mockGetCampaignConfig = async (
  _token: string,
  _endpoint: string,
  configHashes: ConfigHashes
): Promise<CampaignConfig> => {
  return {
    features: {
      minAppBuildVersion: 0,
      minAppBundleVersion: "3.0.0",
      flowType: "DEFAULT",
      transactionGrouping: true
    }
  };
};

export const getCampaignConfig = IS_MOCK
  ? mockGetCampaignConfig
  : liveGetCampaignConfig;
