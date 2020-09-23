import React, { createContext, FunctionComponent } from "react";
import { CampaignFeatures, CampaignConfig, CampaignPolicy } from "../types";

interface CampaignConfigContext {
  readonly features: CampaignFeatures | null;
  readonly policies: CampaignPolicy[] | null;
}
export const CampaignConfigContext = createContext<CampaignConfigContext>({
  features: null,
  policies: null
});

export const CampaignConfigContextProvider: FunctionComponent<{
  campaignConfig: CampaignConfig;
}> = ({ campaignConfig, children }) => {
  return (
    <CampaignConfigContext.Provider value={campaignConfig}>
      {children}
    </CampaignConfigContext.Provider>
  );
};
