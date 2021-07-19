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
import * as SecureStore from "expo-secure-store";

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

  /**
   * Compares old and new credential maps and saves changes to the store. Only
   * updates buckets that have changes.
   */
  const saveToStore: (
    authCredentials: AuthCredentialsMap,
    prevAuthCredentials: AuthCredentialsMap
  ) => void = useCallback((authCredentials, prevAuthCredentials) => {
    const authEntries = Object.entries(authCredentials); // list of new credentials
    const prevAuthEntries = Object.entries(prevAuthCredentials); // list of prev credentials
    // iterate the longer length in case we have to clear buckets
    const credentialsCount = Math.max(
      authEntries.length,
      prevAuthEntries.length
    );

    for (let i = 0; i < credentialsCount; i += BUCKET_SIZE) {
      const authCredentialsBucketString = JSON.stringify(
        Object.fromEntries(authEntries.splice(i, i + BUCKET_SIZE))
      );
      const prevAuthCredentialsBucketString = JSON.stringify(
        Object.fromEntries(prevAuthEntries.splice(i, i + BUCKET_SIZE))
      );

      if (authCredentialsBucketString !== prevAuthCredentialsBucketString) {
        const bucketNo = Math.floor(i / BUCKET_SIZE);
        if (authCredentialsBucketString === "{}") {
          // if the new bucket is empty, delete the key
          SecureStore.deleteItemAsync(
            AUTH_CREDENTIALS_STORE_KEY + "_" + bucketNo
          );
        } else {
          SecureStore.setItemAsync(
            AUTH_CREDENTIALS_STORE_KEY + "_" + bucketNo,
            authCredentialsBucketString
          );
        }
      }
    }
  }, []);

  useEffect(() => {
    if (hasLoadedFromStore) {
      const authCredentialsString = JSON.stringify(authCredentials);
      const prevAuthCredentialsString = JSON.stringify(prevAuthCredentials);
      // do a top level check to see if there are any changes
      if (authCredentialsString !== prevAuthCredentialsString) {
        // if there are changes, do a check for each bucket
        saveToStore(authCredentials, prevAuthCredentials ?? {});
      }
    }
  }, [hasLoadedFromStore, authCredentials, prevAuthCredentials, saveToStore]);

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
     * Migrates credentials from old auth store to new auth store
     * @returns true if credentials were migrated from oldAuth, false if nothing found there
     */
    const migrateOldAuthFromStore = async (): Promise<boolean> => {
      const values = await AsyncStorage.multiGet([
        SESSION_TOKEN_KEY,
        EXPIRY_KEY,
        ENDPOINT_KEY,
      ]);
      const [sessionToken, expiry, endpoint] = values.map((value) => value[1]);
      if (sessionToken && endpoint && expiry) {
        await AsyncStorage.multiRemove([
          SESSION_TOKEN_KEY,
          EXPIRY_KEY,
          ENDPOINT_KEY,
        ]);
        const newAuthCredentials = {
          [endpoint]: {
            endpoint,
            sessionToken,
            expiry: Number(expiry),
            operatorToken: "",
          },
        };
        setAuthCredentialsMap(newAuthCredentials);
        AsyncStorage.setItem(
          AUTH_CREDENTIALS_STORE_KEY,
          JSON.stringify(newAuthCredentials)
        );
        return true;
      } else {
        return false;
      }
    };

    const loadAuthCredentialsFromStore = async (): Promise<void> => {
      const authCredentialsString = await AsyncStorage.getItem(
        AUTH_CREDENTIALS_STORE_KEY
      );

      if (shouldMigrate) {
        if (authCredentialsString) {
          // if there's already the new store, delete old keys
          AsyncStorage.multiRemove([
            SESSION_TOKEN_KEY,
            EXPIRY_KEY,
            ENDPOINT_KEY,
          ]);
        } else {
          const migrated = await migrateOldAuthFromStore();
          if (migrated) {
            Sentry.addBreadcrumb({
              category: "migration",
              message: "success",
            });
            setHasLoadedFromStore(true);
            return;
          } else {
            Sentry.addBreadcrumb({
              category: "migration",
              message: "failure",
            });
          }
        }
      }

      if (!authCredentialsString) {
        setHasLoadedFromStore(true);
        return;
      }
      try {
        const authCredentialsFromStore: AuthCredentialsMap = JSON.parse(
          authCredentialsString
        );
        setAuthCredentialsMap((prev) => ({
          ...prev,
          ...authCredentialsFromStore,
        }));
        setHasLoadedFromStore(true);
      } catch (e) {
        setState(() => {
          throw new Error(e);
        });
      }
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
