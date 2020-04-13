import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useEffect
} from "react";
import { AsyncStorage } from "react-native";

export const SESSION_TOKEN_KEY = "SESSION_TOKEN";
export const EXPIRY_KEY = "EXPIRY_KEY";
export const ENDPOINT_KEY = "ENDPOINT_KEY";

interface AuthenticationContext {
  token: string;
  expiry: string;
  endpoint: string;
  setAuthInfo: (token: string, expiry: number, endpoint: string) => void;
  clearAuthInfo: () => void;
}

export const AuthenticationContext = createContext<AuthenticationContext>({
  token: "",
  endpoint: "",
  expiry: "",
  setAuthInfo: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  clearAuthInfo: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useAuthenticationContext = (): AuthenticationContext =>
  useContext<AuthenticationContext>(AuthenticationContext);

export const AuthenticationContextProvider: FunctionComponent = ({
  children
}) => {
  const [token, setToken] = useState("");
  const [expiry, setExpiry] = useState("");
  const [endpoint, setEndpoint] = useState("");

  const setAuthInfo: AuthenticationContext["setAuthInfo"] = (
    tokenInput: string,
    expiryInput: number,
    endpointInput: string
  ): void => {
    setToken(tokenInput);
    const expiryString = expiryInput.toString();
    setExpiry(expiryString);
    setEndpoint(endpointInput);
    AsyncStorage.multiSet([
      [SESSION_TOKEN_KEY, tokenInput],
      [EXPIRY_KEY, expiryString],
      [ENDPOINT_KEY, endpointInput]
    ]);
  };

  const clearAuthInfo: AuthenticationContext["clearAuthInfo"] = (): void => {
    setToken("");
    setEndpoint("");
    AsyncStorage.multiRemove([SESSION_TOKEN_KEY, EXPIRY_KEY, ENDPOINT_KEY]);
  };

  const loadAuthFromStore = async (): Promise<void> => {
    const sessionToken = await AsyncStorage.getItem(SESSION_TOKEN_KEY);
    const expiry = await AsyncStorage.getItem(EXPIRY_KEY);
    const endpoint = await AsyncStorage.getItem(ENDPOINT_KEY);
    if (sessionToken && endpoint && expiry) {
      setToken(sessionToken);
      setExpiry(expiry);
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
        expiry,
        endpoint,
        setAuthInfo,
        clearAuthInfo
      }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
