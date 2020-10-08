import React, { createContext, FunctionComponent } from "react";
import {
  CampaignFeatures,
  CampaignConfig,
  CampaignPolicy,
  CampaignC13N
} from "../types";

interface CampaignConfigContext {
  readonly features: CampaignFeatures | null;
  readonly policies: CampaignPolicy[] | null;
  readonly c13n: CampaignC13N | null;
}
export const CampaignConfigContext = createContext<CampaignConfigContext>({
  features: null,
  policies: null,
  c13n: null
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
