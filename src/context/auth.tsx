import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useEffect
} from "react";
import { AsyncStorage } from "react-native";

export const SESSION_TOKEN_KEY = "SESSION_TOKEN";
export const ENDPOINT_KEY = "ENDPOINT_KEY";

interface AuthenticationContext {
  token: string;
  endpoint: string;
  setAuthInfo: (token: string, endpoint: string) => void;
  clearAuthInfo: () => void;
}

export const AuthenticationContext = createContext<AuthenticationContext>({
  token: "",
  endpoint: "",
  setAuthInfo: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  clearAuthInfo: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useAuthenticationContext = (): AuthenticationContext =>
  useContext<AuthenticationContext>(AuthenticationContext);

export const AuthenticationContextProvider: FunctionComponent = ({
  children
}) => {
  const [token, setToken] = useState("");
  const [endpoint, setEndpoint] = useState("");

  const setAuthInfo: AuthenticationContext["setAuthInfo"] = (
    tokenInput: string,
    endpointInput: string
  ): void => {
    setToken(tokenInput);
    setEndpoint(endpointInput);
    AsyncStorage.multiSet([
      [SESSION_TOKEN_KEY, tokenInput],
      [ENDPOINT_KEY, endpointInput]
    ]);
  };

  const clearAuthInfo: AuthenticationContext["clearAuthInfo"] = (): void => {
    setToken("");
    setEndpoint("");
    AsyncStorage.multiRemove([SESSION_TOKEN_KEY, ENDPOINT_KEY]);
  };

  const loadAuthFromStore = async (): Promise<void> => {
    const sessionToken = await AsyncStorage.getItem(SESSION_TOKEN_KEY);
    const endpoint = await AsyncStorage.getItem(ENDPOINT_KEY);
    if (sessionToken && endpoint) {
      setToken(sessionToken);
      setEndpoint(endpoint);
    }
  };

  useEffect(() => {
    loadAuthFromStore();
  }, []);

  return (
    <AuthenticationContext.Provider
      value={{
        token,
        endpoint,
        setAuthInfo,
        clearAuthInfo
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
