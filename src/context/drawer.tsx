import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export interface DrawerButton {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  onPress: () => void;
  accessibilityLabel?: string;
}

interface DrawerContext {
  drawerButtons: DrawerButton[]; // context consumers should never get an undefined config
  setDrawerButtons: (buttons: DrawerButton[]) => void;
  clearDrawerButtons: () => void;
}

const DEFAULT_BUTTONS: DrawerButton[] = [];

const DrawerContext = createContext<DrawerContext>({
  drawerButtons: DEFAULT_BUTTONS,
  setDrawerButtons: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  clearDrawerButtons: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useDrawerContext = (): DrawerContext =>
  useContext<DrawerContext>(DrawerContext);

export const DrawerContextProvider: FunctionComponent<{
  children?: ReactNode | undefined;
}> = ({ children }) => {
  const [drawerButtons, setDrawerButtons] =
    useState<DrawerButton[]>(DEFAULT_BUTTONS);

  const clearDrawerButtons = useCallback((): void => {
    setDrawerButtons(DEFAULT_BUTTONS);
  }, []);

  return (
    <DrawerContext.Provider
      value={{ drawerButtons, setDrawerButtons, clearDrawerButtons }}
    >
      {children}
    </DrawerContext.Provider>
  );
};
