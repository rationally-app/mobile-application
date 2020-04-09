import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState
} from "react";
import { AsyncStorage } from "react-native";

export const SESSION_TOKEN_KEY = "SESSION_TOKEN";

interface AuthenticationContext {
  token: string;
  endpoint: string;
  setSessionToken: (key: string) => void;
  setEndpoint: (key: string) => void;
}

export const AuthenticationContext = createContext<AuthenticationContext>({
  token: "",
  setSessionToken: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  endpoint: "",
  setEndpoint: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
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

  return (
    <AuthenticationContext.Provider
      value={{ token, setSessionToken, endpoint, setEndpoint }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
