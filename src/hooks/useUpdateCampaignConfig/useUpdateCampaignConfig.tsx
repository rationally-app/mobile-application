import { useState, useCallback, useContext } from "react";
import { CampaignConfig } from "../../types";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { getCampaignConfig } from "../../services/campaignConfig";

type FetchingState =
  | "DEFAULT"
  | "FETCHING_CONFIG"
  | "RESULT_RETURNED_NEW_UPDATES"
  | "RESULT_RETURNED_NO_UPDATES";

type UpdateCampaignConfigHook = {
  fetchingState: FetchingState;
  updateCampaignConfig: () => void;
  error?: Error;
  clearError: () => void;
  result?: CampaignConfig;
};

export const useUpdateCampaignConfig = (
  authKey: string,
  endpoint: string
): UpdateCampaignConfigHook => {
  const [fetchingState, setFetchingState] = useState<FetchingState>("DEFAULT");
  const [result, setResult] = useState<CampaignConfig>();
  const [error, setError] = useState<Error>();

  const { setCampaignConfig, configHashes } = useContext(CampaignConfigContext);

  const updateCampaignConfig = useCallback(() => {
    const fetchCampaignConfig = async (): Promise<void> => {
      setError(undefined);
      setResult(undefined);
      setFetchingState("FETCHING_CONFIG");
      try {
        const campaignConfigResponse = await getCampaignConfig(
          authKey,
          endpoint,
          configHashes
        );
        const configs = Object.values(campaignConfigResponse);
        if (configs.some(c => !!c)) {
          await setCampaignConfig(campaignConfigResponse);
          setFetchingState("RESULT_RETURNED_NEW_UPDATES");
          setResult(campaignConfigResponse);
        } else {
          setFetchingState("RESULT_RETURNED_NO_UPDATES");
        }
      } catch (e) {
        setError(e);
      }
    };

    fetchCampaignConfig();
  }, [authKey, configHashes, endpoint, setCampaignConfig]);

  const clearError = useCallback(() => {
    setError(undefined);
  }, []);

  return {
    fetchingState,
    updateCampaignConfig,
    error,
    clearError,
    result
  };
};
