import React, {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { usePrevious } from "../hooks/usePrevious";
import { AuthCredentials } from "../types";
import { Sentry } from "../utils/errorTracking";
import {
  readFromStoreInBuckets,
  saveToStoreInBuckets,
} from "./bucketStorageHelper";

export const AUTH_CREDENTIALS_STORE_KEY = "AUTH_STORE";

/** Number of credentials per bucket. Calculated with 2048/286. 286 is the length of a stringified AuthCredentials object. */
export const BUCKET_SIZE = 7;

/** @deprecated */
export const SESSION_TOKEN_KEY = "SESSION_TOKEN";

/** @deprecated */
export const EXPIRY_KEY = "EXPIRY_KEY";

/** @deprecated */
export const ENDPOINT_KEY = "ENDPOINT_KEY";

type AuthCredentialsMap = {
  [key: string]: AuthCredentials;
};

interface AuthStoreContext {
  hasLoadedFromStore: boolean;
  authCredentials: AuthCredentialsMap;
  setAuthCredentials: (key: string, authCredentials: AuthCredentials) => void;
  removeAuthCredentials: (key: string) => void;
  clearAuthCredentials: () => void;
}

export const AuthStoreContext = createContext<AuthStoreContext>({
  hasLoadedFromStore: false,
  authCredentials: {},
  setAuthCredentials: () => undefined,
  removeAuthCredentials: () => undefined,
  clearAuthCredentials: () => undefined,
});

/**
 * Uses three versions of auth credential storage. Will automatically migrate to v3 and clear the values in v1 and v2 storage
 *
 * Versions:
 *
 * 1. (deprecated)
 *    - Stores the corresponding values in AsyncStorage under the following keys: {@link SESSION_TOKEN_KEY}, {@link EXPIRY_KEY} and {@link ENDPOINT_KEY}
 *    - Can only store one set of credentials
 * 2. (deprecated)
 *    - Stores a stringified {@link AuthCredentialsMap} in AsyncStorage under the key {@link AUTH_CREDENTIALS_STORE_KEY}
 *    - Map from {{@link AuthCredentials.operatorToken}}{{@link AuthCredentials.endpoint}} to corresponding credentials
 * 3. (current)
 *    - Stores a stringified {@link AuthCredentialsMap} in SecureStorage under the key {@link AUTH_CREDENTIALS_STORE_KEY}
 *    - Map from a hash of {{@link AuthCredentials.operatorToken}}{{@link AuthCredentials.endpoint}} to corresponding credentials
 *    - Due to the limit of 2048 bytes per key, we adopt the following storage method:
 *      - The map is split into buckets, each containing 7 {@link authCredentials} objects
 *      - @todo {@link AUTH_CREDENTIALS_STORE_KEY} stores the number of buckets
 *      - {@link AUTH_CREDENTIALS_STORE_KEY}_n stores the nth bucket (zero indexed)
 */
export const AuthStoreContextProvider: FunctionComponent<{
  shouldMigrate?: boolean; // Temporary toggle to disable migration when testing
}> = ({ shouldMigrate = true, children }) => {
  const [hasLoadedFromStore, setHasLoadedFromStore] = useState(false);
  const [authCredentials, setAuthCredentialsMap] = useState<AuthCredentialsMap>(
    {}
  );
  const prevAuthCredentials = usePrevious(authCredentials);

  useEffect(() => {
    if (hasLoadedFromStore) {
      const authCredentialsString = JSON.stringify(authCredentials);
      const prevAuthCredentialsString = JSON.stringify(prevAuthCredentials);
      // do a top level check to see if there are any changes
      if (authCredentialsString !== prevAuthCredentialsString) {
        // if there are changes, do a check for each bucket
        saveToStoreInBuckets(
          AUTH_CREDENTIALS_STORE_KEY,
          authCredentials,
          prevAuthCredentials ?? {},
          BUCKET_SIZE
        );
      }
    }
  }, [hasLoadedFromStore, authCredentials, prevAuthCredentials]);

  const setAuthCredentials: AuthStoreContext["setAuthCredentials"] = useCallback(
    (key, newAuthCredentials) => {
      setAuthCredentialsMap((prevCredentials) => ({
        ...prevCredentials,
        [key]: newAuthCredentials,
      }));
    },
    []
  );

  const removeAuthCredentials: AuthStoreContext["removeAuthCredentials"] = useCallback(
    (key) => {
      setAuthCredentialsMap((prevCredentials) => {
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          [key]: credentialsToBeRemoved,
          ...remainingCredentials
        } = prevCredentials;
        return remainingCredentials;
      });
    },
    []
  );

  const clearAuthCredentials: AuthStoreContext["clearAuthCredentials"] = useCallback(() => {
    setAuthCredentialsMap({});
  }, []);

  const [, setState] = useState();
  useEffect(() => {
    /**
     * Migrates credentials from old auth store to new auth store. Checks stores in order of
     * increasing age (e.g. checks v2 then v1). Takes the value in the highest version. Clears all
     * old storage locations.
     * @param newStorageHasData whether most recent data has been found. If this is true, does not
     * attempt any migration and just clears old storage locations
     * @returns the updated value of {@link hasUpdatedData}, i.e. true if any updated data was found
     * in the older storage (if {@link newStorageHasData} was passed in as true, it will always return true)
     */
    const migrateOldAuthFromStore = async (
      newStorageHasData: boolean
    ): Promise<boolean> => {
      let hasUpdatedData = newStorageHasData;
      // check v2 storage
      if (!hasUpdatedData) {
        const authCredentialsString = await AsyncStorage.getItem(
          AUTH_CREDENTIALS_STORE_KEY
        );
        if (authCredentialsString) {
          try {
            const authCredentialsFromStore: AuthCredentialsMap = JSON.parse(
              authCredentialsString
            );
            setAuthCredentialsMap(authCredentialsFromStore);
            hasUpdatedData = true; // should this be set b4 parsing? error recovery policy
          } catch (e) {
            setState(() => {
              throw new Error(e);
            });
          }
        }
      }
      if (hasUpdatedData) {
        await AsyncStorage.removeItem(AUTH_CREDENTIALS_STORE_KEY);
      }

      // check v1 storage
      if (!hasUpdatedData) {
        const values = await AsyncStorage.multiGet([
          SESSION_TOKEN_KEY,
          EXPIRY_KEY,
          ENDPOINT_KEY,
        ]);
        const [sessionToken, expiry, endpoint] = values.map(
          (value) => value[1]
        );
        if (sessionToken && endpoint && expiry!==undefined) {
          const newAuthCredentials = {
            [endpoint]: {
              operatorToken: "",
              sessionToken,
              endpoint,
              expiry: Number(expiry),
            },
          };
          setAuthCredentialsMap(newAuthCredentials);
          hasUpdatedData = true;
        }
      }
      if (hasUpdatedData) {
        await AsyncStorage.multiRemove([
          SESSION_TOKEN_KEY,
          EXPIRY_KEY,
          ENDPOINT_KEY,
        ]);
      }
      return hasUpdatedData;
    };

    const loadAuthCredentialsFromStore = async (): Promise<void> => {
      let newStorageHasData = false;
      try {
        const dataFromStore = await readFromStoreInBuckets<AuthCredentials>(
          AUTH_CREDENTIALS_STORE_KEY
        );

        if (dataFromStore !== null) {
          setAuthCredentialsMap((prev) => ({
            ...prev,
            ...dataFromStore,
          }));
          newStorageHasData = true;
        }
      } catch (e) {
        setState(() => {
          throw new Error(e);
        });
      }
      if (shouldMigrate) {
        const migrated = await migrateOldAuthFromStore(newStorageHasData);
        if (!newStorageHasData) {
          // migration was attempted
          if (migrated) {
            Sentry.addBreadcrumb({
              category: "migration",
              message: "success",
            });
          } else {
            Sentry.addBreadcrumb({
              category: "migration",
              message: "failure",
            });
          }
        }
      }
      setHasLoadedFromStore(true);
    };

    loadAuthCredentialsFromStore();
  }, [shouldMigrate]);

  return (
    <AuthStoreContext.Provider
      value={{
        hasLoadedFromStore,
        authCredentials,
        setAuthCredentials,
        removeAuthCredentials,
        clearAuthCredentials,
      }}
    >
      {children}
    </AuthStoreContext.Provider>
  );
};
