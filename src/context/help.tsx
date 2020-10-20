import React, {
  createContext,
  FunctionComponent,
  useState,
  useCallback,
} from "react";
import { HelpModal } from "../components/HelpModal/HelpModal";

export const HelpModalContext = createContext(
  () => {} // eslint-disable-line @typescript-eslint/no-empty-function
);

export const HelpModalContextProvider: FunctionComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const showHelpModal = useCallback((): void => setIsVisible(true), []);
  return (
    <HelpModalContext.Provider value={showHelpModal}>
      {children}
      <HelpModal isVisible={isVisible} onExit={() => setIsVisible(false)} />
    </HelpModalContext.Provider>
  );
};
