import { useState, useCallback } from "react";
import { CampaignConfig, ConfigHashes } from "../../types";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";
import { getCampaignConfig } from "../../services/campaignConfig";
import { hashString } from "../../utils/hash";

const generateConfigHashes = async (
  config: CampaignConfig | undefined
): Promise<ConfigHashes | undefined> => {
  if (!config) {
    return Promise.resolve(undefined);
  }
  const configHashes: ConfigHashes = {
    features: undefined,
    policies: undefined,
    c13n: undefined,
  };
  for (const [key, value] of Object.entries(config)) {
    if (value !== null) {
      configHashes[key as keyof ConfigHashes] = await hashString(
        JSON.stringify(value)
      );
    }
  }
  return configHashes;
};

type FetchingState =
  | "DEFAULT"
  | "FETCHING_CONFIG"
  | "RETURNED_NEW_UPDATES"
  | "RETURNED_NO_UPDATES";

type UpdateCampaignConfigHook = {
  fetchingState: FetchingState;
  updateCampaignConfig: (
    currentCampaignConfig: CampaignConfig | undefined,
    setCampaignConfig: CampaignConfigsStoreContext["setCampaignConfig"]
  ) => void;
  error?: Error;
  clearError: () => void;
  result?: CampaignConfig;
};

export const useUpdateCampaignConfig = (
  operatorToken: string,
  sessionToken: string,
  endpoint: string
): UpdateCampaignConfigHook => {
  const [fetchingState, setFetchingState] = useState<FetchingState>("DEFAULT");
  const [result, setResult] = useState<CampaignConfig>();
  const [error, setError] = useState<Error>();

  const updateCampaignConfig: UpdateCampaignConfigHook["updateCampaignConfig"] =
    useCallback(
      (currentCampaignConfig, setCampaignConfig) => {
        const fetchCampaignConfig = async (): Promise<void> => {
          setError(undefined);
          setResult(undefined);
          const configHashes = await generateConfigHashes(
            currentCampaignConfig
          );

          setFetchingState("FETCHING_CONFIG");
          try {
            const campaignConfigResponse = await getCampaignConfig(
              sessionToken,
              endpoint,
              configHashes
            );
            const configs = Object.values(campaignConfigResponse);
            if (configs.some((c) => !!c)) {
              setCampaignConfig(
                `${operatorToken}${endpoint}`,
                campaignConfigResponse
              );
              setResult(campaignConfigResponse);
              setFetchingState("RETURNED_NEW_UPDATES");
            } else {
              setFetchingState("RETURNED_NO_UPDATES");
            }
          } catch (e) {
            setError(e);
          }
        };

        fetchCampaignConfig();
      },
      [endpoint, operatorToken, sessionToken]
    );

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return {
    fetchingState,
    updateCampaignConfig,
    error,
    clearError,
    result,
  };
};
