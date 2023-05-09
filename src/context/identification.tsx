import React, {
  createContext,
  FunctionComponent,
  ReactNode,
  useCallback,
  useState,
} from "react";
import { IdentificationFlag } from "../types";

export const defaultSelectedIdType: IdentificationFlag = {
  type: "STRING",
  label: "",
  scannerType: "NONE",
  validation: "REGEX",
  validationRegex: "",
};

interface IdentificationContext {
  selectedIdType: IdentificationFlag;
  setSelectedIdType: (selectedIdType: IdentificationFlag) => void;
  resetSelectedIdType: () => void;
}

export const IdentificationContext = createContext<IdentificationContext>({
  selectedIdType: defaultSelectedIdType,
  setSelectedIdType: (selectedIdType: IdentificationFlag) => undefined,
  resetSelectedIdType: () => undefined,
});

export const IdentificationContextProvider: FunctionComponent<{
  children?: ReactNode | undefined;
}> = ({ children }) => {
  const [selectedIdType, setSelectedIdType] = useState<IdentificationFlag>(
    defaultSelectedIdType
  );

  const resetSelectedIdType = useCallback(() => {
    setSelectedIdType(defaultSelectedIdType);
  }, []);

  return (
    <IdentificationContext.Provider
      value={{ selectedIdType, setSelectedIdType, resetSelectedIdType }}
    >
      {children}
    </IdentificationContext.Provider>
  );
};
