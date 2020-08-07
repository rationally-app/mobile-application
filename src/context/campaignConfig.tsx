import React, {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
  useCallback
} from "react";
import { AsyncStorage } from "react-native";
import { CampaignFeatures, CampaignConfig, ConfigHashes } from "../types";
import { hashString } from "../utils/hash";

export const FEATURES_KEY = "FEATURES";

interface CampaignConfigContext {
  features: CampaignFeatures | null;
  configHashes: ConfigHashes;
  setCampaignConfig: (config: CampaignConfig) => void;
  clearCampaignConfig: () => void;
}
export const CampaignConfigContext = createContext<CampaignConfigContext>({
  features: null,
  configHashes: {},
  setCampaignConfig: () => null,
  clearCampaignConfig: () => null
});

export const CampaignConfigContextProvider: FunctionComponent = ({
  children
}) => {
  const [features, setFeatures] = useState<CampaignConfigContext["features"]>(
    null
  );

  // Recalculated whenever the campaign config is set or loaded from the store
  const [configHashes, setConfigHashes] = useState<
    CampaignConfigContext["configHashes"]
  >({});

  const setCampaignConfig: CampaignConfigContext["setCampaignConfig"] = useCallback(
    async ({ features }): Promise<void> => {
      if (features) {
        const featuresString = JSON.stringify(features);
        const configHashes = {
          features: await hashString(featuresString)
        };
        await AsyncStorage.multiSet([[FEATURES_KEY, featuresString]]);
        setFeatures(features);
        setConfigHashes(configHashes);
      }
    },
    []
  );

  const clearCampaignConfig: CampaignConfigContext["clearCampaignConfig"] = useCallback(async (): Promise<
    void
  > => {
    setFeatures(null);
    setConfigHashes({});
    await AsyncStorage.multiRemove([FEATURES_KEY]);
  }, []);

  const loadCampaignConfigFromStore = async (): Promise<void> => {
    const values = await AsyncStorage.multiGet([FEATURES_KEY]);
    const [featuresString] = values.map(value => value[1]);
    if (featuresString) {
      setFeatures(JSON.parse(featuresString));
    }

    const configHashes = {
      features: featuresString ? await hashString(featuresString) : undefined
    };
    setConfigHashes(configHashes);
  };

  useEffect(() => {
    loadCampaignConfigFromStore();
  }, []);

  return (
    <CampaignConfigContext.Provider
      value={{
        features,
        configHashes,
        setCampaignConfig,
        clearCampaignConfig
      }}
    >
      {children}
    </CampaignConfigContext.Provider>
  );
};
