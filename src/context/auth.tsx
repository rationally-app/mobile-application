import React, {
  createContext,
  FunctionComponent,
  PropsWithChildren,
} from "react";
import { AuthCredentials } from "../types";

interface AuthContext {
  readonly operatorToken: string;
  readonly sessionToken: string;
  readonly endpoint: string;
  readonly expiry: number;
}
export const AuthContext = createContext<AuthContext>({
  operatorToken: "",
  sessionToken: "",
  endpoint: "",
  expiry: 0,
});

export const AuthContextProvider: FunctionComponent<
  PropsWithChildren<{
    authCredentials: AuthCredentials;
  }>
> = ({ authCredentials, children }) => {
  return (
    <AuthContext.Provider value={authCredentials}>
      {children}
    </AuthContext.Provider>
  );
};
