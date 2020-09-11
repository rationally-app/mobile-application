import React, {
  useState,
  FunctionComponent,
  createContext,
  useContext,
  useEffect
} from "react";
import * as Localization from "expo-localization";
import zh from "../common/zh.json";
import en from "../common/en.json";

import i18n from "i18n-js";

export interface LocalizationContext {
  i18n: any;
}

export const LocalizationContext = createContext<LocalizationContext>({
  i18n
});

export const LocalizationContextProvider: FunctionComponent = ({
  children
}) => {
  const [i18nInstance, setI18nInstance] = useState(i18n);

  useEffect(() => {
    i18n.fallbacks = true;
    i18n.locale = Localization.locale;
    i18n.translations = {
      zh,
      en
    };
    setI18nInstance(i18n);
  }, []);

  return (
    <LocalizationContext.Provider
      value={{
        i18n: i18nInstance
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};
