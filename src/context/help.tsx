import React, {
  createContext,
  useContext,
  FunctionComponent,
  useState
} from "react";
import { HelpModal } from "../components/HelpModal/HelpModal";

export interface HelpModalContextValue {
  showHelpModal: () => void;
}

export const HelpModalContext = createContext<HelpModalContextValue>({
  showHelpModal: () => {} // eslint-disable-line @typescript-eslint/no-empty-function
});

export const useHelpModalContext = (): HelpModalContextValue =>
  useContext<HelpModalContextValue>(HelpModalContext);

export const HelpModalContextProvider: FunctionComponent = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const showHelpModal = (): void => setIsVisible(true);
  return (
    <HelpModalContext.Provider value={{ showHelpModal }}>
      {children}
      <HelpModal isVisible={isVisible} onExit={() => setIsVisible(false)} />
    </HelpModalContext.Provider>
  );
};
