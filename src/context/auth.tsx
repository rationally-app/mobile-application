import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState
} from "react";

interface AuthenticationContext {
  authKey: string;
  endpoint: string;
  setAuthKey: (key: string) => void;
  setEndpoint: (key: string) => void;
}

export const AuthenticationContext = createContext<AuthenticationContext>({
  authKey: "",
  setAuthKey: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  endpoint: "",
  setEndpoint: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useAuthenticationContext = (): AuthenticationContext =>
  useContext<AuthenticationContext>(AuthenticationContext);

export const AuthenticationContextProvider: FunctionComponent = ({
  children
}) => {
  const [authKey, setAuthKey] = useState("");
  const [endpoint, setEndpoint] = useState("");

  return (
    <AuthenticationContext.Provider
      value={{ authKey, setAuthKey, endpoint, setEndpoint }}
    >
      {children}
    </AuthenticationContext.Provider>
  );
};
