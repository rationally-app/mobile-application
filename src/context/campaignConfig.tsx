import React, { createContext, FunctionComponent, useState } from "react";
import {
  CampaignFeatures,
  CampaignConfig,
  CampaignPolicy,
  IdentificationFlag
} from "../types";

export const defaultSelectedIdType: IdentificationFlag = {
  type: "STRING",
  label: "",
  scannerType: "NONE",
  validation: "REGEX",
  validationRegex: ""
};

interface CampaignConfigContext {
  readonly features: CampaignFeatures | null;
  readonly policies: CampaignPolicy[] | null;
  selectedIdType: IdentificationFlag;
  setSelectedIdType: (selectedIdType: IdentificationFlag) => void;
}

export const CampaignConfigContext = createContext<CampaignConfigContext>({
  features: null,
  policies: null,
  selectedIdType: defaultSelectedIdType,
  setSelectedIdType: (selectedIdType: IdentificationFlag) => undefined
});

export const CampaignConfigContextProvider: FunctionComponent<{
  campaignConfig: CampaignConfig;
}> = ({ campaignConfig, children }) => {
  const [selectedIdType, setSelectedIdType] = useState<IdentificationFlag>(
    defaultSelectedIdType
  );

  return (
    <CampaignConfigContext.Provider
      value={{ ...campaignConfig, selectedIdType, setSelectedIdType }}
    >
      {children}
    </CampaignConfigContext.Provider>
  );
};
