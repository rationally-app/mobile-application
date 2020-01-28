import React, { createContext, useContext, FunctionComponent } from "react";
import { useNetInfo } from "@react-native-community/netinfo";

interface NetworkContext {
  isConnected: boolean;
}

export const NetworkContext = createContext<NetworkContext>({
  isConnected: false
});

export const useNetworkContext = (): NetworkContext =>
  useContext<NetworkContext>(NetworkContext);

export const NetworkContextProvider: FunctionComponent = ({ children }) => {
  const { isConnected } = useNetInfo();

  return (
    <NetworkContext.Provider value={{ isConnected }}>
      {children}
    </NetworkContext.Provider>
  );
};
