import React, {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useContext,
  useState,
} from "react";
import {
  CustomTheme,
  govWalletTheme,
  GOVWALLET_THEME_NAME,
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

export const ThemeContextProvider: FunctionComponent<{
  children?: ReactNode | undefined;
}> = ({ children }) => {
  const [theme, setThemeValue] = useState(sallyTheme);

  const setTheme = useCallback(
    (themeName?: string) => {
      if (themeName === GOVWALLET_THEME_NAME) {
        setThemeValue(govWalletTheme);
      } else {
        setThemeValue(sallyTheme);
      }
    },
    [setThemeValue]
  );

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContext =>
  useContext<ThemeContext>(ThemeContext);
