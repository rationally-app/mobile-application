import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState,
  useCallback
} from "react";

export interface DrawerButtons {
  icon: string;
  label: string;
  onPress: () => void;
}

interface DrawerContext {
  drawerButtons: DrawerButtons[]; // context consumers should never get an undefined config
  setDrawerButtons: (buttons: DrawerButtons[]) => void;
  clearDrawerButtons: () => void;
}

const DEFAULT_BUTTONS: DrawerButtons[] = [];

const DrawerContext = createContext<DrawerContext>({
  drawerButtons: DEFAULT_BUTTONS,
  setDrawerButtons: () => {}, // eslint-disable-line @typescript-eslint/no-empty-function
  clearDrawerButtons: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useDrawerContext = (): DrawerContext =>
  useContext<DrawerContext>(DrawerContext);

export const DrawerContextProvider: FunctionComponent = ({ children }) => {
  const [drawerButtons, setDrawerButtons] = useState<DrawerButtons[]>(
    DEFAULT_BUTTONS
  );

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
