import React, {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CampaignConfig } from "../types";
import { usePrevious } from "../hooks/usePrevious";
import { CampaignConfigError } from "../services/campaignConfig";
import {
  readFromStoreInBuckets,
  saveToStoreInBuckets,
} from "../utils/bucketStorageHelper";
import { Sentry } from "../utils/errorTracking";

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

export const CampaignConfigsStoreContext = createContext<CampaignConfigsStoreContext>(
  {
    hasLoadedFromStore: false,
    allCampaignConfigs: {},
    setCampaignConfig: () => undefined,
    removeCampaignConfig: () => undefined,
    clearCampaignConfigs: () => undefined,
  }
);

export const CampaignConfigsStoreContextProvider: FunctionComponent = ({
  children,
}) => {
  /**
   * This flag marks when {@link allConfigs} is matching with the current state of
   * the primary store. Any changes after this flag is true should trigger updates to the
   * primary store.
   *
   * This flag should be set to true before any migration happens so that migrations will
   * update the primary store.
   *
   * Similar use case to {@link AuthStoreContextProvider}
   */
  const [hasLoadedFromPrimaryStore, setHasLoadedFromPrimaryStore] = useState(
    false
  );
  const [hasLoadedFromStore, setHasLoadedFromStore] = useState(false);
  const [allConfigs, setAllConfigs] = useState<
    CampaignConfigsStoreContext["allCampaignConfigs"]
  >({});

  const prevAllConfigs = usePrevious(allConfigs);

  useEffect(() => {
    if (hasLoadedFromPrimaryStore) {
      const allConfigsString = JSON.stringify(allConfigs);
      const prevConfigsString = JSON.stringify(prevAllConfigs);
      if (allConfigsString !== prevConfigsString) {
        saveToStoreInBuckets(
          CAMPAIGN_CONFIGS_STORE_KEY,
          allConfigsString,
          prevConfigsString
        );
      }
    }
  }, [hasLoadedFromPrimaryStore, allConfigs, prevAllConfigs]);

  const setCampaignConfig: CampaignConfigsStoreContext["setCampaignConfig"] = useCallback(
    (key, newConfig) => {
      if (!newConfig) {
        return;
      }

      setAllConfigs((prevConfigs) => {
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
            newConfig.c13n !== null ? newConfig.c13n : prevConfig?.c13n ?? null,
        };

        return {
          ...prevConfigs,
          [key]: mergedConfig,
        };
      });
    },
    []
  );

  const removeCampaignConfig: CampaignConfigsStoreContext["removeCampaignConfig"] = useCallback(
    async (key) => {
      if (!key) {
        return;
      }
      setAllConfigs((prevConfigs) => {
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
    /**
     * Migrates credentials from old config store to new config store. Clears all old storage locations.
     * @param newStorageHasData whether most recent data has been found. If this is true, does not
     * attempt any migration and just clears old storage locations
     * @returns the updated value of {@link hasUpdatedData}, i.e. true if any updated data was found
     * in the older storage (if {@link newStorageHasData} was passed in as true, it will always return true)
     */
    const migrateOldConfigFromStore = async (
      newStorageHasData: boolean
    ): Promise<boolean> => {
      let hasUpdatedData = newStorageHasData;
      // check v1 storage
      if (!hasUpdatedData) {
        const configString = await AsyncStorage.getItem(
          CAMPAIGN_CONFIGS_STORE_KEY
        );
        if (configString) {
          try {
            const configStringFromStore: CampaignConfigsMap = JSON.parse(
              configString
            );
            setAllConfigs(configStringFromStore);
            hasUpdatedData = true; // should this be set b4 parsing? error recovery policy
          } catch (e) {
            setState(() => {
              throw new Error(e);
            });
          }
        }
      }
      if (hasUpdatedData) {
        await AsyncStorage.removeItem(CAMPAIGN_CONFIGS_STORE_KEY);
      }

      return hasUpdatedData;
    };

    const loadCampaignConfigFromStore = async (): Promise<void> => {
      let newStorageHasData = false;
      try {
        const campaignConfigsString = await readFromStoreInBuckets(
          CAMPAIGN_CONFIGS_STORE_KEY
        );
        if (campaignConfigsString !== null) {
          const campaignConfigsFromStore = JSON.parse(campaignConfigsString);
          setAllConfigs((prev) => ({
            ...prev,
            ...campaignConfigsFromStore,
          }));
          newStorageHasData = true;
        }
      } catch (e) {
        setState(() => {
          throw new CampaignConfigError(e);
        });
      }
      setHasLoadedFromPrimaryStore(true);
      const migrated = await migrateOldConfigFromStore(newStorageHasData);
      if (!newStorageHasData) {
        // migration was attempted
        if (migrated) {
          Sentry.addBreadcrumb({
            category: "configMigration",
            message: "success",
          });
        } else {
          Sentry.addBreadcrumb({
            category: "configMigration",
            message: "failure",
          });
        }
      }
      setHasLoadedFromStore(true);
    };

    loadCampaignConfigFromStore();
  }, []);

  const contextValue = {
    hasLoadedFromStore,
    allCampaignConfigs: allConfigs,
    setCampaignConfig,
    removeCampaignConfig,
    clearCampaignConfigs,
  };

  return (
    <CampaignConfigsStoreContext.Provider value={contextValue}>
      {children}
    </CampaignConfigsStoreContext.Provider>
  );
};
