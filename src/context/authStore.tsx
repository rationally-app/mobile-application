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
} from "../utils/bucketStorageHelper";
import { AuthInvalidError } from "../services/auth";

export const AUTH_CREDENTIALS_STORE_KEY = "AUTH_STORE";

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
 * Uses three versions of auth credential storage. Will automatically migrate to v3 and clear the values in v2 storage
 * Assumes that no one uses v1 storage anymore as of Jul 2021.
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
 *    - Due to size limit of SecureStore, uses a bucketing method explained in {@link saveToStoreInBuckets}
 */
export const AuthStoreContextProvider: FunctionComponent<{
  shouldMigrate?: boolean; // Temporary toggle to disable migration when testing
}> = ({ shouldMigrate = true, children }) => {
  /**
   * Flag to mark when all loading has been done and consumers can read from the data.
   * This includes any migration actions needed.
   */
  const [hasLoadedFromStore, setHasLoadedFromStore] = useState(false);
  /**
   * This flag marks when {@link authCredentials} is matching with the current state of
   * the primary store. Any changes after this flag is true should trigger updates to the
   * primary store.
   *
   * This flag should be set to true before any migration happens so that migrations will
   * update the primary store.
   *
   * Documented in [#398](https://github.com/rationally-app/mobile-application/pull/398)
   */
  const [hasLoadedFromPrimaryStore, setHasLoadedFromPrimaryStore] =
    useState(false);
  const [authCredentials, setAuthCredentialsMap] = useState<AuthCredentialsMap>(
    {}
  );
  const prevAuthCredentials = usePrevious(authCredentials);

  const [, setState] = useState();
  /** Effect to update the store when there are changes to authCredentials */
  useEffect(() => {
    if (hasLoadedFromPrimaryStore) {
      const authCredentialsString = JSON.stringify(authCredentials);
      const prevAuthCredentialsString = JSON.stringify(prevAuthCredentials);
      // do a top level check to see if there are any changes
      if (authCredentialsString !== prevAuthCredentialsString) {
        // if there are changes, do a check for each bucket
        saveToStoreInBuckets(
          AUTH_CREDENTIALS_STORE_KEY,
          authCredentialsString,
          prevAuthCredentialsString ?? ""
        ).catch((reason) => {
          setState(() => {
            throw reason;
          });
        });
      }
    }
  }, [hasLoadedFromPrimaryStore, authCredentials, prevAuthCredentials]);

  const setAuthCredentials: AuthStoreContext["setAuthCredentials"] =
    useCallback((key, newAuthCredentials) => {
      setAuthCredentialsMap((prevCredentials) => ({
        ...prevCredentials,
        [key]: newAuthCredentials,
      }));
    }, []);

  const removeAuthCredentials: AuthStoreContext["removeAuthCredentials"] =
    useCallback((key) => {
      setAuthCredentialsMap((prevCredentials) => {
        const {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          [key]: credentialsToBeRemoved,
          ...remainingCredentials
        } = prevCredentials;
        return remainingCredentials;
      });
    }, []);

  const clearAuthCredentials: AuthStoreContext["clearAuthCredentials"] =
    useCallback(() => {
      setAuthCredentialsMap({});
    }, []);

  useEffect(() => {
    /**
     * Migrates credentials from old auth store to new auth store. Checks stores in order of
     * increasing age (although now only has v2 to check). Takes the value in the highest version. Clears all
     * old storage locations.
     * @param newStorageHasData whether most recent data has been found. If this is true, does not
     * attempt any migration and just clears old storage locations
     * @returns the updated value of {@link newStorageHasData}, i.e. true if any updated data was found
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
            hasUpdatedData = true;
          } catch (e) {
            setState(() => {
              throw new AuthInvalidError(e);
            });
          }
        }
      }
      if (hasUpdatedData) {
        await AsyncStorage.removeItem(AUTH_CREDENTIALS_STORE_KEY);
      }

      if (!newStorageHasData) {
        // migration was attempted
        if (hasUpdatedData) {
          Sentry.addBreadcrumb({
            category: "authMigration",
            message: "success",
          });
        } else {
          Sentry.addBreadcrumb({
            category: "authMigration",
            message: "failure",
          });
        }
      }
      return hasUpdatedData;
    };

    const loadAuthCredentialsFromStore = async (): Promise<void> => {
      let newStorageHasData = false;
      try {
        const authCredentialsString = await readFromStoreInBuckets(
          AUTH_CREDENTIALS_STORE_KEY
        );

        if (authCredentialsString !== null) {
          const authCredentialsFromStore = JSON.parse(authCredentialsString);
          setAuthCredentialsMap((prev) => ({
            ...prev,
            ...authCredentialsFromStore,
          }));
          newStorageHasData = true;
        }
      } catch (e) {
        setState(() => {
          throw new AuthInvalidError(e);
        });
      }
      setHasLoadedFromPrimaryStore(true);
      if (shouldMigrate) {
        await migrateOldAuthFromStore(newStorageHasData);
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
