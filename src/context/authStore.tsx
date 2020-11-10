import React, {
  createContext,
  FunctionComponent,
  useState,
  useEffect,
  useCallback,
} from "react";
import  AsyncStorage  from "@react-native-async-storage/async-storage";
import { usePrevious } from "../hooks/usePrevious";
import { AuthCredentials } from "../types";
import { Sentry } from "../utils/errorTracking";

export const AUTH_CREDENTIALS_STORE_KEY = "AUTH_STORE";

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
      if (authCredentialsString !== prevAuthCredentialsString) {
        console.log(AUTH_CREDENTIALS_STORE_KEY);
        console.log(authCredentialsString);
        AsyncStorage.setItem(AUTH_CREDENTIALS_STORE_KEY, authCredentialsString);
        console.log("success");
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
