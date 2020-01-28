import { useState, useEffect } from "react";
import { AsyncStorage } from "react-native";
import { NetworkTypes } from "../../../types";

export interface Config {
  network: NetworkTypes;
}
interface ConfigHook {
  config: Config;
  loaded: boolean;
  setValue: <K extends keyof Config>(key: K, value: Config[K]) => Promise<void>;
}

const CONFIG_KEY = "CONFIG";
const DEFAULT_CONFIG: Config = { network: NetworkTypes.ropsten };

export const useConfig = (): ConfigHook => {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [loaded, setLoaded] = useState(false);

  const setValue: ConfigHook["setValue"] = async (key, value) => {
    const nextConfig = {
      ...config,
      [key]: value
    };
    setConfig(nextConfig);
    await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(nextConfig));
  };

  const loadConfigFromState = async (): Promise<void> => {
    const configStr = await AsyncStorage.getItem(CONFIG_KEY);
    if (configStr) {
      setConfig(JSON.parse(configStr));
    } else {
      await AsyncStorage.setItem(CONFIG_KEY, JSON.stringify(DEFAULT_CONFIG));
    }
    setLoaded(true);
  };

  useEffect(() => {
    loadConfigFromState();
  }, []);

  return { config, loaded, setValue };
};
