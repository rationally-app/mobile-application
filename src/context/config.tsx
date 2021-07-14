import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LoadingView } from "../components/Loading";

export enum AppMode {
  production = "production",
  staging = "staging",
}

interface Config {
  appMode: AppMode;
  fullMobileNumber?: {
    countryCode: string;
    mobileNumber: string;
  };
}

interface ConfigContext {
  config: Config; // context consumers should never get an undefined config
  setConfigValue: <K extends keyof Config>(key: K, value: Config[K]) => void;
}

const CONFIG_KEY = "CONFIG";
const DEFAULT_CONFIG: Config = { appMode: AppMode.production };

export const ConfigContext = createContext<ConfigContext>({
  config: DEFAULT_CONFIG,
  setConfigValue: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useConfigContext = (): ConfigContext =>
  useContext<ConfigContext>(ConfigContext);

export const ConfigContextProvider: FunctionComponent = ({ children }) => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);

  const setConfigValue: ConfigContext["setConfigValue"] = (key, value) => {
    const nextConfig = {
      ...config,
      [key]: value,
    };
    setConfig(nextConfig);
    AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(nextConfig));
  };

  const loadConfigFromStore = async (): Promise<void> => {
    const configStr = await AsyncStorage.getItem(CONFIG_KEY);
    if (configStr) {
      setConfig({
        ...DEFAULT_CONFIG,
        ...JSON.parse(configStr),
      });
    } else {
      await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
    }
  };

  useEffect(() => {
    loadConfigFromStore();
  }, []);

  return (
    <ConfigContext.Provider value={{ config, setConfigValue }}>
      {config !== undefined ? children : <LoadingView />}
    </ConfigContext.Provider>
  );
};
