import React, {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
  useCallback
} from "react";
import { AsyncStorage } from "react-native";
import { CampaignFeatures, CampaignConfig } from "../types";

export const FEATURES_KEY = "FEATURES";

interface CampaignConfigContext {
  features: CampaignFeatures | null;
  setCampaignConfig: (config: CampaignConfig) => void;
  clearCampaignConfig: () => void;
}
export const CampaignConfigContext = createContext<CampaignConfigContext>({
  features: null,
  setCampaignConfig: () => null,
  clearCampaignConfig: () => null
});

export const CampaignConfigContextProvider: FunctionComponent = ({
  children
}) => {
  const [features, setFeatures] = useState<CampaignConfigContext["features"]>(
    null
  );

  const setCampaignConfig: CampaignConfigContext["setCampaignConfig"] = useCallback(
    async ({ features }): Promise<void> => {
      setFeatures(features);
      await AsyncStorage.multiSet([[FEATURES_KEY, JSON.stringify(features)]]);
    },
    []
  );

  const clearCampaignConfig: CampaignConfigContext["clearCampaignConfig"] = useCallback(async (): Promise<
    void
  > => {
    setFeatures(null);
    await AsyncStorage.multiRemove([FEATURES_KEY]);
  }, []);

  const loadCampaignConfigFromStore = async (): Promise<void> => {
    const values = await AsyncStorage.multiGet([FEATURES_KEY]);
    const [features] = values.map(value => value[1]);
    setFeatures(JSON.parse(features));
  };

  useEffect(() => {
    loadCampaignConfigFromStore();
  }, []);

  return (
    <CampaignConfigContext.Provider
      value={{
        features,
        setCampaignConfig,
        clearCampaignConfig
      }}
    >
      {children}
    </CampaignConfigContext.Provider>
  );
};
