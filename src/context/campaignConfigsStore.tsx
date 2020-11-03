import React, {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
  useCallback
} from "react";
import { AsyncStorage } from "react-native";
import { CampaignConfig } from "../types";
import { usePrevious } from "../hooks/usePrevious";
import { CampaignConfigError } from "../services/campaignConfig";

export const CAMPAIGN_CONFIGS_STORE_KEY = "CAMPAIGN_CONFIGS_STORE";

export type CampaignConfigsMap = {
  [key: string]: CampaignConfig | undefined;
};

export interface CampaignConfigsStoreContext {
  readonly hasLoadedFromStore: boolean;
  readonly allCampaignConfigs: CampaignConfigsMap;
  /**
   * Key is currently operatorToken + endpoint
   */
  setCampaignConfig: (key: string, config: CampaignConfig) => void;
  removeCampaignConfig: (key: string) => void;
  clearCampaignConfigs: () => void;
}

export const CampaignConfigsStoreContext = createContext<
  CampaignConfigsStoreContext
>({
  hasLoadedFromStore: false,
  allCampaignConfigs: {},
  setCampaignConfig: () => undefined,
  removeCampaignConfig: () => undefined,
  clearCampaignConfigs: () => undefined
});

export const CampaignConfigsStoreContextProvider: FunctionComponent = ({
  children
}) => {
  const [hasLoadedFromStore, setHasLoadedFromStore] = useState(false);
  const [allConfigs, setAllConfigs] = useState<
    CampaignConfigsStoreContext["allCampaignConfigs"]
  >({});

  const prevAllConfigs = usePrevious(allConfigs);

  useEffect(() => {
    if (hasLoadedFromStore) {
      const allConfigsString = JSON.stringify(allConfigs);
      const prevConfigsString = JSON.stringify(prevAllConfigs);
      if (allConfigsString !== prevConfigsString) {
        AsyncStorage.setItem(CAMPAIGN_CONFIGS_STORE_KEY, allConfigsString);
      }
    }
  }, [hasLoadedFromStore, allConfigs, prevAllConfigs]);

  const setCampaignConfig: CampaignConfigsStoreContext["setCampaignConfig"] = useCallback(
    (key, newConfig) => {
      if (!newConfig) {
        return;
      }

      setAllConfigs(prevConfigs => {
        const prevConfig: CampaignConfig | undefined = prevConfigs[key];
        // Tried to use Object.entries to loop rather than directly accessing
        // as below. But ran into type mismatches.
        const mergedConfig: CampaignConfig = {
          features:
            newConfig.features !== null
              ? newConfig.features
              : prevConfig?.features ?? null,
          policies:
            newConfig.policies !== null
              ? newConfig.policies
              : prevConfig?.policies ?? null,
          c13n:
            newConfig.c13n !== null ? newConfig.c13n : prevConfig?.c13n ?? null
        };

        return {
          ...prevConfigs,
          [key]: mergedConfig
        };
      });
    },
    []
  );

  const removeCampaignConfig: CampaignConfigsStoreContext["removeCampaignConfig"] = useCallback(
    async key => {
      if (!key) {
        return;
      }
      setAllConfigs(prevConfigs => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [key]: configToBeRemoved, ...remainingConfigs } = prevConfigs;
        return remainingConfigs;
      });
    },
    []
  );

  const clearCampaignConfigs: CampaignConfigsStoreContext["clearCampaignConfigs"] = useCallback(async () => {
    setAllConfigs({});
  }, []);

  const [, setState] = useState();
  useEffect(() => {
    const loadCampaignConfigFromStore = async (): Promise<void> => {
      const campaignConfigsString = await AsyncStorage.getItem(
        CAMPAIGN_CONFIGS_STORE_KEY
      );
      if (!campaignConfigsString) {
        setHasLoadedFromStore(true);
        return;
      }
      try {
        const allCampaignConfigsFromStore: CampaignConfigsMap = JSON.parse(
          campaignConfigsString
        );
        setAllConfigs(allCampaignConfigsFromStore);
        setHasLoadedFromStore(true);
      } catch (e) {
        setState(() => {
          throw new CampaignConfigError(e);
        });
      }
    };

    loadCampaignConfigFromStore();
  }, []);

  const contextValue = {
    hasLoadedFromStore,
    allCampaignConfigs: allConfigs,
    setCampaignConfig,
    removeCampaignConfig,
    clearCampaignConfigs
  };

  return (
    <CampaignConfigsStoreContext.Provider value={contextValue}>
      {children}
    </CampaignConfigsStoreContext.Provider>
  );
};
