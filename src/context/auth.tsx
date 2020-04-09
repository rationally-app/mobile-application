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
  setSessionToken: (key: string) => void;
  setEndpointValue: (key: string) => void;
}

export const AuthenticationContext = createContext<AuthenticationContext>({
  token: "",
  setSessionToken: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  endpoint: "",
  setEndpointValue: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useAuthenticationContext = (): AuthenticationContext =>
  useContext<AuthenticationContext>(AuthenticationContext);

export const AuthenticationContextProvider: FunctionComponent = ({
  children
}) => {
  const [token, setToken] = useState("");
  const [endpoint, setEndpoint] = useState("");

  const setSessionToken: AuthenticationContext["setSessionToken"] = (
    token: string
  ) => {
    setToken(token);
    AsyncStorage.setItem(SESSION_TOKEN_KEY, token);
  };

  const setEndpointValue: AuthenticationContext["setEndpointValue"] = (
    endpoint: string
  ) => {
    setEndpoint(endpoint);
    AsyncStorage.setItem(SESSION_TOKEN_KEY, token);
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
      value={{ token, setSessionToken, endpoint, setEndpointValue }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
