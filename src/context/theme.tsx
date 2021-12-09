import React, {
  createContext,
  FunctionComponent,
  useContext,
  useState,
} from "react";
import {
  CustomTheme,
  govWalletTheme,
  sallyTheme,
} from "../common/styles/themes";

interface ThemeContext {
  theme: CustomTheme;
  setTheme: (themeName: string | undefined) => void;
}

export const ThemeContext = createContext<ThemeContext>({
  theme: sallyTheme,
  setTheme: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const ThemeContextProvider: FunctionComponent = ({ children }) => {
  const [theme, setThemeValue] = useState(sallyTheme);
  // const { features } = useContext(CampaignConfigContext);

  const setTheme = (themeName?: string): void => {
    if (themeName === "GOV_WALLET") {
      setThemeValue(govWalletTheme);
    } else {
      setThemeValue(sallyTheme);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme: theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContext =>
  useContext<ThemeContext>(ThemeContext);
