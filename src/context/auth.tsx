import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState
} from "react";

interface AuthenticationContext {
  authKey: string;
  setAuthKey: (key: string) => void;
}

export const AuthenticationContext = createContext<AuthenticationContext>({
  authKey: "",
  setAuthKey: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useAuthenticationContext = (): AuthenticationContext =>
  useContext<AuthenticationContext>(AuthenticationContext);

export const AuthenticationContextProvider: FunctionComponent = ({
  children
}) => {
  const [authKey, setAuthKey] = useState("");

  return (
    <AuthenticationContext.Provider value={{ authKey, setAuthKey }}>
      {children}
    </AuthenticationContext.Provider>
  );
};
