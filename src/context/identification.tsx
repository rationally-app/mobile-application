import React, { createContext, FunctionComponent, useState } from "react";
import { IdentificationFlag } from "../types";

export const defaultSelectedIdType: IdentificationFlag = {
  type: "STRING",
  label: "",
  scannerType: "NONE",
  validation: "REGEX",
  validationRegex: ""
};

interface IdentificationContext {
  selectedIdType: IdentificationFlag;
  setSelectedIdType: (selectedIdType: IdentificationFlag) => void;
}

export const IdentificationContext = createContext<IdentificationContext>({
  selectedIdType: defaultSelectedIdType,
  setSelectedIdType: (selectedIdType: IdentificationFlag) => undefined
});

export const IdentificationContextProvider: FunctionComponent = ({
  children
}) => {
  const [selectedIdType, setSelectedIdType] = useState<IdentificationFlag>(
    defaultSelectedIdType
  );

  return (
    <IdentificationContext.Provider
      value={{ selectedIdType, setSelectedIdType }}
    >
      {children}
    </IdentificationContext.Provider>
  );
};
